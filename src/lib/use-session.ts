"use client";

import { selectSessionUser, useDB, useHydrated } from "./mock-db";

/**
 * Current session. `ready` is false until client state is live, so guards must
 * wait for it (a reload on a private route must never bounce a logged-in user to /sign-in).
 * Phase 2 swaps this for BetterAuth's `useSession`.
 */
export function useSession() {
  const db = useDB();
  const ready = useHydrated();
  const user = ready ? selectSessionUser(db) : null;
  return { user, ready };
}
