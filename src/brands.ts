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
    product: "Sale-readiness console",
    house: "Cubiczan",
    eyebrow: "Field services · institutional buyers",
    promise: "Get the book ready before the process starts.",
    audience: "Owner-operated field-service companies around $1M+ EBITDA that want to meet institutional buyers without looking like a lifestyle shop.",
    bio: "ServiceSell helps field-services operators prepare for a sale: quality of earnings, concentration, owner dependence, fleet and safety files, and a data room that survives the first diligence call.",
    source: "Product brief + Cubiczan public positioning (agentic finance, governed approvals). Public Facebook bios were not independently retrievable at build time.",
    ingestLabel: "Ingest the field-service book",
    outputLabel: "Buyer-prep checklist",
    lockLabel: "Lock the readiness pack",
  },
  finbridge: {
    id: "finbridge",
    alias: "#finbridge",
    name: "FinBridge",
    product: "Proforma & valuation console",
    house: "Cubiczan",
    eyebrow: "SMB owners · beyond the bookkeeper",
    promise: "A governed proforma before you raise or sell.",
    audience: "SMB owners who have outgrown cash-basis bookkeeping and need a defensible financial picture for a raise or a sale.",
    bio: "FinBridge sits between the bookkeeper and a full-time CFO: normalized earnings, a three-year proforma, a valuation band with provenance, and a human lock before anyone treats the number as fact.",
    source: "Product brief + Cubiczan public positioning (fractional CFO, capital structuring, AI governance). Public Facebook bios were not independently retrievable at build time.",
    ingestLabel: "Ingest the operating picture",
    outputLabel: "Proforma + valuation band",
    lockLabel: "Lock the fundraising pack",
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
