import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  brand: "bg-brand-50 text-brand-700",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
  ink: "bg-ink-100 text-ink-700",
} as const;

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
    <div className="card flex items-center gap-4 p-5">
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", TONES[tone])}>
        <Icon className="size-6" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink-500">{label}</p>
        <p className="font-display text-3xl font-extrabold leading-tight text-ink-900">{value}</p>
        {hint && <p className="mt-0.5 truncate text-xs text-ink-400">{hint}</p>}
      </div>
    </div>
  );
}
