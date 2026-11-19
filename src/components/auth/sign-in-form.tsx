"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/auth/password-input";
import { authClient } from "@/lib/auth-client";
import { DEMO_PASSWORD, dashboardPathFor } from "@/lib/mock-db";
import { safeRedirect } from "@/lib/redirect";
import { useSession } from "@/lib/use-session";

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

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e: Errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    setErrors(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    const { data, error } = await authClient.signIn.email({
      email: email.trim(),
      password,
      rememberMe: true,
    });
    if (error) {
      setBusy(false);
      toast.error(error.message || "Invalid email or password");
      return;
    }
    toast.success(`Welcome back, ${(data?.user.name ?? "").split(" ")[0] || "friend"}!`);
    router.replace(
      redirect ??
        dashboardPathFor((data?.user.role as "customer" | "technician" | "admin") ?? "customer"),
    );
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="si-email" className="field-label">Email</label>
        <input
          id="si-email"
          type="email"
          className="field"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="field-error">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="si-password" className="field-label">Password</label>
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

      <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full">
        {busy && <Loader2 className="size-4 animate-spin" />}
        Sign In
      </button>

      <p className="text-center text-sm text-ink-500">
        New to FixMate?{" "}
        <Link
          href={redirect ? `/sign-up?redirect=${encodeURIComponent(redirect)}` : "/sign-up"}
          className="font-bold text-brand-700 hover:underline"
        >
          Create an account
        </Link>
      </p>

      <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Demo accounts</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO.map((d) => (
            <button
              key={d.email}
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setEmail(d.email);
                setPassword(DEMO_PASSWORD);
                setErrors({});
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-400">
          Tap a role to fill the form. Password for all demo accounts:{" "}
          <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-ink-700">{DEMO_PASSWORD}</code>
        </p>
      </div>
    </form>
  );
}
