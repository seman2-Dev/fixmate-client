"use client";

import Link from "next/link";
import { Clock, Users, Wrench } from "lucide-react";
import { AreaChart, BarChart, ChartCard, DonutChart } from "@/components/charts";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { CATEGORIES } from "@/lib/types";
import { useDB } from "@/lib/mock-db";
import { formatMoney } from "@/lib/utils";

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

export default function AdminOverview() {
  const db = useDB();
  const technicians = db.users.filter((u) => u.role === "technician").length;
  const pending = db.services.filter((s) => s.approvalStatus === "pending").length;
  const revenue = db.payments.reduce((s, p) => s + p.amount, 0);

  const now = new Date("2026-11-18");
  const monthly = MONTHS.map((label, i) => {
    const target = new Date(now.getFullYear(), now.getMonth() - (MONTHS.length - 1 - i), 1);
    const value = db.payments
      .filter((p) => {
        const d = new Date(p.paidAt);
        return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
      })
      .reduce((s, p) => s + p.amount, 0);
    return { label, value: Math.round(value) };
  });

  const byCategory = CATEGORIES.map((c) => ({
    label: c,
    value: db.services.filter((s) => s.category === c && s.approvalStatus === "approved").length,
  }));
  const st = (s: string) => db.bookings.filter((b) => b.status === s).length;

  return (
    <>
      <PageHeader
        title="Platform overview"
        description="Users, listings, jobs and revenue across FixMate."
        action={
          pending > 0 ? (
            <Link href="/dashboard/admin/services" className="btn btn-primary">
              Review {pending} pending {pending === 1 ? "service" : "services"}
            </Link>
          ) : undefined
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Users" value={db.users.length} icon={Users} tone="blue" />
        <StatCard label="Total Technicians" value={technicians} icon={Wrench} tone="brand" />
        <StatCard label="Pending Services" value={pending} icon={Clock} tone="amber" hint={`Revenue ${formatMoney(revenue)}`} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Revenue by month" subtitle="Stripe payments received (USD)">
          <AreaChart data={monthly} valuePrefix="$" />
        </ChartCard>
        <ChartCard title="Approved services by category" subtitle="What customers can book today">
          <BarChart data={byCategory} />
        </ChartCard>
        <ChartCard title="All jobs by status" subtitle="Every booking on the platform" className="xl:col-span-2">
          <DonutChart
            centerLabel="bookings"
            centerValue={db.bookings.length}
            data={[
              { label: "Requested", value: st("requested"), color: "#3b82f6" },
              { label: "Accepted", value: st("accepted"), color: "#6366f1" },
              { label: "In Progress", value: st("in-progress"), color: "#f59e0b" },
              { label: "Completed", value: st("completed"), color: "#10b981" },
              { label: "Rejected", value: st("rejected"), color: "#ef4444" },
              { label: "Cancelled", value: st("cancelled"), color: "#9ca3af" },
            ]}
          />
        </ChartCard>
      </div>
    </>
  );
}
