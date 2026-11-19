"use client";

import { createContext, useContext } from "react";
import type { User } from "@/lib/types";

const DashboardUserContext = createContext<User | null>(null);

export const DashboardUserProvider = DashboardUserContext.Provider;

/** The signed-in user. Only available below the guarded dashboard layout, so it is never null. */
export function useDashboardUser(): User {
  const user = useContext(DashboardUserContext);
  if (!user) throw new Error("useDashboardUser must be used inside the dashboard layout");
  return user;
}
