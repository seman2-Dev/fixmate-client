"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { RequireRole } from "@/components/auth/require-role";
import { getCheckoutSession, useDB } from "@/lib/mock-db";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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
      <Card className="gap-0 py-0 w-full max-w-lg p-8 text-center">
        <h1 className="text-2xl font-extrabold text-foreground">Checkout session not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">Start the payment again from My Bookings.</p>
        <Button asChild className="mt-6">
<Link href="/dashboard/customer/bookings">
          Back to My Bookings
        </Link>
</Button>
      </Card>
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
    <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-card shadow-pop md:grid-cols-[0.9fr_1.1fr]">
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
        <h1 className="text-xl font-extrabold text-foreground">Pay with card</h1>
        <div>
          <Label htmlFor="ck-card">Card number</Label>
          <Input id="ck-card" className="font-mono" value={card} onChange={(e) => setCard(e.target.value)} inputMode="numeric" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ck-exp">Expiry</Label>
            <Input id="ck-exp" className="font-mono" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="ck-cvc">CVC</Label>
            <Input id="ck-cvc" className="font-mono" value={cvc} onChange={(e) => setCvc(e.target.value)} />
          </div>
        </div>
        <Button size="lg" className="w-full" type="submit" disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
          Pay {formatMoney(session.amount)}
        </Button>
        <Link
          href="/payment/cancel"
          className="block text-center text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          ← Cancel and go back
        </Link>
      </form>
    </div>
  );
}
