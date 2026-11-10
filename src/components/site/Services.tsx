import { ArrowUpRight, Info } from "lucide-react";
import { Reveal, RevealHeading, Stagger } from "@/components/motion/Reveal";
import { SERVICES, requestService } from "@/lib/site";

export function Services() {
  return (
    <section id="services" className="relative bg-background py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-copper">
                <span className="h-px w-10 bg-copper" /> Our Services
              </p>
            </Reveal>
            <RevealHeading
              text={"Specialist care,\nfrom ridge to gutter."}
              className="mt-6 text-[clamp(2.2rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.95]"
            />
          </div>
          <Reveal delay={0.1} className="max-w-sm">
            <p className="text-muted-foreground">
              Six disciplines that together keep a roof sound, weather-tight and beautiful.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[0.7rem] text-muted-foreground">
              <Info className="h-3.5 w-3.5 text-copper" /> Typical specialist services — owner verification recommended
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <article
              key={s.id}
              data-stagger
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-[transform,border-color,box-shadow] duration-700 ease-cinema hover:-translate-y-2 hover:border-copper/40 hover:shadow-elegant"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={s.image}
                  alt={`${s.title} (illustrative)`}
                  width={1200}
                  height={912}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-cinema group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-[0.65rem] font-semibold tracking-[0.2em]">
                  0{i + 1}
                </span>
              </div>
              <div className="relative flex flex-1 flex-col p-6 pt-2 sm:p-7 sm:pt-3">
                <span className="mb-5 block h-px w-10 bg-copper transition-[width] duration-700 ease-cinema group-hover:w-24" />
                <h3 className="font-display text-2xl font-bold">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                <button
                  type="button"
                  onClick={() => requestService(s.title)}
                  className="mt-7 inline-flex min-h-11 items-center gap-2 self-start text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-copper"
                  aria-label={`Enquire about ${s.title}`}
                >
                  Enquire
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-all duration-500 group-hover:rotate-45 group-hover:border-copper group-hover:bg-copper group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </article>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
