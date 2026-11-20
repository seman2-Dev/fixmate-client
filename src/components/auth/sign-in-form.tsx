"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/auth/password-input";
import { DEMO_PASSWORD, dashboardPathFor, signIn } from "@/lib/mock-db";
import { safeRedirect } from "@/lib/redirect";
import { useSession } from "@/lib/use-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Errors {
  email?: string;
  password?: string;
}

const DEMO = [
  { label: "Customer", email: "ayesha@fixmate.dev" },
  { label: "Technician", email: "rafiq@fixmate.dev" },
  { label: "Admin", email: "admin@fixmate.dev" },
];

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, ready } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const redirect = safeRedirect(params.get("redirect"));

  // logged-in users never see the sign-in page
  useEffect(() => {
    if (ready && user && !busy) router.replace(redirect ?? dashboardPathFor(user.role));
  }, [ready, user, busy, redirect, router]);

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e: Errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    // Phase 2: BetterAuth signIn.email({ email, password })
    const res = signIn(email, password);
    if (!res.ok) {
      setBusy(false);
      toast.error(res.error);
      return;
    }
    toast.success(`Welcome back, ${res.data.name.split(" ")[0]}!`);
    router.replace(redirect ?? dashboardPathFor(res.data.role));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <Label htmlFor="si-email">Email</Label>
        <Input
          id="si-email"
          type="email"
          
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="field-error">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="si-password">Password</Label>
        <PasswordInput
          id="si-password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          aria-invalid={!!errors.password}
        />
        {errors.password && <p className="field-error">{errors.password}</p>}
      </div>

      <Button size="lg" className="w-full" type="submit" disabled={busy}>
        {busy && <Loader2 className="size-4 animate-spin" />}
        Sign In
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to FixMate?{" "}
        <Link
          href={redirect ? `/sign-up?redirect=${encodeURIComponent(redirect)}` : "/sign-up"}
          className="font-bold text-brand-700 dark:text-brand-300 hover:underline"
        >
          Create an account
        </Link>
      </p>

      <div className="rounded-2xl border border-dashed border-border bg-card p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Demo accounts (Phase 1 mock)</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO.map((d) => (
            <Button variant="outline" size="sm"
              key={d.email}
              type="button"
             
              onClick={() => {
                setEmail(d.email);
                setPassword(DEMO_PASSWORD);
                setErrors({});
              }}
            >
              {d.label}
            </Button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Tap a role to fill the form. Password for all demo accounts:{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-foreground/85">{DEMO_PASSWORD}</code>
        </p>
      </div>
    </form>
  );
}
