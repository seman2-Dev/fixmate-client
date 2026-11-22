"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Printer, XCircle } from "lucide-react";
import { toast } from "sonner";
import { RequireRole } from "@/components/auth/require-role";
import { apiRequest } from "@/lib/api-client";
import type { Payment } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return <RequireRole role="customer">{() => <Verify />}</RequireRole>;
}

function Verify() {
  const sessionId = useSearchParams().get("session_id") ?? "";
  const ran = useRef(false);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(sessionId ? null : "Payment session not found");
  const [ready, setReady] = useState(!sessionId);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (!sessionId) {
      return;
    }
    apiRequest<Payment>(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`, { protectedRequest: true })
      .then((result) => {
        setPayment(result);
        toast.success("Payment received. Thank you!");
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Could not verify payment";
        setError(message);
        toast.error(message);
      })
      .finally(() => setReady(true));
  }, [sessionId]);

  if (!ready) return <div className="skeleton h-72 w-full max-w-lg" />;
  if (!payment) {
    return (
      <Card className="gap-0 py-0 w-full max-w-lg p-8 text-center sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-red-100 dark:bg-red-500/15 text-red-600">
          <XCircle className="size-9" />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold text-foreground">We could not verify this payment</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error}</p>
        <Button asChild className="mt-8">
<Link href="/dashboard/customer/bookings">
          Back to My Bookings
        </Link>
</Button>
      </Card>
    );
  }

  const p = payment;
  return (
    <Card className="gap-0 py-0 w-full max-w-lg p-8 text-center sm:p-10">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600">
        <CheckCircle2 className="size-9" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold text-foreground">Payment successful</h1>
      <p className="mt-2 text-sm text-muted-foreground">Your job is now marked as paid.</p>
      <dl className="mt-8 divide-y divide-border rounded-2xl border border-border text-left text-sm">
        {[
          ["Service", p.serviceTitle],
          ["Technician", p.technicianName],
          ["Amount paid", formatMoney(p.amount)],
          ["Paid on", formatDate(p.paidAt)],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-bold text-foreground">{v}</dd>
          </div>
        ))}
        <div className="px-4 py-3">
          <dt className="text-muted-foreground">Transaction ID</dt>
          <dd className="mt-1 break-all font-mono text-xs font-semibold text-foreground">{p.transactionId}</dd>
        </div>
      </dl>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Button variant="outline" type="button" onClick={() => window.print()}>
          <Printer className="size-4" /> Print invoice
        </Button>
        <Button asChild>
          <Link href="/dashboard/customer/bookings">Back to My Bookings</Link>
        </Button>
      </div>
    </Card>
  );
}
