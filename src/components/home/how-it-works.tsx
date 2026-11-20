import { CreditCard, Search, Send, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export const STEPS = [
  {
    icon: Search,
    title: "Find a Service",
    text: "Search approved repair services by device, category or area and compare prices upfront.",
  },
  {
    icon: Send,
    title: "Send a Request",
    text: "Describe the problem, pick a date and send your repair request in under a minute.",
  },
  {
    icon: Wrench,
    title: "Technician Fixes It",
    text: "Watch the job move from Accepted to In Progress to Completed, with nothing hidden.",
  },
  {
    icon: CreditCard,
    title: "Pay After Completion",
    text: "Pay securely online only once the technician marks the job done and sets the final amount.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative border-y bg-card py-20 sm:py-24">
      <div className="bg-blueprint-light absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden />
      <div className="container-page relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">How FixMate works</span>
          <h2 className="section-title">From broken to booked in four steps</h2>
          <p className="section-lead mx-auto">
            No more handing over a device and hoping. Every job has a clear status, and money only
            moves when the work is done.
          </p>
        </Reveal>

        <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i} className="group relative rounded-3xl border bg-background p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
              <span aria-hidden className="absolute top-5 right-6 font-display text-6xl leading-none font-extrabold text-ink-100 transition-colors group-hover:text-brand-100">
                {i + 1}
              </span>
              <span className="relative grid size-14 place-items-center rounded-2xl bg-ink-900 text-white shadow-card transition-colors duration-300 group-hover:bg-primary">
                <step.icon className="size-7" strokeWidth={1.8} />
              </span>
              <h3 className="mt-6 text-xl font-extrabold text-foreground">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
