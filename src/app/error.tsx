"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-16">
      <Card className="gap-0 py-0 w-full max-w-lg p-8 text-center sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-100 dark:bg-red-500/15 text-red-600">
          <AlertTriangle className="size-8" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-foreground">Something went wrong</h1>
        <p className="mt-3 text-base leading-relaxed text-foreground/75">
          An unexpected error stopped this page from loading. Your data is safe. Try again, or head back
          home.
        </p>
        {error.digest && <p className="mt-3 text-xs text-muted-foreground">Reference: {error.digest}</p>}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            <RotateCcw className="size-4" /> Try again
          </Button>
          <Button asChild variant="outline">
<Link href="/">
            <Home className="size-4" /> Back to Home
          </Link>
</Button>
        </div>
      </Card>
    </div>
  );
}
