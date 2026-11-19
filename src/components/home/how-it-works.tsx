import { CreditCard, Search, Send, Wrench } from "lucide-react";

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
    <section className="relative border-y border-ink-100 bg-white py-20">
      <div className="bg-blueprint-light absolute inset-0 opacity-60" aria-hidden />
      <div className="container-page relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">How FixMate works</span>
          <h2 className="section-title">From broken to booked in four steps</h2>
          <p className="section-lead mx-auto">
            No more handing over a device and hoping. Every job has a clear status, and money only
            moves when the work is done.
          </p>
        </div>

        <ol className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="absolute left-[12.5%] right-[12.5%] top-9 hidden border-t-2 border-dashed border-brand-200 lg:block"
            aria-hidden
          />
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative text-center">
              <div className="relative mx-auto grid size-[72px] place-items-center rounded-3xl bg-ink-900 text-white shadow-card">
                <step.icon className="size-8" strokeWidth={1.8} />
                <span className="absolute -right-2 -top-2 grid size-8 place-items-center rounded-full bg-brand-600 text-sm font-extrabold ring-4 ring-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-ink-900">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-[17rem] text-sm leading-relaxed text-ink-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
