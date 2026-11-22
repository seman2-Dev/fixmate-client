"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Check, Wrench, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { ApprovalBadge, AvailabilityBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/modal";
import { apiRequest } from "@/lib/api-client";
import type { ApprovalStatus, Service } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FILTERS: { value: "all" | ApprovalStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

export default function AdminServicesPage() {
  useDashboardUser();
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("pending"); // pending first by default
  const [rejecting, setRejecting] = useState<Service | null>(null);

  useEffect(() => {
    let active = true;
    apiRequest<Service[]>("/api/admin/services", { protectedRequest: true })
      .then((result) => {
        if (active) setServices(result);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Could not load services"));
    return () => {
      active = false;
    };
  }, []);

  const rows = services.filter((s) => filter === "all" || s.approvalStatus === filter);

  async function decide(s: Service, status: ApprovalStatus) {
    try {
      await apiRequest(`/api/admin/services/${s._id}/approval`, {
        protectedRequest: true,
        method: "PATCH",
        body: JSON.stringify({ approvalStatus: status }),
      });
      setServices((rows) => rows.map((row) => row._id === s._id ? { ...row, approvalStatus: status } : row));
      toast.success(status === "approved" ? "Service approved and published" : "Service rejected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update service");
    }
  }

  return (
    <>
      <PageHeader title="Service Approval" description="Only approved and available services appear on public pages." />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-6">
        <TabsList aria-label="Filter by approval status">
          {FILTERS.map((f) => {
            const count = f.value === "all" ? services.length : services.filter((s) => s.approvalStatus === f.value).length;
            return (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label} <span className="rounded-full bg-foreground/10 px-1.5 text-xs tabular-nums">{count}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {rows.length === 0 ? (
        <EmptyState icon={Wrench} title="Nothing to review here" message={filter === "pending" ? "All caught up. New and edited services will appear here for approval." : "No services match this filter."} />
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <Table stacked>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Listed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Decision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => (
                <TableRow key={s._id}>
                  <TableCell data-label="Service">
                    <div className="flex items-center gap-3">
                      <img src={s.image} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                      <div className="max-w-[16rem]">
                        <p className="font-bold text-foreground">{s.title}</p>
                        <p className="text-xs text-muted-foreground">{s.category} · {s.serviceMode}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell data-label="Technician">
                    <p className="font-semibold text-foreground">{s.technicianName}</p>
                    <p className="text-xs text-muted-foreground">{s.technicianEmail}</p>
                  </TableCell>
                  <TableCell data-label="Price" className="font-semibold text-foreground">{formatMoney(s.basePrice)}</TableCell>
                  <TableCell data-label="Listed" className="whitespace-nowrap">{formatDate(s.createdAt)}</TableCell>
                  <TableCell data-label="Status">
                    <div className="flex flex-col items-start gap-1.5">
                      <ApprovalBadge status={s.approvalStatus} />
                      {s.approvalStatus === "approved" && <AvailabilityBadge available={s.isAvailable} />}
                    </div>
                  </TableCell>
                  <TableCell data-label="Decision">
                    <div className="flex justify-end gap-2">
                      {s.approvalStatus !== "approved" && (
                        <Button variant="success" size="sm" type="button" onClick={() => decide(s, "approved")}>
                          <Check className="size-4" /> Approve
                        </Button>
                      )}
                      {s.approvalStatus !== "rejected" && (
                        <Button size="sm" className="border border-red-200 dark:border-red-400/30 bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300 hover:bg-red-100" type="button" onClick={() => setRejecting(s)}>
                          <X className="size-4" /> Reject
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
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
