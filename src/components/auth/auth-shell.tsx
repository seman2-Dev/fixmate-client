import { BadgeCheck, ClipboardCheck, Wallet } from "lucide-react";

const POINTS = [
  { icon: BadgeCheck, text: "Every technician listing is approved by an admin" },
  { icon: ClipboardCheck, text: "Follow your repair job from request to completion" },
  { icon: Wallet, text: "Pay online only after the work is delivered" },
];

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100dvh-72px)] lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative isolate hidden overflow-hidden bg-ink-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="bg-blueprint absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
        <div className="absolute -bottom-24 -left-16 -z-10 size-96 rounded-full bg-brand-600/25 blur-3xl" aria-hidden />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-300">FixMate</p>
          <h2 className="mt-4 max-w-sm text-4xl font-extrabold leading-tight">
            Fix it right. Pay when it&apos;s done.
          </h2>
        </div>
        <ul className="enter space-y-5">
          {POINTS.map((p) => (
            <li key={p.text} style={{ "--i": POINTS.indexOf(p) } as React.CSSProperties} className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-300 ring-1 ring-white/15">
                <p.icon className="size-5" />
              </span>
              <span className="pt-2 text-sm leading-relaxed text-ink-100">{p.text}</span>
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="enter w-full max-w-md">
          <h1 style={{ "--i": 0 } as React.CSSProperties} className="text-3xl font-extrabold text-foreground sm:text-4xl">{title}</h1>
          <p style={{ "--i": 1 } as React.CSSProperties} className="mt-2 text-base text-muted-foreground">{subtitle}</p>
          <div style={{ "--i": 2 } as React.CSSProperties} className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  );
}
