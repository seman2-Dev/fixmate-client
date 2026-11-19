"use client";

import { Receipt, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { useDB } from "@/lib/mock-db";
import { formatDate, formatMoney } from "@/lib/utils";

export default function AdminTransactionsPage() {
  const db = useDB();
  const rows = db.payments.slice().sort((a, b) => +new Date(b.paidAt) - +new Date(a.paidAt));
  const total = rows.reduce((s, p) => s + p.amount, 0);

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
        <div className="table-wrap">
          <table className="table-base min-w-[960px]">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Technician</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Paid on</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p._id}>
                  <td className="font-bold text-ink-900">{p.customerName}</td>
                  <td>{p.technicianName}</td>
                  <td className="max-w-[14rem]">{p.serviceTitle}</td>
                  <td className="font-semibold text-ink-900">{formatMoney(p.amount)}</td>
                  <td>
                    <code className="rounded bg-ink-50 px-2 py-1 font-mono text-xs text-ink-600">{p.transactionId}</code>
                  </td>
                  <td className="whitespace-nowrap">{formatDate(p.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
