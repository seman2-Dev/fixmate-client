"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Check, Wrench, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { ApprovalBadge, AvailabilityBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/modal";
import { setServiceApproval, useDB } from "@/lib/mock-db";
import type { ApprovalStatus, Service } from "@/lib/types";
import { cn, formatDate, formatMoney } from "@/lib/utils";

const FILTERS: { value: "all" | ApprovalStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

export default function AdminServicesPage() {
  const admin = useDashboardUser();
  const db = useDB();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("pending"); // pending first by default
  const [rejecting, setRejecting] = useState<Service | null>(null);

  const rows = db.services.filter((s) => filter === "all" || s.approvalStatus === filter);

  function decide(s: Service, status: ApprovalStatus) {
    // Phase 2: PATCH /api/admin/services/:id/approval (verifyToken + verifyAdmin)
    const res = setServiceApproval(s._id, admin, status);
    if (res.ok) toast.success(status === "approved" ? "Service approved and published" : "Service rejected");
    else toast.error(res.error);
  }

  return (
    <>
      <PageHeader title="Service Approval" description="Only approved and available services appear on public pages." />

      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter by approval status">
        {FILTERS.map((f) => {
          const count = f.value === "all" ? db.services.length : db.services.filter((s) => s.approvalStatus === f.value).length;
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
        <EmptyState icon={Wrench} title="Nothing to review here" message={filter === "pending" ? "All caught up. New and edited services will appear here for approval." : "No services match this filter."} />
      ) : (
        <div className="table-wrap">
          <table className="table-base min-w-[900px]">
            <thead>
              <tr>
                <th>Service</th>
                <th>Technician</th>
                <th>Price</th>
                <th>Listed</th>
                <th>Status</th>
                <th className="text-right">Decision</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={s.image} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                      <div className="max-w-[16rem]">
                        <p className="font-bold text-ink-900">{s.title}</p>
                        <p className="text-xs text-ink-500">{s.category} · {s.serviceMode}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="font-semibold text-ink-800">{s.technicianName}</p>
                    <p className="text-xs text-ink-500">{s.technicianEmail}</p>
                  </td>
                  <td className="font-semibold text-ink-900">{formatMoney(s.basePrice)}</td>
                  <td className="whitespace-nowrap">{formatDate(s.createdAt)}</td>
                  <td>
                    <div className="flex flex-col items-start gap-1.5">
                      <ApprovalBadge status={s.approvalStatus} />
                      {s.approvalStatus === "approved" && <AvailabilityBadge available={s.isAvailable} />}
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      {s.approvalStatus !== "approved" && (
                        <button type="button" className="btn btn-success btn-sm" onClick={() => decide(s, "approved")}>
                          <Check className="size-4" /> Approve
                        </button>
                      )}
                      {s.approvalStatus !== "rejected" && (
                        <button type="button" className="btn btn-sm border border-red-200 bg-red-50 text-red-700 hover:bg-red-100" onClick={() => setRejecting(s)}>
                          <X className="size-4" /> Reject
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
          if (rejecting) decide(rejecting, "rejected");
          setRejecting(null);
        }}
        title="Reject this service?"
        message={
          <>
            <strong>{rejecting?.title}</strong> will be hidden from public pages. The technician can edit it and resubmit.
          </>
        }
        confirmLabel="Reject service"
        cancelLabel="Go back"
      />
    </>
  );
}
