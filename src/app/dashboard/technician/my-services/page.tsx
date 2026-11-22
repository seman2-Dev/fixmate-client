"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Boxes, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { ServiceForm } from "@/components/technician/service-form";
import { ApprovalBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { apiRequest } from "@/lib/api-client";
import type { Service } from "@/lib/types";
import { cn, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function MyServicesPage() {
  const user = useDashboardUser();
  const [mine, setMine] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);

  useEffect(() => {
    let active = true;
    apiRequest<Service[]>("/api/services/mine", { protectedRequest: true })
      .then((result) => {
        if (active) setMine(result);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Could not load services"));
    return () => {
      active = false;
    };
  }, []);

  async function toggle(s: Service) {
    try {
      await apiRequest(`/api/services/${s._id}`, {
        protectedRequest: true,
        method: "PATCH",
        body: JSON.stringify({ isAvailable: !s.isAvailable }),
      });
      setMine((rows) => rows.map((row) => row._id === s._id ? { ...row, isAvailable: !row.isAvailable } : row));
      toast.success(!s.isAvailable ? "Service is now available" : "Service hidden from public pages");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update availability");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await apiRequest(`/api/services/${deleting._id}`, { protectedRequest: true, method: "DELETE" });
      setMine((rows) => rows.filter((row) => row._id !== deleting._id));
      toast.success("Service deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete service");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <PageHeader title="My Services" description="Edit, hide or remove the repair services you offer. Editing sends a service back for approval." />

      {mine.length === 0 ? (
        <EmptyState icon={Boxes} title="You have not listed any services" message="Add your first repair service to start receiving requests." actionLabel="Add a service" actionHref="/dashboard/technician/add-service" />
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mine.map((s) => (
                <TableRow key={s._id}>
                  <TableCell data-label="Service">
                    <div className="flex items-center gap-3">
                      <img src={s.image} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                      <span className="max-w-[16rem] font-bold text-foreground">{s.title}</span>
                    </div>
                  </TableCell>
                  <TableCell data-label="Category">{s.category}</TableCell>
                  <TableCell data-label="Price" className="font-semibold text-foreground">{formatMoney(s.basePrice)}</TableCell>
                  <TableCell data-label="Approval">
                    <ApprovalBadge status={s.approvalStatus} />
                  </TableCell>
                  <TableCell data-label="Available">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={s.isAvailable}
                      aria-label={`${s.isAvailable ? "Disable" : "Enable"} ${s.title}`}
                      onClick={() => toggle(s)}
                      className={cn("relative h-6 w-11 cursor-pointer rounded-full transition", s.isAvailable ? "bg-emerald-500" : "bg-ink-300")}
                    >
                      <span className={cn("absolute top-0.5 size-5 rounded-full bg-card shadow transition-all", s.isAvailable ? "left-[22px]" : "left-0.5")} />
                    </button>
                  </TableCell>
                  <TableCell data-label="Actions">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" type="button" onClick={() => setEditing(s)} aria-label={`Edit ${s.title}`}>
                        <Pencil className="size-4" /> Edit
                      </Button>
                      <Button size="sm" className="border border-red-200 dark:border-red-400/30 bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300 hover:bg-red-100" type="button" onClick={() => setDeleting(s)} aria-label={`Delete ${s.title}`}>
                        <Trash2 className="size-4" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit service" description="After saving, this service goes back to Pending until an admin approves it again." size="lg">
        {editing && (
          <ServiceForm
            key={editing._id}
            tech={user}
            initial={editing}
            submitLabel="Save and resubmit"
            onCancel={() => setEditing(null)}
            onSubmit={async (values) => {
              try {
                await apiRequest(`/api/services/${editing._id}`, {
                  protectedRequest: true,
                  method: "PATCH",
                  body: JSON.stringify(values),
                });
                setMine((rows) => rows.map((row) => row._id === editing._id ? { ...row, ...values, approvalStatus: "pending" } : row));
                toast.success("Service updated", { description: "It is pending admin approval again." });
                setEditing(null);
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Could not update service");
              }
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete this service?"
        message={
          <>
            <strong>{deleting?.title}</strong> will be removed permanently. Existing bookings keep their own copy of the service details.
          </>
        }
        confirmLabel="Delete service"
        cancelLabel="Keep service"
      />
    </>
  );
}
