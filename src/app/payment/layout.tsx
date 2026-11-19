import { Suspense } from "react";
import { Logo } from "@/components/ui/logo";

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-paper">
      <div className="bg-blueprint-light absolute inset-0 -z-10" aria-hidden />
      <header className="container-page flex h-[72px] items-center">
        <Logo />
      </header>
      <main id="main" className="container-page flex flex-1 items-start justify-center py-10 sm:py-16">
        <Suspense fallback={<div className="skeleton h-64 w-full max-w-lg" />}>{children}</Suspense>
      </main>
    </div>
  );
}
