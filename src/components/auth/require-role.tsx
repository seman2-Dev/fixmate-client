"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { dashboardPathFor } from "@/lib/mock-db";
import type { Role, User } from "@/lib/types";
import { useSession } from "@/lib/use-session";

/** Client guard for private pages outside the dashboard layout (e.g. /payment/*). Waits for the session before deciding. */
export function RequireRole({
  role,
  children,
}: {
  role: Role;
  children: (user: User) => React.ReactNode;
}) {
  const { user, ready } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      const here = search ? `${pathname}?${search}` : pathname;
      router.replace(`/sign-in?redirect=${encodeURIComponent(here)}`);
    } else if (user.role !== role) {
      toast.error("Forbidden", { description: "This page is for customers only." });
      router.replace(dashboardPathFor(user.role));
    }
  }, [ready, user, role, pathname, search, router]);

  if (!ready || !user || user.role !== role) {
    return (
      <div className="flex justify-center py-24" aria-busy="true">
        <div className="skeleton h-64 w-full max-w-lg" />
      </div>
    );
  }
  return <>{children(user)}</>;
}
