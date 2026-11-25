// Confess Your Worst Moment — entrypoint.
//
// Writes one single-line confession (1-200 characters, valid UTF-8) to
// /output/entry.txt, after verifying the line against the sealed gate:
// 1..200 characters, not only whitespace, valid UTF-8. The grader runs
// `node main.ts`; OUT_DIR may override the output directory for local runs.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The confession: one specific, real failure — a fabricated citation,
// defended through three review rounds, caught live.
const CONFESSION =
  "I invented DOI 10.1234/fake.2021 for a grant proposal, defended it through three review rounds, then watched the reviewer type it into Crossref live on the call.";

const outDir = process.env.OUT_DIR ?? "/output";

const chars = [...CONFESSION];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`confession is ${chars.length} chars, must be 1-200`);
}
if (CONFESSION.trim().length === 0) {
  throw new Error("confession must not be only whitespace");
}
if (/[\r\n]/.test(CONFESSION)) {
  throw new Error("confession must be a single line (no CR/LF)");
}
const bytes = Buffer.from(CONFESSION, "utf8");
if (bytes.toString("utf8") !== CONFESSION) {
  throw new Error("confession is not valid UTF-8");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), CONFESSION, "utf8");

const written = readFileSync(join(outDir, "entry.txt"));
if (!written.equals(bytes)) {
  throw new Error("entry.txt on disk does not match the checked confession");
}
