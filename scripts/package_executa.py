#!/usr/bin/env python3
"""Package the Cubiczan CHP Python Executa for Anna binary distribution.

Builds a PyInstaller onefile binary, wraps it with archive-root manifest.json,
and writes the archives named in executas/servicesell-finbridge/executa.json:

  dist/cubiczan-chp-{version}-{platform}.tar.gz   (Unix)
  dist/cubiczan-chp-{version}-windows-x86_64.zip  (Windows)

linux-x86_64 is required for Anna Cloud Agent. Do not commit the archives;
download GHA Release assets into executas/servicesell-finbridge/dist/ before
`anna-app apps publish`.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import platform
import shutil
import subprocess
import sys
import tarfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXECUTA_DIR = ROOT / "executas" / "servicesell-finbridge"
ENTRYPOINT_NAME = "cubiczan-chp"
PLUGIN = "servicesell_finbridge_plugin.py"


def detect_platform() -> str:
    system = platform.system().lower()
    machine = platform.machine().lower()
    if system == "darwin":
        return "darwin-arm64" if machine in {"arm64", "aarch64"} else "darwin-x86_64"
    if system == "linux":
        if machine in {"x86_64", "amd64"}:
            return "linux-x86_64"
        if machine in {"aarch64", "arm64"}:
            return "linux-aarch64"
        raise SystemExit(f"unsupported linux arch: {machine}")
    if system == "windows":
        if machine in {"amd64", "x86_64"}:
            return "windows-x86_64"
        if machine in {"arm64", "aarch64"}:
            return "windows-arm64"
        raise SystemExit(f"unsupported windows arch: {machine}")
    raise SystemExit(f"unsupported OS: {system}")


def executa_version() -> str:
    meta = json.loads((EXECUTA_DIR / "executa.json").read_text(encoding="utf-8"))
    return str(meta["version"])


def add_data_arg() -> str:
    sep = ";" if os.name == "nt" else ":"
    return f"data{sep}data"


def pyinstaller_cmd(binary_name: str) -> list[str]:
    return [
        sys.executable,
        "-m",
        "PyInstaller",
        "--onefile",
        "--clean",
        "--noupx",
        "--noconfirm",
        "--name",
        binary_name,
        "--add-data",
        add_data_arg(),
        "--hidden-import",
        "engine",
        PLUGIN,
    ]


def write_archive_manifest(staging: Path, version: str, platform_key: str) -> None:
    entry = f"{ENTRYPOINT_NAME}.exe" if platform_key.startswith("windows-") else ENTRYPOINT_NAME
    payload = {
        "name": ENTRYPOINT_NAME,
        "version": version,
        "runtime": {
            "binary": {
                "entrypoint": {
                    "default": ENTRYPOINT_NAME,
                    "windows-x86_64": f"{ENTRYPOINT_NAME}.exe",
                    "windows-arm64": f"{ENTRYPOINT_NAME}.exe",
                },
                "permissions": {entry: "0o755"},
            }
        },
    }
    (staging / "manifest.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def package(platform_key: str, skip_smoke: bool) -> Path:
    version = executa_version()
    dist_dir = EXECUTA_DIR / "dist"
    dist_dir.mkdir(parents=True, exist_ok=True)
    is_windows = platform_key.startswith("windows-")
    binary_name = f"{ENTRYPOINT_NAME}.exe" if is_windows else ENTRYPOINT_NAME

    print(f"building {ENTRYPOINT_NAME} {version} for {platform_key}", flush=True)
    subprocess.run(pyinstaller_cmd(ENTRYPOINT_NAME), cwd=EXECUTA_DIR, check=True)

    built = EXECUTA_DIR / "dist" / binary_name
    if not built.is_file():
        # PyInstaller on Windows may still emit without .exe in some configs.
        alt = EXECUTA_DIR / "dist" / ENTRYPOINT_NAME
        if alt.is_file():
            built = alt
            binary_name = ENTRYPOINT_NAME
        else:
            raise SystemExit(f"pyinstaller did not emit {built}")

    if not skip_smoke and not is_windows:
        describe = subprocess.run(
            [str(built)],
            input='{"jsonrpc":"2.0","method":"describe","id":1}\n',
            capture_output=True,
            text=True,
            check=False,
        )
        line = (describe.stdout or "").strip().splitlines()
        if not line:
            print(f"::warning::describe smoke test produced no stdout: {describe.stderr}", flush=True)
        else:
            payload = json.loads(line[0])
            name = payload.get("result", {}).get("name")
            print(f"describe name={name}", flush=True)

    staging = EXECUTA_DIR / "build" / "archive" / platform_key
    if staging.exists():
        shutil.rmtree(staging)
    staging.mkdir(parents=True)
    shutil.copy2(built, staging / binary_name)
    write_archive_manifest(staging, version, platform_key)

    if is_windows:
        asset = dist_dir / f"{ENTRYPOINT_NAME}-{version}-{platform_key}.zip"
        with zipfile.ZipFile(asset, "w", compression=zipfile.ZIP_DEFLATED) as zf:
            for item in staging.iterdir():
                zf.write(item, arcname=item.name)
    else:
        asset = dist_dir / f"{ENTRYPOINT_NAME}-{version}-{platform_key}.tar.gz"
        with tarfile.open(asset, "w:gz") as tf:
            for item in staging.iterdir():
                tf.add(item, arcname=item.name)

    checksum = asset.with_suffix(asset.suffix + ".sha256") if asset.suffix == ".gz" else Path(str(asset) + ".sha256")
    if asset.name.endswith(".tar.gz"):
        checksum = Path(str(asset) + ".sha256")
    checksum.write_text(f"{sha256_file(asset)}  {asset.name}\n", encoding="utf-8")
    print(f"wrote {asset.relative_to(ROOT)} ({asset.stat().st_size} bytes)", flush=True)
    print(f"wrote {checksum.relative_to(ROOT)}", flush=True)
    return asset


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--platform", default="", help="Anna platform key, e.g. linux-x86_64")
    parser.add_argument("--skip-smoke", action="store_true")
    args = parser.parse_args()
    platform_key = args.platform or detect_platform()
    package(platform_key, skip_smoke=args.skip_smoke)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
