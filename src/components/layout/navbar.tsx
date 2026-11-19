"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Menu, UserCog, X } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badges";
import { authClient } from "@/lib/auth-client";
import { dashboardPathFor } from "@/lib/mock-db";
import { useSession } from "@/lib/use-session";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How It Works" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  async function handleSignOut() {
    await authClient.signOut();
    setMenuOpen(false);
    setMobileOpen(false);
    toast.success("Signed out. See you soon!");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100/80 bg-paper/90 backdrop-blur-lg">
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "relative rounded-lg px-4 py-2 text-sm font-semibold transition",
                isActive(item.href)
                  ? "text-brand-700 after:absolute after:inset-x-4 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-brand-600"
                  : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!ready ? (
            <div className="skeleton hidden h-10 w-44 md:block" aria-hidden />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Open account menu"
                className="flex cursor-pointer items-center gap-2 rounded-full border border-ink-200 bg-white py-1 pl-1 pr-3 transition hover:border-ink-400"
              >
                <Avatar name={user.name} image={user.image} size="sm" />
                <ChevronDown className={cn("size-4 text-ink-500 transition", menuOpen && "rotate-180")} />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-72 origin-top-right overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-pop"
                >
                  <div className="flex items-center gap-3 border-b border-ink-100 bg-ink-50 p-4">
                    <Avatar name={user.name} image={user.image} size="lg" />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-ink-900">{user.name}</p>
                      <p className="truncate text-xs text-ink-500">{user.email}</p>
                      <div className="mt-1.5">
                        <RoleBadge role={user.role} />
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      role="menuitem"
                      href={dashboardPathFor(user.role)}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
                    >
                      <LayoutDashboard className="size-4 text-brand-600" /> Dashboard
                    </Link>
                    <Link
                      role="menuitem"
                      href="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
                    >
                      <UserCog className="size-4 text-brand-600" /> Update Profile
                    </Link>
                    <button
                      role="menuitem"
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="size-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/sign-in" className="btn btn-ghost">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}

          <button
            type="button"
            className="grid size-10 cursor-pointer place-items-center rounded-xl border border-ink-200 bg-white md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-ink-100 bg-paper md:hidden">
          <div className="container-page space-y-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "block rounded-xl px-4 py-3 text-base font-semibold",
                  isActive(item.href) ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-ink-100",
                )}
              >
                {item.label}
              </Link>
            ))}
            {ready && !user && (
              <div className="grid grid-cols-2 gap-3 pt-3">
                <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="btn btn-outline">
                  Sign In
                </Link>
                <Link href="/sign-up" onClick={() => setMobileOpen(false)} className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
