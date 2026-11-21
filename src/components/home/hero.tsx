"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/types";
import { HeroSlideshow } from "@/components/home/hero-slideshow";

/** A live-looking "repair ticket" that explains the product at a glance. */
// function JobTicket() {
//   return (
//     <div className="relative mx-auto w-full max-w-[460px] pb-10 lg:pb-0">
//       <div aria-hidden className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand-500/30 via-brand-500/5 to-transparent blur-2xl" />
//       <div className="animate-float relative rounded-3xl bg-white p-6 text-ink-900 shadow-pop ring-1 ring-white/20">
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
//               <Smartphone className="size-6" />
//             </span>
//             <div>
//               <p className="text-xs font-semibold tracking-wider text-ink-500 uppercase">Repair ticket · #FM-2041</p>
//               <p className="font-display text-lg leading-tight font-extrabold">iPhone screen replacement</p>
//             </div>
//           </div>
//           <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-amber-800 ring-1 ring-amber-200 ring-inset">
//             <span className="size-1.5 rounded-full bg-current" /> In Progress
//           </span>
//         </div>

//         <ol className="relative mt-7 grid grid-cols-4 gap-1" aria-label="Job progress">
//           <span aria-hidden className="absolute top-[13px] right-[12.5%] left-[12.5%] h-0.5 bg-ink-100" />
//           <span
//             aria-hidden
//             className="absolute top-[13px] left-[12.5%] h-0.5 w-[50%] origin-left bg-primary"
//             style={{ animation: "fm-grow-x 1.2s .6s cubic-bezier(.22,1,.36,1) both" }}
//           />
//           {TRACK.map((s) => (
//             <li key={s.label} className="relative flex flex-col items-center gap-2 text-center">
//               <span
//                 className={
//                   "relative z-10 grid size-7 place-items-center rounded-full text-white ring-4 ring-white " +
//                   (s.done ? "bg-primary" : s.active ? "bg-amber-500" : "bg-ink-200")
//                 }
//               >
//                 {s.done ? <Check className="size-4" strokeWidth={3} /> : s.active ? <Wrench className="size-3.5" /> : null}
//                 {s.active && <span aria-hidden className="animate-pulse-ring absolute inset-0 rounded-full" />}
//               </span>
//               <span className={"text-[11px] leading-tight font-semibold " + (s.active ? "text-ink-900" : s.done ? "text-ink-700" : "text-ink-400")}>
//                 {s.label}
//               </span>
//             </li>
//           ))}
//         </ol>

//         <div className="mt-7 flex items-center justify-between rounded-2xl bg-secondary p-4">
//           <div className="flex items-center gap-3">
//             <span className="grid size-10 place-items-center rounded-full bg-ink-900 text-sm font-bold text-white">RA</span>
//             <div>
//               <p className="text-sm font-bold">Rafiq Ahmed</p>
//               <p className="flex items-center gap-1 text-xs text-ink-500">
//                 <BadgeCheck className="size-3.5 text-emerald-600" /> Verified technician
//               </p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-[11px] font-semibold tracking-wider text-ink-500 uppercase">Pay after</p>
//             <p className="font-display text-lg font-extrabold">$85</p>
//           </div>
//         </div>
//       </div>

//       <div
//         className="animate-float absolute -bottom-0 -left-2 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 text-ink-900 shadow-pop sm:-left-8"
//         style={{ animationDelay: "1.6s" }}
//       >
//         <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
//           <Wallet className="size-5" />
//         </span>
//         <div>
//           <p className="text-[11px] font-semibold tracking-wider text-ink-500 uppercase">Payment</p>
//           <p className="text-sm font-extrabold">Only after completion</p>
//         </div>
//       </div>
//     </div>
//   );
// }

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
      <div className="bg-blueprint absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_95%)]" aria-hidden />
      <div className="absolute -top-24 -left-24 -z-10 size-[460px] rounded-full bg-brand-600/25 blur-3xl" aria-hidden />
      <div className="absolute -right-32 bottom-0 -z-10 size-[380px] rounded-full bg-sky-500/10 blur-3xl" aria-hidden />

      <div className="container-page grid items-center gap-14 pt-14 pb-28 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24 lg:pb-36">
        <div className="enter">
          <span style={{ "--i": 0 } as React.CSSProperties} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-[0.16em] text-brand-200 uppercase ring-1 ring-white/15">
            <ShieldCheck className="size-4" /> Verified technicians only
          </span>
          <h1 style={{ "--i": 1 } as React.CSSProperties} className="mt-6 text-[2.5rem] leading-[1.04] font-extrabold sm:text-6xl lg:text-[4.25rem]">
            Broken device? <span className="relative whitespace-nowrap text-brand-400">Get it fixed
              <svg aria-hidden viewBox="0 0 300 12" className="absolute -bottom-2 left-0 h-3 w-full text-brand-500/70" preserveAspectRatio="none">
                <path d="M2 8 C 60 2, 140 2, 298 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" style={{ "--len": 320, strokeDasharray: 320, animation: "fm-draw 1s .9s ease-out both" } as React.CSSProperties} />
              </svg>
            </span>{" "}
            by people you can trust.
          </h1>
          <p style={{ "--i": 2 } as React.CSSProperties} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-200">
            Book a repair for your phone, laptop, AC, fridge, TV or wiring. Follow every step of the job,
            and pay only after the work is delivered.
          </p>

          <form
            style={{ "--i": 3 } as React.CSSProperties}
            onSubmit={onSubmit}
            role="search"
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-pop ring-4 ring-white/10 transition-shadow focus-within:ring-brand-500/40 sm:flex-row"
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
                className="w-full min-w-0 bg-transparent py-3 text-base text-ink-900 outline-none placeholder:text-ink-400"
              />
            </div>
            <Button type="submit" size="lg">
              Find a Technician <ArrowRight />
            </Button>
          </form>

          <div style={{ "--i": 4 } as React.CSSProperties} className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-ink-300">Popular:</span>
            {CATEGORIES.slice(0, 4).map((c) => (
              <Link
                key={c}
                href={`/services?category=${encodeURIComponent(c)}`}
                className="rounded-full bg-white/10 px-3 py-1 font-medium text-white ring-1 ring-white/15 transition-colors hover:bg-white/20"
              >
                {c}
              </Link>
            ))}
          </div>

          <p style={{ "--i": 5 } as React.CSSProperties} className="mt-8 text-sm text-ink-300">
            Are you a repair pro?{" "}
            <Link href="/sign-up" className="font-semibold text-white underline decoration-brand-500 underline-offset-4 hover:text-brand-300">
              List your services
            </Link>
          </p>
        </div>
        <HeroSlideshow />
        <div className="page-enter [animation-delay:.35s]">
          {/* <JobTicket /> */}
        </div>
      </div>
    </section>
  );
}
