import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

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
        "flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white/70 px-6 py-14 text-center",
        className,
      )}
    >
      <span className="grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="size-8" strokeWidth={1.75} />
      </span>
      <h3 className="mt-5 text-xl font-extrabold text-ink-900">{title}</h3>
      {message && <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500">{message}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button type="button" onClick={onAction} className="btn btn-primary mt-6">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
