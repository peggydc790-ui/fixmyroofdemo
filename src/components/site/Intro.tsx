import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageReveal, Reveal, RevealHeading } from "@/components/motion/Reveal";
import introImg from "@/assets/intro-home.jpg";
import tilesImg from "@/assets/roof-after.jpg";

const POINTS = [
  { k: "Inspect", v: "Understand the roof’s true condition before any work begins." },
  { k: "Restore", v: "Address the cause, not just the symptom — tile, ridge and seal." },
  { k: "Protect", v: "Finish with coatings that help the roof face the seasons ahead." },
];

export function Intro() {
  return (
    <section id="about" className="theme-paper relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:pr-8">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-copper">
              <span className="h-px w-10 bg-copper" /> About the craft
            </p>
          </Reveal>
          <RevealHeading
            text={"Your roof deserves\nmore than a quick fix."}
            className="mt-6 text-[clamp(2.2rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.95]"
          />
          <Reveal delay={0.1} className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              A roof works quietly, every day — shielding your home from Brisbane’s intense sun, humid summers and
              sudden storms. Over time, that exposure takes its toll: porous tiles, cracked pointing, moss, faded
              coatings and small leaks that slowly become structural problems.
            </p>
            <p>
              FIX MY ROOF Total Roof Restorations focuses on restoring roofs properly. Rather than patching what you
              can see, a thorough restoration considers the whole system — so your home stays dry, protected and
              looking its best.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
              {POINTS.map((p, i) => (
                <div key={p.k} className="bg-background p-5">
                  <dt className="flex items-center gap-2 text-sm font-semibold">
                    <span className="text-xs text-copper">0{i + 1}</span> {p.k}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2} className="mt-10">
            <Button asChild variant="line" size="pill" className="border-foreground/25">
              <a href="#services">
                Discover the services <ArrowRight />
              </a>
            </Button>
          </Reveal>
        </div>

        <div className="relative lg:col-span-6">
          <ImageReveal
            src={introImg}
            alt="Modern Brisbane home with a charcoal tile roof at golden hour (illustrative)"
            width={1200}
            height={1504}
            className="aspect-[4/5] w-full shadow-elegant"
          />
          <div className="absolute -bottom-10 -left-4 hidden w-56 sm:block lg:-left-14 lg:w-64">
            <ImageReveal
              src={tilesImg}
              alt="Close-up of freshly restored charcoal roof tiles (illustrative)"
              width={1600}
              height={1008}
              parallax={4}
              className="aspect-square w-full border-4 border-background shadow-elegant"
            />
          </div>
          <p className="mt-4 text-right text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
            Illustrative imagery
          </p>
        </div>
      </div>
    </section>
  );
}
