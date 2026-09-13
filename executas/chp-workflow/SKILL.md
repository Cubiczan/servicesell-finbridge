---
name: cubiczan-chp-workflow
description: Run Cubiczan propose-challenge-lock to implement AI agents in a field-service or shop-floor workflow. Use when the user mentions #servicesell, #finbridge, after-hours booking, job-cost, quoting, or CHP lock.
metadata: {"matrix":{"emoji":"🔒","execution_mode":"prompt","category_name":"finance","skill_key":"cubiczan-chp-workflow"}}
---

# Cubiczan CHP workflow

This skill steers the Cubiczan ServiceSell × FinBridge console. It is one product with two skins. The product is implementing production governed agents in the live workflow — not sale-readiness and not a valuation/raise pack.

## When to load

- User writes `#servicesell` or asks for field-service agents (HVAC, plumbing, electrical, roofing, landscaping) in dispatch, after-hours booking, quoting, job-cost, or field notes → invoice.
- User writes `#finbridge` or asks for shop-floor / operator finance-ops agents on quoting, job-cost, cash, or after-hours ops beyond the bookkeeper.
- User asks to propose, challenge, lock, or export a workflow pack.

## Rules

1. Never invent a named company as a customer. Use the bundled illustrative composites or figures the operator typed.
2. Call tools in order: `ingest_scenario` → `generate_workup` → (show provenance) → `lock_consensus` → `export_summary`.
3. Every number must keep its source: ingested, derived, assumption, or benchmark.
4. Do not treat a figure as final while any claim is still `proposed` or `challenged`.
5. Open the `main` app view when the user wants the structured console rather than chat prose.
6. Brand skin changes copy and theme only. Tools stay the same. Both skins market the same ability.
7. Do not claim live ops metrics, reply rates, or named customer results.
8. Do not pitch this as sale-readiness for institutional buyers or as an SMB proforma/valuation for a raise.

## Output

Prefer the structured UI. If you must answer in chat, list claims as a table with value, source, formula, challenges, and review status.
