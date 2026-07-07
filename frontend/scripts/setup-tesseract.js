#!/usr/bin/env node
// Copies tesseract.js worker + core files from node_modules into public/tesseract/
// so they are served as static assets and satisfy a strict worker-src 'self' CSP.
const { cpSync, mkdirSync, existsSync } = require("fs");
const { join } = require("path");

const root = join(__dirname, "..");
const dest = join(root, "public", "tesseract");

mkdirSync(dest, { recursive: true });

const workerSrc = join(root, "node_modules", "tesseract.js", "dist", "worker.min.js");
const coreSrc = join(root, "node_modules", "tesseract.js-core");

if (!existsSync(workerSrc)) {
  console.error("tesseract.js worker not found — run yarn install first");
  process.exit(1);
}

cpSync(workerSrc, join(dest, "worker.min.js"));
cpSync(coreSrc, dest, { recursive: true, filter: (src) => !src.endsWith(".wasm") });

console.log("tesseract assets copied to public/tesseract/");
