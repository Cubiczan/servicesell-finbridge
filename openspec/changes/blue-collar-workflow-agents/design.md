# Design

## Product

One Cubiczan console. Two skins. Same ability: implement production governed agents in the existing workflow (no rip-and-replace ERP).

- **ServiceSell** — HVAC, plumbing, electrical, roofing, landscaping: dispatch, after-hours booking, quoting, job-cost, field notes → invoice.
- **FinBridge** — shop-floor / operator finance-ops: quoting, job-cost, cash, after-hours ops beyond the bookkeeper.

CHP is unchanged: propose → challenge → lock + human review.

## Field remap

Sale-only scenario fields become workflow-agent fields. Claim ids stay shared across skins.

| Was | Now | Why |
| --- | --- | --- |
| `dataRoomReadyPct` | `afterHoursCapturePct` | After-hours missed calls / booking coverage, not a data room |
| `growthAsk` | `openQuotes` | Open quotes in the book, not a capital ask |
| `useOfProceeds` | `workflowNotes` | Where agents sit in the live workflow |

Engine math (`valuation`, `proforma`, readiness score) stays so lock/export and tests stay deterministic. Those figures are a governed operating view, not the product promise.

## Copy rules

- Brand spelling: Cubiczan. Website: cubiczan.com.
- Do not claim live ops metrics or reply rates.
- Anna App 276 / DoraHacks is integration metadata for judges, not the hero pitch.
