"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4 py-16">
      <div className="card w-full max-w-lg p-8 text-center sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-100 text-red-600">
          <AlertTriangle className="size-8" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-ink-900">Something went wrong</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          An unexpected error stopped this page from loading. Your data is safe. Try again, or head back
          home.
        </p>
        {error.digest && <p className="mt-3 text-xs text-ink-400">Reference: {error.digest}</p>}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary">
            <RotateCcw className="size-4" /> Try again
          </button>
          <Link href="/" className="btn btn-outline">
            <Home className="size-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
