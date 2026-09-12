# Design

## Spine

```
brand pick → ingest → generate_workup → challenge → human review → lock → export
```

ServiceSell and FinBridge are CSS + copy + which panel is primary (checklist vs proforma). Claim ids, tool names, and lock rules are identical.

## Engine

JSON scenarios + rules live beside the Python Executa so the published tool stays self-contained. The TypeScript UI imports the same JSON and mirrors the formulas so standalone preview works without spawning stdio.

## Host

`connectHost()` uses `AnnaAppRuntime` when the Anna iframe SDK is present. Otherwise it mocks `tools.invoke` / `storage` / `window.set_title` against the TS engine.

## Provenance

Each claim records `source`, optional `formula`, `inputs`, `confidence`, and attached challenges. Export includes only approved/locked claims.
