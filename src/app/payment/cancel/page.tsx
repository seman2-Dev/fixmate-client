"use client";

import Link from "next/link";
import { Ban } from "lucide-react";
import { RequireRole } from "@/components/auth/require-role";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <RequireRole role="customer">
      {() => (
        <Card className="gap-0 py-0 w-full max-w-lg p-8 text-center sm:p-10">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-600">
            <Ban className="size-9" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold text-foreground">Payment cancelled</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            No worries, you have not been charged and your booking is unchanged. You can pay whenever
            you are ready.
          </p>
          <Button asChild size="lg" className="mt-8 w-full">
<Link href="/dashboard/customer/bookings">
            Try Again
          </Link>
</Button>
        </Card>
      )}
    </RequireRole>
  );
}
