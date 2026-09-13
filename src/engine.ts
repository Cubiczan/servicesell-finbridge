import scenariosJson from "../executas/servicesell-finbridge/data/scenarios.json";
import rulesJson from "../executas/servicesell-finbridge/data/rules.json";

export type BrandId = "servicesell" | "finbridge";
export type ClaimSource = "ingested" | "derived" | "assumption" | "benchmark";
export type ClaimStatus = "proposed" | "challenged" | "approved" | "rejected" | "locked";
export type Confidence = "high" | "medium" | "low";
export type Phase = "brand" | "ingest" | "workup" | "challenge" | "review" | "locked" | "export";

export type AddBack = {
  id: string;
  label: string;
  amount: number;
  recurring: boolean;
};

export type Scenario = {
  id: string;
  brand: BrandId;
  label: string;
  disclaimer: string;
  vertical: string;
  geography: string;
  ttmRevenue: number;
  reportedEbitda: number;
  grossMargin: number;
  addBacks: AddBack[];
  recurringPct: number;
  topCustomerPct: number;
  ownerFieldHoursWeekly: number;
  technicianCount: number;
  fleetCount: number;
  workingCapital: number;
  netDebt: number;
  ownerDependence: string;
  safetyIncidents12m: number;
  bonded: boolean;
  licensedStates: number;
  afterHoursCapturePct: number;
  growthRate: number;
  openQuotes: number;
  workflowNotes: string;
};

export type Challenge = { id: string; severity: "high" | "medium" | "low"; text: string };

export type Claim = {
  id: string;
  label: string;
  value: number;
  unit: string;
  format: "number" | "pct" | "usd" | "multiple";
  source: ClaimSource;
  formula?: string | null;
  inputs: string[];
  confidence: Confidence;
  challenges: Challenge[];
  status: ClaimStatus;
  reviewNote: string;
};

export type Review = { claimId: string; decision: "approved" | "rejected"; note?: string };

export type Workup = {
  ok: boolean;
  brand: BrandId;
  scenario: Scenario;
  metrics: Record<string, number>;
  valuation: Record<string, number>;
  proforma: Array<Record<string, number>>;
  readiness: { score: number; parts: Record<string, number>; brand: BrandId };
  claims: Claim[];
  checklist: Array<{
    id: string;
    title: string;
    claim: string;
    status: string;
    claimSnapshot?: Claim;
  }>;
  phase: Phase;
  disclaimer?: string;
  lock?: {
    locked: boolean;
    approvedCount: number;
    rejectedCount: number;
    pendingCount: number;
    reason: string | null;
  };
};

const SCENARIOS = scenariosJson as Record<BrandId, Scenario>;
const RULES = rulesJson as {
  valuation: Record<BrandId, { ebitdaMultipleLow: number; ebitdaMultipleHigh: number; recurringPremium: number }>;
  proformaYears: number;
  readinessWeights: Record<string, number>;
  challenges: Array<{
    id: string;
    claim: string;
    severity: Challenge["severity"];
    when: { field: string; op: string; value: number };
    text: string;
    brands?: BrandId[];
  }>;
  checklist: Record<BrandId, Array<{ id: string; title: string; claim: string }>>;
};

export const BRANDS: BrandId[] = ["servicesell", "finbridge"];

export function emptyScenario(brand: BrandId): Scenario {
  return {
    id: "custom",
    brand,
    label: "Operator-entered scenario",
    disclaimer: "Operator-supplied figures. Not attributed to any named company.",
    vertical: "",
    geography: "",
    ttmRevenue: 0,
    reportedEbitda: 0,
    grossMargin: 0.35,
    addBacks: [],
    recurringPct: 0,
    topCustomerPct: 0,
    ownerFieldHoursWeekly: 0,
    technicianCount: 0,
    fleetCount: 0,
    workingCapital: 0,
    netDebt: 0,
    ownerDependence: "medium",
    safetyIncidents12m: 0,
    bonded: false,
    licensedStates: 1,
    afterHoursCapturePct: 0,
    growthRate: 0.06,
    openQuotes: 0,
    workflowNotes: "",
  };
}

