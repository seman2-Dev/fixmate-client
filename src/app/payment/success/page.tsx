"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { RequireRole } from "@/components/auth/require-role";
import { getCheckoutSession, useDB, verifyCheckoutSession } from "@/lib/mock-db";
import { formatDate, formatMoney } from "@/lib/utils";

export default function PaymentSuccessPage() {
  return (
    <RequireRole role="customer">{(user) => <Verify email={user.email} />}</RequireRole>
  );
}

function Verify({ email }: { email: string }) {
  const sessionId = useSearchParams().get("session_id") ?? "";
  const db = useDB();
  const ran = useRef(false);

  // The result is derived from the database; the effect only performs the (idempotent) verification.
  const payment = db.payments.find((p) => p.stripeSessionId === sessionId);
  const found = getCheckoutSession(sessionId);
  const error = payment
    ? null
    : !sessionId || !found
      ? "Payment session not found"
      : found.session.customerEmail !== email
        ? "This payment belongs to another account"
        : null;

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    // Phase 2: GET /api/payments/verify?session_id=... (idempotent: never saves the same payment twice)
    const res = sessionId ? verifyCheckoutSession(sessionId, email) : null;
    if (res?.ok) toast.success("Payment received. Thank you!");
    else toast.error(res && !res.ok ? res.error : "Payment session not found");
  }, [sessionId, email]);

  if (!payment && !error) return <div className="skeleton h-72 w-full max-w-lg" />;
  if (!payment) {
    return (
      <div className="card w-full max-w-lg p-8 text-center sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-red-100 text-red-600">
          <XCircle className="size-9" />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold text-ink-900">We could not verify this payment</h1>
        <p className="mt-3 text-sm text-ink-500">{error}</p>
        <Link href="/dashboard/customer/bookings" className="btn btn-primary mt-8">
          Back to My Bookings
        </Link>
      </div>
    );
  }

  const p = payment;
  return (
    <div className="card w-full max-w-lg p-8 text-center sm:p-10">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="size-9" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold text-ink-900">Payment successful</h1>
      <p className="mt-2 text-sm text-ink-500">Your job is now marked as paid.</p>
      <dl className="mt-8 divide-y divide-ink-100 rounded-2xl border border-ink-100 text-left text-sm">
        {[
          ["Service", p.serviceTitle],
          ["Technician", p.technicianName],
          ["Amount paid", formatMoney(p.amount)],
          ["Paid on", formatDate(p.paidAt)],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-ink-500">{k}</dt>
            <dd className="text-right font-bold text-ink-900">{v}</dd>
          </div>
        ))}
        <div className="px-4 py-3">
          <dt className="text-ink-500">Transaction ID</dt>
          <dd className="mt-1 break-all font-mono text-xs font-semibold text-ink-800">{p.transactionId}</dd>
        </div>
      </dl>
      <Link href="/dashboard/customer/bookings" className="btn btn-primary btn-lg mt-8 w-full">
        Back to My Bookings
      </Link>
    </div>
  );
}
