import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("text-copper", className)} aria-hidden fill="none">
      <path d="M4 22 20 8l16 14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 22v10h20V22" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2" strokeLinejoin="round" />
      <path d="M15 19.5 20 15l5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.95rem] font-extrabold tracking-[0.06em]">FIX MY ROOF</span>
        {!compact && (
          <span className="mt-1 text-[0.56rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Total Roof Restorations
          </span>
        )}
      </span>
    </span>
  );
}
