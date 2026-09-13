# DoraHacks #2349 — paste this into the BUIDL

**Hackathon:** https://dorahacks.io/hackathon/2349/buidl  
**BUIDL name:** ServiceSell × FinBridge  
**Anna App id:** 276 · **slug:** `servicesell-finbridge`

## Paste-ready paragraph

ServiceSell × FinBridge is one Cubiczan Anna App with two brand skins — not two products. **Problem:** mid-market blue-collar operators ($20M–$500M) still run dispatch, quoting, job-cost, after-hours, and cash on shop software with no governed agents in production. **Who:** ServiceSell = HVAC / plumbing / electrical / roofing / landscaping shops that need agents in dispatch, booking, and job-cost; FinBridge = operators who need agents on quote-to-cash and cash beyond the bookkeeper, with a human lock. **How AI / agents work:** Impact Quadrant diagnoses the workflow and deploys Cubiczan agents on the ERP you already run; a deterministic workup engine (and, on Anna, the bundled Executa) proposes claims with provenance; a rule pack challenges weak coverage (after-hours gap, owner still on the board, job-cost variance, slow quote-to-cash); a human must approve or reject every claim before lock and export — Cubiczan CHP, not a chatbot transcript. **Listing:** App id 276, schema-2 UI bundle, Python Executa (`ingest_scenario`, `generate_workup`, `lock_consensus`, `export_summary`), `#servicesell` / `#finbridge` aliases, SKILL.md. **Run:** `npm i && npm run preview` (http://127.0.0.1:43173). **Media:** demo `docs/media/demo.mp4` (~180s), thumbnail `docs/media/thumbnail.png` (1280×720), screenshot gallery under `docs/media/*.png`. **YouTube:** https://youtu.be/qWRtj5F-i5E **Repos:** https://github.com/Cubiczan/servicesell-finbridge · https://github.com/icohangar-ops/servicesell-finbridge

## One-liner

One Anna App, two Cubiczan skins: agents in the $20M–$500M shop workflow (dispatch, job-cost, quote-to-cash) on a propose → challenge → lock console.

## Problem / who / how

| | |
| --- | --- |
| **Problem** | Mid-market shops still run the board, the quote, job-cost, after-hours, and cash without governed agents. Numbers have no provenance, no challenge, and no human lock. |
| **Who** | ServiceSell: field-service / trades operators ($20M–$500M). FinBridge: operators who have outgrown the bookkeeper on quote-to-cash. |
| **How AI** | Diagnose the workflow. Agents + rule pack propose and challenge claims. A person locks. Export is refused while anything is pending. |
| **Anna** | App **276** / `servicesell-finbridge` — UI bundle, Executa tools, SKILL.md, `#servicesell` / `#finbridge`. |

## Dual brand (one app)

- **ServiceSell** — agent deployment board (after-hours booking, dispatch, job-cost).
- **FinBridge** — quote-to-cash + cash beyond the bookkeeper (human lock).
- Same tools, same claim ids, same CHP lock. Theme and copy change. Not two repos of product.

## How to run

```bash
npm i && npm run preview
# http://127.0.0.1:43173  then #servicesell or #finbridge
npx anna-app validate --strict    # optional, no Anna PAT required
npx anna-app dev --port 43180     # official harness if uv is installed
```

## Judge media

| Asset | Path |
| --- | --- |
| ~180s FFmpeg demo | [docs/media/demo.mp4](docs/media/demo.mp4) |
| 1280×720 thumbnail | [docs/media/thumbnail.png](docs/media/thumbnail.png) |
| Screenshot gallery | [docs/media/](docs/media/) (`01`–`11` + mobile) |
| Artifact copies | [artifacts/](artifacts/) |

**YouTube URL (Sam fills this):** `https://youtu.be/qWRtj5F-i5E`

## Links

- https://github.com/Cubiczan/servicesell-finbridge
- https://github.com/icohangar-ops/servicesell-finbridge
- https://anna.partners/developers
- https://www.cubiczan.com
- https://dorahacks.io/hackathon/2349/buidl

MIT. Illustrative composites only — no invented customers.
