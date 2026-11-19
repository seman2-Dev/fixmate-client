"use client";

import { useState, type FormEvent } from "react";
import { ClipboardList, Check, Play, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { BookingBadge, PaymentBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { updateBookingStatus, useDB } from "@/lib/mock-db";
import type { Booking, BookingStatus } from "@/lib/types";
import { cn, formatDate, formatMoney } from "@/lib/utils";

const FILTERS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function ManageRequestsPage() {
  const user = useDashboardUser();
  const db = useDB();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const [rejecting, setRejecting] = useState<Booking | null>(null);
  const [completing, setCompleting] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  const all = db.bookings.filter((b) => b.technicianEmail === user.email);
  const rows = filter === "all" ? all : all.filter((b) => b.status === filter);

  function move(b: Booking, next: BookingStatus, label: string) {
    // Phase 2: PATCH /api/bookings/:id/status (verifyToken + verifyTechnician, owner only)
    const res = updateBookingStatus(b._id, user.email, next);
    if (res.ok) toast.success(label);
    else toast.error(res.error);
  }

  function openComplete(b: Booking) {
    setCompleting(b);
    setAmount(String(b.basePrice));
    setAmountError("");
  }

  function submitComplete(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return setAmountError("Enter an amount greater than 0");
    if (!completing) return;
    const res = updateBookingStatus(completing._id, user.email, "completed", Math.round(value * 100) / 100);
    if (res.ok) toast.success("Job completed", { description: "The customer can now pay." });
    else toast.error(res.error);
    setCompleting(null);
  }

  return (
    <>
      <PageHeader title="Manage Requests" description="Move each job forward one step at a time. Only valid actions are shown." />

      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {FILTERS.map((f) => {
          const count = f.value === "all" ? all.length : all.filter((b) => b.status === f.value).length;
          return (
            <button
              key={f.value}
              role="tab"
              aria-selected={filter === f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition",
                filter === f.value ? "bg-ink-900 text-white" : "border border-ink-200 bg-white text-ink-600 hover:border-ink-400",
              )}
            >
              {f.label} <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={ClipboardList} title={filter === "all" ? "No requests yet" : "Nothing in this stage"} message={filter === "all" ? "When customers book your approved services, their requests will show up here." : "Try another status filter."} />
      ) : (
        <div className="table-wrap">
          <table className="table-base min-w-[1000px]">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Address & date</th>
                <th>Problem</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b._id}>
                  <td>
                    <p className="font-bold text-ink-900">{b.customerName}</p>
                    <p className="text-xs text-ink-500">{b.customerPhone}</p>
                  </td>
                  <td className="max-w-[12rem] font-semibold text-ink-900">{b.serviceTitle}</td>
                  <td className="max-w-[14rem]">
                    <p className="text-xs leading-relaxed text-ink-600">{b.address}</p>
                    <p className="mt-1 text-xs font-bold text-ink-800">{formatDate(b.preferredDate)}</p>
                  </td>
                  <td className="max-w-[18rem]">
                    <p className="line-clamp-3 text-xs leading-relaxed text-ink-600" title={b.problemDescription}>
                      {b.problemDescription}
                    </p>
                  </td>
                  <td>
                    <div className="flex flex-col items-start gap-1.5">
                      <BookingBadge status={b.status} />
                      {b.status === "completed" && (
                        <>
                          <PaymentBadge status={b.paymentStatus} />
                          <span className="text-xs font-semibold text-ink-700">{formatMoney(b.finalAmount)}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      {b.status === "requested" && (
                        <>
                          <button type="button" className="btn btn-success btn-sm" onClick={() => move(b, "accepted", "Request accepted")}>
                            <Check className="size-4" /> Accept
                          </button>
                          <button type="button" className="btn btn-sm border border-red-200 bg-red-50 text-red-700 hover:bg-red-100" onClick={() => setRejecting(b)}>
                            <X className="size-4" /> Reject
                          </button>
                        </>
                      )}
                      {b.status === "accepted" && (
                        <button type="button" className="btn btn-dark btn-sm" onClick={() => move(b, "in-progress", "Work started")}>
                          <Play className="size-4" /> Start Work
                        </button>
                      )}
                      {b.status === "in-progress" && (
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => openComplete(b)}>
                          <Check className="size-4" /> Mark Completed
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        onConfirm={() => {
          if (rejecting) move(rejecting, "rejected", "Request rejected");
          setRejecting(null);
        }}
        title="Reject this request?"
        message={
          <>
            <strong>{rejecting?.customerName}</strong> will be told you cannot take this job. Rejection is final.
          </>
        }
        confirmLabel="Reject request"
        cancelLabel="Go back"
      />

      <Modal
        open={!!completing}
        onClose={() => setCompleting(null)}
        title="Complete this job"
        description="Set the final amount the customer will pay."
        size="sm"
        footer={
          <>
            <button type="button" className="btn btn-outline" onClick={() => setCompleting(null)}>
              Cancel
            </button>
            <button type="submit" form="complete-form" className="btn btn-primary">
              Mark Completed
            </button>
          </>
        }
      >
        <form id="complete-form" onSubmit={submitComplete} noValidate>
          <p className="mb-4 text-sm text-ink-600">
            {completing?.serviceTitle} · base price {completing && formatMoney(completing.basePrice)}
          </p>
          <label htmlFor="final-amount" className="field-label">Final amount (USD)</label>
          <input
            id="final-amount"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            className="field"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={!!amountError}
            data-autofocus
          />
          {amountError && <p className="field-error">{amountError}</p>}
        </form>
      </Modal>
    </>
  );
}
