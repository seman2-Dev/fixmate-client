"use client";

import type { Role } from "./types";
import { useSession as useBetterAuthSession } from "./auth-client";

export function useSession() {
  const session = useBetterAuthSession();
  const rawUser = session.data?.user as
    | {
        id: string;
        name: string;
        email: string;
        image?: string | null;
        role?: Role;
        phone?: string;
        area?: string;
        bio?: string;
      }
    | undefined;

  const user = rawUser
    ? {
        _id: rawUser.id,
        name: rawUser.name,
        email: rawUser.email,
        image: rawUser.image || "",
        role: (["customer", "technician", "admin"].includes(rawUser.role || "")
          ? rawUser.role?.toLowerCase()
          : "customer") as Role,
        phone: rawUser.phone || "",
        area: rawUser.area || "",
        bio: rawUser.bio || "",
        createdAt: session.data?.session?.createdAt?.toString?.() || "",
      }
    : null;

  return { user, ready: !session.isPending };
}
