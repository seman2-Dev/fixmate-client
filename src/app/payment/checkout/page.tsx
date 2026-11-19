"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { RequireRole } from "@/components/auth/require-role";
import { getCheckoutSession, useDB } from "@/lib/mock-db";
import { formatMoney } from "@/lib/utils";

/**
 * PHASE 1 STAND-IN for Stripe's hosted Checkout page (test mode).
 * Phase 2 removes this route: the client is redirected to the real Stripe Checkout URL instead.
 */
export default function MockCheckoutPage() {
  return (
    <RequireRole role="customer">
      {(user) => <CheckoutCard email={user.email} />}
    </RequireRole>
  );
}

function CheckoutCard({ email }: { email: string }) {
  const router = useRouter();
  const sessionId = useSearchParams().get("session_id") ?? "";
  useDB();
  const found = getCheckoutSession(sessionId);
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12 / 34");
  const [cvc, setCvc] = useState("123");
  const [busy, setBusy] = useState(false);

  if (!found || found.session.customerEmail !== email) {
    return (
      <div className="card w-full max-w-lg p-8 text-center">
        <h1 className="text-2xl font-extrabold text-ink-900">Checkout session not found</h1>
        <p className="mt-3 text-sm text-ink-500">Start the payment again from My Bookings.</p>
        <Link href="/dashboard/customer/bookings" className="btn btn-primary mt-6">
          Back to My Bookings
        </Link>
      </div>
    );
  }
  const { booking, session } = found;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (card.replace(/\s/g, "") !== "4242424242424242") {
      toast.error("Your card was declined", { description: "In test mode use 4242 4242 4242 4242." });
      return;
    }
    setBusy(true);
    setTimeout(() => router.push(`/payment/success?session_id=${session.id}`), 700);
  }

  return (
    <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-pop md:grid-cols-[0.9fr_1.1fr]">
      <div className="bg-ink-900 p-8 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-300">Test mode · mock checkout</p>
        <p className="mt-8 text-sm text-ink-300">Pay FixMate</p>
        <p className="font-display text-5xl font-extrabold">{formatMoney(session.amount)}</p>
        <div className="mt-8 border-t border-white/15 pt-6 text-sm">
          <p className="font-bold">{booking.serviceTitle}</p>
          <p className="mt-1 text-ink-300">Technician: {booking.technicianName}</p>
          <p className="mt-1 text-ink-300">Final amount set by the technician</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 p-8">
        <h1 className="text-xl font-extrabold text-ink-900">Pay with card</h1>
        <div>
          <label htmlFor="ck-card" className="field-label">Card number</label>
          <input id="ck-card" className="field font-mono" value={card} onChange={(e) => setCard(e.target.value)} inputMode="numeric" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="ck-exp" className="field-label">Expiry</label>
            <input id="ck-exp" className="field font-mono" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ck-cvc" className="field-label">CVC</label>
            <input id="ck-cvc" className="field font-mono" value={cvc} onChange={(e) => setCvc(e.target.value)} />
          </div>
        </div>
        <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
          Pay {formatMoney(session.amount)}
        </button>
        <Link
          href="/payment/cancel"
          className="block text-center text-sm font-semibold text-ink-500 hover:text-ink-800"
        >
          ← Cancel and go back
        </Link>
      </form>
    </div>
  );
}
