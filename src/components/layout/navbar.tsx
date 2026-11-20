"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Menu, UserCog } from "lucide-react";
import { toast } from "sonner";
import { PaletteTrigger } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme";
import { Logo } from "@/components/ui/logo";
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
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { dashboardPathFor, signOut } from "@/lib/mock-db";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Sliding active indicator under the current link
  useLayoutEffect(() => {
    const measure = () => {
      const active = navRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
      setPill(active ? { left: active.offsetLeft, width: active.offsetWidth } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSignOut() {
    signOut();
    setMobileOpen(false);
    toast.success("Signed out. See you soon!");
    router.push("/");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/85 backdrop-blur-lg transition-shadow duration-300",
        scrolled ? "border-border shadow-[0_8px_24px_-18px_rgb(18_32_44/0.45)]" : "border-transparent",
      )}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav ref={navRef} aria-label="Main" className="relative hidden items-center gap-1 md:flex">
          {pill && (
            <span
              aria-hidden
              className="absolute -bottom-[13px] h-0.5 rounded-full bg-primary transition-[left,width] duration-300 ease-out"
              style={{ left: pill.left + 16, width: Math.max(pill.width - 32, 0) }}
            />
          )}
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none",
                isActive(item.href)
                  ? "text-primary"
                  : "text-foreground/75 hover:bg-secondary hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <PaletteTrigger />
          <ThemeToggle className="relative" />
          {!ready ? (
            <div className="skeleton hidden h-10 w-44 md:block" aria-hidden />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Open account menu"
                  className="group flex cursor-pointer items-center gap-2 rounded-full border border-input bg-card py-1 pr-3 pl-1 transition-colors duration-200 outline-none hover:border-ink-400 focus-visible:ring-[3px] focus-visible:ring-ring/40"
                >
                  <Avatar name={user.name} image={user.image} size="sm" />
                  <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-0">
                <div className="flex items-center gap-3 border-b bg-secondary/60 p-4">
                  <Avatar name={user.name} image={user.image} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate font-bold text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    <div className="mt-1.5">
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                </div>
                <div className="p-1.5">
                  <DropdownMenuItem asChild>
                    <Link href={dashboardPathFor(user.role)}>
                      <LayoutDashboard className="!text-primary" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <UserCog className="!text-primary" /> Update Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
                    <LogOut className="!text-red-600" /> Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background text-foreground">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Site navigation</SheetDescription>
              <div className="border-b px-5 py-5">
                <Logo />
              </div>
              <nav id="mobile-nav" aria-label="Mobile" className="flex-1 space-y-1 overflow-y-auto p-4">
                {NAV.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-base font-semibold transition-colors",
                        isActive(item.href) ? "bg-accent text-accent-foreground" : "text-foreground/85 hover:bg-secondary",
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                {ready && user && (
                  <>
                    <SheetClose asChild>
                      <Link href={dashboardPathFor(user.role)} className="block rounded-xl px-4 py-3 text-base font-semibold text-foreground/85 hover:bg-secondary">
                        Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/dashboard/profile" className="block rounded-xl px-4 py-3 text-base font-semibold text-foreground/85 hover:bg-secondary">
                        Update Profile
                      </Link>
                    </SheetClose>
                  </>
                )}
              </nav>
              <div className="border-t p-4">
                {ready && user ? (
                  <Button variant="outline" className="w-full text-red-700 dark:text-red-300" onClick={handleSignOut}>
                    <LogOut /> Sign Out
                  </Button>
                ) : (
                  ready && (
                    <div className="grid grid-cols-2 gap-3">
                      <SheetClose asChild>
                        <Button asChild variant="outline">
                          <Link href="/sign-in">Sign In</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild>
                          <Link href="/sign-up">Sign Up</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
