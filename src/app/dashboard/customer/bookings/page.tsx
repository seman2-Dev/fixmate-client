"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClipboardList, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { BookingBadge, PaymentBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/modal";
import { cancelBooking, createCheckoutSession, useDB } from "@/lib/mock-db";
import type { Booking } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";

function amountOf(b: Booking) {
  return b.status === "completed" ? b.finalAmount : b.basePrice;
}

export default function CustomerBookingsPage() {
  const user = useDashboardUser();
  const router = useRouter();
  const db = useDB();
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const mine = db.bookings.filter((b) => b.customerEmail === user.email);

  function confirmCancel() {
    if (!cancelling) return;
    // Phase 2: PATCH /api/bookings/:id/cancel
    const res = cancelBooking(cancelling._id, user.email);
    if (res.ok) toast.success("Request cancelled");
    else toast.error(res.error);
    setCancelling(null);
  }

  function payNow(b: Booking) {
    // Phase 2: POST /api/payments/create-checkout-session -> redirect to Stripe Checkout URL
    const res = createCheckoutSession(b._id, user.email);
    if (!res.ok) return toast.error(res.error);
    router.push(`/payment/checkout?session_id=${res.data}`);
  }

  const actions = (b: Booking) => (
    <div className="flex flex-wrap items-center gap-2">
      {b.status === "requested" && (
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setCancelling(b)}>
          Cancel
        </button>
      )}
      {b.status === "completed" && b.paymentStatus === "unpaid" && (
        <button type="button" className="btn btn-primary btn-sm" onClick={() => payNow(b)}>
          <CreditCard className="size-4" /> Pay Now
        </button>
      )}
      {b.paymentStatus === "paid" && <PaymentBadge status="paid" />}
    </div>
  );

  return (
    <>
      <PageHeader
        title="My Bookings"
        description="Every repair request you have sent, with live status. Pay once a job is completed."
        action={
          <Link href="/services" className="btn btn-primary">
            New request
          </Link>
        }
      />

      {mine.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No bookings yet"
          message="When you send a repair request it will show up here so you can follow it step by step."
          actionLabel="Browse services"
          actionHref="/services"
        />
      ) : (
        <>
          <div className="table-wrap hidden md:block">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Technician</th>
                  <th>Preferred date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mine.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={b.serviceImage} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                        <span className="max-w-[14rem] font-bold text-ink-900">{b.serviceTitle}</span>
                      </div>
                    </td>
                    <td>{b.technicianName}</td>
                    <td className="whitespace-nowrap">{formatDate(b.preferredDate)}</td>
                    <td className="whitespace-nowrap font-semibold text-ink-900">
                      {formatMoney(amountOf(b))}
                      <span className="block text-xs font-normal text-ink-400">
                        {b.status === "completed" ? "final" : "base"}
                      </span>
                    </td>
                    <td>
                      <BookingBadge status={b.status} />
                    </td>
                    <td>
                      <PaymentBadge status={b.paymentStatus} />
                    </td>
                    <td>{actions(b)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-4 md:hidden">
            {mine.map((b) => (
              <li key={b._id} className="card p-4">
                <div className="flex gap-3">
                  <img src={b.serviceImage} alt="" className="h-16 w-20 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="font-bold leading-snug text-ink-900">{b.serviceTitle}</p>
                    <p className="text-xs text-ink-500">{b.technicianName}</p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-ink-400">Preferred date</dt>
                    <dd className="font-semibold text-ink-800">{formatDate(b.preferredDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-400">{b.status === "completed" ? "Final amount" : "Base price"}</dt>
                    <dd className="font-semibold text-ink-800">{formatMoney(amountOf(b))}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <BookingBadge status={b.status} />
                  <PaymentBadge status={b.paymentStatus} />
                </div>
                <div className="mt-4">{actions(b)}</div>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmDialog
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        onConfirm={confirmCancel}
        title="Cancel this request?"
        message={
          <>
            Your request for <strong>{cancelling?.serviceTitle}</strong> will be cancelled. This cannot be
            undone, but you can always send a new request.
          </>
        }
        confirmLabel="Yes, cancel request"
        cancelLabel="Keep request"
      />
    </>
  );
}
