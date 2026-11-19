"use client";

import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { EmptyState } from "@/components/ui/empty-state";
import { useDB } from "@/lib/mock-db";
import { formatDate, formatMoney } from "@/lib/utils";

export default function CustomerPaymentsPage() {
  const user = useDashboardUser();
  const db = useDB();
  const mine = db.payments
    .filter((p) => p.customerEmail === user.email)
    .sort((a, b) => +new Date(b.paidAt) - +new Date(a.paidAt));
  const total = mine.reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <PageHeader
        title="Payment History"
        description="Every job you have paid for, with the Stripe transaction reference."
        action={
          mine.length > 0 ? (
            <div className="rounded-2xl border border-ink-100 bg-white px-5 py-3 text-right shadow-card">
              <p className="text-xs font-medium text-ink-400">Total paid</p>
              <p className="font-display text-2xl font-extrabold text-ink-900">{formatMoney(total)}</p>
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
        <div className="table-wrap">
          <table className="table-base">
            <thead>
              <tr>
                <th>Service</th>
                <th>Technician</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Paid on</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((p) => (
                <tr key={p._id}>
                  <td className="font-bold text-ink-900">{p.serviceTitle}</td>
                  <td>{p.technicianName}</td>
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
