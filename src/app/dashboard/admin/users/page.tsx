"use client";

import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { User } from "@/lib/types";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badges";
import { apiRequest } from "@/lib/api-client";
import type { Role } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { NativeSelect } from "@/components/ui/native-select";

export default function AdminUsersPage() {
  const admin = useDashboardUser();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    let active = true;
    apiRequest<User[]>("/api/admin/users", { protectedRequest: true })
      .then((result) => {
        if (active) setUsers(result);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Could not load users"));
    return () => {
      active = false;
    };
  }, []);

  async function change(id: string, name: string, role: Role) {
    try {
      await apiRequest(`/api/admin/users/${id}/role`, {
        protectedRequest: true,
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      setUsers((rows) => rows.map((row) => row._id === id ? { ...row, role } : row));
      toast.success(`${name} is now a ${role}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update role");
    }
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
    [admin.email],
  );

  return (
    <>
      <PageHeader title="Manage Users" description="See every account and change roles. You cannot change your own role." />
      <DataTable columns={columns} data={users} />
    </>
  );
}
