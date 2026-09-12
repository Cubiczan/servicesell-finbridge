# DoraHacks #2349 — Anna AI App Builder Program

Paste this into the BUIDL submission at https://dorahacks.io/hackathon/2349/buidl

## BUIDL name

ServiceSell × FinBridge — Cubiczan dual-brand Anna App

Anna App id: **276** (`servicesell-finbridge`)

## One-liner

One Anna App, two Cubiczan brand skins: field-service sale readiness and SMB proforma/valuation, sharing a propose → challenge → lock console.

## Description

ServiceSell × FinBridge is a B2B agentification console for Cubiczan. It is **one product with two skins**, not two apps.

**ServiceSell** helps field-services companies (around $1M+ EBITDA) get ready to meet institutional buyers: quality of earnings, customer concentration, owner dependence, fleet and safety files, and a data-room checklist.

**FinBridge** helps SMB owners step beyond the bookkeeper: a normalized earnings bridge, a three-year proforma, and a valuation band that never pretends to be a price.

Both skins sit on the same Cubiczan CHP-inspired spine:

1. **Propose** — the agent (or the deterministic workup engine) emits claims.
2. **Challenge** — a rule pack flags weak claims (concentration, aggressive add-backs, thin recurring, unfinished data room).
3. **Lock** — a human approves or rejects every claim. Export is refused until the pack is locked.

Every number carries **claim provenance**: ingested, derived (with formula), assumption, or benchmark. The UI is a structured console — not a chat transcript with extra CSS.

### Anna App shape

- `app.json` / `manifest.json` (schema 2 UI bundle)
- Static SPA bundle (React + TypeScript, Vite)
- Bundled Python Executa (`ingest_scenario`, `generate_workup`, `lock_consensus`, `export_summary`)
- `SKILL.md` recipe for `#servicesell` / `#finbridge`
- Runs offline without Anna cloud credentials; `anna-app validate` and `npm test` are the local bar

### What judges should click

1. Open the preview and pick **ServiceSell**.
2. Load the illustrative HVAC composite (labeled as not a customer).
3. Generate the buyer-prep checklist and open the challenge board.
4. Approve/reject claims, lock consensus, export markdown.
5. Switch to **#finbridge** and repeat for the proforma + valuation band.

### Links

- Developer docs followed: https://anna.partners/developers and https://anna.partners/llms.txt
- Hackathon: https://dorahacks.io/hackathon/2349
- House site: https://www.cubiczan.com

No secrets. No invented customer logos. MIT licensed.
