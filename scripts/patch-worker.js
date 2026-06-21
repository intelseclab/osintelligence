#!/usr/bin/env node
// Patches _worker.js to serve static public files directly from the ASSETS binding
// instead of routing through the Next.js server.
//
// Without this patch:
// - fetch('/tools/search-engines.md') hits the Next.js /tools/[id] route → returns HTML
// - The markdown parser receives HTML → parses 0 tools → empty tools page
//
// Fix: serve _next/static/*, /tools/*.md, and other static extensions from ASSETS directly.

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
            {
              const p = url.pathname;
              const STATIC_EXTENSIONS = /\\.(md|txt|ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|otf|eot|pdf|json|xml|webmanifest)$/i;
              if (
                p.startsWith("/_next/static/") ||
                p.startsWith("/_next/media/") ||
                STATIC_EXTENSIONS.test(p)
              ) {
                const assetResp = await env.ASSETS.fetch(request);
                if (assetResp.status !== 404) return assetResp;
              }
            }`;

if (!src.includes(ANCHOR)) {
  console.error("patch-worker: anchor string not found in _worker.js — aborting");
  process.exit(1);
}

fs.writeFileSync(workerPath, src.replace(ANCHOR, PATCH));
console.log("patch-worker: patched _worker.js to serve static files from ASSETS");
