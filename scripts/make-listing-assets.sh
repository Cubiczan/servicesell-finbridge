#!/usr/bin/env bash
# Copy/refresh Anna Listing-tab assets into docs/listing/ and artifacts/.
# Console still needs a manual upload (Listing is not the version manifest).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MEDIA="$ROOT/docs/media"
LIST="$ROOT/docs/listing"
ART="$ROOT/artifacts"

mkdir -p "$LIST" "$ART"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required to build the square listing logo" >&2
  exit 1
fi

# Square logo: pad the 1280×720 thumbnail into a square so both brand names
# stay visible. Anna Console Upload logo centre-crops to square and resizes
# to 256×256 WebP — a square source avoids clipping ServiceSell | FinBridge.
ffmpeg -y -hide_banner -loglevel error \
  -i "$MEDIA/thumbnail.png" \
  -vf "pad=iw:iw:0:(oh-ih)/2:color=0x10110F,scale=1080:1080" \
  "$LIST/logo.png"

cp -f "$MEDIA/thumbnail.png" "$LIST/cover.png"
cp -f "$MEDIA/01-brand-gate.png" "$LIST/01-brand-gate.png"
cp -f "$MEDIA/03-servicesell-workup.png" "$LIST/02-servicesell-workup.png"
cp -f "$MEDIA/08-finbridge-proforma.png" "$LIST/03-finbridge-proforma.png"
cp -f "$MEDIA/04-servicesell-challenge.png" "$LIST/04-servicesell-challenge.png"
cp -f "$MEDIA/05-servicesell-review.png" "$LIST/05-human-lock.png"
cp -f "$MEDIA/10-mobile-servicesell.png" "$LIST/06-mobile-servicesell.png"

cp -f "$LIST/logo.png" "$ART/logo.png"
cp -f "$LIST/cover.png" "$ART/thumbnail.png"
cp -f "$LIST/01-brand-gate.png" "$ART/screenshot_brand_gate.png"
cp -f "$LIST/02-servicesell-workup.png" "$ART/screenshot_servicesell_workup.png"
cp -f "$LIST/03-finbridge-proforma.png" "$ART/screenshot_finbridge_proforma.png"
cp -f "$LIST/04-servicesell-challenge.png" "$ART/screenshot_servicesell_challenge.png"

cat > "$LIST/README.md" <<'EOF'
# Anna Listing assets (App 276)

These files are what the Anna Developer Console **Listing** tab expects. Listing
fields live on the `AnnaApp` row, **not** in `manifest.json`. Publish does not
upload them automatically — Sam must click **Upload logo** and paste/add
screenshots in the Console.

Official constraints ([Listing Fields](https://anna.partners/developers/apps/app-listing)):

| Field | Constraint |
| --- | --- |
| Logo | jpeg/png/webp/gif, max **2 MB**. Server centre-crops to square, resizes to **256×256** WebP |
| Screenshots | **max 6** URLs |
| Cover | optional URL, ≤500 chars |

## Upload these

| Console field | File | Notes |
| --- | --- | --- |
| **Upload logo** | `logo.png` (1080×1080 PNG) | Product mark: ServiceSell \| FinBridge split |
| Cover (optional) | `cover.png` (1280×720) | Same as YouTube thumbnail |
| Screenshot 1 | `01-brand-gate.png` | Dual-skin picker |
| Screenshot 2 | `02-servicesell-workup.png` | ServiceSell agent workup |
| Screenshot 3 | `03-finbridge-proforma.png` | FinBridge quote-to-cash |
| Screenshot 4 | `04-servicesell-challenge.png` | CHP challenge board |
| Screenshot 5 | `05-human-lock.png` | Human lock |
| Screenshot 6 | `06-mobile-servicesell.png` | Mobile form factor |

Regenerate: `npm run listing:assets` (requires ffmpeg).

Do not invent traction in listing copy. Brand spelling is **Cubiczan**.
EOF

echo "listing assets ready in $LIST"
ls -lh "$LIST"
