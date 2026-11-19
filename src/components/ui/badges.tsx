import type { ApprovalStatus, BookingStatus, PaymentStatus, Role } from "@/lib/types";
import { cn } from "@/lib/utils";

/** One colour language for every dashboard: requested=blue, accepted=indigo, in progress=amber, completed=green, rejected=red, cancelled=gray. */
const BOOKING: Record<BookingStatus, { label: string; cls: string }> = {
  requested: { label: "Requested", cls: "bg-blue-50 text-blue-700 ring-blue-200" },
  accepted: { label: "Accepted", cls: "bg-indigo-50 text-indigo-700 ring-indigo-200" },
  "in-progress": { label: "In Progress", cls: "bg-amber-50 text-amber-800 ring-amber-200" },
  completed: { label: "Completed", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-700 ring-red-200" },
  cancelled: { label: "Cancelled", cls: "bg-ink-100 text-ink-600 ring-ink-200" },
};

const APPROVAL: Record<ApprovalStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-800 ring-amber-200" },
  approved: { label: "Approved", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-700 ring-red-200" },
};

const PAYMENT: Record<PaymentStatus, { label: string; cls: string }> = {
  unpaid: { label: "Unpaid", cls: "bg-rose-50 text-rose-700 ring-rose-200" },
  paid: { label: "Paid", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

const ROLE: Record<Role, { label: string; cls: string }> = {
  customer: { label: "Customer", cls: "bg-sky-50 text-sky-700 ring-sky-200" },
  technician: { label: "Technician", cls: "bg-brand-50 text-brand-700 ring-brand-200" },
  admin: { label: "Admin", cls: "bg-violet-50 text-violet-700 ring-violet-200" },
};

function Pill({ label, cls, dot = true }: { label: string; cls: string; dot?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        cls,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {label}
    </span>
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
        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
        : "bg-ink-100 text-ink-600 ring-ink-200"
    }
  />
);
