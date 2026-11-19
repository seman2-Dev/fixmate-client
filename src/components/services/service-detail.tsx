"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Clock, Home, Info, MapPin, ShieldCheck, Store, Tag, Wallet } from "lucide-react";
import { RequestRepairModal } from "@/components/services/request-repair-modal";
import { Avatar } from "@/components/ui/avatar";
import { useDB, useHydrated } from "@/lib/mock-db";
import { isPublic } from "@/lib/services-query";
import { useSession } from "@/lib/use-session";
import { formatUSD } from "@/lib/utils";

function DetailSkeleton() {
  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4">
        <div className="skeleton aspect-[16/10] w-full" />
        <div className="skeleton h-9 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
      <div className="skeleton h-96 w-full" />
    </div>
  );
}

export function ServiceDetail({ id }: { id: string }) {
  const db = useDB();
  const ready = useHydrated();
  const { user } = useSession();
  const [open, setOpen] = useState(false);

  if (!ready) return <DetailSkeleton />;

  const service = db.services.find((s) => s._id === id);
  if (!service || !isPublic(service)) notFound();

  const tech = db.users.find((u) => u.email === service.technicianEmail);
  const ModeIcon = service.serviceMode === "Home Visit" ? Home : Store;

  const facts = [
    { icon: Tag, label: "Starting price", value: formatUSD(service.basePrice) },
    { icon: Clock, label: "Estimated duration", value: service.estimatedDuration },
    { icon: ModeIcon, label: "Service mode", value: service.serviceMode },
    { icon: MapPin, label: "Service area", value: service.serviceArea },
  ];

  return (
    <div className="container-page py-8 sm:py-10">
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition hover:text-brand-700"
      >
        <ArrowLeft className="size-4" /> Back to services
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.45fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-3xl bg-ink-100 shadow-card">
            <img src={service.image} alt={service.title} className="aspect-[16/10] w-full object-cover" />
          </div>

          <div className="mt-8">
            <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
              {service.category}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
              {service.title}
            </h1>
            <h2 className="mt-8 text-lg font-extrabold text-ink-900">What this service includes</h2>
            <p className="mt-3 text-base leading-relaxed text-ink-600">{service.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, t: "Admin approved", d: "Listing reviewed before it went live" },
                { icon: Wallet, t: "Pay after service", d: "Nothing to pay until the job is completed" },
                { icon: Clock, t: "Live job status", d: "Track each step from your dashboard" },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl border border-ink-100 bg-white p-4">
                  <b.icon className="size-6 text-brand-600" />
                  <p className="mt-3 text-sm font-bold text-ink-900">{b.t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <p className="text-sm font-medium text-ink-500">Starting from</p>
            <p className="font-display text-5xl font-extrabold text-ink-900">{formatUSD(service.basePrice)}</p>
            <p className="mt-1 text-xs text-ink-400">Final amount is set by the technician after the job.</p>

            <dl className="mt-6 space-y-4 border-t border-ink-100 pt-6">
              {facts.slice(1).map((f) => (
                <div key={f.label} className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink-50 text-brand-600">
                    <f.icon className="size-[18px]" />
                  </span>
                  <div>
                    <dt className="text-xs font-medium text-ink-400">{f.label}</dt>
                    <dd className="text-sm font-bold text-ink-900">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              {!user ? (
                <Link
                  href={`/sign-in?redirect=${encodeURIComponent(`/services/${service._id}`)}`}
                  className="btn btn-primary btn-lg w-full"
                >
                  Sign in to Request Repair
                </Link>
              ) : user.role === "customer" ? (
                <button type="button" className="btn btn-primary btn-lg w-full" onClick={() => setOpen(true)}>
                  Request Repair
                </button>
              ) : (
                <>
                  <button type="button" disabled className="btn btn-primary btn-lg w-full">
                    Request Repair
                  </button>
                  <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs font-medium leading-relaxed text-amber-800">
                    <Info className="mt-0.5 size-4 shrink-0" />
                    Only customers can request a repair. You are signed in as a {user.role}.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-ink-400">Your technician</h2>
            <div className="mt-4 flex items-center gap-4">
              <Avatar name={service.technicianName} image={tech?.image} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold text-ink-900">{service.technicianName}</p>
                <p className="flex items-center gap-1.5 text-sm text-ink-500">
                  <MapPin className="size-4 shrink-0 text-brand-600" />
                  <span className="truncate">{tech?.area || service.serviceArea}</span>
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-600">
              {tech?.bio || "This technician has not added a bio yet."}
            </p>
          </div>
        </aside>
      </div>

      {user?.role === "customer" && (
        <RequestRepairModal open={open} onClose={() => setOpen(false)} service={service} user={user} />
      )}
    </div>
  );
}
