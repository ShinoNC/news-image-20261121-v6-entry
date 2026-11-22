// news-image-20261121 v6 — Saturday 21 November 2026: 30 stories, 7 regions.
// The entry image is a deterministic front page composed in code (PIL):
// masthead + huge serif date + number strip + region bar + 3 equal heroes
// + 10 bannered panels + dark world map with region-coloured pins + a
// 17-item ALSO list + a DATE CHECK box + footer. This program copies the
// shipped entry.png byte-for-byte to the output directory.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const dst = join(outDir, "entry.png");

if (!existsSync(src)) {
  console.error("entry.png missing next to main.ts");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);

// Verify the copy is byte-identical to the shipped image, and that the
// PNG signature survived (first 8 bytes: 89 50 4E 47 0D 0A 1A 0A).
const a = readFileSync(src);
const b = readFileSync(dst);
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!a.equals(b) || !b.subarray(0, 8).equals(PNG_SIG)) {
  console.error("entry.png copy mismatch or bad PNG signature");
  process.exit(1);
}
console.log(`wrote ${dst} (${b.length} bytes)`);
