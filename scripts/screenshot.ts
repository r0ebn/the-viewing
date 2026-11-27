/**
 * Screenshots: photograph the built outputs for a visual check.
 * Run after `npm run build`.
 *
 *   npm run screenshots
 *
 * Writes docs/screenshots/email.png, page.png and document.png. The
 * social card needs no photograph — the build renders it as a PNG and
 * copies it to docs/screenshots/canvas.png itself.
 *
 * The fact sheet is photographed from its print HTML laid out on an A4
 * page (the PDF itself is checked separately with pdfinfo).
 */
import { chromium } from "playwright";
import { access, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url);
const SHOTS = new URL("../docs/screenshots/", import.meta.url);

/** Full Chromium from Playwright's cache, used when the headless shell isn't installed. */
const CACHED_CHROMIUM = join(homedir(), ".cache/ms-playwright/chromium-1255/chrome-linux64/chrome");

async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch {
    await access(CACHED_CHROMIUM);
    console.log(`Headless shell missing; launching cached Chromium at ${CACHED_CHROMIUM}`);
    return await chromium.launch({ executablePath: CACHED_CHROMIUM });
  }
}

const SHOTS_LIST = [
  { file: "out/email.html", name: "email.png", width: 700 },
  { file: "out/page.html", name: "page.png", width: 1200 },
  { file: "out/page.html", name: "page-mobile.png", width: 375 },
  { file: "out/fact-sheet.html", name: "document.png", width: 794 },
] as const;

async function main() {
  await mkdir(SHOTS, { recursive: true });
  const browser = await launchBrowser();
  for (const shot of SHOTS_LIST) {
    const page = await browser.newPage({ viewport: { width: shot.width, height: 1000 } });
    const url = new URL(shot.file, ROOT).href;
    try {
      await page.goto(url, { waitUntil: "networkidle" });
    } catch {
      await page.goto(url, { waitUntil: "load" });
    }
    await page.waitForTimeout(600);
    await page.screenshot({ path: new URL(shot.name, SHOTS).pathname, fullPage: true });
    console.log(`Wrote docs/screenshots/${shot.name}`);
    await page.close();
  }
  await browser.close();
  console.log("Done. Inspect the PNGs in docs/screenshots/.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
