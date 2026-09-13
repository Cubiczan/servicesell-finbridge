"""Deterministic Cubiczan CHP workup engine.

Reads the same JSON rules/scenarios as the UI. No network. No secrets.
"""

from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parent / "data"


def load_json(name: str) -> dict[str, Any]:
    return json.loads((DATA_DIR / name).read_text(encoding="utf-8"))


SCENARIOS = load_json("scenarios.json")
RULES = load_json("rules.json")

BRANDS = ("servicesell", "finbridge")


def empty_scenario(brand: str) -> dict[str, Any]:
    return {
        "id": "custom",
        "brand": brand,
        "label": "Operator-entered scenario",
        "disclaimer": "Operator-supplied figures. Not attributed to any named company.",
        "vertical": "",
        "geography": "",
        "ttmRevenue": 0,
        "reportedEbitda": 0,
        "grossMargin": 0.35,
        "addBacks": [],
        "recurringPct": 0,
        "topCustomerPct": 0,
        "ownerFieldHoursWeekly": 0,
        "technicianCount": 0,
        "fleetCount": 0,
        "workingCapital": 0,
        "netDebt": 0,
        "ownerDependence": "medium",
        "safetyIncidents12m": 0,
        "bonded": False,
        "licensedStates": 1,
        "dataRoomReadyPct": 0,
        "growthRate": 0.06,
        "growthAsk": 0,
        "useOfProceeds": "",
        "quoteCycleDays": 0,
        "jobCostVariancePct": 0,
    }


def get_scenario(brand: str, scenario_id: str | None = None, overrides: dict | None = None) -> dict[str, Any]:
    if brand not in BRANDS:
        raise ValueError(f"unknown brand: {brand}")
    if scenario_id == "custom":
        base = empty_scenario(brand)
    else:
        base = deepcopy(SCENARIOS[brand])
    if overrides:
        add_backs = overrides.get("addBacks")
        base.update({k: v for k, v in overrides.items() if k != "addBacks"})
        if add_backs is not None:
            base["addBacks"] = add_backs
    base["brand"] = brand
    return base


