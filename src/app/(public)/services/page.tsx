import type { Metadata } from "next";
import { Suspense } from "react";
import { ServicesBrowser } from "@/components/services/services-browser";
import { ServiceCardSkeleton } from "@/components/service-card";

export const metadata: Metadata = {
  title: "Browse Repair Services",
  description: "Search, filter and sort approved repair services from verified technicians.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink-900 py-14 text-white">
        <div className="bg-blueprint absolute inset-0 -z-10" aria-hidden />
        <div className="container-page">
          <span className="section-eyebrow !text-brand-300">Service catalogue</span>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Browse repair services</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-200">
            Every listing is approved by our admins. Compare prices, pick a technician and send your
            request.
          </p>
        </div>
      </section>

      <div className="container-page py-10">
        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <ServicesBrowser />
        </Suspense>
      </div>
    </>
  );
}
