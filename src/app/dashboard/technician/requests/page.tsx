"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ClipboardList, Check, Play, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { BookingBadge, PaymentBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { apiRequest } from "@/lib/api-client";
import type { Booking, BookingStatus } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FILTERS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function ManageRequestsPage() {
  const [all, setAll] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const [rejecting, setRejecting] = useState<Booking | null>(null);
  const [completing, setCompleting] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest<Booking[]>("/api/bookings/technician", { protectedRequest: true })
      .then((result) => {
        if (active) setAll(result);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Could not load requests"));
    return () => {
      active = false;
    };
  }, []);
  const rows = filter === "all" ? all : all.filter((b) => b.status === filter);

  async function move(b: Booking, next: BookingStatus, label: string, finalAmount?: number) {
    try {
      await apiRequest(`/api/bookings/${b._id}/status`, {
        protectedRequest: true,
        method: "PATCH",
        body: JSON.stringify({ status: next, ...(finalAmount ? { finalAmount } : {}) }),
      });
      setAll((rows) => rows.map((row) => row._id === b._id ? {
        ...row,
        status: next,
        ...(finalAmount ? { finalAmount } : {}),
      } : row));
      toast.success(label);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update job");
    }
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
    void move(completing, "completed", "Job completed", Math.round(value * 100) / 100);
    setCompleting(null);
  }

  return (
    <>
      <PageHeader title="Manage Requests" description="Move each job forward one step at a time. Only valid actions are shown." />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-6">
        <TabsList aria-label="Filter by status">
          {FILTERS.map((f) => {
            const count = f.value === "all" ? all.length : all.filter((b) => b.status === f.value).length;
            return (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label} <span className="rounded-full bg-foreground/10 px-1.5 text-xs tabular-nums">{count}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {rows.length === 0 ? (
        <EmptyState icon={ClipboardList} title={filter === "all" ? "No requests yet" : "Nothing in this stage"} message={filter === "all" ? "When customers book your approved services, their requests will show up here." : "Try another status filter."} />
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <Table stacked>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Address & date</TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((b) => (
                <TableRow key={b._id}>
                  <TableCell data-label="Customer">
                    <p className="font-bold text-foreground">{b.customerName}</p>
                    <p className="text-xs text-muted-foreground">{b.customerPhone}</p>
                  </TableCell>
                  <TableCell data-label="Service" className="max-w-[12rem] font-semibold text-foreground">{b.serviceTitle}</TableCell>
                  <TableCell data-label="Address & date" className="max-w-[14rem]">
                    <p className="text-xs leading-relaxed text-foreground/75">{b.address}</p>
                    <p className="mt-1 text-xs font-bold text-foreground">{formatDate(b.preferredDate)}</p>
                  </TableCell>
                  <TableCell data-label="Problem" className="max-w-[18rem]">
                    <p className="line-clamp-3 text-xs leading-relaxed text-foreground/75" title={b.problemDescription}>
                      {b.problemDescription}
                    </p>
                  </TableCell>
                  <TableCell data-label="Status">
                    <div className="flex flex-col items-start gap-1.5">
                      <BookingBadge status={b.status} />
                      {b.status === "completed" && (
                        <>
                          <PaymentBadge status={b.paymentStatus} />
                          <span className="text-xs font-semibold text-foreground/85">{formatMoney(b.finalAmount)}</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell data-label="Action">
                    <div className="flex justify-end gap-2">
                      {b.status === "requested" && (
                        <>
                          <Button variant="success" size="sm" type="button" onClick={() => move(b, "accepted", "Request accepted")}>
                            <Check className="size-4" /> Accept
                          </Button>
                          <Button size="sm" className="border border-red-200 dark:border-red-400/30 bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300 hover:bg-red-100" type="button" onClick={() => setRejecting(b)}>
                            <X className="size-4" /> Reject
                          </Button>
                        </>
                      )}
                      {b.status === "accepted" && (
                        <Button variant="dark" size="sm" type="button" onClick={() => move(b, "in-progress", "Work started")}>
                          <Play className="size-4" /> Start Work
                        </Button>
                      )}
                      {b.status === "in-progress" && (
                        <Button size="sm" type="button" onClick={() => openComplete(b)}>
                          <Check className="size-4" /> Mark Completed
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
            <Button variant="outline" type="button" onClick={() => setCompleting(null)}>
              Cancel
            </Button>
            <Button type="submit" form="complete-form">
              Mark Completed
            </Button>
          </>
        }
      >
        <form id="complete-form" onSubmit={submitComplete} noValidate>
          <p className="mb-4 text-sm text-foreground/75">
            {completing?.serviceTitle} · base price {completing && formatMoney(completing.basePrice)}
          </p>
          <Label htmlFor="final-amount">Final amount (USD)</Label>
          <Input
            id="final-amount"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            
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
