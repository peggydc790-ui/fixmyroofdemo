import { CloudRain, Hammer, Home, Hourglass, ScanSearch, SunMedium } from "lucide-react";
import { Reveal, RevealHeading, Stagger } from "@/components/motion/Reveal";

const BENEFITS = [
  { icon: CloudRain, title: "Weather-ready protection", text: "A sound roof stands up better to Queensland’s heavy summer rain, storms and humidity." },
  { icon: Hourglass, title: "A longer roof life", text: "Restoring tiles, pointing and coatings can extend the useful life of an existing roof." },
  { icon: ScanSearch, title: "Problems found early", text: "Careful inspection uncovers small issues before they turn into leaks or water damage." },
  { icon: SunMedium, title: "Cooler under the sun", text: "Modern reflective roof coatings can help reduce the heat a roof absorbs." },
  { icon: Home, title: "Lifted street appeal", text: "A clean, uniform roof transforms how a home presents — from the street and the sky." },
  { icon: Hammer, title: "Detail-led workmanship", text: "Restoration rewards patience: clean lines, secure capping and an even, lasting finish." },
];

export function WhyUs() {
  return (
    <section aria-labelledby="why-heading" className="theme-paper relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-copper">
                <span className="h-px w-10 bg-copper" /> Why choose us
              </p>
            </Reveal>
            <div id="why-heading">
              <RevealHeading
                text={"Why professional\nrestoration matters."}
                className="mt-6 text-[clamp(2.2rem,5.4vw,4.2rem)] font-extrabold uppercase leading-[0.95]"
              />
            </div>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-muted-foreground">
                Your roof is your home’s first line of defence. Investing in proper restoration protects everything
                beneath it — the structure, the interiors, and the people inside.
              </p>
            </Reveal>
          </div>

          <Stagger className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:col-span-7">
            {BENEFITS.map((b) => (
              <div key={b.title} data-stagger className="group bg-background p-7 transition-colors duration-500 hover:bg-card sm:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border text-copper transition-all duration-500 ease-cinema group-hover:-translate-y-1 group-hover:border-copper/50">
                  <b.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-6 font-display text-xl font-bold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
