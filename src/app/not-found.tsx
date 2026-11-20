import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-[80dvh] flex-1 flex-col overflow-hidden bg-background">
      <div className="bg-blueprint-light absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden />
      <div className="enter container-page flex flex-1 flex-col items-center justify-center py-12 text-center">
        <svg viewBox="20 0 400 220" className="animate-float w-full max-w-sm" role="img" aria-label="A wrench leaning against a broken 404 sign">
          <ellipse cx="180" cy="200" rx="130" ry="10" fill="#12202c" opacity=".12" />
          <rect x="60" y="30" width="240" height="150" rx="22" fill="#12202c" />
          <rect x="72" y="42" width="216" height="126" rx="14" fill="#1b2a38" />
          <text x="180" y="130" textAnchor="middle" fontSize="78" fontWeight="800" fill="#f7f4ee" fontFamily="var(--font-display)">
            4<tspan fill="#fb7c37">0</tspan>4
          </text>
          <path d="M150 42 L170 80 L150 100 L176 168" stroke="#fb7c37" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".6" />
          <g transform="translate(290 190) rotate(-55)">
            <rect x="0" y="-9" width="130" height="18" rx="9" fill="#ee5c14" />
            <circle cx="140" cy="0" r="24" fill="none" stroke="#ee5c14" strokeWidth="15" />
            <rect x="120" y="-8" width="36" height="16" fill="#f7f4ee" />
          </g>
        </svg>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">Error 404</p>
        <h1 className="mt-2 text-4xl font-extrabold text-foreground sm:text-5xl">This page is out for repair</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-foreground/75">
          We could not find what you were looking for. It may have moved, been removed, or the link is
          mistyped.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
<Link href="/">
            <Home className="size-4" /> Back to Home
          </Link>
</Button>
          <Button asChild variant="outline" size="lg">
<Link href="/services">
            <Search className="size-4" /> Browse services
          </Link>
</Button>
        </div>
      </div>
    </div>
  );
}
