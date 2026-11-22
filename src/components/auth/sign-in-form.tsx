"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/auth/password-input";
import { signIn } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/redirect";
import { useSession } from "@/lib/use-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Errors {
  email?: string;
  password?: string;
}

function dashboardPathFor(role: "customer" | "technician" | "admin") {
  return `/dashboard/${role}`;
}

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
    const res = await signIn.email({
      email: email.trim(),
      password,
      callbackURL: redirect ?? dashboardPathFor("customer"),
    });
    if (res.error) {
      setBusy(false);
      toast.error(res.error.message || "Could not sign in");
      return;
    }
    toast.success("Welcome back!");
  }

  async function signInWithGoogle() {
    setBusy(true);
    const res = await signIn.social({
      provider: "google",
      callbackURL: redirect ?? "/dashboard",
    });
    if (res.error) {
      setBusy(false);
      toast.error(res.error.message || "Could not sign in with Google");
    }
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

      <Button
        variant="outline"
        size="lg"
        className="w-full"
        type="button"
        disabled={busy}
        onClick={signInWithGoogle}
      >
        <svg aria-hidden="true" className="size-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.15c1.84-1.69 2.9-4.18 2.9-7.22Z" />
          <path fill="#34A853" d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.15-2.45c-.87.58-1.98.92-3.3.92-2.54 0-4.7-1.72-5.47-4.03H3.27v2.53A9.74 9.72 0 0 0 12 21.7Z" />
          <path fill="#FBBC05" d="M6.53 13.78A5.85 5.85 0 0 1 6.23 12c0-.62.11-1.22.3-1.78V7.69H3.27A9.72 9.72 0 0 0 2.25 12c0 1.56.37 3.04 1.02 4.31l3.26-2.53Z" />
          <path fill="#EA4335" d="M12 6.19c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.17 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.73 5.39l3.26 2.53C7.3 7.91 9.46 6.19 12 6.19Z" />
        </svg>
        Continue with Google
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

    </form>
  );
}
