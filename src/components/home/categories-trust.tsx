import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Hammer, Quote, ShieldCheck, Star, Wallet } from "lucide-react";
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
    <section className="py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">Popular categories</span>
          <h2 className="section-title">What needs fixing today?</h2>
          <p className="section-lead mx-auto">
            Pick a category to see only the services that match, with prices and technicians listed.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const meta = CATEGORY_META[c];
            return (
              <Link
                key={c}
                href={`/services?category=${encodeURIComponent(c)}`}
                className="card group flex h-full flex-col p-6 transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-pop"
              >
                <span className={`grid size-14 place-items-center rounded-2xl ${meta.tint}`}>
                  <meta.icon className="size-7" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-ink-900">{c}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">{meta.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-700">
                  Browse {c}
                  <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
          <Link
            href="/services"
            className="group flex h-full flex-col justify-between rounded-2xl bg-brand-600 p-6 text-white transition duration-200 hover:-translate-y-1 hover:bg-brand-700 hover:shadow-pop"
          >
            <ShieldCheck className="size-9" strokeWidth={1.6} />
            <div>
              <h3 className="mt-8 text-lg font-extrabold">See every service</h3>
              <p className="mt-1.5 text-sm text-brand-100">Browse the full catalogue of approved repairs.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold">
                Open catalogue <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
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
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center !text-brand-300">Why choose FixMate</span>
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">Repairs you can actually trust</h2>
          <p className="mt-3 text-lg text-ink-200">
            Built around the three things people worry about most: who to trust, what is happening, and
            when to pay.
          </p>
        </div>

        <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
              <s.icon className="size-7 text-brand-400" />
              <dd className="mt-4 font-display text-4xl font-extrabold">{s.value}</dd>
              <dt className="mt-1 text-sm text-ink-200">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex h-full flex-col rounded-2xl bg-white p-6 text-ink-800">
              <Quote className="size-8 text-brand-500" />
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink-700">{t.quote}</blockquote>
              <figcaption className="mt-6 border-t border-ink-100 pt-4">
                <p className="font-bold text-ink-900">{t.name}</p>
                <p className="text-sm text-ink-500">{t.place}</p>
              </figcaption>
            </figure>
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
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-600 px-6 py-14 text-center text-white sm:px-12">
          <div className="bg-blueprint absolute inset-0 opacity-60" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Are you a skilled repair technician?</h2>
            <p className="mt-4 text-lg text-brand-50">
              List your services, receive structured job requests and get paid securely when the work is done.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/sign-up" className="btn btn-lg bg-white text-brand-800 hover:bg-brand-50">
                Join as a technician
              </Link>
              <Link href="/about" className="btn btn-lg border border-white/40 text-white hover:bg-white/10">
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
