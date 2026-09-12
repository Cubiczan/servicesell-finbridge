---
name: cubiczan-chp-workflow
description: Run Cubiczan propose-challenge-lock on a ServiceSell sale-readiness pack or a FinBridge proforma. Use when the user mentions #servicesell, #finbridge, buyer prep, valuation band, or CHP lock.
metadata: {"matrix":{"emoji":"🔒","execution_mode":"prompt","category_name":"finance","skill_key":"cubiczan-chp-workflow"}}
---

# Cubiczan CHP workflow

This skill steers the ServiceSell × FinBridge Anna App. It is one product with two skins.

## When to load

- User writes `#servicesell` or asks for field-service sale readiness / buyer-prep.
- User writes `#finbridge` or asks for an SMB proforma, valuation band, or fundraising pack.
- User asks to propose, challenge, lock, or export numbers.

## Rules

1. Never invent a named company as a customer. Use the bundled illustrative composites or figures the operator typed.
2. Call tools in order: `ingest_scenario` → `generate_workup` → (show provenance) → `lock_consensus` → `export_summary`.
3. Every number must keep its source: ingested, derived, assumption, or benchmark.
4. Do not treat a figure as final while any claim is still `proposed` or `challenged`.
5. Open the `main` app view when the user wants the structured console rather than chat prose.
6. Brand skin changes copy and theme only. Tools stay the same.

## Output

Prefer the structured UI. If you must answer in chat, list claims as a table with value, source, formula, challenges, and review status.
