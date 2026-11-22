/** Only allow same-site relative redirects (blocks open-redirect via ?redirect=https://evil.com). */
export function safeRedirect(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  return value;
}

export function dashboardPathFor(role: "customer" | "technician" | "admin"): string {
  return `/dashboard/${role}`;
}
