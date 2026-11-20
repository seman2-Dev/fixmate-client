"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { BookingBadge, PaymentBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { useDB } from "@/lib/mock-db";
import type { BookingStatus } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Booking } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

const FILTERS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

const columns: ColumnDef<Booking>[] = [
  { id: "Service", header: "Service", accessorFn: (b) => b.serviceTitle, meta: { className: "max-w-[14rem]" }, cell: ({ row }) => <span className="font-bold text-foreground">{row.original.serviceTitle}</span> },
  { id: "Customer", header: "Customer", accessorFn: (b) => b.customerName },
  { id: "Technician", header: "Technician", accessorFn: (b) => b.technicianName },
  { id: "Date", header: "Date", accessorFn: (b) => b.preferredDate, cell: ({ row }) => <span className="whitespace-nowrap">{formatDate(row.original.preferredDate)}</span> },
  { id: "Status", header: "Status", accessorFn: (b) => b.status, cell: ({ row }) => <BookingBadge status={row.original.status} /> },
  { id: "Payment", header: "Payment", accessorFn: (b) => b.paymentStatus, cell: ({ row }) => <PaymentBadge status={row.original.paymentStatus} /> },
  {
    id: "Amount",
    header: "Amount",
    accessorFn: (b) => (b.status === "completed" ? b.finalAmount : b.basePrice),
    meta: { className: "md:text-right" },
    cell: ({ getValue }) => <span className="font-semibold text-foreground">{formatMoney(getValue<number>())}</span>,
  },
];

export default function AdminBookingsPage() {
  const db = useDB();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const rows = db.bookings.filter((b) => filter === "all" || b.status === filter);

  return (
    <>
      <PageHeader title="All Bookings" description="A read-only view of every repair job on the platform." />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-6">
        <TabsList aria-label="Filter by status">
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {rows.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No bookings found" message="No jobs match this status." />
      ) : (
        <DataTable columns={columns} data={rows} />
      )}
    </>
  );
}
