# Anna App 276 — resubmit after review rejection

Review rejected ServiceSell × FinBridge for two reasons:

1. Listing had no product logo or product screenshots.
2. After install/open, Cloud Agent reported:
   `executa 'tool-cubiczan-cubiczan-chp-yexs252k' is not deployed on the selected agent`

That minted id must **not** be committed. Publish resolves `bundled:cubiczan-chp` → the platform `tool_id`. Cloud Agent is Linux, so the **linux-x86_64** binary must exist.

Docs followed: [Build on Anna 101](https://forum.anna.partners/t/build-on-anna-101/228) ch. 6–7, [Bundling Executas](https://anna.partners/developers/apps/app-bundling), [Binary Distribution](https://anna.partners/developers/tools/executa-binary), [Listing Fields](https://anna.partners/developers/apps/app-listing), [anna-executa-examples](https://github.com/whtcjdtc2007/anna-executa-examples).

## What this branch changed

| Piece | Before | After |
| --- | --- | --- |
| `manifest.json` `required_executas` | `tool-dev-servicesell-finbridge` | `bundled:cubiczan-chp` + `bundled:chp-workflow` |
| `ui.host_api.tools` | hardcoded local tool_id | `required:bundled:cubiczan-chp` |
| `executa.json` | local tool_id only | `distribution.profiles.binary.binary_artifacts` including **linux-x86_64** |
| Frontend | handle lookup (kept) | no inline script (Anna CSP); `anna-tool-ids.js` loaded first |
| GHA | none | `.github/workflows/build-executa-binaries.yml` |
| Listing files | in `docs/media/` but never Console-uploaded | `docs/listing/` pack + this checklist |

Local/dev `tool_id` stays `tool-dev-servicesell-finbridge` in `executa.json` / `pyproject.toml` so `anna-app dev` can spawn the Python plugin. Production ids come from publish-generated `bundle/anna-tool-ids.js`.

## Sam: resubmit checklist

Do these in order. Do **not** paste `tool-cubiczan-cubiczan-chp-yexs252k` (or any other minted id) into the repo.

### 1. Merge this PR and rebuild binaries

1. Merge to `main`.
2. GitHub → **Actions** → **Build Executa binaries** → **Run workflow** on `main`.
3. Wait until **linux-x86_64** is green (Cloud Agent). Also confirm darwin-arm64, darwin-x86_64, windows-x86_64.
4. Download the four archives (and `.sha256` if present) from the workflow artifacts or the GitHub Release.

Expected names (version `0.1.1`):

```
cubiczan-chp-0.1.1-darwin-arm64.tar.gz
cubiczan-chp-0.1.1-darwin-x86_64.tar.gz
cubiczan-chp-0.1.1-linux-x86_64.tar.gz
cubiczan-chp-0.1.1-windows-x86_64.zip
```

### 2. Place archives where `executa.json` points

From the repo root:

```bash
mkdir -p executas/servicesell-finbridge/dist
# copy the four archives into that directory
ls executas/servicesell-finbridge/dist/cubiczan-chp-0.1.1-*
```

Paths must match `distribution.profiles.binary.binary_artifacts.*.path` (`{version}` → `0.1.1`).

### 3. Publish a new version (does not store-release by itself)

```bash
npm i
npx anna-app login --host https://anna.partners   # if needed
npx anna-app validate --strict
npx anna-app apps publish
```

`apps publish` = `apps push` + `apps cut <version>`. It publishes bundled Executas, uploads `binary_artifacts` (including linux-x86_64) to Anna storage, substitutes `bundled:*` handles, and writes `bundle/anna-tool-ids.js`. It does **not** put the app on the Store.

If Visibility on the Executa edit page flips back to `private`, set it to `public` or `app_bundled` before saving.

### 4. Upload listing logo + screenshots in Developer Console

Listing is **not** the manifest. Open App **276** → **Listing** tab:

1. **Upload logo** → `docs/listing/logo.png` (1080×1080 PNG, &lt;2 MB).
2. Add up to 6 screenshots (one URL/file per line). Use:

   - `docs/listing/01-brand-gate.png`
   - `docs/listing/02-servicesell-workup.png`
   - `docs/listing/03-finbridge-proforma.png`
   - `docs/listing/04-servicesell-challenge.png`
   - `docs/listing/05-human-lock.png`
   - `docs/listing/06-mobile-servicesell.png`

3. Confirm name, tagline, and description still match Cubiczan / mid-market ICP. Do not invent traction.

See `docs/listing/README.md`.

### 5. Retest on **Anna Cloud Agent** (Linux)

Install/open the cut version on Cloud Agent and confirm:

- No `is not deployed on the selected agent` error.
- Brand gate opens; `#servicesell` / `#finbridge` switch skins.
- Ingest → propose → challenge → lock still works (tool invoke).

Laptop-only Python/`anna-app dev` is **not** sufficient for this review item.

### 6. Resubmit review

```bash
npx anna-app apps submit-review
```

Or Developer Console → Versions → Submit for review (pins the newest cut as the review candidate).

## Local smoke (optional, this machine)

```bash
python3 -m pip install pyinstaller
python3 scripts/package_executa.py --platform linux-x86_64
printf '%s\n' '{"jsonrpc":"2.0","method":"describe","id":1}' | ./executas/servicesell-finbridge/dist/cubiczan-chp
```
