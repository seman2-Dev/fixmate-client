import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  brand: "bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 ring-brand-100 dark:ring-brand-400/30",
  blue: "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 ring-blue-100 dark:ring-blue-400/30",
  green: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-100 dark:ring-emerald-400/30",
  amber: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-amber-100 dark:ring-amber-400/30",
  violet: "bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 ring-violet-100 dark:ring-violet-400/30",
  ink: "bg-secondary text-foreground/85 ring-border",
} as const;

/** Every card reserves the hint line so cards in a row always share one height. */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "brand",
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  hint?: string;
}) {
  return (
    <div className="group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border bg-card p-5 shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <span
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105",
          TONES[tone],
        )}
      >
        <Icon className="size-6" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-display text-3xl leading-tight font-extrabold text-foreground tabular-nums">{value}</p>
        <p className="mt-0.5 h-4 truncate text-xs text-muted-foreground">{hint ?? " "}</p>
      </div>
    </div>
  );
}
