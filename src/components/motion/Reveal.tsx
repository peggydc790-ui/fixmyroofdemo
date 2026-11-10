import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

let registered = false;
export function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Fade-up + blur-to-sharp entrance when scrolled into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y, filter: "blur(10px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          delay,
          ease: "expo.out",
          clearProps: "filter",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    });
    return () => ctx.revert();
  }, [delay, y]);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Children marked with [data-stagger] reveal one after another. */
export function Stagger({ children, className, stagger = 0.09 }: { children: ReactNode; className?: string; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsap();
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll("[data-stagger]");
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 48, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "expo.out",
          stagger,
          clearProps: "filter,transform",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [stagger]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Word-by-word masked headline reveal. Use "\n" for explicit line breaks. */
export function RevealHeading({
  text,
  className,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-word]"),
        { yPercent: 115, rotate: 3 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.25,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [text]);

  const lines = text.split("\n");
  return (
    <Tag ref={ref} className={cn("font-display", className)} aria-label={text.replace(/\n/g, " ")}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden>
          {line.split(" ").map((word, wi) => (
            <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span data-word className="inline-block will-change-transform">
                {word}
                {wi < line.split(" ").length - 1 ? "\u00A0" : ""}
              </span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}

/** Clip-path image reveal with gentle parallax. */
export function ImageReveal({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
  parallax = 8,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  parallax?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsap();
    const img = el.querySelector("img");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(18% 8% 18% 8% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
      if (img) {
        gsap.fromTo(
          img,
          { yPercent: -parallax, scale: 1.18 },
          {
            yPercent: parallax,
            scale: 1.1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }
    }, el);
    return () => ctx.revert();
  }, [parallax]);
  return (
    <div ref={ref} className={cn("overflow-hidden rounded-3xl", className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
