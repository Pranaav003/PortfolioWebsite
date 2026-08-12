/* Deterministic quality gate for the variant HTML files.
 * Run: node variants/validate.mjs [file...]   (defaults to the 3 variants)
 * Exit 0 if all files pass every hard check, 1 otherwise. */
import { readFileSync, existsSync } from "node:fs";

const files = process.argv.slice(2);
const targets = files.length
  ? files
  : ["variants/variant-neon.html", "variants/variant-editorial.html", "variants/variant-cyber.html"];

const count = (s, re) => (s.match(re) || []).length;

/** @returns {{name:string, ok:boolean, detail:string, hard:boolean}[]} */
function checks(html) {
  const projectNums = new Set((html.match(/data-project=["']?(\d{3})/g) || []).map((m) => m.slice(-3)));
  const scriptOpen = count(html, /<script\b/gi), scriptClose = count(html, /<\/script>/gi);
  const styleOpen = count(html, /<style\b/gi), styleClose = count(html, /<\/style>/gi);
  return [
    ["<html lang> present", /<html[^>]*\blang=/i.test(html), "", true],
    ["viewport meta", /name=["']viewport["']/i.test(html), "", true],
    ["exactly one <h1>", count(html, /<h1\b/gi) === 1, `found ${count(html, /<h1\b/gi)}`, true],
    ['<main id="main">', /<main[^>]*\bid=["']main["']/i.test(html), "", true],
    ["data-neural canvas", /data-neural/.test(html), "", true],
    ["data-open-palette trigger", /data-open-palette/.test(html), "", true],
    ["data-split headline", /data-split/.test(html), "", true],
    ["≥6 data-count metrics", count(html, /data-count=/g) >= 6, `found ${count(html, /data-count=/g)}`, true],
    ["all 6 projects (001-006) wired", ["001","002","003","004","005","006"].every((n) => projectNums.has(n)), `found ${[...projectNums].sort().join(",")}`, true],
    ["≥6 data-reveal elements", count(html, /data-reveal/g) >= 6, `found ${count(html, /data-reveal/g)}`, true],
    ["loads assets/content.js", /assets\/content\.js/.test(html), "", true],
    ["loads assets/engine.js", /assets\/engine\.js/.test(html), "", true],
    ["loads GSAP from CDN", /gsap.*\.min\.js/i.test(html), "", true],
    ["ScrollTrigger loaded", /ScrollTrigger(\.min)?\.js/i.test(html), "", false],
    ["calls PortfolioEngine.mount", /PortfolioEngine\.mount/.test(html), "", true],
    ["adds html.js class early", /classList\.add\(['"]js['"]\)/.test(html), "", true],
    ["html.js reveal scope in CSS", /html\.js\s+\[data-reveal\]|html\.js\[data-reveal\]/.test(html), "put hidden state under html.js", true],
    ["prefers-reduced-motion media query", /prefers-reduced-motion/.test(html), "", true],
    ["does NOT use SplitText", !/SplitText/.test(html), "SplitText is paid; hand-roll", true],
    ["balanced <script> tags", scriptOpen === scriptClose, `${scriptOpen} open / ${scriptClose} close`, true],
    ["balanced <style> tags", styleOpen === styleClose, `${styleOpen} open / ${styleClose} close`, true],
    ["substantial page (>10KB)", html.length > 10240, `${(html.length / 1024).toFixed(1)}KB`, true],
    ["images use alt attrs", count(html, /<img\b/gi) === 0 || /<img[^>]*\balt=/i.test(html), "", false],
  ].map(([name, ok, detail, hard]) => ({ name, ok, detail: detail || "", hard }));
}

let anyHardFail = false;
for (const f of targets) {
  console.log("\n=== " + f + " ===");
  if (!existsSync(f)) { console.log("  ✗ MISSING FILE"); anyHardFail = true; continue; }
  const html = readFileSync(f, "utf8");
  let hardFail = 0, softFail = 0;
  for (const c of checks(html)) {
    const mark = c.ok ? "✓" : c.hard ? "✗" : "⚠";
    console.log(`  ${mark} ${c.name}${c.detail ? "  (" + c.detail + ")" : ""}`);
    if (!c.ok && c.hard) hardFail++;
    if (!c.ok && !c.hard) softFail++;
  }
  console.log(`  → ${hardFail} hard fail(s), ${softFail} soft warning(s)`);
  if (hardFail) anyHardFail = true;
}
console.log("\n" + (anyHardFail ? "RESULT: FAIL (hard checks)" : "RESULT: PASS"));
process.exit(anyHardFail ? 1 : 0);
