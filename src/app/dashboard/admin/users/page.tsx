"use client";

import { toast } from "sonner";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { User } from "@/lib/types";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badges";
import { setUserRole, useDB } from "@/lib/mock-db";
import type { Role } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { NativeSelect } from "@/components/ui/native-select";

export default function AdminUsersPage() {
  const admin = useDashboardUser();
  const db = useDB();

  function change(id: string, name: string, role: Role) {
    // Phase 2: PATCH /api/admin/users/:id/role (verifyToken + verifyAdmin)
    const res = setUserRole(admin, id, role);
    if (res.ok) toast.success(`${name} is now a ${role}`);
    else toast.error(res.error);
  }

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "User",
        header: "User",
        accessorFn: (u) => u.name,
        meta: { noLabel: true },
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex items-center gap-3 text-left">
              <Avatar name={u.name} image={u.image} size="md" />
              <span className="font-bold text-foreground">
                {u.name} {u.email === admin.email && <span className="ml-1 text-xs font-medium text-muted-foreground">(you)</span>}
              </span>
            </div>
          );
        },
      },
      { id: "Email", header: "Email", accessorFn: (u) => u.email },
      { id: "Role", header: "Role", accessorFn: (u) => u.role, cell: ({ row }) => <RoleBadge role={row.original.role} /> },
      { id: "Joined", header: "Joined", accessorFn: (u) => +new Date(u.createdAt), cell: ({ row }) => <span className="whitespace-nowrap">{formatDate(row.original.createdAt)}</span> },
      {
        id: "Change role",
        header: "Change role",
        enableSorting: false,
        cell: ({ row }) => {
          const u = row.original;
          const self = u.email === admin.email;
          return (
            <>
              <label className="sr-only" htmlFor={`role-${u._id}`}>
                Role for {u.name}
              </label>
              <NativeSelect
                id={`role-${u._id}`}
                value={u.role}
                disabled={self}
                onChange={(e) => change(u._id, u.name, e.target.value as Role)}
                className="h-9 w-40 py-1"
                title={self ? "You cannot change your own role" : undefined}
              >
                <option value="customer">Customer</option>
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
              </NativeSelect>
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [admin.email],
  );

  return (
    <>
      <PageHeader title="Manage Users" description="See every account and change roles. You cannot change your own role." />
      <DataTable columns={columns} data={db.users} />
    </>
  );
}
