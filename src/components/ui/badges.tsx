import type { ApprovalStatus, BookingStatus, PaymentStatus, Role } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** One colour language for every dashboard: requested=blue, accepted=indigo, in progress=amber, completed=green, rejected=red, cancelled=gray. */
const BOOKING: Record<BookingStatus, { label: string; cls: string }> = {
  requested: { label: "Requested", cls: "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 ring-blue-200 dark:ring-blue-400/30" },
  accepted: { label: "Accepted", cls: "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 ring-indigo-200 dark:ring-indigo-400/30" },
  "in-progress": { label: "In Progress", cls: "bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-amber-200 dark:ring-amber-400/30" },
  completed: { label: "Completed", cls: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-400/30" },
  rejected: { label: "Rejected", cls: "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300 ring-red-200 dark:ring-red-400/30" },
  cancelled: { label: "Cancelled", cls: "bg-secondary text-foreground/75 ring-border" },
};

const APPROVAL: Record<ApprovalStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-amber-200 dark:ring-amber-400/30" },
  approved: { label: "Approved", cls: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-400/30" },
  rejected: { label: "Rejected", cls: "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300 ring-red-200 dark:ring-red-400/30" },
};

const PAYMENT: Record<PaymentStatus, { label: string; cls: string }> = {
  unpaid: { label: "Unpaid", cls: "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-rose-200 dark:ring-rose-400/30" },
  paid: { label: "Paid", cls: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-400/30" },
};

const ROLE: Record<Role, { label: string; cls: string }> = {
  customer: { label: "Customer", cls: "bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-sky-200 dark:ring-sky-400/30" },
  technician: { label: "Technician", cls: "bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 ring-brand-200 dark:ring-brand-400/30" },
  admin: { label: "Admin", cls: "bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 ring-violet-200 dark:ring-violet-400/30" },
};

function Pill({ label, cls, dot = true }: { label: string; cls: string; dot?: boolean }) {
  return (
    <Badge variant="outline" className={cn("py-1", cls)}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {label}
    </Badge>
  );
}

export const BookingBadge = ({ status }: { status: BookingStatus }) => (
  <Pill {...BOOKING[status]} />
);
export const ApprovalBadge = ({ status }: { status: ApprovalStatus }) => (
  <Pill {...APPROVAL[status]} />
);
export const PaymentBadge = ({ status }: { status: PaymentStatus }) => (
  <Pill {...PAYMENT[status]} />
);
export const RoleBadge = ({ role }: { role: Role }) => (
  <Pill {...ROLE[role]} dot={false} />
);
export const AvailabilityBadge = ({ available }: { available: boolean }) => (
  <Pill
    label={available ? "Available" : "Unavailable"}
    cls={
      available
        ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-400/30"
        : "bg-secondary text-foreground/75 ring-border"
    }
  />
);
