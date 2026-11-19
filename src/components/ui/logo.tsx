import Link from "next/link";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  tone = "dark",
  className,
}: {
  href?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="FixMate home"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
        <Wrench className="size-5 -rotate-45" strokeWidth={2.4} />
      </span>
      <span
        className={cn(
          "font-display text-xl font-extrabold tracking-tight",
          tone === "dark" ? "text-ink-900" : "text-white",
        )}
      >
        Fix<span className="text-brand-500">Mate</span>
      </span>
    </Link>
  );
}
