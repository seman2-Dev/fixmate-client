"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ClipboardList,
  CreditCard,
  Home,
  LayoutDashboard,
  ListChecks,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Receipt,
  Search,
  UserCog,
  Users,
  Wrench,
  X,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardUserProvider } from "@/components/dashboard/user-context";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badges";
import { authClient } from "@/lib/auth-client";
import { Logo } from "@/components/ui/logo";
import { dashboardPathFor } from "@/lib/mock-db";
import type { Role } from "@/lib/types";
import { useSession } from "@/lib/use-session";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const NAV: Record<Role, NavItem[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: ClipboardList },
    { href: "/dashboard/customer/payments", label: "Payment History", icon: CreditCard },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/technician/add-service", label: "Add Service", icon: PlusCircle },
    { href: "/dashboard/technician/my-services", label: "My Services", icon: Boxes },
    { href: "/dashboard/technician/requests", label: "Manage Requests", icon: ListChecks },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Service Approval", icon: Wrench },
    { href: "/dashboard/admin/bookings", label: "All Bookings", icon: ClipboardList },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
  ],
};

function FullScreenLoader() {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper" aria-busy="true" aria-label="Loading dashboard">
      <div className="flex flex-col items-center gap-4">
        <span className="grid size-14 animate-pulse place-items-center rounded-2xl bg-brand-600 text-white">
          <Wrench className="size-7 -rotate-45" />
        </span>
        <p className="text-sm font-semibold text-ink-500">Loading your workspace…</p>
      </div>
    </div>
  );
}

/**
 * Guarded dashboard layout (client-side for Phase 1).
 * - waits for the session to be ready so a reload never bounces a signed-in user to /sign-in
 * - logged out  -> /sign-in?redirect=<current path>
 * - wrong role  -> that user's own dashboard
 * Phase 2: the same rules are also enforced by the server's role middlewares.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready } = useSession();
  const [drawer, setDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const signingOut = useRef(false);

  const routeRole = (["customer", "technician", "admin"] as const).find(
    (r) => pathname === `/dashboard/${r}` || pathname.startsWith(`/dashboard/${r}/`),
  );
  const allowed = !!user && (!routeRole || routeRole === user.role);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      // an intentional sign-out goes Home, not back through the sign-in redirect
      if (!signingOut.current) router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (pathname === "/dashboard") {
      router.replace(dashboardPathFor(user.role));
      return;
    }
    if (routeRole && routeRole !== user.role) {
      toast.error("Forbidden", { description: "You do not have access to that area." });
      router.replace(dashboardPathFor(user.role));
    }
  }, [ready, user, pathname, routeRole, router]);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawer]);

  if (!ready || !user || !allowed || pathname === "/dashboard") return <FullScreenLoader />;

  const items = [
    ...NAV[user.role],
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog } satisfies NavItem,
  ];
  const isActive = (i: NavItem) => (i.exact ? pathname === i.href : pathname.startsWith(i.href));

  async function handleSignOut() {
    signingOut.current = true;
    await authClient.signOut();
    toast.success("Signed out. See you soon!");
    router.push("/");
    router.refresh();
  }

  const sidebar = (mobile: boolean) => {
    const slim = collapsed && !mobile;
    return (
      <div className="flex h-full flex-col bg-ink-900 text-ink-200">
        <div className={cn("flex h-[72px] items-center border-b border-white/10 px-5", slim && "justify-center px-0")}>
          {slim ? (
            <Link href="/" aria-label="FixMate home" className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white">
              <Wrench className="size-5 -rotate-45" />
            </Link>
          ) : (
            <Logo tone="light" />
          )}
          {mobile && (
            <button
              type="button"
              className="ml-auto grid size-9 cursor-pointer place-items-center rounded-lg text-ink-300 hover:bg-white/10"
              onClick={() => setDrawer(false)}
              aria-label="Close sidebar"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        <nav aria-label="Dashboard" className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawer(false)}
                title={slim ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition",
                  slim && "justify-center px-0",
                  active ? "bg-brand-600 text-white shadow-sm" : "hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon className="size-5 shrink-0" />
                {!slim && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          {user.role === "customer" && (
            <Link
              href="/services"
              title={slim ? "Browse services" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition hover:bg-white/10 hover:text-white",
                slim && "justify-center px-0",
              )}
            >
              <Search className="size-5 shrink-0" />
              {!slim && "Browse services"}
            </Link>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            title={slim ? "Sign out" : undefined}
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/15",
              slim && "justify-center px-0",
            )}
          >
            <LogOut className="size-5 shrink-0" />
            {!slim && "Sign Out"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <DashboardUserProvider value={user}>
      <div className="min-h-dvh bg-ink-50">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-200 lg:block",
            collapsed ? "w-[84px]" : "w-64",
          )}
        >
          {sidebar(false)}
        </aside>

        {drawer && (
          <div className="fixed inset-0 z-[90] lg:hidden">
            <div className="absolute inset-0 bg-ink-950/60" onClick={() => setDrawer(false)} aria-hidden />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-pop">{sidebar(true)}</aside>
          </div>
        )}

        <div className={cn("flex min-h-dvh flex-col transition-[padding] duration-200", collapsed ? "lg:pl-[84px]" : "lg:pl-64")}>
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b border-ink-100 bg-white/90 px-4 backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="grid size-10 cursor-pointer place-items-center rounded-xl border border-ink-200 text-ink-700 transition hover:bg-ink-50 lg:hidden"
                onClick={() => setDrawer(true)}
                aria-label="Open sidebar"
              >
                <PanelLeftOpen className="size-5" />
              </button>
              <button
                type="button"
                className="hidden size-10 cursor-pointer place-items-center rounded-xl border border-ink-200 text-ink-700 transition hover:bg-ink-50 lg:grid"
                onClick={() => setCollapsed((v) => !v)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-pressed={collapsed}
              >
                {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
              </button>
              <Link
                href="/"
                className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-100 sm:flex"
              >
                <Home className="size-4" /> Back to Home
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="max-w-[12rem] truncate text-sm font-bold text-ink-900">{user.name}</p>
                <div className="mt-0.5 flex justify-end">
                  <RoleBadge role={user.role} />
                </div>
              </div>
              <Link href="/dashboard/profile" aria-label="Open your profile">
                <Avatar name={user.name} image={user.image} size="md" />
              </Link>
            </div>
          </header>

          <main id="main" className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardUserProvider>
  );
}
