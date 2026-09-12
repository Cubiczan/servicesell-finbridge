# ServiceSell × FinBridge

One Cubiczan Anna App. Two brand skins. Same tools.

This is a B2B agentification console — not a chatbot with a theme toggle.

- **ServiceSell** — field-services operators around $1M+ EBITDA getting ready to meet institutional buyers.
- **FinBridge** — SMB owners who have outgrown the bookkeeper and need a governed proforma + valuation band for a raise or a sale.

Shared spine: **propose → challenge → lock**, Cubiczan CHP-inspired consensus with a human on the lock. Every number carries claim provenance.

App name / slug: `servicesell-finbridge`  
Aliases: `#servicesell` · `#finbridge`  
License: [MIT](LICENSE)

## DoraHacks #2349 — paste-ready BUIDL

A longer paste block lives in [DORAHACKS.md](DORAHACKS.md). Short version:

> ServiceSell × FinBridge is a single Anna App for Cubiczan’s dual brands. Field-service owners (ServiceSell) and SMB operators (FinBridge) share one propose → challenge → lock console. Agents propose a buyer-prep checklist or a three-year proforma; a rule pack challenges weak claims; a human approves or rejects every number before export. Built as an Anna App (`app.json`, UI bundle, Executa, SKILL.md) for the Anna AI App Builder Program.

Submit at [DoraHacks hackathon 2349](https://dorahacks.io/hackathon/2349/buidl).

## Brand positioning

Public Facebook bios for ServiceSell and FinBridge were not independently retrievable when this repo was built. Copy below is taken from Cubiczan’s public site and the product brief that commissioned the app.

**Cubiczan** ([cubiczan.com](https://www.cubiczan.com)) — Agentic finance systems and capital structuring. Fractional CFO, AI governance, control points, approval gates, evidence packs. The house brand behind both skins.

**ServiceSell** — Sale-readiness for field-services companies preparing to meet institutional buyers. Quality of earnings, concentration, owner dependence, fleet/safety files, data room.

**FinBridge** — The step beyond bookkeeping: normalized earnings, a three-year proforma, a valuation band with provenance, and a human lock before anyone treats the number as fact.

This repo does **not** invent named companies as customers. Demo books are labeled *illustrative composites*.

## What you can do in the demo

1. Pick a brand skin (`#servicesell` or `#finbridge`).
2. Ingest the illustrative composite or type your own figures.
3. Generate a buyer-prep checklist (ServiceSell) or a proforma + valuation band (FinBridge).
4. Review automatic challenges, then approve or reject every claim.
5. Lock consensus and export a markdown summary.

## Anna App layout

Scaffolded with `anna-app init` from [`@anna-ai/cli`](https://www.npmjs.com/package/@anna-ai/cli), then filled in against [anna.partners/developers](https://anna.partners/developers) (`/llms.txt` for the index; append `.md` to `/developers/**` URLs).

```
app.json                 listing + bundled Executas
manifest.json            schema 2 UI + host_api ACL
bundle/                  static SPA Anna mounts in the iframe
src/                     React + TypeScript UI source (Vite → bundle/)
executas/servicesell-finbridge/   Python CHP tool (JSON-RPC stdio)
executas/chp-workflow/SKILL.md    declarative recipe
SKILL.md                 repo-root pointer for agents
fixtures/                local harness recordings
```

No Anna cloud secrets are stored in this repository. The UI engine runs fully offline. `anna-app login` is only required if you want live host LLM / APS.

## Run locally (no Anna credentials)

Prerequisites: Node 22+, npm. Optional: [uv](https://docs.astral.sh/uv/) for `anna-app doctor` / `anna-app dev`.

```bash
npm install
npm test
npm run build
npm run preview          # http://127.0.0.1:43173
# or live-reload:
npm run dev
```

Open `#servicesell` or `#finbridge` after the app loads, or use the brand gate.

## Anna CLI

```bash
npm i -g @anna-ai/cli    # or use the locally installed anna-app via npx
npx anna-app doctor
npx anna-app validate
npx anna-app validate --strict
npx anna-app dev --port 43180
```

`anna-app dev` starts the official harness (in-process dispatcher + iframe). It does **not** need a PAT for the offline tool path. Use `anna-app login --host https://anna.partners` only when you want `llm.complete` or real APS.

If `uv` is missing:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Publish notes (Anna)

1. `anna-app login --host https://anna.partners`
2. `anna-app account set-handle <your-handle>`
3. `anna-app validate --strict`
4. `anna-app apps push` (working draft; mints bundled tool ids)
5. `anna-app apps publish` / submit for review

Local `tool_id` is `tool-dev-servicesell-finbridge`. Publish replaces it; the bundle reads `window.__ANNA_TOOL_IDS__` when the CLI emits it.

## Disclaimer

Figures are illustrative. This app is not a valuation opinion, offer of securities, or quality-of-earnings report. Cubiczan is a consulting practice; operators should use licensed advisors for a transaction.
