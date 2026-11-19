import type { Service, ServiceQuery } from "./types";

/**
 * Mirrors the MongoDB query the Express server will run in Phase 2
 * (Challenge 1: search, filter and sort are NOT done with client `.filter()` in production).
 * Public visibility rule: approvalStatus === "approved" AND isAvailable === true.
 */
export function isPublic(s: Service) {
  return s.approvalStatus === "approved" && s.isAvailable;
}

export function queryServices(all: Service[], query: ServiceQuery): Service[] {
  const q = (query.q ?? "").trim().toLowerCase();
  let rows = all.filter(isPublic);

  if (q) {
    rows = rows.filter(
      (s) => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
    );
  }
  if (query.category) rows = rows.filter((s) => s.category === query.category);
  if (query.mode) rows = rows.filter((s) => s.serviceMode === query.mode);

  const sorted = rows.slice();
  switch (query.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.basePrice - b.basePrice);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.basePrice - a.basePrice);
      break;
    default:
      sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  return sorted;
}

export function latestServices(all: Service[], limit = 6) {
  return queryServices(all, { sort: "newest" }).slice(0, limit);
}
