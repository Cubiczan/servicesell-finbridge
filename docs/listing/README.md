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
