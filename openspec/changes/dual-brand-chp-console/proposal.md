# Change: Dual-brand CHP console

## Why

Cubiczan needs one Anna App that can wear ServiceSell and FinBridge without forking the product. Hackathon judges and operators should see a structured propose → challenge → lock flow, not two chatbots.

## What changes

- Anna App scaffold (`app.json`, `manifest.json`, UI bundle, Executa, SKILL.md)
- Brand skins via `#servicesell` / `#finbridge` plus an in-app switcher
- Shared deterministic engine for ingest, workup, challenge, lock, export
- Claim provenance on every number
- Offline demo that does not require Anna cloud credentials

## Out of scope

- Live quality-of-earnings against real books
- Named customer case studies
- Payments, auth, or a second component library
- Publishing to the Anna App Store (operator does that with a PAT)
