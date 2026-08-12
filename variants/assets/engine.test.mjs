/* Unit tests for the pure logic in engine.js + content integrity.
 * Run: node variants/assets/engine.test.mjs
 * No DOM required — engine.js only touches the DOM inside init* functions. */
import assert from "node:assert/strict";

await import("./content.js");
await import("./engine.js");
const E = globalThis.PortfolioEngine;
const P = globalThis.PORTFOLIO;

let pass = 0;
const t = (name, fn) => { fn(); pass++; console.log("  ✓ " + name); };

console.log("engine pure-logic + content tests");

// ── content integrity ───────────────────────────────────────────────────
t("content: 6 projects, 6 skills, 3 experience, 2 education, 6 contacts", () => {
  assert.equal(P.projects.length, 6);
  assert.equal(P.skills.length, 6);
  assert.equal(P.experience.length, 3);
  assert.equal(P.education.length, 2);
  assert.equal(P.contact.length, 6);
});
t("content: live-reconciled facts (IBM RAS Intern, Purdue GPA 3.5, résumé, links)", () => {
  assert.ok(P.experience.some((e) => e.company === "IBM" && /RAS Intern/.test(e.role)));
  assert.ok(P.education.some((e) => /Purdue/.test(e.school) && /3\.5/.test(e.degree)));
  assert.ok(/Pranaav_Iyer_CV\.pdf/.test(P.resume));
  assert.ok(P.contact.some((c) => c.label === "Résumé"));
  P.projects.forEach((p) => assert.ok(Array.isArray(p.links) && p.links.length >= 1, p.title + " needs a link"));
  assert.ok(P.projects[0].links.some((l) => /doi\.org/.test(l.href)), "ASL should carry the IEEE paper DOI");
});
t("content: metrics are grounded (all present, ASL latency = 150)", () => {
  assert.equal(P.metrics.length, 6);
  const asl = P.metrics.find((m) => m.label.includes("latency"));
  assert.equal(asl.value, 150);
  assert.equal(asl.prefix, "<");
});
t("content: every project has title/desc/tech; no empty tech arrays", () => {
  P.projects.forEach((p) => { assert.ok(p.title && p.desc && Array.isArray(p.tech) && p.tech.length); });
});

// ── buildCommands ─────────────────────────────────────────────────────────
const cmds = E.buildCommands(P);
t("buildCommands: one nav command per section", () => {
  P.sections.forEach((s) => assert.ok(cmds.find((c) => c.id === "go-" + s.id), "missing go-" + s.id));
});
t("buildCommands: includes resume, help, whoami, sudo-hire, clear", () => {
  ["resume", "help", "whoami", "sudo-hire", "clear"].forEach((id) =>
    assert.ok(cmds.find((c) => c.id === id), "missing " + id));
});
t("buildCommands: nav commands carry an anchor target", () => {
  const go = cmds.find((c) => c.id === "go-projects");
  assert.equal(go.target, "#projects");
  assert.equal(go.kind, "nav");
});

// ── filterCommands ──────────────────────────────────────────────────────────
t("filterCommands: empty query returns full registry, in order", () => {
  const r = E.filterCommands(cmds, "");
  assert.equal(r.length, cmds.length);
  assert.equal(r[0].id, cmds[0].id);
});
t("filterCommands: 'help' ranks the help command first", () => {
  assert.equal(E.filterCommands(cmds, "help")[0].id, "help");
});
t("filterCommands: 'sudo' surfaces sudo-hire", () => {
  assert.ok(E.filterCommands(cmds, "sudo").some((c) => c.id === "sudo-hire"));
});
t("filterCommands: 'projects' surfaces the projects nav command", () => {
  assert.ok(E.filterCommands(cmds, "projects").some((c) => c.id === "go-projects"));
});
t("filterCommands: gibberish returns nothing", () => {
  assert.equal(E.filterCommands(cmds, "qzxwvk").length, 0);
});

// ── isSubsequence ─────────────────────────────────────────────────────────
t("isSubsequence: positive + negative", () => {
  assert.equal(E.isSubsequence("abc", "axbxxc"), true);
  assert.equal(E.isSubsequence("abc", "acb"), false);
  assert.equal(E.isSubsequence("", "anything"), true);
});

// ── neural field ────────────────────────────────────────────────────────────
t("genNodes: count + bounds honored, seeded rng is deterministic", () => {
  let seed = 42;
  const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const a = E.genNodes(15, 200, 100, rng);
  assert.equal(a.length, 15);
  a.forEach((n) => { assert.ok(n.x >= 0 && n.x <= 200 && n.y >= 0 && n.y <= 100); });
  seed = 42;
  const b = E.genNodes(15, 200, 100, rng);
  assert.deepEqual(a.map((n) => n.x), b.map((n) => n.x));
});
t("connectNodes: connects near, skips far, alpha in (0,1]", () => {
  const nodes = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 500, y: 500 }];
  const edges = E.connectNodes(nodes, 50);
  assert.equal(edges.length, 1);
  assert.equal(edges[0].a, 0); assert.equal(edges[0].b, 1);
  assert.ok(edges[0].alpha > 0 && edges[0].alpha <= 1);
});
t("nodeCountFor: clamps to [22,90]", () => {
  assert.equal(E.nodeCountFor(10, 10), 22);
  assert.equal(E.nodeCountFor(10000, 10000), 90);
  const mid = E.nodeCountFor(1440, 900);
  assert.ok(mid >= 22 && mid <= 90);
});

