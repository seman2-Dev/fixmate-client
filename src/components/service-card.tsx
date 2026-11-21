/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, Home, MapPin, Store, Wrench } from "lucide-react";
import type { Service } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUSD } from "@/lib/utils";

export function ServiceCard({ service }: { service: Service }) {
  const ModeIcon = service.serviceMode === "Home Visit" ? Home : Store;
  return (
    <Card className="group h-full gap-0 overflow-hidden py-0 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
      <Link
        href={`/services/${service._id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-secondary"
        tabIndex={-1}
        aria-hidden
      >
        <img
          src={service.image}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950/55 to-transparent" />
        <Badge variant="secondary" className="absolute top-3 left-3 bg-white/95 text-ink-800 shadow-sm ring-0 backdrop-blur">
          {service.category}
        </Badge>
        <span className="absolute right-3 bottom-3 rounded-xl bg-white px-3 py-1.5 text-sm font-extrabold text-ink-900 shadow-sm">
          <span className="mr-1 text-xs font-semibold text-ink-500">from</span>
          {formatUSD(service.basePrice)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-lg leading-snug font-extrabold text-foreground">
          <Link href={`/services/${service._id}`} className="rounded-sm focus-visible:outline-2 focus-visible:outline-ring">
            {service.title}
          </Link>
        </h3>

        <ul className="mt-3 space-y-1.5 text-sm text-foreground/75">
          <li className="flex items-center gap-2">
            <ModeIcon className="size-4 shrink-0 text-primary" />
            {service.serviceMode}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="truncate">{service.serviceArea}</span>
          </li>
          <li className="flex items-center gap-2">
            <Wrench className="size-4 shrink-0 text-primary" />
            <span className="truncate">{service.technicianName}</span>
          </li>
        </ul>

        <Button asChild variant="dark" className="mt-5 w-full">
          <Link href={`/services/${service._id}`} aria-label={`View details for ${service.title}`}>
            View Details
            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export function ServiceCardSkeleton() {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-4 h-10 w-full" />
      </div>
    </Card>
  );
}
