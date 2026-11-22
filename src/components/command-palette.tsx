"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Info, LogIn, LogOut, Moon, Search, Sun, UserPlus, UserCog, Wrench } from "lucide-react";
import { toast } from "sonner";
import { NAV } from "@/components/dashboard/shell";
import { useTheme } from "@/components/theme";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { apiRequest } from "@/lib/api-client";
import { signOut } from "@/lib/auth-client";
import { CATEGORIES, type Service } from "@/lib/types";
import { useSession } from "@/lib/use-session";
import { formatUSD } from "@/lib/utils";

const OPEN_EVENT = "fixmate:open-palette";

/** Search-style button that opens the palette (also reachable with Ctrl/⌘ + K). */
export function PaletteTrigger({ compact }: { compact?: boolean }) {
  const open = () => window.dispatchEvent(new Event(OPEN_EVENT));
  if (compact) {
    return (
      <Button variant="outline" size="icon" aria-label="Search and jump to…" onClick={open}>
        <Search className="size-5" />
      </Button>
    );
  }
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Search and jump to… (Ctrl K)"
      className="hidden h-10 cursor-pointer items-center gap-2 rounded-lg border border-input bg-card pr-2 pl-3 text-sm text-muted-foreground shadow-xs transition-colors outline-none hover:border-ink-400 focus-visible:ring-[3px] focus-visible:ring-ring/40 lg:flex"
    >
      <Search className="size-4" />
      <span className="w-24 text-left">Search…</span>
      <kbd className="rounded-md border bg-secondary px-1.5 py-0.5 text-[11px] font-semibold">Ctrl K</kbd>
    </button>
  );
}

export function CommandPalette() {
  const router = useRouter();
  const { user } = useSession();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    let active = true;
    apiRequest<Service[]>("/api/services")
      .then((result) => {
        if (active) setServices(result);
      })
      .catch(() => {
        if (active) setServices([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search FixMate" description="Search services, pages and actions">
      <CommandInput placeholder="Search services, pages or actions…" />
      <CommandList>
        <CommandEmpty>No results. Try a device, category or page name.</CommandEmpty>

        <CommandGroup heading="Pages">
          <CommandItem value="home page" onSelect={() => go("/")}>
            <Home /> Home
          </CommandItem>
          <CommandItem value="browse services page" onSelect={() => go("/services")}>
            <Search /> Browse Services
          </CommandItem>
          <CommandItem value="how it works about page" onSelect={() => go("/about")}>
            <Info /> How It Works
          </CommandItem>
          {!user && (
            <>
              <CommandItem value="sign in login" onSelect={() => go("/sign-in")}>
                <LogIn /> Sign In
              </CommandItem>
              <CommandItem value="sign up register create account" onSelect={() => go("/sign-up")}>
                <UserPlus /> Sign Up
              </CommandItem>
            </>
          )}
        </CommandGroup>

        {user && (
          <CommandGroup heading={`${user.role} dashboard`}>
            {NAV[user.role].map((item) => (
              <CommandItem key={item.href} value={`dashboard ${item.label}`} onSelect={() => go(item.href)}>
                <item.icon /> {item.label}
              </CommandItem>
            ))}
            <CommandItem value="update profile account" onSelect={() => go("/dashboard/profile")}>
              <UserCog /> Update Profile
            </CommandItem>
          </CommandGroup>
        )}

        <CommandGroup heading="Categories">
          {CATEGORIES.map((c) => (
            <CommandItem key={c} value={`category ${c}`} onSelect={() => go(`/services?category=${encodeURIComponent(c)}`)}>
              <Wrench /> {c} repairs
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Services">
          {services.map((s) => (
            <CommandItem
              key={s._id}
              value={`service ${s.title} ${s.category} ${s.serviceArea}`}
              onSelect={() => go(`/services/${s._id}`)}
            >
              <Wrench />
              <span className="min-w-0 flex-1 truncate">{s.title}</span>
              <span className="text-xs font-semibold text-muted-foreground">{formatUSD(s.basePrice)}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem value="toggle theme dark light mode" onSelect={() => { toggle(); setOpen(false); }}>
            {theme === "dark" ? <Sun /> : <Moon />} Switch to {theme === "dark" ? "light" : "dark"} theme
          </CommandItem>
          {user && (
            <CommandItem
              value="sign out logout"
              onSelect={async () => {
                setOpen(false);
                await signOut();
                toast.success("Signed out. See you soon!");
                router.push("/");
              }}
            >
              <LogOut /> Sign Out
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
