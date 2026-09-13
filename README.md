# ServiceSell × FinBridge

**Cubiczan. One product. Two skins. Same ability.**

Cubiczan helps blue-collar and field-service businesses implement AI agents in the live workflow — dispatch, after-hours booking, quoting, job-cost, field notes → invoice. Governed production agents (CHP: propose → challenge → lock). No rip-and-replace ERP. Not a buyer data-room. Not a raise pack.

- **ServiceSell** — HVAC, plumbing, electrical, roofing, landscaping: agents in the field book.
- **FinBridge** — shop-floor / operator finance-ops: agents on quoting, job-cost, cash, and after-hours ops beyond the bookkeeper.

Not two products. `#servicesell` and `#finbridge` are skins on one CHP spine.

| | |
| --- | --- |
| **Website** | [cubiczan.com](https://www.cubiczan.com) |
| **Slug** | `servicesell-finbridge` |
| **License** | [MIT](LICENSE) |

**YouTube URL (Sam fills this):** `https://youtu.be/qWRtj5F-i5E`

## Repos

- https://github.com/Cubiczan/servicesell-finbridge
- https://github.com/icohangar-ops/servicesell-finbridge

## How the agents are wired

| Layer | What it does |
| --- | --- |
| Structured UI | React console (not a chat skin). Provenance chips on every number. |
| Engine | Deterministic ingest → workup → challenge → lock → export. Runs offline. |
| Executa | Python JSON-RPC tool: `ingest_scenario`, `generate_workup`, `lock_consensus`, `export_summary`. |
| Skill | `SKILL.md` / `executas/chp-workflow/SKILL.md` for `#servicesell` and `#finbridge`. |
| Manifest | `app.json` + schema-2 `manifest.json` UI bundle. |

Every claim is `ingested`, `derived` (formula attached), `assumption`, or `benchmark`. Lock is refused while any claim is still `proposed` or `challenged`. Cubiczan ships production governed agentic AI (CHP); Impact Quadrant forward-deploys.

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

No cloud credentials are required for the demo. `anna-app login --host https://anna.partners` is only for live host LLM / APS.

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
| ServiceSell | Workflow workup | [docs/media/03-servicesell-workup.png](docs/media/03-servicesell-workup.png) |
| ServiceSell | Challenge board | [docs/media/04-servicesell-challenge.png](docs/media/04-servicesell-challenge.png) |
| ServiceSell | Human lock | [docs/media/05-servicesell-review.png](docs/media/05-servicesell-review.png) |
| ServiceSell | Export | [docs/media/06-servicesell-export.png](docs/media/06-servicesell-export.png) |
| FinBridge | Ingest | [docs/media/07-finbridge-ingest.png](docs/media/07-finbridge-ingest.png) |
| FinBridge | Forward operating view | [docs/media/08-finbridge-proforma.png](docs/media/08-finbridge-proforma.png) |
| FinBridge | Challenge | [docs/media/09-finbridge-challenge.png](docs/media/09-finbridge-challenge.png) |
| ServiceSell | Mobile | [docs/media/10-mobile-servicesell.png](docs/media/10-mobile-servicesell.png) |
| FinBridge | Mobile | [docs/media/11-mobile-finbridge.png](docs/media/11-mobile-finbridge.png) |

![Brand gate](docs/media/01-brand-gate.png)

![ServiceSell workup](docs/media/03-servicesell-workup.png)

![FinBridge operating view](docs/media/08-finbridge-proforma.png)

![Thumbnail](docs/media/thumbnail.png)

## Judge paste

Full paste block: [DORAHACKS.md](DORAHACKS.md).

> Cubiczan helps blue-collar and field-service businesses implement AI agents in the live workflow — not a buyer data-room and not a raise pack. **One product, two skins:** ServiceSell = HVAC / plumbing / electrical / roofing / landscaping agents on dispatch, after-hours booking, quoting, job-cost, field notes → invoice. FinBridge = shop-floor finance-ops agents on quoting, job-cost, cash, after-hours ops beyond the bookkeeper. **How agents work:** a deterministic workup engine proposes claims with provenance; a rule pack challenges weak numbers (missed after-hours, open quotes, job-cost leakage); a human must approve or reject every claim before lock and export — Cubiczan CHP, production, not a demo. **Run:** `npm i && npm run preview`. **Media:** `docs/media/demo.mp4`, `docs/media/thumbnail.png`. **Site:** https://www.cubiczan.com **Repos:** https://github.com/Cubiczan/servicesell-finbridge · https://github.com/icohangar-ops/servicesell-finbridge

## Brand positioning

Public Facebook bios were not independently retrievable at build time. Copy is from [cubiczan.com](https://www.cubiczan.com) and the product brief Sam locked.

**Cubiczan** — Production governed agentic AI (CHP). Impact Quadrant forward-deploys.  
**ServiceSell** — Field-workflow agents for trades.  
**FinBridge** — Shop-floor finance-ops agents beyond the bookkeeper.  
Demo books are **illustrative composites**, not named customers. No live ops metrics or reply rates are claimed.

## App layout

```
app.json                 listing + bundled Executas
manifest.json            schema 2 UI + host_api ACL
bundle/                  static SPA
src/                     React + TypeScript UI (Vite → bundle/)
executas/servicesell-finbridge/   Python CHP tool
executas/chp-workflow/SKILL.md    declarative recipe
docs/media/              demo.mp4, thumbnail, screenshots
artifacts/               copies for judges
```

## Integration metadata

Anna listing id **276**, slug `servicesell-finbridge`, schema-2 UI bundle. That is how this console is hosted — it is not the customer pitch. Docs: https://anna.partners/developers · https://anna.partners/llms.txt

## Disclaimer

Illustrative figures only. Not a valuation opinion, offer of securities, or quality-of-earnings report. Not a claim of live production results at a named shop.
