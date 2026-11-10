import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { MoveHorizontal } from "lucide-react";
import { Reveal, RevealHeading } from "@/components/motion/Reveal";
import beforeImg from "@/assets/roof-before.jpg";
import afterImg from "@/assets/roof-after.jpg";

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const update = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    update(e.clientX);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => dragging && update(e.clientX);
  const onUp = () => setDragging(false);
  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <section id="work" className="relative overflow-hidden bg-ink py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow inline-flex items-center gap-3 text-copper">
              <span className="h-px w-10 bg-copper" /> Before &amp; After <span className="h-px w-10 bg-copper" />
            </p>
          </Reveal>
          <RevealHeading
            text={"The difference is\nin the detail."}
            className="mt-6 text-[clamp(2.2rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.95]"
          />
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-lg text-muted-foreground">
              Drag across to see how cleaning, repointing and a protective coating can transform a weathered roof.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-14">
          <div
            ref={box}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className="relative aspect-[4/3] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-3xl border border-border shadow-elegant sm:aspect-[16/9]"
          >
            <img src={afterImg} alt="Restored roof with clean charcoal tiles and fresh ridge pointing (illustrative)" width={1600} height={1008} loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
            <img
              src={beforeImg}
              alt="Weathered roof with moss, lichen and cracked pointing (illustrative)"
              width={1600}
              height={1008}
              loading="lazy"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            />

            <span className="glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.22em]">Before</span>
            <span className="glass absolute right-4 top-4 rounded-full px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.22em]">After</span>

            <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
              <div className="absolute inset-y-0 -left-px w-0.5 bg-foreground/90 shadow-copper" />
            </div>
            <div
              role="slider"
              tabIndex={0}
              aria-label="Before and after comparison"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={`${Math.round(pos)}% before image shown`}
              onKeyDown={onKey}
              className="glass-strong absolute top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-foreground transition-transform duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{ left: `${pos}%` }}
            >
              <MoveHorizontal className="h-5 w-5 text-copper" />
            </div>
          </div>
          <p className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
            Illustrative imagery — not a FIX MY ROOF project
          </p>
        </Reveal>
      </div>
    </section>
  );
}
