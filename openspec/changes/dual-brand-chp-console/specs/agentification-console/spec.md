# Capability: agentification-console

## Requirements

### Dual brand, one product

The app SHALL expose ServiceSell and FinBridge as skins of one tool surface. Switching brand SHALL change theme and copy and SHALL NOT change tool ids.

### Provenance

Every emitted numeric claim SHALL include a source of `ingested`, `derived`, `assumption`, or `benchmark`. Derived claims SHALL include a formula string.

### CHP lock

The engine SHALL refuse to lock while any claim remains `proposed` or `challenged`. A human approve or reject is required for every claim.

### No invented customers

Bundled scenarios SHALL be labeled as illustrative composites and SHALL NOT be presented as named customers.

### Offline demo

A local preview SHALL run the full ingest → workup → lock → export path without Anna cloud credentials.