export function getScenario(brand: BrandId, scenarioId?: string, overrides?: Partial<Scenario>): Scenario {
  const base =
    scenarioId === "custom" ? emptyScenario(brand) : { ...SCENARIOS[brand], addBacks: [...SCENARIOS[brand].addBacks] };
  return { ...base, ...overrides, brand, addBacks: overrides?.addBacks ?? base.addBacks };
}

export function listScenarios() {
  return Object.values(SCENARIOS).map((item) => ({
    id: item.id,
    brand: item.brand,
    label: item.label,
    disclaimer: item.disclaimer,
    vertical: item.vertical,
  }));
}

function compare(left: number, op: string, right: number) {
  switch (op) {
    case ">":
      return left > right;
    case ">=":
      return left >= right;
    case "<":
      return left < right;
    case "<=":
      return left <= right;
    case "==":
      return left === right;
    default:
      throw new Error(`unknown op: ${op}`);
  }
}

function claim(
  id: string,
  label: string,
  value: number,
  opts: Partial<Claim> & Pick<Claim, "source">,
): Claim {
  return {
    id,
    label,
    value,
    unit: opts.unit ?? "usd",
    format: opts.format ?? "usd",
    source: opts.source,
    formula: opts.formula,
    inputs: opts.inputs ?? [],
    confidence: opts.confidence ?? "high",
    challenges: [],
    status: "proposed",
    reviewNote: "",
  };
}

export function metrics(scenario: Scenario) {
  const addBacksTotal = scenario.addBacks.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const recurringAddBacks = scenario.addBacks
    .filter((item) => item.recurring)
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const reported = Number(scenario.reportedEbitda || 0);
  const revenue = Number(scenario.ttmRevenue || 0);
  const wc = Number(scenario.workingCapital || 0);
  const adjEbitda = reported + addBacksTotal;
  return {
    addBacksTotal,
    recurringAddBacks,
    adjEbitda,
    normalizedEbitda: reported + recurringAddBacks,
    wcPct: revenue ? wc / revenue : 0,
    ebitdaMargin: revenue ? adjEbitda / revenue : 0,
    addBackShareOfEbitda: reported ? addBacksTotal / reported : 0,
    recurringRevenue: revenue * Number(scenario.recurringPct || 0),
  };
}

export function valuationBand(brand: BrandId, scenario: Scenario, m: ReturnType<typeof metrics>) {
  const table = RULES.valuation[brand];
  const premium = table.recurringPremium * Number(scenario.recurringPct || 0);
  const multipleLow = table.ebitdaMultipleLow + premium;
  const multipleHigh = table.ebitdaMultipleHigh + premium;
  const evLow = m.adjEbitda * multipleLow;
  const evHigh = m.adjEbitda * multipleHigh;
  return {
    multipleLow,
    multipleHigh,
    evLow,
    evHigh,
    evMid: (evLow + evHigh) / 2,
    equityLow: evLow - Number(scenario.netDebt || 0),
    equityHigh: evHigh - Number(scenario.netDebt || 0),
  };
}

export function proforma(scenario: Scenario, m: ReturnType<typeof metrics>) {
  const growth = Number(scenario.growthRate || 0.06);
  const revenue0 = Number(scenario.ttmRevenue || 0);
  const gm = Number(scenario.grossMargin || 0.35);
  const rows = [];
  for (let year = 1; year <= RULES.proformaYears; year += 1) {
    const lift = Number(scenario.recurringPct || 0) >= 0.25 ? 0.004 * year : 0;
    const revenue = revenue0 * (1 + growth) ** year;
    const ebitda = revenue * (m.ebitdaMargin + lift);
    rows.push({
      year,
      revenue,
      cogs: revenue * (1 - gm),
      grossProfit: revenue * gm,
      ebitda,
      ebitdaMargin: revenue ? ebitda / revenue : 0,
    });
  }
  return rows;
}

