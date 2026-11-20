"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { PackageSearch, Search, SlidersHorizontal, X } from "lucide-react";
import { ServiceCard, ServiceCardSkeleton } from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { useDB, useHydrated } from "@/lib/mock-db";
import { queryServices } from "@/lib/services-query";
import { CATEGORIES, SERVICE_MODES, type ServiceQuery } from "@/lib/types";

const ALL = "__all__";

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
      <Card className="sticky top-[84px] z-20 gap-0 p-4 shadow-lift sm:p-5">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="grid gap-3 md:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
          <div className="relative md:col-span-3 lg:col-span-1">
            <Label htmlFor="svc-search" className="sr-only">
              Search by title or category
            </Label>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              key={q}
              id="svc-search"
              type="search"
              defaultValue={q}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by title or category"
              className="pl-10"
            />
          </div>

          <div>
            <Label htmlFor="svc-category" className="sr-only">
              Category
            </Label>
            <Select value={category || ALL} onValueChange={(v) => setParam("category", v === ALL ? "" : v)}>
              <SelectTrigger id="svc-category" aria-label="Category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="svc-mode" className="sr-only">
              Service mode
            </Label>
            <Select value={mode || ALL} onValueChange={(v) => setParam("mode", v === ALL ? "" : v)}>
              <SelectTrigger id="svc-mode" aria-label="Service mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Any service mode</SelectItem>
                {SERVICE_MODES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="svc-sort" className="sr-only">
              Sort by
            </Label>
            <Select value={sort} onValueChange={(v) => setParam("sort", v)}>
              <SelectTrigger id="svc-sort" aria-label="Sort by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="button" variant="outline" onClick={clearAll} disabled={!hasFilters} className="h-11 md:col-span-3 lg:col-span-1">
            <X /> Clear
          </Button>
        </form>
      </Card>

      <div className="mb-6 mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground/75" aria-live="polite">
          <SlidersHorizontal className="size-4 text-primary" />
          {ready
            ? `${results.length} ${results.length === 1 ? "service" : "services"} found`
            : "Loading services…"}
          {category && (
            <Badge variant="outline" className="bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 ring-brand-200 dark:ring-brand-400/30">
              {category}
            </Badge>
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
          {results.map((s, i) => (
            <div key={s._id} className="page-enter h-full" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
              <ServiceCard service={s} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
