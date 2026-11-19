"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { PackageSearch, Search, SlidersHorizontal, X } from "lucide-react";
import { ServiceCard, ServiceCardSkeleton } from "@/components/service-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useDB, useHydrated } from "@/lib/mock-db";
import { queryServices } from "@/lib/services-query";
import { CATEGORIES, SERVICE_MODES, type ServiceQuery } from "@/lib/types";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

/**
 * Filters live in the URL (?q=&category=&mode=&sort=) so they survive a reload and
 * a Home category card can deep-link into a pre-filtered page.
 * Phase 2: the same params are forwarded to GET /api/services and applied in MongoDB.
 */
export function ServicesBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const db = useDB();
  const ready = useHydrated();
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const mode = params.get("mode") ?? "";
  const sortParam = params.get("sort");
  const sort: NonNullable<ServiceQuery["sort"]> =
    sortParam === "price-asc" || sortParam === "price-desc" ? sortParam : "newest";

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value && !(key === "sort" && value === "newest")) next.set(key, value);
      else next.delete(key);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  useEffect(() => () => {
    if (debounce.current) clearTimeout(debounce.current);
  }, []);

  const onSearch = (value: string) => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setParam("q", value.trim()), 350);
  };

  const clearAll = () => router.replace(pathname, { scroll: false });
  const hasFilters = Boolean(q || category || mode || sort !== "newest");

  const results = queryServices(db.services, { q, category, mode, sort });

  return (
    <>
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="card sticky top-[84px] z-20 grid gap-3 p-4 sm:p-5 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto]"
      >
        <div className="relative md:col-span-2 lg:col-span-1">
          <label htmlFor="svc-search" className="sr-only">
            Search by title or category
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
          <input
            key={q}
            id="svc-search"
            type="search"
            defaultValue={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by title or category"
            className="field pl-10"
          />
        </div>

        <div>
          <label htmlFor="svc-category" className="sr-only">
            Category
          </label>
          <select
            id="svc-category"
            value={category}
            onChange={(e) => setParam("category", e.target.value)}
            className="field cursor-pointer"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="svc-mode" className="sr-only">
            Service mode
          </label>
          <select
            id="svc-mode"
            value={mode}
            onChange={(e) => setParam("mode", e.target.value)}
            className="field cursor-pointer"
          >
            <option value="">Any service mode</option>
            {SERVICE_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="svc-sort" className="sr-only">
            Sort by
          </label>
          <select
            id="svc-sort"
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="field cursor-pointer"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={clearAll}
          disabled={!hasFilters}
          className="btn btn-outline md:col-span-2 lg:col-span-1"
        >
          <X className="size-4" /> Clear
        </button>
      </form>

      <div className="mb-6 mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-600" aria-live="polite">
          <SlidersHorizontal className="size-4 text-brand-600" />
          {ready
            ? `${results.length} ${results.length === 1 ? "service" : "services"} found`
            : "Loading services…"}
          {category && (
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
              {category}
            </span>
          )}
        </p>
      </div>

      {!ready ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No services match your search"
          message="Try a different keyword, switch the category or service mode, or clear all filters to see everything."
          actionLabel="Clear all filters"
          onAction={clearAll}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </div>
      )}
    </>
  );
}