// ── formatCount + easing ────────────────────────────────────────────────────
t("formatCount: prefix/suffix/decimals", () => {
  assert.equal(E.formatCount(150, { prefix: "<", suffix: "ms" }), "<150ms");
  assert.equal(E.formatCount(4.0, { decimals: 1 }), "4.0");
  assert.equal(E.formatCount(3.72, { decimals: 1 }), "3.7");
  assert.equal(E.formatCount(6, { suffix: "+" }), "6+");
  assert.equal(E.formatCount(15, { prefix: "+", suffix: "%" }), "+15%");
});
t("easeOutExpo: pinned at 0 and 1, monotonic-ish", () => {
  assert.equal(E.easeOutExpo(0), 0);
  assert.equal(E.easeOutExpo(1), 1);
  assert.ok(E.easeOutExpo(0.5) > 0.5);
});
t("clamp", () => {
  assert.equal(E.clamp(5, 0, 10), 5);
  assert.equal(E.clamp(-1, 0, 10), 0);
  assert.equal(E.clamp(99, 0, 10), 10);
});

// ── scroll lock reference counting (F5) ────────────────────────────────────
t("scroll-lock: lockScroll/unlockScroll are exported", () => {
  assert.equal(typeof E.lockScroll, "function", "lockScroll must be exported");
  assert.equal(typeof E.unlockScroll, "function", "unlockScroll must be exported");
  assert.equal(typeof E.resetScrollLocks, "function", "resetScrollLocks must be exported");
});

t("scroll-lock: reference counts correctly — double lock needs double unlock", () => {
  // Simulate the stuck-lock scenario: palette opens (lock=1) then drawer also opens (lock=2)
  // Then palette closes (lock=1 — scroll still locked!)
  // drawer closes (lock=0 — scroll unlocked)
  E.resetScrollLocks();
  const overflow = [];
  // Patch document.body for this test
  const origBody = globalThis.document && globalThis.document.body;
  if (!globalThis.document) globalThis.document = {};
  if (!globalThis.document.body) globalThis.document.body = { style: {} };
  globalThis.document.body.style.overflow = "";

  E.lockScroll();   // palette open  → scrollLocks = 1
  assert.equal(globalThis.document.body.style.overflow, "hidden", "should lock after first lock");
  E.lockScroll();   // drawer open   → scrollLocks = 2
  assert.equal(globalThis.document.body.style.overflow, "hidden", "should stay locked after second lock");
  E.unlockScroll(); // palette close → scrollLocks = 1
  assert.equal(globalThis.document.body.style.overflow, "hidden", "should stay locked until fully balanced");
  E.unlockScroll(); // drawer close  → scrollLocks = 0
  assert.equal(globalThis.document.body.style.overflow, "", "should unlock when balanced");
  E.resetScrollLocks();
});

t("scroll-lock: extra unlock does not go below 0", () => {
  E.resetScrollLocks();
  if (!globalThis.document) globalThis.document = {};
  if (!globalThis.document.body) globalThis.document.body = { style: {} };
  globalThis.document.body.style.overflow = "";

  E.unlockScroll(); // call unlock when already 0 — should not crash or go negative
  assert.equal(globalThis.document.body.style.overflow, "", "extra unlock should not corrupt state");
  E.lockScroll();
  assert.equal(globalThis.document.body.style.overflow, "hidden", "lock still works after spurious unlock");
  E.resetScrollLocks();
});

// ── escapeHTML for palette print safety (F6) ────────────────────────────────
t("escapeHTML: is exported and escapes XSS chars", () => {
  assert.equal(typeof E.escapeHTML, "function", "escapeHTML must be exported");
  assert.equal(E.escapeHTML("<script>alert(1)</script>"), "&lt;script&gt;alert(1)&lt;/script&gt;");
  assert.equal(E.escapeHTML("a & b"), "a &amp; b");
  assert.equal(E.escapeHTML('say "hi"'), "say &quot;hi&quot;");
  assert.equal(E.escapeHTML("it's"), "it&#39;s");
  assert.equal(E.escapeHTML("safe text"), "safe text");
});

// ── content: IBM status is current (F7) ─────────────────────────────────────
t("content: IBM status is current (not Incoming)", () => {
  const ibm = P.experience.find((e) => e.company === "IBM");
  assert.ok(ibm, "IBM experience entry must exist");
  assert.ok(!/incoming/i.test(ibm.year), "IBM year must not say Incoming — internship started May 2026");
  assert.ok(!/incoming/i.test(ibm.desc), "IBM desc must not say 'Joining IBM as an incoming' after start date");
  // Identity/about status should also be current
  assert.ok(!/incoming/i.test(P.identity.status), "identity.status must not say Incoming");
  assert.ok(!/incoming/i.test(P.about.details.find(d => d.label === "Status").value), "about.details Status must not say Incoming");
});

// ── content: resume path should NOT have /public/ prefix (F8) ───────────────
t("content: resume path does not start with /public/", () => {
  assert.ok(!P.resume.startsWith("/public/"), "P.resume should not have /public/ prefix — use a root-relative path");
  const cvContact = P.contact.find((c) => c.label === "Résumé");
  assert.ok(cvContact, "Résumé contact entry must exist");
  assert.ok(!cvContact.href.startsWith("/public/"), "Résumé contact href should not have /public/ prefix");
});

console.log(`\n${pass} tests passed.`);
