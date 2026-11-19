"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, UserRound, Wrench } from "lucide-react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/auth/password-input";
import { authClient } from "@/lib/auth-client";
import { dashboardPathFor } from "@/lib/mock-db";
import { safeRedirect } from "@/lib/redirect";
import { useSession } from "@/lib/use-session";
import { cn } from "@/lib/utils";

interface Errors {
  name?: string;
  email?: string;
  password?: string;
}

export function validatePassword(pw: string): string | undefined {
  if (pw.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(pw)) return "Password needs at least one uppercase letter";
  if (!/[a-z]/.test(pw)) return "Password needs at least one lowercase letter";
  return undefined;
}

const ROLES = [
  {
    value: "customer",
    title: "Customer",
    text: "Book repairs and track jobs",
    icon: UserRound,
  },
  {
    value: "technician",
    title: "Technician",
    text: "List services and earn",
    icon: Wrench,
  },
] as const;

export function SignUpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, ready } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  // already signed in -> straight to your dashboard
  useEffect(() => {
    if (ready && user && !busy) router.replace(dashboardPathFor(user.role));
  }, [ready, user, busy, router]);

  function validate(): Errors {
    const e: Errors = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else e.password = validatePassword(password);
    if (!e.password) delete e.password;
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    const { data, error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    });
    if (error) {
      setBusy(false);
      toast.error(error.message || "Could not create your account");
      return;
    }
    toast.success(`Welcome to FixMate, ${(data?.user.name ?? name).split(" ")[0]}!`);
    router.replace(
      safeRedirect(params.get("redirect")) ??
        dashboardPathFor((data?.user.role as "customer" | "technician" | "admin") ?? role),
    );
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="su-name" className="field-label">Full name</label>
        <input
          id="su-name"
          className="field"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="field-error">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="su-email" className="field-label">Email</label>
        <input
          id="su-email"
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
        <label htmlFor="su-password" className="field-label">Password</label>
        <PasswordInput
          id="su-password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 6 chars, upper & lower case"
          aria-invalid={!!errors.password}
        />
        {errors.password ? (
          <p className="field-error">{errors.password}</p>
        ) : (
          <p className="mt-1.5 text-xs text-ink-400">At least 6 characters with one uppercase and one lowercase letter.</p>
        )}
      </div>

      <fieldset>
        <legend className="field-label">I want to join as</legend>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((r) => (
            <label
              key={r.value}
              className={cn(
                "relative flex cursor-pointer flex-col gap-2 rounded-2xl border-2 bg-white p-4 transition",
                role === r.value ? "border-brand-600 bg-brand-50/60" : "border-ink-100 hover:border-ink-300",
              )}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="sr-only"
              />
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-xl",
                  role === r.value ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600",
                )}
              >
                <r.icon className="size-5" />
              </span>
              <span className="text-sm font-extrabold text-ink-900">{r.title}</span>
              <span className="text-xs leading-snug text-ink-500">{r.text}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full">
        {busy && <Loader2 className="size-4 animate-spin" />}
        Create Account
      </button>

      <p className="text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link
          href={params.get("redirect") ? `/sign-in?redirect=${encodeURIComponent(params.get("redirect")!)}` : "/sign-in"}
          className="font-bold text-brand-700 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
