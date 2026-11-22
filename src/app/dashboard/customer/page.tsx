"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClipboardList, CreditCard, Hammer, CheckCircle2 } from "lucide-react";
import { ChartCard, DonutChart } from "@/components/charts";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { BookingBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { apiRequest } from "@/lib/api-client";
import type { Booking } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CustomerOverview() {
  const user = useDashboardUser();
  const [mine, setMine] = useState<Booking[]>([]);
  useEffect(() => {
    let active = true;
    apiRequest<Booking[]>("/api/bookings/my", { protectedRequest: true })
      .then((rows) => {
        if (active) setMine(rows);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Could not load overview"));
    return () => {
      active = false;
    };
  }, []);
  const active = mine.filter((b) => ["requested", "accepted", "in-progress"].includes(b.status));
  const completed = mine.filter((b) => b.status === "completed");
  const toPay = completed.filter((b) => b.paymentStatus === "unpaid");
  const count = (s: string) => mine.filter((b) => b.status === s).length;

  return (
    <>
      <PageHeader
        title={`Hello, ${user.name.split(" ")[0]}`}
        description="Here is where your repair jobs stand right now."
        action={
          <Button asChild>
<Link href="/services">
            Book a repair
          </Link>
</Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Requests" value={mine.length} icon={ClipboardList} tone="blue" />
        <StatCard label="Active Jobs" value={active.length} icon={Hammer} tone="amber" />
        <StatCard label="Completed Jobs" value={completed.length} icon={CheckCircle2} tone="green" />
      </div>

      {toPay.length > 0 && (
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-200 dark:border-brand-400/30 bg-brand-50 dark:bg-brand-500/15 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-xl bg-brand-600 text-white">
              <CreditCard className="size-5" />
            </span>
            <div>
              <p className="font-bold text-foreground">
                {toPay.length} completed {toPay.length === 1 ? "job is" : "jobs are"} ready for payment
              </p>
              <p className="text-sm text-foreground/75">
                Total due {formatMoney(toPay.reduce((s, b) => s + b.finalAmount, 0))}
              </p>
            </div>
          </div>
          <Button asChild>
<Link href="/dashboard/customer/bookings">
            Pay now
          </Link>
</Button>
        </div>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <ChartCard title="Jobs by status" subtitle="All of your repair requests">
          {mine.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <DonutChart
              centerLabel="requests"
              centerValue={mine.length}
              data={[
                { label: "Requested", value: count("requested"), color: "#3b82f6" },
                { label: "Accepted", value: count("accepted"), color: "#6366f1" },
                { label: "In Progress", value: count("in-progress"), color: "#f59e0b" },
                { label: "Completed", value: count("completed"), color: "#10b981" },
                { label: "Rejected", value: count("rejected"), color: "#ef4444" },
                { label: "Cancelled", value: count("cancelled"), color: "#9ca3af" },
              ]}
            />
          )}
        </ChartCard>

        <Card className="gap-0 py-0 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-foreground">Recent requests</h2>
            <Link href="/dashboard/customer/bookings" className="text-sm font-bold text-brand-700 dark:text-brand-300 hover:underline">
              View all
            </Link>
          </div>
          {mine.length === 0 ? (
            <EmptyState
              className="mt-4 border-0 bg-transparent py-8"
              title="No repair requests yet"
              message="Find a service and send your first request."
              actionLabel="Browse services"
              actionHref="/services"
            />
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {mine.slice(0, 5).map((b) => (
                <li key={b._id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{b.serviceTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.technicianName} · {formatDate(b.preferredDate)}
                    </p>
                  </div>
                  <BookingBadge status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
