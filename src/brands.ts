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
    product: "Field-service agentic console",
    house: "Cubiczan",
    eyebrow: "HVAC · plumbing · electrical · roofing · landscaping",
    promise: "Agents on dispatch, booking, and job-cost — without ripping out the shop software.",
    audience:
      "Mid-market blue-collar / field-service operators with $20M–$500M revenue who want AI agents in the existing workflow — not a $1M-EBITDA lifestyle shop and not a sale-readiness pack.",
    bio: "ServiceSell is Cubiczan's field-service skin. Impact Quadrant diagnoses the shop, deploys agents in dispatch, after-hours booking, and job-cost, then governs with CHP (propose → challenge → lock) until a human signs production.",
    source:
      "Product brief + Cubiczan public positioning (agentic services, CHP governance). Public Facebook bios were not independently retrievable at build time.",
    ingestLabel: "Ingest the shop workflow",
    outputLabel: "Agent deployment board",
    lockLabel: "Lock agents for production",
  },
  finbridge: {
    id: "finbridge",
    alias: "#finbridge",
    name: "FinBridge",
    product: "Ops + cash agentic console",
    house: "Cubiczan",
    eyebrow: "Quote-to-cash · job-cost · cash beyond the bookkeeper",
    promise: "Agents on quote, job-cost, and cash — a human locks the move.",
    audience:
      "Mid-market industrial and trades operators ($20M–$500M) who have outgrown cash-basis bookkeeping and need governed agents on quote-to-cash — not a valuation band.",
    bio: "FinBridge is Cubiczan's ops-and-cash skin. Agents sit between the bookkeeper and the operator on quoting, job-cost, and cash. CHP proposes, challenges, and refuses to treat a number as production until a person locks it.",
    source:
      "Product brief + Cubiczan public positioning (agentic services, CHP governance). Public Facebook bios were not independently retrievable at build time.",
    ingestLabel: "Ingest ops + cash",
    outputLabel: "Quote-to-cash workup",
    lockLabel: "Lock the cash / ops pack",
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
