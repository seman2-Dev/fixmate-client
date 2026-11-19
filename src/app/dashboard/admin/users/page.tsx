"use client";

import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardUser } from "@/components/dashboard/user-context";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/badges";
import { setUserRole, useDB } from "@/lib/mock-db";
import type { Role } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const admin = useDashboardUser();
  const db = useDB();

  function change(id: string, name: string, role: Role) {
    // Phase 2: PATCH /api/admin/users/:id/role (verifyToken + verifyAdmin)
    const res = setUserRole(admin, id, role);
    if (res.ok) toast.success(`${name} is now a ${role}`);
    else toast.error(res.error);
  }

  return (
    <>
      <PageHeader title="Manage Users" description="See every account and change roles. You cannot change your own role." />
      <div className="table-wrap">
        <table className="table-base">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Change role</th>
            </tr>
          </thead>
          <tbody>
            {db.users.map((u) => {
              const self = u.email === admin.email;
              return (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} image={u.image} size="md" />
                      <span className="font-bold text-ink-900">
                        {u.name} {self && <span className="ml-1 text-xs font-medium text-ink-400">(you)</span>}
                      </span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="whitespace-nowrap">{formatDate(u.createdAt)}</td>
                  <td>
                    <label className="sr-only" htmlFor={`role-${u._id}`}>
                      Role for {u.name}
                    </label>
                    <select
                      id={`role-${u._id}`}
                      value={u.role}
                      disabled={self}
                      onChange={(e) => change(u._id, u.name, e.target.value as Role)}
                      className="field w-40 cursor-pointer py-2"
                      title={self ? "You cannot change your own role" : undefined}
                    >
                      <option value="customer">Customer</option>
                      <option value="technician">Technician</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
