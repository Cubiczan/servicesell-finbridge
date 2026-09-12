# DoraHacks #2349 — paste this into the BUIDL

**Hackathon:** https://dorahacks.io/hackathon/2349/buidl  
**BUIDL name:** ServiceSell × FinBridge  
**Anna App id:** 276 · **slug:** `servicesell-finbridge`

## Paste-ready paragraph

ServiceSell × FinBridge is one Cubiczan Anna App with two brand skins — not two products. **Problem:** field-service owners (~$1M+ EBITDA) and SMB operators still sit in bookkeeper spreadsheets when they need a buyer-ready or fundraising-ready pack. **Who:** ServiceSell = field-services companies preparing to meet institutional buyers; FinBridge = SMB owners stepping beyond the bookkeeper for a proforma and valuation band. **How AI / agents work:** a deterministic workup engine (and, on Anna, the bundled Executa) proposes claims with provenance; a rule pack challenges weak numbers (concentration, add-backs, owner hours, thin recurring, unfinished data room); a human must approve or reject every claim before lock and export — Cubiczan CHP, not a chatbot transcript. **Anna integration:** App id 276, schema-2 UI bundle, Python Executa (`ingest_scenario`, `generate_workup`, `lock_consensus`, `export_summary`), `#servicesell` / `#finbridge` aliases, SKILL.md. **Run:** `npm i && npm run preview` (http://127.0.0.1:43173). **Media:** demo `docs/media/demo.mp4` (~180s), thumbnail `docs/media/thumbnail.png` (1280×720), screenshot gallery under `docs/media/*.png`. **YouTube:** _https://www.youtube.com/watch?v=YOUR_VIDEO_ID_ **Repos:** https://github.com/Cubiczan/servicesell-finbridge · https://github.com/icohangar-ops/servicesell-finbridge

## One-liner

One Anna App, two Cubiczan skins: field-service sale readiness and SMB proforma/valuation on a propose → challenge → lock console.

## Problem / who / how

| | |
| --- | --- |
| **Problem** | Sale and fundraising work still lives in bookkeeper files. Numbers have no provenance, no challenge, and no human lock. |
| **Who** | ServiceSell: field-services operators preparing for institutional buyers. FinBridge: SMB owners who have outgrown cash-basis bookkeeping. |
| **How AI** | Agent + rule pack propose and challenge claims. A person locks. Export is refused while anything is pending. |
| **Anna** | App **276** / `servicesell-finbridge` — UI bundle, Executa tools, SKILL.md, `#servicesell` / `#finbridge`. |

## Dual brand (one app)

- **ServiceSell** — buyer-prep checklist (QoE, concentration, owner dependence, fleet/safety, data room).
- **FinBridge** — three-year proforma + valuation band (not a price).
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

**YouTube URL (Sam fills this):** `_https://www.youtube.com/watch?v=YOUR_VIDEO_ID_`

## Links

- https://github.com/Cubiczan/servicesell-finbridge
- https://github.com/icohangar-ops/servicesell-finbridge
- https://anna.partners/developers
- https://www.cubiczan.com
- https://dorahacks.io/hackathon/2349/buidl

MIT. Illustrative composites only — no invented customers.
