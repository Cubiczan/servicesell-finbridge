import type { Claim } from "./engine";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatClaim(claim: Claim): string {
  if (claim.format === "pct") return `${(claim.value * 100).toFixed(1)}%`;
  if (claim.format === "multiple") return `${claim.value.toFixed(2)}x`;
  if (claim.format === "number") return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(claim.value);
  return usd.format(claim.value);
}

export function formatUsd(value: number): string {
  return usd.format(value);
}

export function formatPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
