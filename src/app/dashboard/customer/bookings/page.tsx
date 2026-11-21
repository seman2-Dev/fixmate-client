"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, ClipboardList, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { BookingBadge, PaymentBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/modal";
import { cancelBooking, createCheckoutSession, useDB } from "@/lib/mock-db";
import type { Booking } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function amountOf(b: Booking) {
  return b.status === "completed" ? b.finalAmount : b.basePrice;
}

function JobTimeline({ booking }: { booking: Booking }) {
  const steps = ["requested", "accepted", "in-progress", "completed", "paid"] as const;
  const reached = new Set((booking.statusHistory ?? []).map((entry) => entry.status));
  if (booking.status === "cancelled" || booking.status === "rejected") {
    return (
      <p className="text-xs font-semibold text-muted-foreground">
        Final state: {booking.status === "cancelled" ? "Cancelled" : "Rejected"}
      </p>
    );
  }
  if (booking.paymentStatus === "paid") reached.add("paid");
  return (
    <ol className="flex flex-wrap items-center gap-2" aria-label="Job timeline">
      {steps.map((step, index) => {
        const active = reached.has(step);
        return (
          <li key={step} className="flex items-center gap-1.5">
            {index > 0 && <span className="hidden h-px w-3 bg-border sm:block" aria-hidden />}
            <CheckCircle2 className={active ? "size-4 text-emerald-600" : "size-4 text-ink-300"} />
            <span className={active ? "text-xs font-bold text-foreground" : "text-xs text-muted-foreground"}>
              {step === "in-progress" ? "In Progress" : step[0].toUpperCase() + step.slice(1)}
            </span>
          </li>
        );
      })}
    </ol>
  );
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
        <Button variant="outline" size="sm" type="button" onClick={() => setCancelling(b)}>
          Cancel
        </Button>
      )}
      {b.status === "completed" && b.paymentStatus === "unpaid" && (
        <Button size="sm" type="button" onClick={() => payNow(b)}>
          <CreditCard className="size-4" /> Pay Now
        </Button>
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
          <Button asChild>
<Link href="/services">
            New request
          </Link>
</Button>
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
          <Card className="gap-0 overflow-hidden py-0 hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Preferred date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mine.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={b.serviceImage} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                        <div className="max-w-[14rem]">
                          <span className="block font-bold text-foreground">{b.serviceTitle}</span>
                          <div className="mt-2"><JobTimeline booking={b} /></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{b.technicianName}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(b.preferredDate)}</TableCell>
                    <TableCell className="whitespace-nowrap font-semibold text-foreground">
                      {formatMoney(amountOf(b))}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {b.status === "completed" ? "final" : "base"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <BookingBadge status={b.status} />
                    </TableCell>
                    <TableCell>
                      <PaymentBadge status={b.paymentStatus} />
                    </TableCell>
                    <TableCell>{actions(b)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <ul className="space-y-4 md:hidden">
            {mine.map((b) => (
              <Card key={b._id} className="gap-0 py-0 p-4">
                <div className="flex gap-3">
                  <img src={b.serviceImage} alt="" className="h-16 w-20 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="font-bold leading-snug text-foreground">{b.serviceTitle}</p>
                    <p className="text-xs text-muted-foreground">{b.technicianName}</p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Preferred date</dt>
                    <dd className="font-semibold text-foreground">{formatDate(b.preferredDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">{b.status === "completed" ? "Final amount" : "Base price"}</dt>
                    <dd className="font-semibold text-foreground">{formatMoney(amountOf(b))}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <BookingBadge status={b.status} />
                  <PaymentBadge status={b.paymentStatus} />
                </div>
                <div className="mt-4"><JobTimeline booking={b} /></div>
                <div className="mt-4">{actions(b)}</div>
              </Card>
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
