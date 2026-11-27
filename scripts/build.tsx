/**
 * Build: check everything, then render.
 *
 *   npm run build
 *
 * `validate()` is the gate: any error stops the build before a single
 * file is written. The email is validated with the
 * `@hyper-elements/email-clients` plugin as well, and a preview of it
 * is written per client (classic Outlook, Gmail, Apple Mail).
 *
 * Outputs in out/:
 *   email.html / email.txt     the confirmation email and its text twin
 *   page.html                  the listing page
 *   fact-sheet.html / .pdf     the printed A4 fact sheet
 *   just-listed.png / .svg     the social card
 *   clients/*.html             the email as each client draws it
 *
 * Fonts for the PDF and the card are local @fontsource files
 * (src/fonts.ts); nothing is fetched while building.
 */
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { createElement } from "react";
import { ElementsError, formatDiagnostics, render, validate } from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";
import { renderImage } from "@hyper-elements/react/image";
import { emailClients, renderInEmailClients } from "@hyper-elements/email-clients";
import ViewingEmail from "../src/email";
import ListingPage from "../src/page";
import FactSheet from "../src/document";
import JustListedCard from "../src/canvas";
import { loadFontFiles } from "../src/fonts";

const OUT = new URL("../out/", import.meta.url);

function report(name: string, diagnostics: readonly { severity: string }[], formatted: string) {
  const errors = diagnostics.filter((d) => d.severity === "error").length;
  const warnings = diagnostics.filter((d) => d.severity === "warning").length;
  console.log(`\n== ${name}: ${errors} error(s), ${warnings} warning(s)`);
  if (formatted.trim()) console.log(formatted);
  return errors;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(new URL("clients/", OUT), { recursive: true });

  const clientsPlugin = await emailClients();

  const emailEl = createElement(ViewingEmail);
  const pageEl = createElement(ListingPage);
  const documentEl = createElement(FactSheet);
  const canvasEl = createElement(JustListedCard);

  let errors = 0;
  const vEmail = validate(emailEl, { plugins: [clientsPlugin] });
  errors += report("validate email (+ email-clients)", vEmail.diagnostics, formatDiagnostics(vEmail.diagnostics));
  const vPage = validate(pageEl);
  errors += report("validate page", vPage.diagnostics, formatDiagnostics(vPage.diagnostics));
  const vDoc = validate(documentEl);
  errors += report("validate document", vDoc.diagnostics, formatDiagnostics(vDoc.diagnostics));
  const vCanvas = validate(canvasEl);
  errors += report("validate canvas", vCanvas.diagnostics, formatDiagnostics(vCanvas.diagnostics));
  if (errors > 0) {
    console.error(`\nBuild failed: ${errors} validation error(s).`);
    process.exitCode = 1;
    return;
  }

  const email = await render(emailEl, { plugins: [clientsPlugin] });
  report("render email", email.diagnostics, formatDiagnostics(email.diagnostics));
  await writeFile(new URL("email.html", OUT), email.html);
  await writeFile(new URL("email.txt", OUT), email.text);
  console.log("Wrote out/email.html, out/email.txt");

  const previews = await renderInEmailClients(emailEl, {
    emailClients: ["outlook", "gmail", "apple-mail"],
    fonts: "inline",
  });
  for (const preview of previews.previews) {
    await writeFile(new URL(`clients/${preview.filename}`, OUT), preview.html);
    console.log(`Wrote out/clients/${preview.filename}`);
  }
  for (const skipped of previews.skipped) {
    console.log(`Skipped client preview: ${skipped.client} — ${skipped.reason}`);
  }
  report("email-clients previews", previews.diagnostics, formatDiagnostics(previews.diagnostics));

  const page = await render(pageEl);
  report("render page", page.diagnostics, formatDiagnostics(page.diagnostics));
  await writeFile(new URL("page.html", OUT), page.html);
  console.log("Wrote out/page.html");

  const document = await render(documentEl);
  report("render document", document.diagnostics, formatDiagnostics(document.diagnostics));
  await writeFile(new URL("fact-sheet.html", OUT), document.html);
  console.log("Wrote out/fact-sheet.html");

  const fonts = await loadFontFiles();
  console.log(`\nLoaded ${fonts.length} font files for the PDF and image engines`);
  const pdf = await renderPdf(documentEl, { fonts });
  report("renderPdf fact sheet", pdf.diagnostics, formatDiagnostics(pdf.diagnostics));
  await writeFile(new URL("fact-sheet.pdf", OUT), pdf.pdf);
  console.log(`Wrote out/fact-sheet.pdf (${pdf.pdf.length} bytes)`);

  const png = await renderImage(canvasEl, { fonts });
  report("renderImage just-listed (png)", png.diagnostics, formatDiagnostics(png.diagnostics));
  await writeFile(new URL("just-listed.png", OUT), png.image);
  console.log(`Wrote out/just-listed.png (${png.width}x${png.height}, ${png.image.length} bytes)`);

  const svg = await renderImage(canvasEl, { fonts, format: "svg" });
  report("renderImage just-listed (svg)", svg.diagnostics, formatDiagnostics(svg.diagnostics));
  await writeFile(new URL("just-listed.svg", OUT), svg.image);
  console.log(`Wrote out/just-listed.svg (${svg.image.length} bytes)`);

  // out/ is gitignored; the README's card screenshot lives in docs/.
  await mkdir(new URL("../docs/screenshots/", import.meta.url), { recursive: true });
  await copyFile(new URL("just-listed.png", OUT), new URL("../docs/screenshots/canvas.png", import.meta.url));
  console.log("Copied the card to docs/screenshots/canvas.png");

  console.log("\nBuild complete.");
}

main().catch((error) => {
  if (error instanceof ElementsError) {
    console.error(formatDiagnostics(error.diagnostics));
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
