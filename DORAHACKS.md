# Judge paste — Cubiczan ServiceSell × FinBridge

**BUIDL name:** ServiceSell × FinBridge  
**Site:** https://www.cubiczan.com  
**Slug:** `servicesell-finbridge`

Hackathon listing (not the customer pitch): https://dorahacks.io/hackathon/2349/buidl

## Paste-ready paragraph

Cubiczan helps blue-collar and field-service businesses implement AI agents in the live workflow — not a buyer data-room and not a raise pack. **One product, two skins:** ServiceSell = HVAC / plumbing / electrical / roofing / landscaping agents on dispatch, after-hours booking, quoting, job-cost, field notes → invoice. FinBridge = shop-floor finance-ops agents on quoting, job-cost, cash, after-hours ops beyond the bookkeeper. **How agents work:** a deterministic workup engine proposes claims with provenance; a rule pack challenges weak numbers (missed after-hours, open quotes, job-cost leakage, owner still on the truck); a human must approve or reject every claim before lock and export — Cubiczan CHP, production governed agents, not a chatbot transcript. **Run:** `npm i && npm run preview` (http://127.0.0.1:43173). **Media:** demo `docs/media/demo.mp4` (~180s), thumbnail `docs/media/thumbnail.png` (1280×720), screenshot gallery under `docs/media/*.png`. **YouTube:** https://youtu.be/qWRtj5F-i5E **Repos:** https://github.com/Cubiczan/servicesell-finbridge · https://github.com/icohangar-ops/servicesell-finbridge

## One-liner

Cubiczan: governed AI agents in the blue-collar workflow — ServiceSell for the field book, FinBridge for shop-floor finance-ops, one CHP lock.

## Problem / who / how

| | |
| --- | --- |
| **Problem** | Trades and shop-floor operators still run dispatch, after-hours, quoting, and job-cost by hand. Spreadsheets have no provenance, no challenge, and no human lock. |
| **Who** | ServiceSell: field-service shops (HVAC, plumbing, electrical, roofing, landscaping). FinBridge: operators who have outgrown the bookkeeper and need agents on quoting, job-cost, and cash. |
| **How AI** | Agent + rule pack propose and challenge claims. A person locks. Export is refused while anything is pending. |
| **Host** | Slug `servicesell-finbridge` — UI bundle, Executa tools, SKILL.md, `#servicesell` / `#finbridge`. |

## Dual brand (one app)

- **ServiceSell** — workflow agent checklist (after-hours capture, open quotes, job-cost leakage, dispatch / field notes → invoice).
- **FinBridge** — shop-floor finance-ops (quoting, job-cost, cash, after-hours ops).
- Same tools, same claim ids, same CHP lock. Theme and copy change. Not two repos of product.

## How to run

```bash
npm i && npm run preview
# http://127.0.0.1:43173  then #servicesell or #finbridge
npx anna-app validate --strict    # optional, no PAT required
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

- https://www.cubiczan.com
- https://github.com/Cubiczan/servicesell-finbridge
- https://github.com/icohangar-ops/servicesell-finbridge
- https://anna.partners/developers

MIT. Illustrative composites only — no invented customers, no live ops metrics.
