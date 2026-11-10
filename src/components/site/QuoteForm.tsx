import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Check, Loader2, Phone, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealHeading } from "@/components/motion/Reveal";
import { quoteSchema, type QuoteInput } from "@/lib/quote-schema";
import { BUSINESS, SELECT_SERVICE_EVENT, SERVICE_OPTIONS } from "@/lib/site";
import { cn } from "@/lib/utils";
import bgImg from "@/assets/gallery-metal.jpg";

const fieldBase =
  "peer w-full rounded-2xl border bg-foreground/[0.04] px-4 pb-2.5 pt-6 text-[1rem] text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-transparent focus:bg-foreground/[0.07] focus:shadow-copper";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        {label}
      </label>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 flex items-center gap-1.5 overflow-hidden pl-1 text-xs text-destructive"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, submitCount, isValid },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    mode: "onTouched",
    defaultValues: { name: "", phone: "", email: "", suburb: "", service: "", message: "" },
  });

  useEffect(() => {
    const onSelect = (e: Event) => {
      const title = (e as CustomEvent<string>).detail;
      setStatus("idle");
      setValue("service", title, { shouldValidate: true });
    };
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, [setValue]);

  const onSubmit = async () => {
    setStatus("sending");
    // Concept demo: nothing is transmitted or stored.
    await new Promise((r) => setTimeout(r, 900));
    setStatus("done");
  };

  const cls = (name: keyof QuoteInput) =>
    cn(fieldBase, errors[name] ? "border-destructive/70" : "border-border focus:border-copper/70");
  const aria = (name: keyof QuoteInput) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <section id="quote" className="relative overflow-hidden bg-ink py-24 sm:py-32 lg:py-40">
      <img
        src={bgImg}
        alt=""
        aria-hidden
        width={1008}
        height={1408}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-copper">
              <span className="h-px w-10 bg-copper" /> Free quote
            </p>
          </Reveal>
          <RevealHeading
            text={"Let’s give your roof\nthe attention\nit deserves."}
            className="mt-6 text-[clamp(2.1rem,5.2vw,4.2rem)] font-extrabold uppercase leading-[0.95]"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-muted-foreground">
              Share a few details about your property and what you’ve noticed. Prefer to talk it through? Call
              directly.
            </p>
            <Button asChild variant="glass" size="xl" className="mt-8">
              <a href={BUSINESS.phoneHref}>
                <Phone /> {BUSINESS.phoneDisplay}
              </a>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-7">
          <div className="glass-strong rounded-[2rem] p-5 sm:p-8">
            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[28rem] flex-col items-center justify-center text-center"
                  role="status"
                >
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-copper-gradient text-primary-foreground shadow-copper"
                  >
                    <Check className="h-7 w-7" />
                  </motion.span>
                  <h3 className="mt-6 font-display text-3xl font-bold">Your details look great.</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    This is a design concept, so your enquiry has <strong className="text-foreground">not</strong> been
                    sent to anyone and nothing has been stored. To reach FIX MY ROOF Total Roof Restorations, please
                    call{" "}
                    <a href={BUSINESS.phoneHref} className="text-copper underline underline-offset-4">
                      {BUSINESS.phoneDisplay}
                    </a>
                    .
                  </p>
                  <Button
                    variant="line"
                    size="pill"
                    className="mt-8"
                    onClick={() => {
                      reset();
                      setStatus("idle");
                    }}
                  >
                    <RotateCcw /> Start again
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid gap-4 sm:grid-cols-2"
                  aria-label="Request a free quote"
                >
                  <Field id="name" label="Full name" error={errors.name?.message}>
                    <input id="name" autoComplete="name" placeholder="Full name" className={cls("name")} {...aria("name")} {...register("name")} />
                  </Field>
                  <Field id="phone" label="Phone number" error={errors.phone?.message}>
                    <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone" className={cls("phone")} {...aria("phone")} {...register("phone")} />
                  </Field>
                  <Field id="email" label="Email" error={errors.email?.message}>
                    <input id="email" type="email" inputMode="email" autoComplete="email" placeholder="Email" className={cls("email")} {...aria("email")} {...register("email")} />
                  </Field>
                  <Field id="suburb" label="Property suburb" error={errors.suburb?.message}>
                    <input id="suburb" autoComplete="address-level2" placeholder="Suburb" className={cls("suburb")} {...aria("suburb")} {...register("suburb")} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field id="service" label="Service required" error={errors.service?.message}>
                      <select id="service" className={cn(cls("service"), "appearance-none bg-[length:0]")} {...aria("service")} {...register("service")}>
                        <option value="" className="bg-card">Select a service…</option>
                        {SERVICE_OPTIONS.map((o) => (
                          <option key={o} value={o} className="bg-card">
                            {o}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field id="message" label="Project description" error={errors.message?.message}>
                      <textarea id="message" rows={5} placeholder="Description" className={cn(cls("message"), "resize-none pt-7")} {...aria("message")} {...register("message")} />
                    </Field>
                  </div>

                  <AnimatePresence>
                    {submitCount > 0 && !isValid && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:col-span-2"
                        role="alert"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" /> Please check the highlighted fields.
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col gap-4 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-relaxed text-muted-foreground sm:max-w-xs">
                      Concept demo — submissions are validated here but are not sent or stored.
                    </p>
                    <Button type="submit" variant="copper" size="xl" disabled={status === "sending"}>
                      {status === "sending" ? (
                        <>
                          <Loader2 className="animate-spin" /> Checking…
                        </>
                      ) : (
                        <>
                          Request a free quote <ArrowRight />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