export function readinessScore(brand: BrandId, scenario: Scenario, m: ReturnType<typeof metrics>) {
  const w = RULES.readinessWeights;
  const parts = {
    recurring: Math.min(Number(scenario.recurringPct || 0) / 0.5, 1) * w.recurring,
    concentration: Math.max(0, 1 - Math.max(0, Number(scenario.topCustomerPct || 0) - 0.1) / 0.25) * w.concentration,
    owner: Math.max(0, 1 - Number(scenario.ownerFieldHoursWeekly || 0) / 30) * w.owner,
    afterHours: Number(scenario.afterHoursCapturePct || 0) * w.afterHours,
    workingCapital: Math.max(0, 1 - Math.abs(m.wcPct - 0.08) / 0.12) * w.workingCapital,
    safety: Math.max(0, 1 - Number(scenario.safetyIncidents12m || 0) / 4) * w.safety,
    addBacks: Math.max(0, 1 - m.addBackShareOfEbitda / 0.35) * w.addBacks,
  };
  return { score: Math.round(Object.values(parts).reduce((a, b) => a + b, 0) * 10) / 10, parts, brand };
}

function buildClaims(brand: BrandId, scenario: Scenario): Claim[] {
  const m = metrics(scenario);
  const band = valuationBand(brand, scenario, m);
  const years = proforma(scenario, m);
  const y3 = years[years.length - 1] ?? { ebitda: 0, revenue: 0 };

  return [
    claim("ttm_revenue", "TTM revenue", scenario.ttmRevenue, { source: "ingested", inputs: ["ttmRevenue"] }),
    claim("reported_ebitda", "Reported EBITDA", scenario.reportedEbitda, {
      source: "ingested",
      inputs: ["reportedEbitda"],
    }),
    claim("add_backs_total", "Job-cost leakage (all)", m.addBacksTotal, {
      source: "derived",
      formula: "sum(addBacks.amount)",
      inputs: ["addBacks"],
      confidence: "medium",
    }),
    claim("adj_ebitda", "Adjusted EBITDA", m.adjEbitda, {
      source: "derived",
      formula: "reportedEbitda + sum(addBacks.amount)",
      inputs: ["reportedEbitda", "addBacks"],
      confidence: "medium",
    }),
    claim("normalized_ebitda", "Normalized EBITDA (recurring add-backs only)", m.normalizedEbitda, {
      source: "derived",
      formula: "reportedEbitda + sum(recurring add-backs)",
      inputs: ["reportedEbitda", "addBacks.recurring"],
    }),
    claim("recurring_pct", "Contract / maintenance mix", scenario.recurringPct, {
      source: "ingested",
      unit: "pct",
      format: "pct",
      inputs: ["recurringPct"],
      confidence: "medium",
    }),
    claim("top_customer_pct", "Top-account concentration", scenario.topCustomerPct, {
      source: "ingested",
      unit: "pct",
      format: "pct",
      inputs: ["topCustomerPct"],
      confidence: "medium",
    }),
    claim("owner_field_hours", "Owner field hours / week", scenario.ownerFieldHoursWeekly, {
      source: "ingested",
      unit: "hours",
      format: "number",
      inputs: ["ownerFieldHoursWeekly"],
    }),
    claim("fleet_count", "Fleet count", scenario.fleetCount, {
      source: "ingested",
      unit: "count",
      format: "number",
      inputs: ["fleetCount"],
    }),
    claim("wc_pct", "Working capital / revenue", m.wcPct, {
      source: "derived",
      unit: "pct",
      format: "pct",
      formula: "workingCapital / ttmRevenue",
      inputs: ["workingCapital", "ttmRevenue"],
    }),
    claim("data_room_ready", "After-hours capture", scenario.afterHoursCapturePct, {
      source: "ingested",
      unit: "pct",
      format: "pct",
      inputs: ["afterHoursCapturePct"],
      confidence: "low",
    }),
    claim("safety_incidents", "Recordable incidents (12m)", scenario.safetyIncidents12m, {
      source: "ingested",
      unit: "count",
      format: "number",
      inputs: ["safetyIncidents12m"],
    }),
    claim("growth_rate", "Forward growth assumption", scenario.growthRate, {
      source: "assumption",
      unit: "pct",
      format: "pct",
      inputs: ["growthRate"],
      confidence: "low",
    }),
    claim("growth_ask", "Open quotes", scenario.openQuotes, {
      source: "ingested",
      inputs: ["openQuotes"],
      confidence: "medium",
    }),
    claim("multiple_low", "Job-margin multiple (low)", band.multipleLow, {
      source: "benchmark",
      unit: "x",
      format: "multiple",
      formula: "brandLow + recurringPremium * recurringPct",
      inputs: ["brand", "recurringPct"],
      confidence: "medium",
    }),
    claim("multiple_high", "Job-margin multiple (high)", band.multipleHigh, {
      source: "benchmark",
      unit: "x",
      format: "multiple",
      formula: "brandHigh + recurringPremium * recurringPct",
      inputs: ["brand", "recurringPct"],
      confidence: "medium",
    }),
    claim("ev_low", "Book value at stake (low)", band.evLow, {
      source: "derived",
      formula: "adjEbitda * multipleLow",
      inputs: ["adj_ebitda", "multiple_low"],
      confidence: "medium",
    }),
    claim("ev_high", "Book value at stake (high)", band.evHigh, {
      source: "derived",
      formula: "adjEbitda * multipleHigh",
      inputs: ["adj_ebitda", "multiple_high"],
      confidence: "medium",
    }),
    claim("ev_mid", "Book value at stake (mid)", band.evMid, {
      source: "derived",
      formula: "(evLow + evHigh) / 2",
      inputs: ["ev_low", "ev_high"],
      confidence: "medium",
    }),
    claim("equity_mid", "Equity after debt (mid)", (band.equityLow + band.equityHigh) / 2, {
      source: "derived",
      formula: "((evLow + evHigh) / 2) - netDebt",
      inputs: ["ev_mid", "netDebt"],
      confidence: "medium",
    }),
    claim("y3_revenue", "Year-3 operating revenue", y3.revenue, {
      source: "derived",
      formula: "ttmRevenue * (1 + growthRate) ^ 3",
      inputs: ["ttmRevenue", "growthRate"],
      confidence: "low",
    }),
    claim("y3_ebitda", "Year-3 operating EBITDA", y3.ebitda, {
      source: "derived",
      formula: "y3 revenue * (adjEbitda/ttmRevenue [+ recurring lift])",
      inputs: ["ttmRevenue", "adj_ebitda", "growthRate", "recurringPct"],
      confidence: "low",
    }),
  ];
}

