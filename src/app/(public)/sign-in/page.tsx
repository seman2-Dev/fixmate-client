import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to track your repairs and manage your jobs.">
      <Suspense fallback={<div className="skeleton h-72 w-full" />}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
