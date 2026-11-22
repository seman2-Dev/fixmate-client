"use client";

import { Printer, Receipt } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { apiRequest } from "@/lib/api-client";
import { formatDate, formatMoney } from "@/lib/utils";
import type { Payment } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const columns: ColumnDef<Payment>[] = [
  { id: "Service", header: "Service", accessorFn: (p) => p.serviceTitle, cell: ({ row }) => <span className="font-bold text-foreground">{row.original.serviceTitle}</span> },
  { id: "Technician", header: "Technician", accessorFn: (p) => p.technicianName },
  { id: "Amount", header: "Amount", accessorFn: (p) => p.amount, cell: ({ row }) => <span className="font-semibold text-foreground">{formatMoney(row.original.amount)}</span> },
  {
    id: "Transaction ID",
    header: "Transaction ID",
    enableSorting: false,
    accessorFn: (p) => p.transactionId,
    cell: ({ row }) => <code className="rounded bg-secondary px-2 py-1 font-mono text-xs text-foreground/75">{row.original.transactionId}</code>,
  },
  { id: "Paid on", header: "Paid on", accessorFn: (p) => +new Date(p.paidAt), cell: ({ row }) => <span className="whitespace-nowrap">{formatDate(row.original.paidAt)}</span> },
];

export default function CustomerPaymentsPage() {
  const [mine, setMine] = useState<Payment[]>([]);

  useEffect(() => {
    let active = true;
    apiRequest<Payment[]>("/api/payments/my", { protectedRequest: true })
      .then((result) => {
        if (active) setMine(result);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Could not load payments"));
    return () => {
      active = false;
    };
  }, []);

  const sortedMine = [...mine]
    .sort((a, b) => +new Date(b.paidAt) - +new Date(a.paidAt));
  const total = mine.reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <PageHeader
        title="Payment History"
        description="Every job you have paid for, with the Stripe transaction reference."
        action={
          mine.length > 0 ? (
            <div className="flex items-center gap-3">
              <Button variant="outline" type="button" onClick={() => window.print()}>
                <Printer className="size-4" /> Print receipt
              </Button>
              <div className="rounded-2xl border border-border bg-card px-5 py-3 text-right shadow-card">
                <p className="text-xs font-medium text-muted-foreground">Total paid</p>
                <p className="font-display text-2xl font-extrabold text-foreground">{formatMoney(total)}</p>
              </div>
            </div>
          ) : undefined
        }
      />

      {mine.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No payments yet"
          message="Once a technician completes a job, you can pay for it from My Bookings. Receipts will appear here."
          actionLabel="Go to My Bookings"
          actionHref="/dashboard/customer/bookings"
        />
      ) : (
        <DataTable columns={columns} data={sortedMine} initialSort={[{ id: "Paid on", desc: true }]} />
      )}
    </>
  );
}
