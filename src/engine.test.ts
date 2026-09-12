import { describe, expect, it } from "vitest";
import {
  exportSummary,
  generateWorkup,
  getScenario,
  lockConsensus,
} from "./engine";

describe("Cubiczan CHP engine", () => {
  it("tags every ServiceSell number with provenance", () => {
    const workup = generateWorkup("servicesell", getScenario("servicesell"));
    expect(workup.claims.length).toBeGreaterThan(8);
    expect(workup.claims.every((claim) => Boolean(claim.source))).toBe(true);
    expect(workup.checklist.some((item) => item.status === "gap")).toBe(true);
    expect(workup.disclaimer).toMatch(/Not a customer/i);
  });

  it("builds a FinBridge proforma without renaming the brand tools", () => {
    const service = generateWorkup("servicesell", getScenario("servicesell"));
    const finance = generateWorkup("finbridge", getScenario("finbridge"));
    expect(service.claims.map((claim) => claim.id)).toEqual(finance.claims.map((claim) => claim.id));
    expect(finance.proforma).toHaveLength(3);
    expect(finance.valuation.evMid).toBeGreaterThan(0);
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
    expect(pack.markdown).not.toMatch(/Nothing locked/);
  });
});
