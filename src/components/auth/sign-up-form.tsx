"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, UserRound, Wrench } from "lucide-react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/auth/password-input";
import { signIn, signUp } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/redirect";
import { useSession } from "@/lib/use-session";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Errors {
  name?: string;
  email?: string;
  password?: string;
}

function dashboardPathFor(role: "customer" | "technician" | "admin") {
  return `/dashboard/${role}`;
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
    const res = await signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      callbackURL: safeRedirect(params.get("redirect")) ?? dashboardPathFor(role),
    });
    if (res.error) {
      setBusy(false);
      toast.error(res.error.message || "Could not create account");
      return;
    }
    toast.success(`Welcome to FixMate, ${name.trim().split(" ")[0]}!`);
  }

  async function signUpWithGoogle() {
    setBusy(true);
    const res = await signIn.social({
      provider: "google",
      callbackURL: safeRedirect(params.get("redirect")) ?? "/dashboard",
    });
    if (res.error) {
      setBusy(false);
      toast.error(res.error.message || "Could not continue with Google");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <Label htmlFor="su-name">Full name</Label>
        <Input
          id="su-name"
          
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="field-error">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="su-email">Email</Label>
        <Input
          id="su-email"
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
        <Label htmlFor="su-password">Password</Label>
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
          <p className="mt-1.5 text-xs text-muted-foreground">At least 6 characters with one uppercase and one lowercase letter.</p>
        )}
      </div>

      <fieldset>
        <legend className="field-label">I want to join as</legend>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((r) => (
            <label
              key={r.value}
              className={cn(
                "relative flex cursor-pointer flex-col gap-2 rounded-2xl border-2 bg-card p-4 transition-[border-color,background-color,transform] duration-200 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/40 active:scale-[0.99]",
                role === r.value ? "border-brand-600 bg-brand-50/60" : "border-border hover:border-input",
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
                  role === r.value ? "bg-brand-600 text-white" : "bg-secondary text-foreground/75",
                )}
              >
                <r.icon className="size-5" />
              </span>
              <span className="text-sm font-extrabold text-foreground">{r.title}</span>
              <span className="text-xs leading-snug text-muted-foreground">{r.text}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Button size="lg" className="w-full" type="submit" disabled={busy}>
        {busy && <Loader2 className="size-4 animate-spin" />}
        Create Account
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="w-full"
        type="button"
        disabled={busy}
        onClick={signUpWithGoogle}
      >
      <svg aria-hidden="true" className="size-4 shrink-0" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.15c1.84-1.69 2.9-4.18 2.9-7.22Z"/><path fill="#34A853" d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.15-2.45c-.87.58-1.98.92-3.3.92-2.54 0-4.7-1.72-5.47-4.03H3.27v2.53A9.74 9.74 0 0 0 12 21.7Z"/><path fill="#FBBC05" d="M6.53 13.78A5.85 5.85 0 0 1 6.23 12c0-.62.11-1.22.3-1.78V7.69H3.27A9.72 9.72 0 0 0 2.25 12c0 1.56.37 3.04 1.02 4.31l3.26-2.53Z"/><path fill="#EA4335" d="M12 6.19c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.17 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.73 5.39l3.26 2.53C7.3 7.91 9.46 6.19 12 6.19Z"/></svg>
        Continue with Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={params.get("redirect") ? `/sign-in?redirect=${encodeURIComponent(params.get("redirect")!)}` : "/sign-in"}
          className="font-bold text-brand-700 dark:text-brand-300 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
