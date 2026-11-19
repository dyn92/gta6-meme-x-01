// gta6-meme-x-01 entry program (Node 22, standard library only).
//
// Job: take POST.json from the repository root, check that the URL inside it
// really points at one X post, and hand the file on to the output directory
// where the gate reads it. The post itself is the entry — the house reads it
// from X and judges its first picture and text — so this program only has to
// make sure the address it hands over is well formed.
//
// A valid address looks like https://x.com/<handle>/status/<digits>:
//   - scheme must be https (nothing else is a post address on X),
//   - host must be exactly x.com,
//   - path must be /<handle>/status/<id> where the id is digits only.
// Anything else is rejected with a non-zero exit so a bad POST.json can
// never slip through as a silent copy.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Where the repository lives and where the gate expects the file.
const repoDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The shape an X post address must have: handle, then /status/, then digits.
const POST_URL = /^\/([^/]+)\/status\/([0-9]+)$/;

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

// Read the post file as text and parse it. A missing file or broken JSON
// means there is no post address to hand over at all.
let raw: string;
try {
  raw = readFileSync(join(repoDir, 'POST.json'), 'utf8');
} catch (err) {
  fail(`cannot read POST.json from ${repoDir}: ${(err as Error).message}`);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch (err) {
  fail(`POST.json is not valid JSON: ${(err as Error).message}`);
}

// The file must hold one object with a url string in it.
if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
  fail('POST.json must be a JSON object');
}
const urlText = (parsed as { url?: unknown }).url;
if (typeof urlText !== 'string' || urlText.length === 0) {
  fail('POST.json must hold a "url" string');
}

// Break the address apart and check each piece in turn.
let address: URL;
try {
  address = new URL(urlText);
} catch {
  fail(`not a URL: ${urlText}`);
}
if (address.protocol !== 'https:') {
  fail(`scheme must be https, got ${address.protocol}`);
}
if (address.hostname !== 'x.com') {
  fail(`host must be x.com, got ${address.hostname}`);
}
const pathMatch = POST_URL.exec(address.pathname);
if (pathMatch === null) {
  fail(`path must be /<handle>/status/<id>, got ${address.pathname}`);
}
const [, handle, postId] = pathMatch;
if (handle.length === 0 || postId.length === 0) {
  fail('handle and post id must not be empty');
}

// Everything checks out: copy the file verbatim to the output directory.
mkdirSync(outDir, { recursive: true });
try {
  writeFileSync(join(outDir, 'POST.json'), raw);
} catch (err) {
  fail(`cannot write POST.json to ${outDir}: ${(err as Error).message}`);
}