def _num(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _compare(left: float, op: str, right: float) -> bool:
    if op == ">":
        return left > right
    if op == ">=":
        return left >= right
    if op == "<":
        return left < right
    if op == "<=":
        return left <= right
    if op == "==":
        return left == right
    raise ValueError(f"unknown op: {op}")


def _claim(
    claim_id: str,
    label: str,
    value: Any,
    *,
    unit: str = "usd",
    source: str,
    formula: str | None = None,
    inputs: list[str] | None = None,
    confidence: str = "high",
    format: str = "number",
) -> dict[str, Any]:
    return {
        "id": claim_id,
        "label": label,
        "value": value,
        "unit": unit,
        "format": format,
        "source": source,
        "formula": formula,
        "inputs": inputs or [],
        "confidence": confidence,
        "challenges": [],
        "status": "proposed",
        "reviewNote": "",
    }


def metrics(scenario: dict[str, Any]) -> dict[str, float]:
    add_backs = scenario.get("addBacks") or []
    add_total = sum(_num(item.get("amount")) for item in add_backs)
    recurring_add = sum(_num(item.get("amount")) for item in add_backs if item.get("recurring"))
    reported = _num(scenario.get("reportedEbitda"))
    revenue = _num(scenario.get("ttmRevenue"))
    wc = _num(scenario.get("workingCapital"))
    adj = reported + add_total
    normalized = reported + recurring_add
    wc_pct = (wc / revenue) if revenue else 0.0
    ebitda_margin = (adj / revenue) if revenue else 0.0
    add_share = (add_total / reported) if reported else 0.0
    return {
        "addBacksTotal": add_total,
        "recurringAddBacks": recurring_add,
        "adjEbitda": adj,
        "normalizedEbitda": normalized,
        "wcPct": wc_pct,
        "ebitdaMargin": ebitda_margin,
        "addBackShareOfEbitda": add_share,
        "recurringRevenue": revenue * _num(scenario.get("recurringPct")),
        "afterHoursMissed": revenue * _num(RULES.get("nightMix"), 0.18) * (1 - _num(scenario.get("dataRoomReadyPct"))),
        "jobCostVariancePct": _num(scenario.get("jobCostVariancePct")),
        "quoteCycleDays": _num(scenario.get("quoteCycleDays")),
    }


def valuation_band(brand: str, scenario: dict[str, Any], m: dict[str, float]) -> dict[str, float]:
    table = RULES["valuation"][brand]
    recurring = _num(scenario.get("recurringPct"))
    premium = table["recurringPremium"] * recurring
    low_m = table["ebitdaMultipleLow"] + premium
    high_m = table["ebitdaMultipleHigh"] + premium
    adj = m["adjEbitda"]
    ev_low = adj * low_m
    ev_high = adj * high_m
    net_debt = _num(scenario.get("netDebt"))
    return {
        "multipleLow": low_m,
        "multipleHigh": high_m,
        "evLow": ev_low,
        "evHigh": ev_high,
        "evMid": (ev_low + ev_high) / 2,
        "equityLow": ev_low - net_debt,
        "equityHigh": ev_high - net_debt,
    }


def proforma(scenario: dict[str, Any], m: dict[str, float]) -> list[dict[str, float]]:
    years = int(RULES["proformaYears"])
    growth = _num(scenario.get("growthRate"), 0.06)
    revenue0 = _num(scenario.get("ttmRevenue"))
    gm = _num(scenario.get("grossMargin"), 0.35)
    margin0 = m["ebitdaMargin"]
    rows = []
    for year in range(1, years + 1):
        # Recurring mix supports a modest margin lift; project-mix does not.
        lift = 0.004 * year if _num(scenario.get("recurringPct")) >= 0.25 else 0.0
        rev = revenue0 * ((1 + growth) ** year)
        ebitda = rev * (margin0 + lift)
        rows.append(
            {
                "year": year,
                "revenue": rev,
                "cogs": rev * (1 - gm),
                "grossProfit": rev * gm,
                "ebitda": ebitda,
                "ebitdaMargin": (ebitda / rev) if rev else 0.0,
            }
        )
    return rows


def readiness_score(brand: str, scenario: dict[str, Any], m: dict[str, float]) -> dict[str, Any]:
    weights = RULES["readinessWeights"]
    recurring = min(_num(scenario.get("recurringPct")) / 0.5, 1) * weights["recurring"]
    conc = max(0.0, 1 - max(0.0, _num(scenario.get("topCustomerPct")) - 0.1) / 0.25) * weights["concentration"]
    owner_hours = _num(scenario.get("ownerFieldHoursWeekly"))
    owner = max(0.0, 1 - owner_hours / 30) * weights["owner"]
    data_room = _num(scenario.get("dataRoomReadyPct")) * weights["dataRoom"]
    wc = max(0.0, 1 - abs(m["wcPct"] - 0.08) / 0.12) * weights["workingCapital"]
    safety = max(0.0, 1 - _num(scenario.get("safetyIncidents12m")) / 4) * weights["safety"]
    addbacks = max(0.0, 1 - m["addBackShareOfEbitda"] / 0.35) * weights["addBacks"]
    parts = {
        "recurring": recurring,
        "concentration": conc,
        "owner": owner,
        "dataRoom": data_room,
        "workingCapital": wc,
        "safety": safety,
        "addBacks": addbacks,
    }
    total = sum(parts.values())
    return {"score": round(total, 1), "parts": parts, "brand": brand}


def build_claims(brand: str, scenario: dict[str, Any]) -> list[dict[str, Any]]:
    m = metrics(scenario)
    years = proforma(scenario, m)
    y3 = years[-1] if years else {"ebitda": 0, "revenue": 0}
    production = readiness_score(brand, scenario, m)

    claims = [
        _claim("ttm_revenue", "TTM revenue", scenario["ttmRevenue"], source="ingested", inputs=["ttmRevenue"]),
        _claim(
            "reported_ebitda",
            "Reported operating earnings",
            scenario["reportedEbitda"],
            source="ingested",
            inputs=["reportedEbitda"],
        ),
        _claim(
            "add_backs_total",
            "Job-cost leaks / unposted adjustments",
            m["addBacksTotal"],
            source="derived",
            formula="sum(addBacks.amount)",
            inputs=["addBacks"],
            confidence="medium",
        ),
        _claim(
            "adj_ebitda",
            "Adjusted operating earnings",
            m["adjEbitda"],
            source="derived",
            formula="reportedEbitda + sum(addBacks.amount)",
            inputs=["reportedEbitda", "addBacks"],
            confidence="medium",
        ),
        _claim(
            "normalized_ebitda",
            "Normalized operating earnings (recurring leaks only)",
            m["normalizedEbitda"],
            source="derived",
            formula="reportedEbitda + sum(recurring add-backs)",
            inputs=["reportedEbitda", "addBacks.recurring"],
        ),
        _claim(
            "recurring_pct",
            "Contract / maintenance mix",
            scenario["recurringPct"],
            unit="pct",
            source="ingested",
            inputs=["recurringPct"],
            format="pct",
            confidence="medium",
        ),
        _claim(
            "top_customer_pct",
            "Top account share",
            scenario["topCustomerPct"],
            unit="pct",
            source="ingested",
            inputs=["topCustomerPct"],
            format="pct",
            confidence="medium",
        ),
        _claim(
            "owner_field_hours",
            "Owner hours in dispatch / quoting",
            scenario["ownerFieldHoursWeekly"],
            unit="hours",
            source="ingested",
            inputs=["ownerFieldHoursWeekly"],
            format="number",
        ),
        _claim(
            "fleet_count",
            "Fleet / rolling stock",
            scenario["fleetCount"],
            unit="count",
            source="ingested",
            inputs=["fleetCount"],
            format="number",
        ),
        _claim(
            "wc_pct",
            "Working capital / revenue",
            m["wcPct"],
            unit="pct",
            source="derived",
            formula="workingCapital / ttmRevenue",
            inputs=["workingCapital", "ttmRevenue"],
            format="pct",
        ),
        _claim(
            "data_room_ready",
            "After-hours booking coverage",
            scenario["dataRoomReadyPct"],
            unit="pct",
            source="ingested",
            inputs=["dataRoomReadyPct"],
            format="pct",
            confidence="low",
        ),
        _claim(
            "safety_incidents",
            "Recordable incidents (12m)",
            scenario["safetyIncidents12m"],
            unit="count",
            source="ingested",
            inputs=["safetyIncidents12m"],
            format="number",
        ),
        _claim(
            "growth_rate",
            "After-hours capture assumption",
            scenario["growthRate"],
            unit="pct",
            source="assumption",
            inputs=["growthRate"],
            format="pct",
            confidence="low",
        ),
        _claim(
            "growth_ask",
            "Cash trapped in jobs / AR",
            scenario["growthAsk"],
            source="ingested",
            inputs=["growthAsk"],
            confidence="medium",
        ),
        _claim(
            "quote_cycle_days",
            "Quote-to-cash cycle (days)",
            m["quoteCycleDays"],
            unit="days",
            source="ingested",
            inputs=["quoteCycleDays"],
            format="number",
            confidence="medium",
        ),
        _claim(
            "job_cost_variance",
            "Job-cost variance",
            m["jobCostVariancePct"],
            unit="pct",
            source="ingested",
            inputs=["jobCostVariancePct"],
            format="pct",
            confidence="medium",
        ),
        _claim(
            "after_hours_missed",
            "After-hours revenue still leaking",
            m["afterHoursMissed"],
            source="derived",
            formula="ttmRevenue * nightMix * (1 - afterHoursCoverage)",
            inputs=["ttmRevenue", "dataRoomReadyPct"],
            confidence="medium",
        ),
        _claim(
            "contract_book",
            "Contract / maintenance book",
            m["recurringRevenue"],
            source="derived",
            formula="ttmRevenue * recurringPct",
            inputs=["ttmRevenue", "recurringPct"],
        ),
        _claim(
            "production_fit",
            "Production-fit score",
            production["score"],
            unit="score",
            source="derived",
            formula="weighted mix of coverage, owner load, job-cost, cash, safety",
            inputs=["recurringPct", "ownerFieldHoursWeekly", "dataRoomReadyPct", "wcPct"],
            format="number",
            confidence="medium",
        ),
        _claim(
            "y3_revenue",
            "Year-3 operating revenue",
            y3["revenue"],
            source="derived",
            formula="ttmRevenue * (1 + growthRate) ^ 3",
            inputs=["ttmRevenue", "growthRate"],
            confidence="low",
        ),
        _claim(
            "y3_ebitda",
            "Year-3 operating earnings",
            y3["ebitda"],
            source="derived",
            formula="y3 revenue * (adjEbitda/ttmRevenue [+ contract lift])",
            inputs=["ttmRevenue", "adj_ebitda", "growthRate", "recurringPct"],
            confidence="low",
        ),
    ]
    return claims


def apply_challenges(brand: str, scenario: dict[str, Any], claims: list[dict[str, Any]]) -> list[dict[str, Any]]:
    m = metrics(scenario)
    ctx = {
        **{k: _num(scenario.get(k)) for k in (
            "topCustomerPct",
            "ownerFieldHoursWeekly",
            "recurringPct",
            "growthRate",
            "safetyIncidents12m",
            "dataRoomReadyPct",
            "quoteCycleDays",
            "jobCostVariancePct",
        )},
        "addBackShareOfEbitda": m["addBackShareOfEbitda"],
        "wcPct": m["wcPct"],
    }
    by_id = {c["id"]: c for c in claims}
    for rule in RULES["challenges"]:
        allowed = rule.get("brands")
        if allowed and brand not in allowed:
            continue
        when = rule["when"]
        if not _compare(ctx.get(when["field"], 0), when["op"], when["value"]):
            continue
        claim = by_id.get(rule["claim"])
        if not claim:
            continue
        claim["challenges"].append(
            {
                "id": rule["id"],
                "severity": rule["severity"],
                "text": rule["text"],
            }
        )
        claim["status"] = "challenged"
        if rule["severity"] == "high" and claim["confidence"] == "high":
            claim["confidence"] = "medium"
        if rule["severity"] == "high":
            claim["confidence"] = "low" if claim["confidence"] != "low" else "low"
    return claims


def checklist_for(brand: str, claims: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_id = {c["id"]: c for c in claims}
    items = []
    for spec in RULES["checklist"][brand]:
        claim = by_id.get(spec["claim"])
        status = "ready"
        if not claim:
            status = "missing"
        elif claim["status"] == "challenged" or claim["challenges"]:
            status = "gap"
        elif claim["confidence"] == "low":
            status = "watch"
        items.append({**spec, "status": status, "claimSnapshot": claim})
    return items


def ingest(brand: str, scenario_id: str | None = None, overrides: dict | None = None) -> dict[str, Any]:
    scenario = get_scenario(brand, scenario_id, overrides)
    return {"ok": True, "scenario": scenario, "disclaimer": scenario["disclaimer"]}


def generate_workup(brand: str, scenario: dict[str, Any]) -> dict[str, Any]:
    scenario = {**get_scenario(brand), **scenario, "brand": brand}
    m = metrics(scenario)
    claims = build_claims(brand, scenario)
    claims = apply_challenges(brand, scenario, claims)
    return {
        "ok": True,
        "brand": brand,
        "scenario": scenario,
        "metrics": m,
        "valuation": valuation_band(brand, scenario, m),
        "proforma": proforma(scenario, m),
        "readiness": readiness_score(brand, scenario, m),
        "claims": claims,
        "checklist": checklist_for(brand, claims),
        "phase": "challenge",
        "disclaimer": scenario.get("disclaimer"),
    }


def apply_reviews(claims: list[dict[str, Any]], reviews: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_id = {c["id"]: deepcopy(c) for c in claims}
    for review in reviews or []:
        claim = by_id.get(review.get("claimId"))
        if not claim:
            continue
        decision = review.get("decision")
        if decision not in {"approved", "rejected"}:
            continue
        claim["status"] = decision
        claim["reviewNote"] = review.get("note") or ""
    return list(by_id.values())


def lock_consensus(workup: dict[str, Any], reviews: list[dict[str, Any]]) -> dict[str, Any]:
    claims = apply_reviews(workup.get("claims") or [], reviews)
    pending = [c for c in claims if c["status"] in {"proposed", "challenged"}]
    approved = [c for c in claims if c["status"] == "approved"]
    rejected = [c for c in claims if c["status"] == "rejected"]
    locked = len(pending) == 0 and len(approved) > 0
    for claim in claims:
        if claim["status"] == "approved" and locked:
            claim["status"] = "locked"
    result = deepcopy(workup)
    result["claims"] = claims
    result["phase"] = "locked" if locked else "review"
    result["lock"] = {
        "locked": locked,
        "approvedCount": len(approved) if not locked else sum(1 for c in claims if c["status"] == "locked"),
        "rejectedCount": len(rejected),
        "pendingCount": len(pending),
        "reason": None if locked else "Human must approve or reject every claim before lock.",
    }
    return result


def export_summary(workup: dict[str, Any]) -> dict[str, Any]:
    brand = workup.get("brand") or "servicesell"
    phase = workup.get("phase")
    claims = workup.get("claims") or []
    locked = [c for c in claims if c["status"] in {"locked", "approved"}]
    rejected = [c for c in claims if c["status"] == "rejected"]
    title = "Agent deployment summary" if brand == "servicesell" else "Ops + cash summary"
    lines = [
        f"# {title}",
        "",
        f"Brand skin: {brand}",
        f"Phase: {phase}",
        f"Scenario: {(workup.get('scenario') or {}).get('label')}",
        f"Disclaimer: {(workup.get('scenario') or {}).get('disclaimer')}",
        "",
        "## Locked / approved claims",
        "",
    ]
    if not locked:
        lines.append("_Nothing locked. Human review is incomplete._")
    for claim in locked:
        lines.append(f"- **{claim['label']}**: {claim['value']} ({claim['source']}"
                     f"{'; ' + claim['formula'] if claim.get('formula') else ''})")
        if claim.get("reviewNote"):
            lines.append(f"  - Reviewer: {claim['reviewNote']}")
    if rejected:
        lines.append("")
        lines.append("## Rejected claims")
        lines.append("")
        for claim in rejected:
            lines.append(f"- {claim['label']} — {claim.get('reviewNote') or 'rejected'}")
    text = "\n".join(lines) + "\n"
    return {
        "ok": True,
        "title": title,
        "markdown": text,
        "json": {
            "brand": brand,
            "phase": phase,
            "lock": workup.get("lock"),
            "claims": claims,
            "scenario": workup.get("scenario"),
            "valuation": workup.get("valuation"),
            "proforma": workup.get("proforma"),
            "readiness": workup.get("readiness"),
        },
    }


def list_scenarios() -> dict[str, Any]:
    return {
        "ok": True,
        "scenarios": [
            {
                "id": item["id"],
                "brand": item["brand"],
                "label": item["label"],
                "disclaimer": item["disclaimer"],
                "vertical": item["vertical"],
            }
            for item in SCENARIOS.values()
        ],
    }
