import restorationImg from "@/assets/svc-restoration.jpg";
import repairsImg from "@/assets/svc-repairs.jpg";
import repointingImg from "@/assets/svc-repointing.jpg";
import paintingImg from "@/assets/svc-painting.jpg";
import cleaningImg from "@/assets/svc-cleaning.jpg";
import maintenanceImg from "@/assets/svc-maintenance.jpg";

export const BUSINESS = {
  name: "FIX MY ROOF",
  fullName: "FIX MY ROOF Total Roof Restorations",
  tagline: "Total Roof Restorations",
  serviceArea: "Brisbane / North Brisbane, Queensland",
  phoneDisplay: "0410 607 076",
  phoneHref: "tel:+61410607076",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Our Services", href: "#services" },
  { label: "Our Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const SERVICES: Service[] = [
  {
    id: "restoration",
    title: "Roof Restoration",
    description:
      "A complete renewal — cleaning, repairs, repointing and protective coatings — returning a tired roof to a sound, refined finish.",
    image: restorationImg,
  },
  {
    id: "repairs",
    title: "Roof Repairs",
    description:
      "Targeted fixes for cracked or slipped tiles, leaks and storm damage, addressed before small issues become costly ones.",
    image: repairsImg,
  },
  {
    id: "repointing",
    title: "Roof Repointing",
    description:
      "Fresh flexible pointing along ridge and hip capping to keep tiles secure and water where it belongs — outside.",
    image: repointingImg,
  },
  {
    id: "painting",
    title: "Roof Painting",
    description:
      "Multi-coat membrane systems that seal porous tiles and transform kerb appeal with a crisp, even finish.",
    image: paintingImg,
  },
  {
    id: "cleaning",
    title: "Roof Cleaning",
    description:
      "High-pressure cleaning that lifts moss, lichen and grime, revealing the true condition of the roof beneath.",
    image: cleaningImg,
  },
  {
    id: "maintenance",
    title: "Roof Maintenance",
    description:
      "Periodic inspections of tiles, valleys, gutters and flashings — quiet, preventative care through every season.",
    image: maintenanceImg,
  },
];

export const SERVICE_OPTIONS = [
  ...SERVICES.map((s) => s.title),
  "Not sure yet — advice needed",
] as const;

/** Fired by service cards so the quote form can preselect a service. */
export const SELECT_SERVICE_EVENT = "fmr:select-service";

export function requestService(title: string) {
  window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: title }));
  document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
