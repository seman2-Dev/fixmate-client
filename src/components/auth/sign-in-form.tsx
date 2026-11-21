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
