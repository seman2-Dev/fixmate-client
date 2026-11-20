"use client";

import Link from "next/link";
import { Boxes, BadgeCheck, Inbox } from "lucide-react";
import { BarChart, ChartCard, DonutChart } from "@/components/charts";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { BookingBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { useDB } from "@/lib/mock-db";
import { formatDate, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TechnicianOverview() {
  const user = useDashboardUser();
  const db = useDB();
  const services = db.services.filter((s) => s.technicianEmail === user.email);
  const jobs = db.bookings.filter((b) => b.technicianEmail === user.email);
  const approved = services.filter((s) => s.approvalStatus === "approved");
  const pendingRequests = jobs.filter((b) => b.status === "requested");
  const earned = db.payments.filter((p) => p.technicianEmail === user.email).reduce((s, p) => s + p.amount, 0);
  const n = (s: string) => jobs.filter((b) => b.status === s).length;
  const a = (s: string) => services.filter((x) => x.approvalStatus === s).length;

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.name.split(" ")[0]}`}
        description="Your services, incoming requests and earnings at a glance."
        action={
          <Button asChild>
<Link href="/dashboard/technician/add-service">
            Add a service
          </Link>
</Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Services" value={services.length} icon={Boxes} tone="blue" hint="Everything you listed" />
        <StatCard label="Approved Services" value={approved.length} icon={BadgeCheck} tone="green" hint="Live for customers" />
        <StatCard label="Pending Requests" value={pendingRequests.length} icon={Inbox} tone="amber" hint={`Earned so far ${formatMoney(earned)}`} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Jobs by status" subtitle="Requests sent to you">
          {jobs.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No jobs yet.</p>
          ) : (
            <BarChart
              data={[
                { label: "Requested", value: n("requested"), color: "#3b82f6" },
                { label: "Accepted", value: n("accepted"), color: "#6366f1" },
                { label: "In Progress", value: n("in-progress"), color: "#f59e0b" },
                { label: "Completed", value: n("completed"), color: "#10b981" },
                { label: "Rejected", value: n("rejected"), color: "#ef4444" },
              ]}
            />
          )}
        </ChartCard>

        <ChartCard title="Service approval" subtitle="Where your listings stand with the admin">
          {services.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No services listed yet.</p>
          ) : (
            <DonutChart
              centerLabel="services"
              centerValue={services.length}
              data={[
                { label: "Approved", value: a("approved"), color: "#10b981" },
                { label: "Pending", value: a("pending"), color: "#f59e0b" },
                { label: "Rejected", value: a("rejected"), color: "#ef4444" },
              ]}
            />
          )}
        </ChartCard>
      </div>

      <Card className="gap-0 py-0 mt-6 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-foreground">Latest requests</h2>
          <Link href="/dashboard/technician/requests" className="text-sm font-bold text-brand-700 dark:text-brand-300 hover:underline">
            Manage requests
          </Link>
        </div>
        {jobs.length === 0 ? (
          <EmptyState className="mt-4 border-0 bg-transparent py-8" title="No requests yet" message="Requests appear here as soon as customers book your approved services." />
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {jobs.slice(0, 5).map((b) => (
              <li key={b._id} className="flex items-center justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{b.serviceTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {b.customerName} · {formatDate(b.preferredDate)}
                  </p>
                </div>
                <BookingBadge status={b.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
