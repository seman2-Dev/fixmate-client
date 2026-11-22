"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Clock, Users, Wrench } from "lucide-react";
import { AreaChart, BarChart, ChartCard, DonutChart } from "@/components/charts";
import { PageHeader } from "@/components/dashboard/page-header";
import { Wallet } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { CATEGORIES, type Booking, type Payment, type Service, type User } from "@/lib/types";
import { apiRequest } from "@/lib/api-client";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

export default function AdminOverview() {
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest<User[]>("/api/admin/users", { protectedRequest: true }),
      apiRequest<Service[]>("/api/admin/services", { protectedRequest: true }),
      apiRequest<Booking[]>("/api/admin/bookings", { protectedRequest: true }),
      apiRequest<{ payments: Payment[] }>("/api/admin/payments", { protectedRequest: true }),
    ]).then(([userRows, serviceRows, bookingRows, paymentResult]) => {
      if (active) {
        setUsers(userRows);
        setServices(serviceRows);
        setBookings(bookingRows);
        setPayments(paymentResult.payments);
      }
    }).catch((error) => {
      if (active) toast.error(error instanceof Error ? error.message : "Could not load overview");
    });
    return () => {
      active = false;
    };
  }, []);

  const technicians = users.filter((u) => u.role === "technician").length;
  const pending = services.filter((s) => s.approvalStatus === "pending").length;
  const revenue = payments.reduce((s, p) => s + p.amount, 0);

  const now = new Date("2026-11-18");
  const monthly = MONTHS.map((label, i) => {
    const target = new Date(now.getFullYear(), now.getMonth() - (MONTHS.length - 1 - i), 1);
    const value = payments
      .filter((p) => {
        const d = new Date(p.paidAt);
        return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
      })
      .reduce((s, p) => s + p.amount, 0);
    return { label, value: Math.round(value) };
  });

  const byCategory = CATEGORIES.map((c) => ({
    label: c,
    value: services.filter((s) => s.category === c && s.approvalStatus === "approved").length,
  }));
  const st = (s: string) => bookings.filter((b) => b.status === s).length;

  return (
    <>
      <PageHeader
        title="Platform overview"
        description="Users, listings, jobs and revenue across FixMate."
        action={
          pending > 0 ? (
            <Button asChild>
<Link href="/dashboard/admin/services">
              Review {pending} pending {pending === 1 ? "service" : "services"}
            </Link>
</Button>
          ) : undefined
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={users.length} icon={Users} tone="blue" hint="All roles combined" />
        <StatCard label="Total Technicians" value={technicians} icon={Wrench} tone="brand" hint="Offering services" />
        <StatCard label="Pending Services" value={pending} icon={Clock} tone="amber" hint="Awaiting approval" />
        <StatCard label="Total Revenue" value={formatMoney(revenue)} icon={Wallet} tone="green" hint="Stripe payments received" />
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
            centerValue={bookings.length}
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
