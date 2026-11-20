import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  message,
  actionLabel,
  actionHref,
  onAction,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-blueprint-light flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/70 px-6 py-14 text-center",
        className,
      )}
    >
      <span className="relative grid size-16 place-items-center rounded-2xl bg-brand-50 dark:bg-brand-500/15 text-brand-600 ring-8 ring-brand-50/60">
        <Icon className="size-8" strokeWidth={1.75} />
      </span>
      <h3 className="mt-5 text-xl font-extrabold text-foreground">{title}</h3>
      {message && <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{message}</p>}
      {actionLabel && actionHref && (
        <Button asChild className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
