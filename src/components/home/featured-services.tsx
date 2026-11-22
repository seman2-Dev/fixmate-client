"use client";

import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { ServiceCard, ServiceCardSkeleton } from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/reveal";
import { apiRequest } from "@/lib/api-client";
import type { Service } from "@/lib/types";
import { useEffect, useState } from "react";

export function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest<Service[]>("/api/services?limit=6")
      .then((result) => {
        if (active) setServices(result);
      })
      .catch(() => {
        if (active) setServices([]);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="relative z-10 -mt-16 pb-20 sm:-mt-20">
      <div className="container-page">
        <div className="rounded-[2rem] border bg-background/95 p-5 shadow-lift backdrop-blur sm:p-8 lg:p-10">
          <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="section-eyebrow">
                <Wrench className="size-4" /> Fresh on the bench
              </span>
              <h2 className="section-title">Latest repair services</h2>
              <p className="section-lead">
                Newly approved listings from technicians across the city, ready to book today.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/services">
                View all services <ArrowRight />
              </Link>
            </Button>
          </Reveal>

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
              services.map((s, i) => (
                <Reveal key={s._id} delay={i % 3} className="h-full">
                  <ServiceCard service={s} />
                </Reveal>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
