import type { BrandId } from "./engine";

export type BrandTheme = {
  id: BrandId;
  alias: string;
  name: string;
  product: string;
  house: string;
  eyebrow: string;
  promise: string;
  audience: string;
  bio: string;
  source: string;
  ingestLabel: string;
  outputLabel: string;
  lockLabel: string;
};

export const BRAND_THEMES: Record<BrandId, BrandTheme> = {
  servicesell: {
    id: "servicesell",
    alias: "#servicesell",
    name: "ServiceSell",
    product: "Field-workflow agents",
    house: "Cubiczan",
    eyebrow: "HVAC · plumbing · electrical · roofing · landscaping",
    promise: "Put governed agents on dispatch, after-hours booking, quoting, and field notes → invoice.",
    audience:
      "Owner-operated field-service shops that want AI agents in the live workflow — not a rip-and-replace ERP, and not a buyer data-room.",
    bio: "Cubiczan helps HVAC, plumbing, electrical, roofing, and landscaping operators implement production agents in dispatch, after-hours booking, quoting, job-cost, and field notes to invoice. Governed: propose → challenge → lock.",
    source:
      "Product brief + Cubiczan public positioning (production governed agentic AI / CHP; Impact Quadrant forward-deploys). Public Facebook bios were not independently retrievable at build time.",
    ingestLabel: "Ingest the live field book",
    outputLabel: "Workflow agent workup",
    lockLabel: "Lock the workflow pack",
  },
  finbridge: {
    id: "finbridge",
    alias: "#finbridge",
    name: "FinBridge",
    product: "Shop-floor finance-ops agents",
    house: "Cubiczan",
    eyebrow: "Shop-floor · operator finance-ops",
    promise: "Agents on quoting, job-cost, cash, and after-hours ops — beyond the bookkeeper.",
    audience:
      "Operators who have outgrown cash-basis bookkeeping and need governed agents on quoting, job-cost, and cash in the existing shop workflow.",
    bio: "FinBridge is Cubiczan's shop-floor skin: quoting, job-cost, cash, and after-hours ops with a human lock. Same product as ServiceSell — implement AI agents in the live workflow. Not a valuation or raise pack.",
    source:
      "Product brief + Cubiczan public positioning (production governed agentic AI / CHP; Impact Quadrant forward-deploys). Public Facebook bios were not independently retrievable at build time.",
    ingestLabel: "Ingest the shop operating picture",
    outputLabel: "Finance-ops agent workup",
    lockLabel: "Lock the finance-ops pack",
  },
};

export function brandFromLocation(search: string, hash: string, payload?: { brand?: string }): BrandId | null {
  const fromPayload = payload?.brand;
  if (fromPayload === "servicesell" || fromPayload === "finbridge") return fromPayload;
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const q = params.get("brand")?.toLowerCase();
  if (q === "servicesell" || q === "finbridge") return q;
  const h = hash.replace("#", "").toLowerCase();
  if (h === "servicesell" || h === "finbridge") return h;
  return null;
}

export function writeBrandHash(brand: BrandId) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.hash = brand;
  url.searchParams.set("brand", brand);
  window.history.replaceState({}, "", url.toString());
}
