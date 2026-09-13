import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const OUT = path.resolve("docs/media");
const URL = process.env.DEMO_URL || "http://127.0.0.1:43173/";
const CHROME = process.env.CHROME || "/usr/local/bin/google-chrome";

fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function shot(page, name, { y = 0 } = {}) {
  const dest = path.join(OUT, name);
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await sleep(350);
  await page.screenshot({ path: dest, fullPage: false, type: "png" });
  console.log("wrote", dest);
}

async function clickTestId(page, id) {
  await page.waitForSelector(`[data-testid="${id}"]`, { timeout: 15000 });
  await page.click(`[data-testid="${id}"]`);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--window-size=1440,900"],
  defaultViewport: { width: 1440, height: 920, deviceScaleFactor: 1 },
});

const page = await browser.newPage();
page.setDefaultTimeout(20000);
await page.goto(URL, { waitUntil: "networkidle0" });
await page.waitForSelector('[data-testid="enter-servicesell"]');
await shot(page, "01-brand-gate.png");

await clickTestId(page, "enter-servicesell");
await page.waitForSelector('[data-testid="generate-workup"]');
await shot(page, "02-servicesell-ingest.png");

await clickTestId(page, "generate-workup");
await page.waitForFunction(() => document.body.innerText.includes("Proposed pack") || document.body.innerText.includes("Agent deployment"));
await sleep(400);
await shot(page, "03-servicesell-workup.png", { y: 0 });

await clickTestId(page, "toggle-challenge");
await page.waitForFunction(() => document.body.innerText.includes("Challenge board") || document.body.innerText.includes("Claims under dissent"));
await sleep(300);
await shot(page, "04-servicesell-challenge.png");

await clickTestId(page, "goto-review");
await page.waitForSelector('[data-testid="approve-all"]');
await shot(page, "05-servicesell-review.png");

await clickTestId(page, "approve-all");
await sleep(200);
await clickTestId(page, "lock-consensus");
await page.waitForFunction(() => document.body.innerText.includes("Locked / approved") || document.body.innerText.includes("Agent deployment summary"));
await sleep(400);
await shot(page, "06-servicesell-export.png", { y: 0 });

await clickTestId(page, "switch-finbridge");
await page.waitForSelector('[data-testid="generate-workup"]');
await sleep(300);
await shot(page, "07-finbridge-ingest.png");

await clickTestId(page, "generate-workup");
await page.waitForFunction(() => document.body.innerText.includes("Forward operating picture") || document.body.innerText.includes("Proposed pack"));
await sleep(400);
await shot(page, "08-finbridge-proforma.png");

await clickTestId(page, "toggle-challenge");
await sleep(300);
await shot(page, "09-finbridge-challenge.png");

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await clickTestId(page, "switch-servicesell");
await page.waitForSelector('[data-testid="generate-workup"]');
await sleep(300);
await shot(page, "10-mobile-servicesell.png", { y: 420 });
await clickTestId(page, "switch-finbridge");
await page.waitForSelector('[data-testid="generate-workup"]');
await sleep(300);
await shot(page, "11-mobile-finbridge.png", { y: 420 });

await browser.close();
console.log("capture complete");
