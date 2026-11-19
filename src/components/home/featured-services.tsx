"use client";

import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { ServiceCard, ServiceCardSkeleton } from "@/components/service-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useDB, useHydrated } from "@/lib/mock-db";
import { latestServices } from "@/lib/services-query";

export function FeaturedServices() {
  const db = useDB();
  const ready = useHydrated();
  // Phase 2: GET /api/services?limit=6 -> .sort({ createdAt: -1 }).limit(6)
  const services = latestServices(db.services, 6);

  return (
    <section className="py-20">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="section-eyebrow">
              <Wrench className="size-4" /> Fresh on the bench
            </span>
            <h2 className="section-title">Latest repair services</h2>
            <p className="section-lead">
              Newly approved listings from technicians across the city, ready to book today.
            </p>
          </div>
          <Link href="/services" className="btn btn-outline shrink-0">
            View all services <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {!ready ? (
            Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
          ) : services.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState
                title="No services listed yet"
                message="Approved services will appear here as soon as technicians publish them."
                actionLabel="Browse services"
                actionHref="/services"
              />
            </div>
          ) : (
            services.map((s) => <ServiceCard key={s._id} service={s} />)
          )}
        </div>
      </div>
    </section>
  );
}
