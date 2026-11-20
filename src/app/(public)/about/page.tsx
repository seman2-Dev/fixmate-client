import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { HowItWorks } from "@/components/home/how-it-works";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
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
      <section className="relative isolate overflow-hidden bg-ink-900 py-16 text-white sm:py-24">
        <div className="bg-blueprint absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
        <div className="absolute -top-20 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-brand-600/25 blur-3xl" aria-hidden />
        <div className="enter container-page max-w-4xl text-center">
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
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow justify-center">Job tracking</span>
            <h2 className="section-title">One pipeline, zero guesswork</h2>
            <p className="section-lead mx-auto">
              Every repair follows the same path. Only a Requested job can branch off, every other step
              moves forward.
            </p>
          </Reveal>
          <Card className="mx-auto mt-10 max-w-4xl p-6 sm:p-8">
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
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t pt-6 text-sm text-muted-foreground">
              <span>A Requested job can also become</span>
              <BookingBadge status="rejected" />
              <span>by the technician or</span>
              <BookingBadge status="cancelled" />
              <span>by the customer.</span>
            </div>
          </Card>
        </div>
      </section>

      <section className="border-y bg-card py-20">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow justify-center">Three roles</span>
            <h2 className="section-title">Built for everyone in the repair loop</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {ROLES.map((r, i) => (
              <Reveal key={r.title} delay={i} className="h-full">
              <Card className="h-full p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300">
                  <r.icon className="size-7" />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-foreground">{r.title}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/75">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Card>
              </Reveal>
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
              <details key={f.q} className="group rounded-2xl border bg-card p-5 shadow-card transition-shadow open:shadow-lift">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-base font-bold text-foreground focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-foreground/75">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/services">
                Find a technician <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