export function applyChallenges(brand: BrandId, scenario: Scenario, claims: Claim[]) {
  const m = metrics(scenario);
  const ctx: Record<string, number> = {
    topCustomerPct: Number(scenario.topCustomerPct || 0),
    ownerFieldHoursWeekly: Number(scenario.ownerFieldHoursWeekly || 0),
    recurringPct: Number(scenario.recurringPct || 0),
    growthRate: Number(scenario.growthRate || 0),
    safetyIncidents12m: Number(scenario.safetyIncidents12m || 0),
    afterHoursCapturePct: Number(scenario.afterHoursCapturePct || 0),
    addBackShareOfEbitda: m.addBackShareOfEbitda,
    wcPct: m.wcPct,
  };
  const byId = Object.fromEntries(claims.map((item) => [item.id, item]));
  for (const rule of RULES.challenges) {
    if (rule.brands && !rule.brands.includes(brand)) continue;
    if (!compare(ctx[rule.when.field] ?? 0, rule.when.op, rule.when.value)) continue;
    const target = byId[rule.claim];
    if (!target) continue;
    target.challenges.push({ id: rule.id, severity: rule.severity, text: rule.text });
    target.status = "challenged";
    if (rule.severity === "high") target.confidence = "low";
  }
  return claims;
}

function checklistFor(brand: BrandId, claims: Claim[]) {
  const byId = Object.fromEntries(claims.map((item) => [item.id, item]));
  return RULES.checklist[brand].map((spec) => {
    const snap = byId[spec.claim];
    let status = "ready";
    if (!snap) status = "missing";
    else if (snap.status === "challenged" || snap.challenges.length) status = "gap";
    else if (snap.confidence === "low") status = "watch";
    return { ...spec, status, claimSnapshot: snap };
  });
}

