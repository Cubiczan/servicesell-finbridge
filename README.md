# ServiceSell × FinBridge

One Cubiczan Anna App. Two brand skins. Same tools.

This is a B2B agentification console — not a chatbot with a theme toggle.

- **ServiceSell** — field-services operators around $1M+ EBITDA getting ready to meet institutional buyers.
- **FinBridge** — SMB owners who have outgrown the bookkeeper and need a governed proforma + valuation band for a raise or a sale.

Shared spine: **propose → challenge → lock**, Cubiczan CHP-inspired consensus with a human on the lock. Every number carries claim provenance.

App name / slug: `servicesell-finbridge`  
**Anna App id: 276**  
Aliases: `#servicesell` · `#finbridge`  
License: [MIT](LICENSE)

**YouTube URL (Sam fills this):** `_https://www.youtube.com/watch?v=YOUR_VIDEO_ID_`

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

## Screenshot gallery

Captured from the running local demo (Chrome, 1440×920 and 390×844).

| Skin | Shot | File |
| --- | --- | --- |
| Both | Brand gate | [docs/media/01-brand-gate.png](docs/media/01-brand-gate.png) |
| ServiceSell | Ingest HVAC composite | [docs/media/02-servicesell-ingest.png](docs/media/02-servicesell-ingest.png) |
| ServiceSell | Buyer-prep workup | [docs/media/03-servicesell-workup.png](docs/media/03-servicesell-workup.png) |
| ServiceSell | Challenge board | [docs/media/04-servicesell-challenge.png](docs/media/04-servicesell-challenge.png) |
| ServiceSell | Human lock | [docs/media/05-servicesell-review.png](docs/media/05-servicesell-review.png) |
| ServiceSell | Export | [docs/media/06-servicesell-export.png](docs/media/06-servicesell-export.png) |
| FinBridge | Ingest fabrication composite | [docs/media/07-finbridge-ingest.png](docs/media/07-finbridge-ingest.png) |
| FinBridge | Proforma + valuation | [docs/media/08-finbridge-proforma.png](docs/media/08-finbridge-proforma.png) |
| FinBridge | Challenge board | [docs/media/09-finbridge-challenge.png](docs/media/09-finbridge-challenge.png) |
| ServiceSell | Mobile | [docs/media/10-mobile-servicesell.png](docs/media/10-mobile-servicesell.png) |
| FinBridge | Mobile | [docs/media/11-mobile-finbridge.png](docs/media/11-mobile-finbridge.png) |

![Brand gate](docs/media/01-brand-gate.png)

![ServiceSell workup](docs/media/03-servicesell-workup.png)

![FinBridge proforma](docs/media/08-finbridge-proforma.png)

## YouTube thumbnail

1280×720, H.264-ready still:

**[docs/media/thumbnail.png](docs/media/thumbnail.png)**

![Thumbnail](docs/media/thumbnail.png)

Regenerate: `bash scripts/make-media.sh`

## Demo video (MP4)

~180 seconds, H.264, yuv420p, 1280×720, no audio (caption bars on each beat). Composed with **FFmpeg** from the live screenshots plus title/end cards.

**[docs/media/demo.mp4](docs/media/demo.mp4)** (about 1.2 MB — small enough for git; no LFS required)

Copies also live under `artifacts/demo.mp4` and `artifacts/thumbnail.png`.

```bash
# recapture screens from a running preview, then rebuild the video
npm run preview          # keep this up
NODE_PATH=/path/to/puppeteer-core/node_modules node scripts/capture-screens.mjs
bash scripts/make-media.sh
```

**YouTube URL (placeholder for Sam):** `_https://www.youtube.com/watch?v=YOUR_VIDEO_ID_`

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
