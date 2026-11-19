"use client";

import { authClient } from "./auth-client";
import type { User } from "./types";

/**
 * Current BetterAuth session mapped to the app's User shape.
 * `ready` stays false until the session request settles, so route guards must
 * wait for it (a reload on a private route must never bounce a signed-in user).
 */
export function useSession() {
  const { data, isPending } = authClient.useSession();
  const sessionUser = data?.user;
  const user: User | null = sessionUser
    ? {
        _id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
        image: sessionUser.image ?? "",
        role: (sessionUser.role as User["role"]) ?? "customer",
        phone: sessionUser.phone ?? "",
        area: sessionUser.area ?? "",
        bio: sessionUser.bio ?? "",
        createdAt:
          sessionUser.createdAt instanceof Date
            ? sessionUser.createdAt.toISOString()
            : String(sessionUser.createdAt ?? ""),
      }
    : null;

  return { user, ready: !isPending };
}
