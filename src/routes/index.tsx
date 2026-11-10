import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero/Hero";
import { Nav } from "@/components/site/Nav";
import { Intro } from "@/components/site/Intro";
import { Services } from "@/components/site/Services";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { Gallery } from "@/components/site/Gallery";
import { WhyUs } from "@/components/site/WhyUs";
import { Reviews } from "@/components/site/Reviews";
import { QuoteForm } from "@/components/site/QuoteForm";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

const TITLE = "FIX MY ROOF Total Roof Restorations | Roof Restoration Brisbane";
const DESCRIPTION =
  "Roof restoration, repairs, repointing, painting, cleaning and maintenance across Brisbane and North Brisbane, QLD. Request a free quote or call 0410 607 076.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-24 focus:z-[70] focus:rounded-full focus:bg-copper focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Services />
        <BeforeAfter />
        <Gallery />
        <WhyUs />
        <Reviews />
        <QuoteForm />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