export function generateWorkup(brand: BrandId, scenario: Scenario): Workup {
  const merged = getScenario(brand, scenario.id, scenario);
  const m = metrics(merged);
  const claims = applyChallenges(brand, merged, buildClaims(brand, merged));
  return {
    ok: true,
    brand,
    scenario: merged,
    metrics: m,
    valuation: valuationBand(brand, merged, m),
    proforma: proforma(merged, m),
    readiness: readinessScore(brand, merged, m),
    claims,
    checklist: checklistFor(brand, claims),
    phase: "challenge",
    disclaimer: merged.disclaimer,
  };
}

export function lockConsensus(workup: Workup, reviews: Review[]): Workup {
  const byId = Object.fromEntries(workup.claims.map((item) => [item.id, { ...item, challenges: [...item.challenges] }]));
  for (const review of reviews) {
    const claimItem = byId[review.claimId];
    if (!claimItem) continue;
    if (review.decision !== "approved" && review.decision !== "rejected") continue;
    claimItem.status = review.decision;
    claimItem.reviewNote = review.note ?? "";
  }
  const claims = Object.values(byId);
  const pending = claims.filter((item) => item.status === "proposed" || item.status === "challenged");
  const approved = claims.filter((item) => item.status === "approved");
  const rejected = claims.filter((item) => item.status === "rejected");
  const locked = pending.length === 0 && approved.length > 0;
  const next = claims.map((item) => (item.status === "approved" && locked ? { ...item, status: "locked" as const } : item));
  return {
    ...workup,
    claims: next,
    phase: locked ? "locked" : "review",
    lock: {
      locked,
      approvedCount: locked ? next.filter((item) => item.status === "locked").length : approved.length,
      rejectedCount: rejected.length,
      pendingCount: pending.length,
      reason: locked ? null : "Human must approve or reject every claim before lock.",
    },
  };
}

export function exportSummary(workup: Workup) {
  const brand = workup.brand;
  const title = brand === "servicesell" ? "Field-workflow agent summary" : "Shop-floor finance-ops summary";
  const locked = workup.claims.filter((item) => item.status === "locked" || item.status === "approved");
  const rejected = workup.claims.filter((item) => item.status === "rejected");
  const lines = [
    `# ${title}`,
    "",
    `Brand skin: ${brand}`,
    `Phase: ${workup.phase}`,
    `Scenario: ${workup.scenario.label}`,
    `Disclaimer: ${workup.scenario.disclaimer}`,
    "",
    "## Locked / approved claims",
    "",
  ];
  if (!locked.length) lines.push("_Nothing locked. Human review is incomplete._");
  for (const item of locked) {
    lines.push(`- **${item.label}**: ${item.value} (${item.source}${item.formula ? `; ${item.formula}` : ""})`);
    if (item.reviewNote) lines.push(`  - Reviewer: ${item.reviewNote}`);
  }
  if (rejected.length) {
    lines.push("", "## Rejected claims", "");
    for (const item of rejected) lines.push(`- ${item.label} — ${item.reviewNote || "rejected"}`);
  }
  return {
    ok: true,
    title,
    markdown: `${lines.join("\n")}\n`,
    json: {
      brand,
      phase: workup.phase,
      lock: workup.lock,
      claims: workup.claims,
      scenario: workup.scenario,
      valuation: workup.valuation,
      proforma: workup.proforma,
      readiness: workup.readiness,
    },
  };
}

export function runTool(method: string, args: Record<string, unknown>) {
  if (method === "ping") return { pong: true, app: "servicesell-finbridge" };
  if (method === "list_scenarios") return { ok: true, scenarios: listScenarios() };
  if (method === "ingest_scenario") {
    const brand = args.brand as BrandId;
    return { ok: true, scenario: getScenario(brand, args.scenario_id as string | undefined, args.overrides as Partial<Scenario>), disclaimer: "ok" };
  }
  if (method === "generate_workup") return generateWorkup(args.brand as BrandId, args.scenario as Scenario);
  if (method === "lock_consensus") return lockConsensus(args.workup as Workup, (args.reviews as Review[]) ?? []);
  if (method === "export_summary") return exportSummary(args.workup as Workup);
  throw new Error(`unknown method: ${method}`);
}
