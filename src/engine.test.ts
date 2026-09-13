import { describe, expect, it } from "vitest";
import {
  exportSummary,
  generateWorkup,
  getScenario,
  lockConsensus,
} from "./engine";

describe("Cubiczan CHP engine", () => {
  it("tags every ServiceSell number with provenance on a mid-market shop book", () => {
    const workup = generateWorkup("servicesell", getScenario("servicesell"));
    expect(workup.scenario.ttmRevenue).toBeGreaterThanOrEqual(20_000_000);
    expect(workup.scenario.ttmRevenue).toBeLessThanOrEqual(500_000_000);
    expect(workup.claims.length).toBeGreaterThan(8);
    expect(workup.claims.every((claim) => Boolean(claim.source))).toBe(true);
    expect(workup.checklist.some((item) => item.status === "gap")).toBe(true);
    expect(workup.disclaimer).toMatch(/Not a customer/i);
    expect(workup.claims.some((claim) => /after-hours/i.test(claim.label))).toBe(true);
    expect(workup.claims.every((claim) => !/enterprise value|valuation band|buyer-prep/i.test(claim.label))).toBe(true);
  });

  it("builds a FinBridge operating picture without renaming the brand tools", () => {
    const service = generateWorkup("servicesell", getScenario("servicesell"));
    const finance = generateWorkup("finbridge", getScenario("finbridge"));
    expect(finance.scenario.ttmRevenue).toBeGreaterThanOrEqual(20_000_000);
    expect(finance.scenario.ttmRevenue).toBeLessThanOrEqual(500_000_000);
    expect(service.claims.map((claim) => claim.id)).toEqual(finance.claims.map((claim) => claim.id));
    expect(finance.proforma).toHaveLength(3);
    expect(finance.metrics.adjEbitda).toBeGreaterThan(0);
    expect(finance.claims.some((claim) => claim.id === "quote_cycle_days")).toBe(true);
  });

  it("refuses lock until a human reviews every claim", () => {
    const workup = generateWorkup("finbridge", getScenario("finbridge"));
    const blocked = lockConsensus(workup, []);
    expect(blocked.lock?.locked).toBe(false);
    const reviews = workup.claims.map((claim) => ({
      claimId: claim.id,
      decision: "approved" as const,
    }));
    const locked = lockConsensus(workup, reviews);
    expect(locked.lock?.locked).toBe(true);
    expect(locked.claims.every((claim) => claim.status === "locked")).toBe(true);
    const pack = exportSummary(locked);
    expect(pack.markdown).toMatch(/Locked \/ approved claims/);
    expect(pack.markdown).toMatch(/Ops \+ cash summary/);
    expect(pack.markdown).not.toMatch(/Nothing locked/);
    expect(pack.markdown).not.toMatch(/valuation/i);
  });
});
