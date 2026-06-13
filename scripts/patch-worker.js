#!/usr/bin/env node
// Patches _worker.js to serve _next/static/* directly from the ASSETS binding
// instead of routing through the Next.js server (which can't serve them in CF Pages).

const fs = require("fs");
const path = require("path");

const workerPath = path.join(__dirname, "../.open-next/assets/_worker.js");
let src = fs.readFileSync(workerPath, "utf8");

const PATCH_MARKER = "/* static-asset-patch */";
if (src.includes(PATCH_MARKER)) {
  console.log("patch-worker: already patched, skipping");
  process.exit(0);
}

const ANCHOR = "const url = new URL(request.url);";
const PATCH = `${ANCHOR}
            ${PATCH_MARKER}
            if (
              url.pathname.startsWith("/_next/static/") ||
              url.pathname.startsWith("/_next/media/")
            ) {
              return env.ASSETS.fetch(request);
            }`;

if (!src.includes(ANCHOR)) {
  console.error("patch-worker: anchor string not found in _worker.js — aborting");
  process.exit(1);
}

fs.writeFileSync(workerPath, src.replace(ANCHOR, PATCH));
console.log("patch-worker: patched _worker.js to serve _next/static/* from ASSETS");
