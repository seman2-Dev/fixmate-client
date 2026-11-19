import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { FacebookLogo, InstagramLogo, LinkedinLogo, XLogo } from "@/components/ui/brand-icons";
import { CATEGORIES } from "@/lib/types";

const SOCIAL = [
  { label: "X (formerly Twitter)", href: "https://x.com", Icon: XLogo },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookLogo },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramLogo },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinLogo },
];

export function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="bg-blueprint">
        <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-300">
              Verified technicians, trackable jobs and payment only after the work is done. Repairs
              you can finally trust.
            </p>
            <ul className="mt-6 flex items-center gap-3">
              {SOCIAL.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-brand-600"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Quick Links</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                ["Home", "/"],
                ["Browse Services", "/services"],
                ["How It Works", "/about"],
                ["Become a Technician", "/sign-up"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Popular Categories</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c}>
                  <Link
                    href={`/services?category=${encodeURIComponent(c)}`}
                    className="transition hover:text-white"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand-400" />
                <a href="mailto:support@fixmate.dev" className="transition hover:text-white">
                  support@fixmate.dev
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-400" />
                <a href="tel:+8801700000000" className="transition hover:text-white">
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" />
                <span>Level 5, Gulshan Avenue, Dhaka 1212, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <p>Pay after service · Verified technicians · Trackable jobs</p>
        </div>
      </div>
    </footer>
  );
}
