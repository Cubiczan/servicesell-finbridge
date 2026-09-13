# Design

## Offer

Cubiczan is the house brand (products + CHP). Impact Quadrant is the forward-deploy services company. ServiceSell and FinBridge are skins, not products:

| Skin | Wedge |
| --- | --- |
| ServiceSell | Agents in dispatch, after-hours booking, job-cost on existing shop software |
| FinBridge | Agents on quote, job-cost, and cash beyond the bookkeeper, with a human lock |

## Spine (unchanged)

```
brand pick → ingest shop book → generate_workup → challenge → human review → lock → export
```

Claim ids may be retargeted from valuation/sale-readiness labels to ops labels. Tool names and lock rules stay identical.

## Demo books

Illustrative composites only. Revenue in **$20M–$500M**. No named customers.

## Media

Regenerate `docs/media/thumbnail.png` via `scripts/make-media.sh`. Hero text is the ICP and CHP, not the hackathon listing.
