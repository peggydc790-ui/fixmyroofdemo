import { Link } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { BUSINESS, NAV_LINKS, SERVICES } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-ink pt-20 sm:pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 hairline" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Roof restoration and roofing solutions for homes across {BUSINESS.serviceArea}.
            </p>
            <a href={BUSINESS.phoneHref} className="mt-6 inline-block font-display text-2xl font-bold hover:text-copper">
              {BUSINESS.phoneDisplay}
            </a>
          </div>
          <nav aria-label="Footer" className="md:col-span-2">
            <p className="eyebrow text-[0.62rem] text-muted-foreground">Navigate</p>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-foreground/80 transition-colors hover:text-copper">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="eyebrow text-[0.62rem] text-muted-foreground">Services</p>
            <ul className="mt-5 space-y-3 text-sm">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a href="#services" className="text-foreground/80 transition-colors hover:text-copper">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="eyebrow text-[0.62rem] text-muted-foreground">Contact</p>
            <ul className="mt-5 space-y-3 text-sm text-foreground/80">
              <li>
                <a href={BUSINESS.phoneHref} className="hover:text-copper">
                  {BUSINESS.phoneDisplay}
                </a>
              </li>
              <li>Brisbane / North Brisbane, QLD</li>
              <li>
                <a href="#quote" className="hover:text-copper">
                  Request a quote
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="mt-20 select-none text-center font-display text-[18vw] font-extrabold uppercase leading-[0.8] text-foreground/[0.04] lg:text-[13.5rem]"
        >
          Fix my roof
        </p>

        <div className="flex flex-col gap-4 border-t border-border py-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {BUSINESS.fullName}. Independent speculative website concept — not affiliated with, commissioned
            or endorsed by the business.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-copper">
              Privacy Policy
            </Link>
            <a href="#top" className="inline-flex items-center gap-1.5 hover:text-copper">
              Back to top <ArrowUp className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
