import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Hammer, Quote, ShieldCheck, Star, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { CATEGORY_META } from "@/lib/categories";
import { CATEGORIES } from "@/lib/types";

const STATS = [
  { icon: BadgeCheck, value: "120+", label: "Verified technicians" },
  { icon: Hammer, value: "4,800+", label: "Jobs completed" },
  { icon: Wallet, value: "100%", label: "Pay after service" },
  { icon: Star, value: "4.8/5", label: "Average customer rating" },
];

const TESTIMONIALS = [
  {
    quote:
      "My laptop was overheating for months. I booked, watched the status change to Completed, and only then paid. Zero stress.",
    name: "Farhana Akter",
    place: "Dhanmondi, Dhaka",
  },
  {
    quote:
      "As a technician, FixMate gives me a clean list of requests and a clear way to set the final price. Customers trust it.",
    name: "Mizanur Rahman",
    place: "Technician, Mirpur",
  },
  {
    quote:
      "The AC repair was done the next day. Knowing exactly what stage the job was in made all the difference.",
    name: "Tahmid Hossain",
    place: "Uttara, Dhaka",
  },
];

export function PopularCategories() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">Popular categories</span>
          <h2 className="section-title">What needs fixing today?</h2>
          <p className="section-lead mx-auto">
            Pick a category to see only the services that match, with prices and technicians listed.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => {
            const meta = CATEGORY_META[c];
            return (
              <Reveal key={c} delay={i % 4} className="h-full">
              <Link
                href={`/services?category=${encodeURIComponent(c)}`}
                className="group flex h-full flex-col rounded-2xl border bg-card p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                <span className={`grid size-14 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${meta.tint}`}>
                  <meta.icon className="size-7" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-foreground">{c}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{meta.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
                  Browse {c}
                  <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
              </Reveal>
            );
          })}
          <Reveal delay={0} className="h-full">
          <Link
            href="/services"
            className="group bg-blueprint flex h-full min-h-56 flex-col justify-between rounded-2xl bg-primary p-6 text-white transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-brand-700 hover:shadow-lift focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            <ShieldCheck className="size-9" strokeWidth={1.6} />
            <div>
              <h3 className="mt-8 text-lg font-extrabold">See every service</h3>
              <p className="mt-1.5 text-sm text-brand-100">Browse the full catalogue of approved repairs.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold">
                Open catalogue <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 py-20 text-white">
      <div className="bg-blueprint absolute inset-0 -z-10" aria-hidden />
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center !text-brand-300">Why choose FixMate</span>
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Repairs you can actually trust</h2>
          <p className="mt-3 text-lg text-ink-200">
            Built around the three things people worry about most: who to trust, what is happening, and
            when to pay.
          </p>
        </Reveal>

        <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10 transition-colors hover:bg-white/[0.1]">
              <s.icon className="size-7 text-brand-400" />
              <dd className="mt-4 font-display text-4xl font-extrabold">{s.value}</dd>
              <dt className="mt-1 text-sm text-ink-200">{s.label}</dt>
            </Reveal>
          ))}
        </dl>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal as="figure" key={t.name} delay={i} className="flex h-full flex-col rounded-2xl bg-card p-6 text-foreground shadow-lift">
              <Quote className="size-8 text-brand-500" />
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground/85">{t.quote}</blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <p className="font-bold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.place}</p>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TechnicianCta() {
  return (
    <section className="py-20">
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center text-white sm:px-12">
          <div className="bg-blueprint absolute inset-0 opacity-60" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Are you a skilled repair technician?</h2>
            <p className="mt-4 text-lg text-brand-50">
              List your services, receive structured job requests and get paid securely when the work is done.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-card text-brand-800 dark:text-brand-300 shadow-none hover:bg-brand-50">
                <Link href="/sign-up">Join as a technician</Link>
              </Button>
              <Button asChild size="lg" variant="glass">
                <Link href="/about">See how it works</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
