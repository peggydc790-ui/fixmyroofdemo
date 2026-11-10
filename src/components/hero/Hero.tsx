import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";
import posterImg from "@/assets/intro-home.jpg";

const HouseScene = lazy(() => import("./HouseScene"));

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [env, setEnv] = useState<{ compact: boolean; reduced: boolean } | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });
  const textOpacity = useTransform(scrollYProgress, [0, 0.32], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.32], [0, -60]);
  const textBlur = useTransform(scrollYProgress, [0, 0.32], ["blur(0px)", "blur(10px)"]);
  const detailOpacity = useTransform(scrollYProgress, [0.55, 0.78, 0.97, 1], [0, 1, 1, 0.6]);
  const detailY = useTransform(scrollYProgress, [0.55, 0.8], [40, 0]);

  useEffect(() => {
    setEnv({
      compact: window.matchMedia("(max-width: 768px)").matches,
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="top" ref={sectionRef} aria-label="Introduction" className="relative h-[190svh] bg-ink">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Poster keeps the hero rich while WebGL loads (and if it can't). */}
        <img
          src={posterImg}
          alt=""
          width={1200}
          height={1504}
          fetchPriority="high"
          className={cn(
            "absolute inset-0 h-full w-full scale-105 object-cover opacity-60 blur-[2px] transition-opacity duration-[1600ms]",
            ready && "opacity-0",
          )}
        />
        <div
          className={cn("absolute inset-0 transition-opacity duration-[1600ms] ease-cinema", ready ? "opacity-100" : "opacity-0")}
          data-scene-ready={ready ? "" : undefined}
        >
          <ClientOnly fallback={null}>
            {env && (
              <SceneBoundary>
                <Suspense fallback={null}>
                  <HouseScene
                    progressRef={progressRef}
                    compact={env.compact}
                    reducedMotion={env.reduced}
                    active={active}
                    onReady={() => setReady(true)}
                  />
                </Suspense>
              </SceneBoundary>
            )}
          </ClientOnly>
        </div>

        {/* Cinematic veils */}
        <div className="pointer-events-none absolute inset-0 hero-veil" />
        <div className="pointer-events-none absolute inset-0 hero-side-veil" />
        <div className="pointer-events-none absolute inset-0 grain" />

        {/* Headline */}
        <motion.div
          style={{ opacity: textOpacity, y: textY, filter: textBlur }}
          className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-24 sm:px-8 sm:pb-28 lg:justify-center lg:pb-0"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease }}
            className="eyebrow mb-5 flex items-center gap-3 text-copper"
          >
            <span className="h-px w-10 bg-copper" />
            {BUSINESS.fullName}
          </motion.p>

          <h1 className="font-display text-[clamp(2.15rem,9vw,6.4rem)] font-extrabold uppercase leading-[0.92]">
            {["Protect what’s", "under your roof."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={cn("block", i === 1 && "text-copper-gradient")}
                  initial={{ y: "110%", filter: "blur(12px)" }}
                  animate={{ y: "0%", filter: "blur(0px)" }}
                  transition={{ delay: 0.7 + i * 0.14, duration: 1.4, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.15, duration: 1.1, ease }}
            className="mt-6 max-w-md text-base leading-relaxed text-foreground/80 sm:text-lg"
          >
            Professional roof restoration and roofing solutions in Brisbane.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 1, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild variant="copper" size="xl">
              <a href="#quote">
                Request a free quote <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="glass" size="xl">
              <a href="#services">Explore our services</a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Close-up caption once the camera reaches the tiles */}
        <motion.div
          style={{ opacity: detailOpacity, y: detailY }}
          className="pointer-events-none absolute inset-x-0 bottom-16 z-10 mx-auto max-w-7xl px-5 sm:bottom-20 sm:px-8"
        >
          <p className="eyebrow text-copper">Up close</p>
          <p className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-5xl">
            Every tile. Every ridge.
            <br />
            <span className="text-foreground/60">Every detail matters.</span>
          </p>
        </motion.div>

        {/* Scroll cue + concept note */}
        <div className="absolute inset-x-0 bottom-5 z-10 mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#about" className="flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-foreground/60 hover:text-foreground">
            <span className="relative block h-8 w-px overflow-hidden bg-foreground/15">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-copper animate-scroll-cue" />
            </span>
            Scroll
            <ArrowDown className="h-3 w-3" />
          </a>
          <span className="hidden text-[0.65rem] uppercase tracking-[0.22em] text-foreground/45 sm:block">
            Independent design concept · Brisbane, QLD
          </span>
        </div>
      </div>
    </section>
  );
}
