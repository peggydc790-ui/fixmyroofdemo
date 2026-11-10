import { BadgeCheck, Quote } from "lucide-react";
import { Reveal, RevealHeading, Stagger } from "@/components/motion/Reveal";

export function Reviews() {
  return (
    <section aria-labelledby="reviews-heading" className="relative overflow-hidden bg-background py-24 sm:py-32 lg:py-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 hairline" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow inline-flex items-center gap-3 text-copper">
              <span className="h-px w-10 bg-copper" /> Customer reviews <span className="h-px w-10 bg-copper" />
            </p>
          </Reveal>
          <div id="reviews-heading">
            <RevealHeading
              text={"In homeowners’\nown words."}
              className="mt-6 text-[clamp(2.2rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.95]"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
              This space is reserved for genuine, publicly verifiable reviews with accurate attribution. None are shown
              in this concept because none have been independently verified.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <figure key={i} data-stagger className="glass relative flex min-h-64 flex-col rounded-3xl p-7">
              <Quote className="h-8 w-8 text-copper/70" strokeWidth={1.4} />
              <div className="mt-6 space-y-3" aria-hidden>
                <div className="h-2.5 w-full rounded-full bg-foreground/10 animate-slow-pulse" />
                <div className="h-2.5 w-11/12 rounded-full bg-foreground/10 animate-slow-pulse" />
                <div className="h-2.5 w-4/5 rounded-full bg-foreground/10 animate-slow-pulse" />
                <div className="h-2.5 w-2/3 rounded-full bg-foreground/10 animate-slow-pulse" />
              </div>
              <figcaption className="mt-auto flex items-center gap-3 pt-8">
                <span className="h-10 w-10 rounded-full border border-dashed border-foreground/25" aria-hidden />
                <span>
                  <span className="block text-sm font-semibold text-foreground/80">Reserved for a verified review</span>
                  <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <BadgeCheck className="h-3.5 w-3.5" /> Name, suburb &amp; source
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
