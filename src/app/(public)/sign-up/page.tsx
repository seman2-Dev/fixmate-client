import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = { title: "Create Account" };

export default function SignUpPage() {
  return (
    <AuthShell title="Create your account" subtitle="Join FixMate as a customer or a technician in under a minute.">
      <Suspense fallback={<div className="skeleton h-96 w-full" />}>
        <SignUpForm />
      </Suspense>
    </AuthShell>
  );
}
