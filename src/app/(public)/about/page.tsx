import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { HowItWorks } from "@/components/home/how-it-works";
import { BookingBadge, PaymentBadge } from "@/components/ui/badges";

export const metadata: Metadata = {
  title: "How It Works",
  description: "See how FixMate connects customers with verified repair technicians and keeps every job transparent.",
};

const ROLES = [
  {
    icon: UserRound,
    title: "Customers",
    points: [
      "Browse approved services and compare prices",
      "Send a repair request with your problem details",
      "Cancel while the job is still Requested",
      "Pay securely online after completion",
    ],
  },
  {
    icon: Wrench,
    title: "Technicians",
    points: [
      "List the repair services you offer",
      "Accept or reject incoming requests",
      "Move jobs forward and set the final amount",
      "Turn a service on or off any time",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    points: [
      "Approve or reject every new service listing",
      "Manage users and their roles",
      "Monitor all repair jobs on the platform",
      "Track every transaction and total revenue",
    ],
  },
];

const FAQ = [
  {
    q: "When do I pay?",
    a: "Only after the technician marks your job Completed and sets the final amount. A Pay Now button then appears in My Bookings, and checkout is handled securely by Stripe.",
  },
  {
    q: "Can I cancel a request?",
    a: "Yes, while the job is still in the Requested stage. Once a technician accepts it, the job moves forward and can no longer be cancelled.",
  },
  {
    q: "Why does a service need approval?",
    a: "Admins review every new or edited listing before it appears publicly, so customers only see services that meet our quality bar.",
  },
  {
    q: "What if the final price differs from the starting price?",
    a: "The starting price is a guide. The technician confirms the final amount when completing the job, and you can see it before paying.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink-900 py-16 text-white sm:py-20">
        <div className="bg-blueprint absolute inset-0 -z-10" aria-hidden />
        <div className="container-page max-w-4xl text-center">
          <span className="section-eyebrow justify-center !text-brand-300">About FixMate</span>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Repairs shouldn&apos;t feel like a leap of faith
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-200">
            People struggle to find a trustworthy technician, then hand over a device with no idea what is
            happening. FixMate gives every job a clear, trackable status and moves payment to the very end.
          </p>
        </div>
      </section>

      <HowItWorks />

      <section className="py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow justify-center">Job tracking</span>
            <h2 className="section-title">One pipeline, zero guesswork</h2>
            <p className="section-lead mx-auto">
              Every repair follows the same path. Only a Requested job can branch off, every other step
              moves forward.
            </p>
          </div>
          <div className="card mx-auto mt-10 max-w-4xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <BookingBadge status="requested" />
              <ArrowRight className="size-4 text-ink-300" />
              <BookingBadge status="accepted" />
              <ArrowRight className="size-4 text-ink-300" />
              <BookingBadge status="in-progress" />
              <ArrowRight className="size-4 text-ink-300" />
              <BookingBadge status="completed" />
              <ArrowRight className="size-4 text-ink-300" />
              <PaymentBadge status="paid" />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-ink-100 pt-6 text-sm text-ink-500">
              <span>A Requested job can also become</span>
              <BookingBadge status="rejected" />
              <span>by the technician or</span>
              <BookingBadge status="cancelled" />
              <span>by the customer.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-white py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow justify-center">Three roles</span>
            <h2 className="section-title">Built for everyone in the repair loop</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {ROLES.map((r) => (
              <div key={r.title} className="card flex h-full flex-col p-7">
                <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                  <r.icon className="size-7" />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-ink-900">{r.title}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-600">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page max-w-3xl">
          <div className="text-center">
            <span className="section-eyebrow justify-center">FAQ</span>
            <h2 className="section-title">Questions, answered</h2>
          </div>
          <div className="mt-10 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="card group p-5 open:shadow-pop">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-ink-900 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="size-5 shrink-0 text-ink-400 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/services" className="btn btn-primary btn-lg">
              Find a technician <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
