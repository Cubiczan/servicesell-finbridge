"""Cubiczan CHP Executa — propose, challenge, lock, export."""

from __future__ import annotations

import json
import sys

from engine import (
    export_summary,
    generate_workup,
    ingest,
    list_scenarios,
    lock_consensus,
)

MANIFEST = {
    "name": "tool-dev-servicesell-finbridge",
    "display_name": "Cubiczan CHP Workup",
    "version": "0.1.0",
    "description": "Shared ServiceSell + FinBridge tools: ingest, workup, CHP lock, export.",
    "tools": [
        {
            "name": "ping",
            "description": "Smoke-test method.",
            "parameters": {"type": "object", "properties": {}, "additionalProperties": False},
        },
        {
            "name": "list_scenarios",
            "description": "List illustrative composite scenarios (not customers).",
            "parameters": {"type": "object", "properties": {}, "additionalProperties": False},
        },
        {
            "name": "ingest_scenario",
            "description": "Load a composite or operator-entered scenario for a brand skin.",
            "parameters": {
                "type": "object",
                "properties": {
                    "brand": {"type": "string", "enum": ["servicesell", "finbridge"]},
                    "scenario_id": {"type": "string"},
                    "overrides": {"type": "object"},
                },
                "required": ["brand"],
                "additionalProperties": False,
            },
        },
        {
            "name": "generate_workup",
            "description": "Build a provenance-tagged proforma or buyer-prep workup.",
            "parameters": {
                "type": "object",
                "properties": {
                    "brand": {"type": "string", "enum": ["servicesell", "finbridge"]},
                    "scenario": {"type": "object"},
                },
                "required": ["brand", "scenario"],
                "additionalProperties": False,
            },
        },
        {
            "name": "lock_consensus",
            "description": "Apply human approve/reject reviews and lock CHP consensus.",
            "parameters": {
                "type": "object",
                "properties": {
                    "workup": {"type": "object"},
                    "reviews": {"type": "array", "items": {"type": "object"}},
                },
                "required": ["workup"],
                "additionalProperties": False,
            },
        },
        {
            "name": "export_summary",
            "description": "Export markdown + JSON of locked claims only.",
            "parameters": {
                "type": "object",
                "properties": {"workup": {"type": "object"}},
                "required": ["workup"],
                "additionalProperties": False,
            },
        },
    ],
}


def invoke(method: str, args: dict) -> dict:
    if method == "ping":
        return {"success": True, "data": {"pong": True, "app": "servicesell-finbridge"}}
    if method == "list_scenarios":
        return {"success": True, "data": list_scenarios()}
    if method == "ingest_scenario":
        return {
            "success": True,
            "data": ingest(args.get("brand"), args.get("scenario_id"), args.get("overrides")),
        }
    if method == "generate_workup":
        return {"success": True, "data": generate_workup(args["brand"], args.get("scenario") or {})}
    if method == "lock_consensus":
        return {"success": True, "data": lock_consensus(args.get("workup") or {}, args.get("reviews") or [])}
    if method == "export_summary":
        return {"success": True, "data": export_summary(args.get("workup") or {})}
    return {"success": False, "error": f"unknown method: {method}"}


def main() -> None:
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        req = json.loads(line)
        try:
            method = req.get("method")
            if method == "describe":
                result = MANIFEST
            elif method == "health":
                result = {"status": "ready"}
            elif method == "invoke":
                params = req.get("params") or {}
                result = invoke(params.get("tool"), params.get("arguments") or {})
            else:
                raise ValueError(f"unknown rpc: {method}")
            sys.stdout.write(json.dumps({"jsonrpc": "2.0", "id": req.get("id"), "result": result}) + "\n")
        except Exception as exc:  # noqa: BLE001
            sys.stdout.write(
                json.dumps(
                    {
                        "jsonrpc": "2.0",
                        "id": req.get("id"),
                        "error": {"code": -32603, "message": str(exc)},
                    }
                )
                + "\n"
            )
        sys.stdout.flush()


if __name__ == "__main__":
    main()
