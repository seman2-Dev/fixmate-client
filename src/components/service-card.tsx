/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, Home, MapPin, Store, Wrench } from "lucide-react";
import type { Service } from "@/lib/types";
import { formatUSD } from "@/lib/utils";

export function ServiceCard({ service }: { service: Service }) {
  const HomeIcon = service.serviceMode === "Home Visit" ? Home : Store;
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-pop">
      <Link
        href={`/services/${service._id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-ink-100"
        tabIndex={-1}
        aria-hidden
      >
        <img
          src={service.image}
          alt=""
          loading="lazy"
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink-800 shadow-sm">
          {service.category}
        </span>
        <span className="absolute bottom-3 right-3 rounded-xl bg-ink-900/90 px-3 py-1.5 text-sm font-bold text-white backdrop-blur">
          from {formatUSD(service.basePrice)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-extrabold leading-snug text-ink-900">
          {service.title}
        </h3>

        <ul className="mt-3 space-y-1.5 text-sm text-ink-600">
          <li className="flex items-center gap-2">
            <HomeIcon className="size-4 shrink-0 text-brand-600" />
            {service.serviceMode}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-brand-600" />
            <span className="truncate">{service.serviceArea}</span>
          </li>
          <li className="flex items-center gap-2">
            <Wrench className="size-4 shrink-0 text-brand-600" />
            <span className="truncate">{service.technicianName}</span>
          </li>
        </ul>

        <Link
          href={`/services/${service._id}`}
          className="btn btn-dark mt-5 w-full"
          aria-label={`View details for ${service.title}`}
        >
          View Details
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[16/10] rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-4/5" />
        <div className="skeleton h-5 w-2/5" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton mt-4 h-10 w-full" />
      </div>
    </div>
  );
}
