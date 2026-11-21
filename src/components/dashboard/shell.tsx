"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ChevronDown,
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
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardUserProvider } from "@/components/dashboard/user-context";
import { PaletteTrigger } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badges";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/logo";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { dashboardPathFor } from "@/lib/mock-db";
import { signOut } from "@/lib/auth-client";
import type { Role } from "@/lib/types";
import { useSession } from "@/lib/use-session";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const NAV: Record<Role, NavItem[]> = {
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
    <div className="grid min-h-dvh place-items-center bg-background" aria-busy="true" aria-label="Loading dashboard">
      <div className="flex flex-col items-center gap-4">
        <span className="animate-pulse-ring grid size-14 place-items-center rounded-2xl bg-primary text-white">
          <Wrench className="size-7 -rotate-45" />
        </span>
        <p className="text-sm font-semibold text-muted-foreground">Loading your workspace…</p>
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

  if (!ready || !user || !allowed || pathname === "/dashboard") return <FullScreenLoader />;

  const items = [
    ...NAV[user.role],
    { href: "/dashboard/profile", label: "Update Profile", icon: UserCog } satisfies NavItem,
  ];
  const isActive = (i: NavItem) => (i.exact ? pathname === i.href : pathname.startsWith(i.href));

  async function handleSignOut() {
    signingOut.current = true;
    await signOut();
    toast.success("Signed out. See you soon!");
    router.push("/");
  }

  const navLinkCls = (active: boolean, slim: boolean) =>
    cn(
      "group/nav relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold outline-none transition-[background-color,color] duration-200 focus-visible:ring-2 focus-visible:ring-sidebar-ring",
      slim && "justify-center px-0",
      active
        ? "bg-sidebar-primary text-white shadow-sm shadow-black/20"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
    );

  const withTip = (slim: boolean, label: string, node: ReactNode) =>
    slim ? (
      <Tooltip>
        <TooltipTrigger asChild>{node}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    ) : (
      node
    );

  const sidebar = (mobile: boolean) => {
    const slim = collapsed && !mobile;
    return (
      <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
        <div className={cn("flex h-[72px] items-center border-b border-sidebar-border px-5", slim && "justify-center px-0")}>
          {slim ? (
            <Link href="/" aria-label="FixMate home" className="grid size-9 place-items-center rounded-xl bg-primary text-white">
              <Wrench className="size-5 -rotate-45" />
            </Link>
          ) : (
            <Logo tone="light" />
          )}
        </div>

        <nav aria-label="Dashboard" className="scroll-thin flex-1 space-y-1 overflow-y-auto p-3">
          {!slim && (
            <p className="px-3.5 pt-2 pb-2 text-[11px] font-bold tracking-[0.18em] text-white/40 uppercase">
              {user.role} workspace
            </p>
          )}
          {items.map((item) => {
            const active = isActive(item);
            return (
              <div key={item.href}>
                {withTip(
                  slim,
                  item.label,
                  <Link
                    href={item.href}
                    onClick={() => setDrawer(false)}
                    aria-label={slim ? item.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={navLinkCls(active, slim)}
                  >
                    {active && !slim && (
                      <span aria-hidden className="absolute top-1/2 -left-3 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-300" />
                    )}
                    <item.icon className="size-5 shrink-0 transition-transform duration-200 group-hover/nav:scale-110" />
                    {!slim && <span className="truncate">{item.label}</span>}
                  </Link>,
                )}
              </div>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-sidebar-border p-3">
          {user.role === "customer" &&
            withTip(
              slim,
              "Browse services",
              <Link href="/services" aria-label={slim ? "Browse services" : undefined} className={navLinkCls(false, slim)}>
                <Search className="size-5 shrink-0" />
                {!slim && "Browse services"}
              </Link>,
            )}
          {withTip(
            slim,
            "Sign out",
            <button
              type="button"
              onClick={handleSignOut}
              aria-label={slim ? "Sign out" : undefined}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-red-300 outline-none transition-colors hover:bg-red-500/15 focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                slim && "justify-center px-0",
              )}
            >
              <LogOut className="size-5 shrink-0" />
              {!slim && "Sign Out"}
            </button>,
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardUserProvider value={user}>
      <div className="min-h-dvh bg-background">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-300 ease-out lg:block",
            collapsed ? "w-[84px]" : "w-64",
          )}
        >
          {sidebar(false)}
        </aside>

        <Sheet open={drawer} onOpenChange={setDrawer}>
          <SheetContent side="left" className="w-72 border-0 bg-sidebar p-0 text-sidebar-foreground">
            <SheetTitle>Dashboard navigation</SheetTitle>
            <SheetDescription>Move between dashboard pages</SheetDescription>
            {sidebar(true)}
          </SheetContent>
        </Sheet>

        <div className={cn("flex min-h-dvh flex-col transition-[padding] duration-300 ease-out", collapsed ? "lg:pl-[84px]" : "lg:pl-64")}>
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b bg-background/85 px-4 backdrop-blur-lg sm:px-6">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setDrawer(true)} aria-label="Open sidebar">
                <PanelLeftOpen className="size-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden lg:inline-flex"
                onClick={() => setCollapsed((v) => !v)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-pressed={collapsed}
              >
                {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
              </Button>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/">
                  <Home /> Back to Home
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-2">
            <PaletteTrigger />
            <ThemeToggle className="relative" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Open account menu"
                  className="group flex cursor-pointer items-center gap-3 rounded-full border border-input bg-card py-1 pr-3 pl-1 outline-none transition-colors hover:border-ink-400 focus-visible:ring-[3px] focus-visible:ring-ring/40"
                >
                  <Avatar name={user.name} image={user.image} size="sm" />
                  <span className="hidden text-left sm:block">
                    <span className="block max-w-[10rem] truncate text-sm leading-tight font-bold">{user.name}</span>
                    <span className="block text-[11px] leading-tight text-muted-foreground capitalize">{user.role}</span>
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-0">
                <div className="flex items-center gap-3 border-b bg-secondary/60 p-4">
                  <Avatar name={user.name} image={user.image} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate font-bold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    <div className="mt-1.5">
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                </div>
                <div className="p-1.5">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <UserCog /> Update Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/">
                      <Home /> Back to Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
                    <LogOut className="!text-red-600" /> Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </header>

          <main id="main" className="page-enter flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardUserProvider>
  );
}
