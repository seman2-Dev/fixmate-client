"use client";

import { Receipt, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { apiRequest } from "@/lib/api-client";
import { formatDate, formatMoney } from "@/lib/utils";
import type { Payment } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

const columns: ColumnDef<Payment>[] = [
  { id: "Customer", header: "Customer", accessorFn: (p) => p.customerName, cell: ({ row }) => <span className="font-bold text-foreground">{row.original.customerName}</span> },
  { id: "Technician", header: "Technician", accessorFn: (p) => p.technicianName },
  { id: "Service", header: "Service", accessorFn: (p) => p.serviceTitle, meta: { className: "max-w-[14rem]" } },
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

export default function AdminTransactionsPage() {
  const [result, setResult] = useState<{ totalRevenue: number; payments: Payment[] }>({ totalRevenue: 0, payments: [] });
  useEffect(() => {
    let active = true;
    apiRequest<{ totalRevenue: number; payments: Payment[] }>("/api/admin/payments", { protectedRequest: true })
      .then((data) => {
        if (active) setResult(data);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Could not load transactions"));
    return () => {
      active = false;
    };
  }, []);
  const rows = result.payments.slice().sort((a, b) => +new Date(b.paidAt) - +new Date(a.paidAt));
  const total = result.totalRevenue;

  return (
    <>
      <PageHeader title="Transactions" description="Every payment collected through Stripe (test mode)." />

      <div className="mb-6 flex items-center gap-4 rounded-2xl bg-ink-900 p-6 text-white">
        <span className="grid size-14 place-items-center rounded-2xl bg-brand-600">
          <TrendingUp className="size-7" />
        </span>
        <div>
          <p className="text-sm text-ink-300">Total revenue</p>
          <p className="font-display text-4xl font-extrabold">{formatMoney(total)}</p>
        </div>
        <p className="ml-auto hidden text-sm text-ink-300 sm:block">{rows.length} payments</p>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={Receipt} title="No transactions yet" message="Payments appear here after customers pay for completed jobs." />
      ) : (
        <DataTable columns={columns} data={rows} initialSort={[{ id: "Paid on", desc: true }]} />
      )}
    </>
  );
}
