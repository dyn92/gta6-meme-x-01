// Entry program for the gta6-meme-x-01 bounty (Node 22, stdlib only).
//
// What it does, in plain terms:
//   1. Read POST.json from the repository root (next to this file).
//   2. Make sure the "url" inside it is a real X post address:
//      https://x.com/<handle>/status/<numeric id> — nothing else counts.
//   3. Copy that file into the output directory the house reads from
//      (MAKEFUN_OUTPUT_DIR, default "out"), creating the directory if needed.
//   4. Fail loudly (non-zero exit) if anything is off, so a bad entry is
//      never submitted silently.
//
// The post itself is the entry; the house reads it straight from X.
// This program only proves the address we hand in is well-formed.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve the repo root from this file's own location, so the program works
// no matter which directory it is started from.
const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "POST.json");

// The output directory comes from the environment; "out" is the default
// the kit's README uses.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
const targetPath = join(outputDir, "POST.json");

function fail(message) {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

// 1. Read and parse POST.json. A missing file or broken JSON is fatal.
let raw;
try {
  raw = readFileSync(sourcePath, "utf8");
} catch {
  fail(`cannot read ${sourcePath}`);
}
let post;
try {
  post = JSON.parse(raw);
} catch {
  fail("POST.json is not valid JSON");
}
if (typeof post !== "object" || post === null || Array.isArray(post)) {
  fail("POST.json must be a JSON object");
}
if (typeof post.url !== "string" || post.url.length === 0) {
  fail('POST.json must contain a "url" string');
}

// 2. Validate the URL shape. URL parsing alone is not enough: a link to
//    any other site, or to an X page that is not a single status, must fail.
//    - scheme must be https
//    - host must be exactly x.com (no subdomains, no twitter.com aliases)
//    - path must be /<handle>/status/<digits> — handle is any non-empty
//      segment without a slash, id is digits only
//    - a trailing query or fragment is tolerated and ignored by the check
let parsed;
try {
  parsed = new URL(post.url);
} catch {
  fail(`not a parseable URL: ${post.url}`);
}
const parts = parsed.pathname.split("/").filter(Boolean);
const handleOk = parts.length === 3 && parts[0].length > 0;
const statusOk = parts[1] === "status" && /^\d+$/.test(parts[2] ?? "");
if (parsed.protocol !== "https:" || parsed.hostname !== "x.com" || !handleOk || !statusOk) {
  fail(
    `url must look like https://x.com/<handle>/status/<id>, got: ${post.url}`,
  );
}

// 3. Hand the file on, byte for byte, into the output directory.
mkdirSync(outputDir, { recursive: true });
writeFileSync(targetPath, raw, "utf8");
console.log(`main.ts: wrote ${targetPath} (${post.url})`);
