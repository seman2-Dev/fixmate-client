"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RequireRole } from "@/components/auth/require-role";

export default function CheckoutPage() {
  return (
    <RequireRole role="customer">
      {() => <CheckoutRedirect />}
    </RequireRole>
  );
}

function CheckoutRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/customer/bookings");
  }, [router]);
  return <div className="skeleton h-64 w-full max-w-lg" />;
}
