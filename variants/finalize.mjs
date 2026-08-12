/* Finalize a chosen variant into a self-contained, deploy-ready index.html.
 * - Inlines assets/content.js + assets/engine.js (no external app deps; GSAP stays CDN).
 * - Rewrites /public/X asset paths to /X (Vite copies public/ to the dist root).
 * Usage: node variants/finalize.mjs <variant-file> [outfile]
 *        node variants/finalize.mjs variants/variant-neon.html index.html
 */
import { readFileSync, writeFileSync } from "node:fs";

const src = process.argv[2] || "variants/variant-neon.html";
const out = process.argv[3] || "index.html";

let html = readFileSync(src, "utf8");
const content = readFileSync("variants/assets/content.js", "utf8");
const engine = readFileSync("variants/assets/engine.js", "utf8");

// Inline the two external app scripts (order preserved: content before engine before mount).
const before = html;
html = html.replace(
  '<script src="assets/content.js"></script>',
  "<script>\n/* ── inlined: variants/assets/content.js ── */\n" + content + "\n</script>"
);
html = html.replace(
  '<script src="assets/engine.js"></script>',
  "<script>\n/* ── inlined: variants/assets/engine.js ── */\n" + engine + "\n</script>"
);
if (html === before) { console.error("ERROR: could not find the assets/*.js script tags to inline."); process.exit(1); }
if (/src="assets\//.test(html)) { console.error("ERROR: an assets/* reference remains after inlining."); process.exit(1); }

// Vite serves public/ at the root → strip the /public prefix from asset URLs.
const publicRefs = (html.match(/\/public\//g) || []).length;
html = html.replace(/\/public\//g, "/");

writeFileSync(out, html);
console.log(`Wrote ${out}`);
console.log(`  inlined content.js (${content.length}B) + engine.js (${engine.length}B)`);
console.log(`  rewrote ${publicRefs} /public/ asset paths → /`);
console.log(`  final size: ${(html.length / 1024).toFixed(1)}KB`);
