"use client";

import { authClient } from "./auth-client";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "https://fixmate-server1.vercel.app";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function getAccessToken(): Promise<string | null> {
  try {
    const result = await authClient.token();
    return result.data?.token || null;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { protectedRequest?: boolean } = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.protectedRequest) {
    const token = await getAccessToken();
    if (!token) throw new ApiError("Please sign in again", 401);
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      typeof body.message === "string" ? body.message : `Request failed (${response.status})`,
      response.status,
    );
  }
  return body as T;
}
