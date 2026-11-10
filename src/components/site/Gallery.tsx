import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Expand, X } from "lucide-react";
import { Reveal, RevealHeading, Stagger } from "@/components/motion/Reveal";
import queenslander from "@/assets/gallery-queenslander.jpg";
import metal from "@/assets/gallery-metal.jpg";
import tiles from "@/assets/gallery-tiles.jpg";
import restored from "@/assets/svc-restoration.jpg";
import home from "@/assets/intro-home.jpg";
import after from "@/assets/roof-after.jpg";
import painting from "@/assets/svc-painting.jpg";

type Item = { src: string; w: number; h: number; tag: string; title: string };

const ITEMS: Item[] = [
  { src: queenslander, w: 1504, h: 1008, tag: "Residential roofing", title: "Queenslander at dusk" },
  { src: metal, w: 1008, h: 1408, tag: "Metal roofing", title: "Standing seam lines" },
  { src: tiles, w: 1200, h: 1200, tag: "Tile details", title: "Terracotta rhythm" },
  { src: home, w: 1200, h: 1504, tag: "Architectural", title: "Deep eaves, golden hour" },
  { src: restored, w: 1200, h: 912, tag: "Roof restoration", title: "Restored hip roof" },
  { src: after, w: 1600, h: 1008, tag: "Tile details", title: "Fresh ridge pointing" },
  { src: painting, w: 1200, h: 912, tag: "Roof restoration", title: "Membrane coating" },
];

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const current = open === null ? undefined : ITEMS[open];

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % ITEMS.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + ITEMS.length) % ITEMS.length));
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <section aria-labelledby="gallery-heading" className="relative bg-background py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-copper">
                <span className="h-px w-10 bg-copper" /> Our Work · Inspiration
              </p>
            </Reveal>
            <div id="gallery-heading">
              <RevealHeading
                text={"Roofs worth\nlooking up to."}
                className="mt-6 text-[clamp(2.2rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.95]"
              />
            </div>
          </div>
          <Reveal delay={0.1} className="max-w-sm text-sm text-muted-foreground">
            An atmospheric selection of roofing and architectural imagery. These photographs are illustrative and do
            not depict completed FIX MY ROOF projects.
          </Reveal>
        </div>

        <Stagger className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3" stagger={0.07}>
          {ITEMS.map((it, i) => (
            <figure key={it.title} data-stagger className="mb-5 break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden rounded-3xl border border-border text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label={`View larger: ${it.title}`}
              >
                <motion.img
                  layoutId={`g-${i}`}
                  src={it.src}
                  alt={`${it.title} (illustrative)`}
                  width={it.w}
                  height={it.h}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full object-cover transition-transform duration-[1400ms] ease-cinema group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/0 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <span>
                    <span className="eyebrow block text-[0.6rem] text-copper">{it.tag}</span>
                    <span className="mt-1 block font-display text-lg font-semibold">{it.title}</span>
                  </span>
                  <span className="glass flex h-10 w-10 shrink-0 translate-y-2 items-center justify-center rounded-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <Expand className="h-4 w-4" />
                  </span>
                </figcaption>
              </button>
            </figure>
          ))}
        </Stagger>
      </div>

      <AnimatePresence>
        {open !== null && current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-xl sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.img
              layoutId={`g-${open}`}
              src={current.src}
              alt={`${current.title} (illustrative)`}
              className="max-h-[80svh] w-auto max-w-full rounded-2xl object-contain shadow-elegant"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute inset-x-0 bottom-6 text-center">
              <p className="eyebrow text-copper">{current.tag}</p>
              <p className="mt-1 font-display text-lg">{current.title} · Illustrative</p>
            </div>
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(null)}
              className="glass absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full sm:right-8 sm:top-8"
              aria-label="Close image"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
