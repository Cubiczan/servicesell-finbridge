# ServiceSell × FinBridge

**Cubiczan agentic services for mid-market blue-collar shops. Two brand skins. Same CHP tools.**

Impact Quadrant implements AI agents in the workflow a $20M–$500M operator already runs — HVAC, plumbing, electrical, trucking, roofing, landscaping, auto/fleet, discrete and process plants stuck on shop software. Diagnose the board, deploy agents, govern with CHP (**propose → challenge → lock**), then measure production. Not a demo. Not a sale-readiness pack. Not a valuation console.

- **ServiceSell** — field-service / trades skin: agents in dispatch, after-hours booking, and job-cost without ripping out the ERP.
- **FinBridge** — ops + cash skin: agents on quote, job-cost, and cash beyond the bookkeeper, with a human lock.

Not two products. `#servicesell` and `#finbridge` are go-to-market skins on one Cubiczan spine.

| | |
| --- | --- |
| **House brand** | Cubiczan (products + CHP) |
| **Services** | Impact Quadrant (forward-deploy) |
| **ICP** | Mid-market blue-collar / industrial · **$20M–$500M** revenue |
| **License** | [MIT](LICENSE) |
| **Listing** | Anna App **276** · slug `servicesell-finbridge` · [DoraHacks #2349](https://dorahacks.io/hackathon/2349/buidl) |

**YouTube URL (Sam fills this):** `https://youtu.be/qWRtj5F-i5E`

## Repos

- https://github.com/Cubiczan/servicesell-finbridge
- https://github.com/icohangar-ops/servicesell-finbridge

## How AI / Anna is wired

| Layer | What it does |
| --- | --- |
| Structured UI | React console (not a chat skin). Provenance chips on every number. |
| Engine | Deterministic ingest → workup → challenge → lock → export. Runs offline. |
| Executa | Python JSON-RPC tool: `ingest_scenario`, `generate_workup`, `lock_consensus`, `export_summary`. |
| Skill | `SKILL.md` / `executas/chp-workflow/SKILL.md` for `#servicesell` and `#finbridge`. |
| Manifest | `app.json` + schema-2 `manifest.json` UI bundle. Scaffolded with `anna-app init`. |

Every claim is `ingested`, `derived` (formula attached), `assumption`, or `benchmark`. Lock is refused while any claim is still `proposed` or `challenged`.

## How to run

```bash
npm i && npm run preview
# open http://127.0.0.1:43173
# then pick a skin or open #servicesell / #finbridge
```

```bash
npm run dev              # Vite live reload, same port 43173
npm test                 # TS + Python engine
npm run build
npx anna-app validate --strict
npx anna-app dev --port 43180   # official Anna harness (needs uv; no PAT for the offline tool path)
```

No Anna cloud credentials are required for the demo. `anna-app login --host https://anna.partners` is only for live host LLM / APS.

## Anna packaging (review / Cloud Agent)

Do **not** hardcode minted platform tool ids (for example `tool-cubiczan-cubiczan-chp-yexs252k`). The app uses the bundled handle `cubiczan-chp`.

| File | Role |
| --- | --- |
| `app.json` `bundled_executas.cubiczan-chp` | Local Executa path |
| `manifest.json` `bundled:cubiczan-chp` / `required:bundled:cubiczan-chp` | Publish resolves handle → platform `tool_id` |
| `executas/servicesell-finbridge/executa.json` | Local `tool_id` for `anna-app dev` + `distribution.profiles.binary` (`linux-x86_64` required) |
| `bundle/anna-tool-ids.js` | Written by publish; UI reads `window.__ANNA_TOOL_IDS__["cubiczan-chp"]` |

Listing logo + screenshots for the Developer Console: [`docs/listing/`](docs/listing/). Full resubmit steps: [`docs/ANNA-RESUBMIT.md`](docs/ANNA-RESUBMIT.md).

## Judge media

| Asset | Path |
| --- | --- |
| **~180s demo (FFmpeg, H.264)** | [docs/media/demo.mp4](docs/media/demo.mp4) |
| **YouTube thumbnail 1280×720** | [docs/media/thumbnail.png](docs/media/thumbnail.png) |
| Artifact copies | [artifacts/demo.mp4](artifacts/demo.mp4), [artifacts/thumbnail.png](artifacts/thumbnail.png) |

**YouTube URL (placeholder):** `https://youtu.be/qWRtj5F-i5E`

### Screenshot gallery

| Skin | Shot | File |
| --- | --- | --- |
| Both | Brand gate | [docs/media/01-brand-gate.png](docs/media/01-brand-gate.png) |
| ServiceSell | Ingest | [docs/media/02-servicesell-ingest.png](docs/media/02-servicesell-ingest.png) |
| ServiceSell | Agent workup | [docs/media/03-servicesell-workup.png](docs/media/03-servicesell-workup.png) |
| ServiceSell | Challenge board | [docs/media/04-servicesell-challenge.png](docs/media/04-servicesell-challenge.png) |
| ServiceSell | Human lock | [docs/media/05-servicesell-review.png](docs/media/05-servicesell-review.png) |
| ServiceSell | Export | [docs/media/06-servicesell-export.png](docs/media/06-servicesell-export.png) |
| FinBridge | Ingest | [docs/media/07-finbridge-ingest.png](docs/media/07-finbridge-ingest.png) |
| FinBridge | Quote-to-cash | [docs/media/08-finbridge-proforma.png](docs/media/08-finbridge-proforma.png) |
| FinBridge | Challenge | [docs/media/09-finbridge-challenge.png](docs/media/09-finbridge-challenge.png) |
| ServiceSell | Mobile | [docs/media/10-mobile-servicesell.png](docs/media/10-mobile-servicesell.png) |
| FinBridge | Mobile | [docs/media/11-mobile-finbridge.png](docs/media/11-mobile-finbridge.png) |

![Brand gate](docs/media/01-brand-gate.png)

![ServiceSell workup](docs/media/03-servicesell-workup.png)

![FinBridge quote-to-cash](docs/media/08-finbridge-proforma.png)

![Thumbnail](docs/media/thumbnail.png)

## DoraHacks #2349 — paste-ready BUIDL

Full paste block: [DORAHACKS.md](DORAHACKS.md).

> ServiceSell × FinBridge is one Cubiczan Anna App with two brand skins — not two products. **Problem:** mid-market blue-collar operators ($20M–$500M) still run dispatch, quoting, job-cost, after-hours, and cash on shop software with no governed agents. **Who:** ServiceSell = HVAC / trades shops that need agents in dispatch, booking, and job-cost; FinBridge = operators who need agents on quote-to-cash and cash beyond the bookkeeper. **How AI / agents work:** diagnose the workflow, propose agent workups with provenance, challenge weak coverage, and refuse production until a human locks every claim (Cubiczan CHP). Impact Quadrant deploys on the ERP you already run. **Listing:** App id 276, slug `servicesell-finbridge`, schema-2 UI bundle, Python Executa, `#servicesell` / `#finbridge`, SKILL.md. **Run:** `npm i && npm run preview`. **Media:** `docs/media/demo.mp4`, `docs/media/thumbnail.png`, `docs/media/*.png`. **YouTube:** https://youtu.be/qWRtj5F-i5E **Repos:** https://github.com/Cubiczan/servicesell-finbridge · https://github.com/icohangar-ops/servicesell-finbridge

## Brand positioning

Public Facebook bios were not independently retrievable at build time. Copy is from [cubiczan.com](https://www.cubiczan.com) and the product brief locked by Sam Desigan (2026-09-13).

**Cubiczan** — House brand: products + CHP (propose → challenge → lock).  
**Impact Quadrant** — Forward-deploy services company that implements the agents.  
**ServiceSell** — Field-service / trades skin.  
**FinBridge** — Ops + cash skin.  
Demo books are **illustrative composites**, not named customers.

## Anna App layout

```
app.json                 listing + bundled Executas (id 276 / slug)
manifest.json            schema 2 UI + bundled:<handle> refs
bundle/                  static SPA Anna mounts in the iframe
src/                     React + TypeScript UI (Vite → bundle/)
executas/servicesell-finbridge/   Python CHP tool + binary_artifacts
executas/chp-workflow/            declarative skill (SKILL.md + executa.json)
.github/workflows/       multi-platform Executa binaries (linux-x86_64 required)
docs/listing/            logo + ≤6 screenshots for the Anna Listing tab
docs/media/              demo.mp4, thumbnail, screenshot gallery
artifacts/               copies for judges / Console upload
```

Docs followed: https://anna.partners/developers · https://anna.partners/llms.txt

## Disclaimer

Illustrative figures only. Not a customer case study, valuation opinion, or offer of securities.
