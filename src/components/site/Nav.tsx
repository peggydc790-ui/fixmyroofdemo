import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS, NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full px-4 transition-all duration-700 ease-cinema sm:px-6",
            scrolled || open ? "glass-strong" : "border border-transparent",
          )}
        >
          <a href="#top" className="rounded-full focus-visible:outline-2 focus-visible:outline-ring" aria-label={`${BUSINESS.fullName} — home`}>
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={active === l.href ? "true" : undefined}
                  className={cn(
                    "group relative rounded-full px-4 py-2 text-[0.8rem] font-medium tracking-wide transition-colors",
                    active === l.href ? "text-foreground" : "text-foreground/65 hover:text-foreground",
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute inset-x-4 -bottom-0.5 h-px origin-left bg-copper transition-transform duration-500 ease-cinema",
                      active === l.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={BUSINESS.phoneHref}
              className="hidden items-center gap-2 text-[0.8rem] font-medium text-foreground/80 transition-colors hover:text-copper md:flex"
            >
              <Phone className="h-4 w-4" /> {BUSINESS.phoneDisplay}
            </a>
            <Button asChild variant="copper" size="pill" className="hidden sm:inline-flex">
              <a href="#quote">Free quote</a>
            </Button>
            <a
              href={BUSINESS.phoneHref}
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
              className="glass flex h-11 w-11 items-center justify-center rounded-full md:hidden"
            >
              <Phone className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="glass flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink/80 px-6 pb-10 pt-28 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-border py-4 font-display text-4xl font-semibold"
                  >
                    {l.label}
                    <span className="text-xs font-medium tracking-[0.2em] text-copper">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="mt-auto flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              <Button asChild variant="copper" size="xl">
                <a href="#quote" onClick={() => setOpen(false)}>Request a free quote</a>
              </Button>
              <Button asChild variant="glass" size="xl">
                <a href={BUSINESS.phoneHref}>
                  <Phone /> Call {BUSINESS.phoneDisplay}
                </a>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
