import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { BUSINESS } from "@/lib/site";

const TITLE = "Privacy Policy | FIX MY ROOF Total Roof Restorations (Concept)";
const DESCRIPTION = "How this speculative website concept for FIX MY ROOF Total Roof Restorations handles information.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="theme-paper min-h-screen">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-8 sm:px-8">
        <Link to="/" aria-label="Back to home">
          <Logo />
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium hover:text-copper">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-8 sm:px-8">
        <p className="eyebrow text-copper">Placeholder</p>
        <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.95]">Privacy Policy</h1>
        <div className="mt-10 space-y-6 leading-relaxed text-muted-foreground">
          <p>
            This website is an independent, speculative design concept for {BUSINESS.fullName}. It is not operated,
            commissioned or endorsed by the business.
          </p>
          <p>
            The quote request form on this concept checks your entries in your browser only. Nothing you type is sent
            to the business, transmitted to a server or stored.
          </p>
          <p>
            A full privacy policy should be written and approved by the business owner before any live version of
            this website collects personal information.
          </p>
          <p>
            To contact the business directly, call{" "}
            <a href={BUSINESS.phoneHref} className="text-copper underline underline-offset-4">
              {BUSINESS.phoneDisplay}
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
