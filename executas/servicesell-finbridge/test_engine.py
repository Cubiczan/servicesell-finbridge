#!/usr/bin/env python3
"""Offline parity checks for the Python CHP engine."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from engine import export_summary, generate_workup, get_scenario, lock_consensus  # noqa: E402


def main() -> int:
    service = generate_workup("servicesell", get_scenario("servicesell"))
    finance = generate_workup("finbridge", get_scenario("finbridge"))
    assert service["claims"], "ServiceSell workup produced no claims"
    assert all(claim.get("source") for claim in service["claims"])
    assert service["scenario"]["disclaimer"].lower().startswith("not a customer")
    assert [c["id"] for c in service["claims"]] == [c["id"] for c in finance["claims"]]
    assert len(finance["proforma"]) == 3

    blocked = lock_consensus(service, [])
    assert blocked["lock"]["locked"] is False

    reviews = [{"claimId": claim["id"], "decision": "approved"} for claim in service["claims"]]
    locked = lock_consensus(service, reviews)
    assert locked["lock"]["locked"] is True
    pack = export_summary(locked)
    assert "Locked / approved claims" in pack["markdown"]
    print("python engine ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
