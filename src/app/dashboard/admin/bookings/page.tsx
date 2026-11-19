"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { BookingBadge, PaymentBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { useDB } from "@/lib/mock-db";
import type { BookingStatus } from "@/lib/types";
import { cn, formatDate, formatMoney } from "@/lib/utils";

const FILTERS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminBookingsPage() {
  const db = useDB();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const rows = db.bookings.filter((b) => filter === "all" || b.status === filter);

  return (
    <>
      <PageHeader title="All Bookings" description="A read-only view of every repair job on the platform." />

      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {FILTERS.map((f) => (
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
            {f.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No bookings found" message="No jobs match this status." />
      ) : (
        <div className="table-wrap">
          <table className="table-base min-w-[960px]">
            <thead>
              <tr>
                <th>Service</th>
                <th>Customer</th>
                <th>Technician</th>
                <th>Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b._id}>
                  <td className="max-w-[14rem] font-bold text-ink-900">{b.serviceTitle}</td>
                  <td>{b.customerName}</td>
                  <td>{b.technicianName}</td>
                  <td className="whitespace-nowrap">{formatDate(b.preferredDate)}</td>
                  <td>
                    <BookingBadge status={b.status} />
                  </td>
                  <td>
                    <PaymentBadge status={b.paymentStatus} />
                  </td>
                  <td className="text-right font-semibold text-ink-900">{formatMoney(b.status === "completed" ? b.finalAmount : b.basePrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
