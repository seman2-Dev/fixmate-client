"use client";

import Link from "next/link";
import { Ban } from "lucide-react";
import { RequireRole } from "@/components/auth/require-role";

export default function PaymentCancelPage() {
  return (
    <RequireRole role="customer">
      {() => (
        <div className="card w-full max-w-lg p-8 text-center sm:p-10">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-amber-100 text-amber-600">
            <Ban className="size-9" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold text-ink-900">Payment cancelled</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            No worries, you have not been charged and your booking is unchanged. You can pay whenever
            you are ready.
          </p>
          <Link href="/dashboard/customer/bookings" className="btn btn-primary btn-lg mt-8 w-full">
            Try Again
          </Link>
        </div>
      )}
    </RequireRole>
  );
}
