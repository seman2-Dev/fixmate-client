"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { BadgeCheck, CheckCircle2, Search, ShieldCheck, Wallet } from "lucide-react";

function HeroIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px]">
      <div className="absolute inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand-500/25 via-brand-500/5 to-transparent ring-1 ring-white/10" />
      <svg viewBox="0 0 480 480" className="absolute inset-0 size-full" role="img" aria-label="A smartphone with a cracked screen being repaired with a wrench">
        <defs>
          <linearGradient id="hero-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1b2a38" />
            <stop offset="1" stopColor="#0b141d" />
          </linearGradient>
        </defs>
        <g className="animate-spin-slow" style={{ transformOrigin: "400px 90px" }}>
          <circle cx="400" cy="90" r="38" fill="none" stroke="#fb7c37" strokeWidth="10" strokeDasharray="14 9" opacity=".7" />
        </g>
        <g className="animate-spin-slow" style={{ transformOrigin: "78px 400px", animationDirection: "reverse" }}>
          <circle cx="78" cy="400" r="30" fill="none" stroke="#ffffff" strokeWidth="8" strokeDasharray="10 8" opacity=".25" />
        </g>
        <g transform="translate(160 62)">
          <rect width="170" height="350" rx="34" fill="#f7f4ee" />
          <rect x="11" y="11" width="148" height="328" rx="25" fill="url(#hero-screen)" />
          <rect x="60" y="22" width="50" height="9" rx="4.5" fill="#0b141d" />
          <path d="M28 58 L84 168 L56 205 L124 290 M84 168 L138 150" stroke="#fb7c37" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <rect x="30" y="238" width="110" height="9" rx="4.5" fill="#2a3b4c" />
          <rect x="30" y="258" width="76" height="9" rx="4.5" fill="#2a3b4c" />
          <rect x="30" y="296" width="110" height="26" rx="13" fill="#ee5c14" />
        </g>
        <g transform="translate(300 300) rotate(35)">
          <rect x="0" y="-10" width="150" height="20" rx="10" fill="#fb7c37" />
          <circle cx="162" cy="0" r="26" fill="none" stroke="#fb7c37" strokeWidth="16" />
          <rect x="140" y="-8" width="40" height="16" fill="#12202c" />
        </g>
      </svg>

      <div className="animate-float-slow absolute left-0 top-16 flex items-center gap-3 rounded-2xl bg-white p-3.5 pr-5 shadow-pop">
        <span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-700">
          <CheckCircle2 className="size-5" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Job status</p>
          <p className="text-sm font-extrabold text-ink-900">In Progress</p>
        </div>
      </div>

      <div
        className="animate-float-slow absolute bottom-20 right-0 flex items-center gap-3 rounded-2xl bg-white p-3.5 pr-5 shadow-pop"
        style={{ animationDelay: "1.4s" }}
      >
        <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
          <Wallet className="size-5" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Payment</p>
          <p className="text-sm font-extrabold text-ink-900">After completion</p>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/services?q=${encodeURIComponent(term)}` : "/services");
  }

  return (
    <section className="relative isolate overflow-hidden bg-ink-900 text-white">
      <div className="bg-blueprint absolute inset-0 -z-10" aria-hidden />
      <div className="absolute -left-24 top-1/2 -z-10 size-[420px] -translate-y-1/2 rounded-full bg-brand-600/20 blur-3xl" aria-hidden />

      <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-200 ring-1 ring-white/15">
            <ShieldCheck className="size-4" /> Verified technicians only
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            Broken device?{" "}
            <span className="text-brand-400">Get it fixed</span> by verified technicians.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-200">
            Book a repair for your phone, laptop, AC, fridge, TV or wiring. Follow every step of the job,
            and pay only after the work is delivered.
          </p>

          <form
            onSubmit={onSubmit}
            role="search"
            className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-2 shadow-pop sm:flex-row"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search repair services
            </label>
            <div className="flex flex-1 items-center gap-3 px-3">
              <Search className="size-5 shrink-0 text-ink-400" />
              <input
                id="hero-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Try “screen replacement” or “AC”"
                className="w-full bg-transparent py-3 text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">
              Find a Technician
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-ink-200">
            <span className="flex items-center gap-2">
              <BadgeCheck className="size-5 text-brand-400" /> Admin-approved listings
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-brand-400" /> Step-by-step job tracking
            </span>
            <span className="flex items-center gap-2">
              <Wallet className="size-5 text-brand-400" /> Pay after service
            </span>
          </div>
          <p className="mt-6 text-sm text-ink-300">
            Are you a repair pro?{" "}
            <Link href="/sign-up" className="font-semibold text-white underline decoration-brand-500 underline-offset-4 hover:text-brand-300">
              List your services
            </Link>
          </p>
        </div>

        <HeroIllustration />
      </div>
    </section>
  );
}
