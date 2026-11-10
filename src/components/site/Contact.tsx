import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealHeading } from "@/components/motion/Reveal";
import { BUSINESS } from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" className="theme-paper relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-copper">
                <span className="h-px w-10 bg-copper" /> Contact
              </p>
            </Reveal>
            <RevealHeading
              text={"Talk to a\nroofing specialist."}
              className="mt-6 text-[clamp(2.2rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.95]"
            />
            <Reveal delay={0.1}>
              <a
                href={BUSINESS.phoneHref}
                className="group mt-10 inline-flex items-center gap-4 font-display text-[clamp(2rem,7vw,4.5rem)] font-bold leading-none tracking-tight transition-colors hover:text-copper"
              >
                {BUSINESS.phoneDisplay}
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-copper-gradient text-primary-foreground transition-transform duration-500 group-hover:rotate-12 sm:h-16 sm:w-16">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:col-span-5">
            <dl className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
              <div className="p-6 sm:p-7">
                <dt className="eyebrow text-[0.62rem] text-muted-foreground">Business</dt>
                <dd className="mt-2 font-display text-xl font-bold">{BUSINESS.fullName}</dd>
              </div>
              <div className="flex items-start gap-4 p-6 sm:p-7">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-copper" />
                <div>
                  <dt className="eyebrow text-[0.62rem] text-muted-foreground">Service area</dt>
                  <dd className="mt-2 text-lg font-semibold">{BUSINESS.serviceArea}</dd>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 sm:p-7">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-copper" />
                <div>
                  <dt className="eyebrow text-[0.62rem] text-muted-foreground">Phone</dt>
                  <dd className="mt-2 text-lg font-semibold">
                    <a href={BUSINESS.phoneHref} className="underline-offset-4 hover:text-copper hover:underline">
                      {BUSINESS.phoneDisplay}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="p-6 sm:p-7">
                <Button asChild variant="copper" size="xl" className="w-full">
                  <a href={BUSINESS.phoneHref}>
                    <Phone /> Call now
                  </a>
                </Button>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
