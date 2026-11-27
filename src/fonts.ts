/**
 * Font files for the PDF and image engines.
 *
 * renderPdf and renderImage never fetch: every font the Document or the
 * Canvas uses must arrive as bytes (TTF, OTF or WOFF — not WOFF2). The
 * files come from the @fontsource packages in devDependencies, so a clean
 * checkout gets them with `npm install`. One entry per family / weight /
 * style actually used.
 */
import { readFile } from "node:fs/promises";

export interface FontFile {
  family: string;
  src: Buffer;
  weight?: number;
  style?: "normal" | "italic";
}

const FONTSOURCE = new URL("../node_modules/@fontsource/", import.meta.url);

const SPECS: Array<{ family: string; file: string; weight: number; style?: "normal" | "italic" }> = [
  { family: "Fraunces", file: "fraunces/files/fraunces-latin-400-normal.woff", weight: 400 },
  { family: "Fraunces", file: "fraunces/files/fraunces-latin-500-normal.woff", weight: 500 },
  { family: "Fraunces", file: "fraunces/files/fraunces-latin-600-normal.woff", weight: 600 },
  { family: "Fraunces", file: "fraunces/files/fraunces-latin-700-normal.woff", weight: 700 },
  { family: "Fraunces", file: "fraunces/files/fraunces-latin-500-italic.woff", weight: 500, style: "italic" },
  { family: "Fraunces", file: "fraunces/files/fraunces-latin-600-italic.woff", weight: 600, style: "italic" },
  { family: "Inter", file: "inter/files/inter-latin-400-normal.woff", weight: 400 },
  { family: "Inter", file: "inter/files/inter-latin-500-normal.woff", weight: 500 },
  { family: "Inter", file: "inter/files/inter-latin-600-normal.woff", weight: 600 },
  { family: "Inter", file: "inter/files/inter-latin-700-normal.woff", weight: 700 },
];

export async function loadFontFiles(): Promise<FontFile[]> {
  const out: FontFile[] = [];
  for (const spec of SPECS) {
    const src = await readFile(new URL(spec.file, FONTSOURCE));
    out.push({ family: spec.family, src, weight: spec.weight, style: spec.style });
  }
  return out;
}
