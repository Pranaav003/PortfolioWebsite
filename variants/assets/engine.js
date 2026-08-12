/* ============================================================================
 * engine.js — Shared behavior engine for every portfolio variant.
 *
 * Design contract
 * ---------------
 * Variants own LOOK (layout + CSS). The engine owns BEHAVIOR so all three
 * variants act identically and correctly. The engine injects its own DOM for
 * the ⌘K palette, project drawer, custom cursor and scroll-progress bar, all
 * themed through `--pf-*` CSS custom properties that a variant sets on :root.
 *
 * Variant hooks (attributes the engine looks for):
 *   [data-open-palette]        → element(s) that open the ⌘K palette on click
 *   [data-project="001"]       → a project card; opens the drawer for that num
 *   [data-count="150"]         → number that counts up on scroll
 *      + [data-prefix] [data-suffix] [data-decimals]
 *   [data-reveal]              → element revealed on scroll (staggered per parent)
 *      + [data-reveal-delay]   → optional extra ms delay
 *   [data-neural]              → <canvas> that hosts the neural-net field
 *   [data-split]               → element whose text is split into per-char spans
 *   a[href^="#"]               → smooth-scrolled to target (offset for fixed nav)
 *
 * Correctness invariants (enforced here so no variant can regress them):
 *   - prefers-reduced-motion: every animation degrades to its final state.
 *   - no-JS: engine never hides content; reveal/countup only ADD motion.
 *   - GSAP optional: reveals/parallax use GSAP if present, else IntersectionObserver.
 *   - focus trap + Esc + aria on every overlay; scroll lock while open.
 *   - custom cursor only on (pointer:fine); disabled on touch.
 * ==========================================================================*/
(function (root) {
  "use strict";

  // ── Environment flags ──────────────────────────────────────────────────
  const hasDOM = typeof document !== "undefined";
  const mm = (q) => (typeof matchMedia === "function" ? matchMedia(q) : { matches: false, addEventListener() {} });
  const prefersReduced = () => mm("(prefers-reduced-motion: reduce)").matches;
  const finePointer = () => mm("(pointer: fine)").matches;
  const hasGSAP = () => typeof root.gsap !== "undefined";
  const hasScrollTrigger = () => hasGSAP() && typeof root.ScrollTrigger !== "undefined";

  // ── Easing (pure) ────────────────────────────────────────────────────────
  const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // ══════════════════════════════════════════════════════════════════════
  //  PURE LOGIC — unit-tested in engine.test.mjs (no DOM required)
  // ══════════════════════════════════════════════════════════════════════

  /** Build the ⌘K command registry from portfolio content. Pure + testable. */
  function buildCommands(P) {
    const cmds = [];
    (P.sections || []).forEach((s) =>
      cmds.push({
        id: "go-" + s.id,
        title: "Go to " + s.label,
        hint: s.n,
        keywords: ["nav", "goto", "section", s.id, s.label.toLowerCase()],
        kind: "nav",
        target: "#" + s.id,
      })
    );
    if (P.resume)
      cmds.push({ id: "resume", title: "Open résumé (PDF)", hint: "↵", keywords: ["cv", "resume", "pdf", "download"], kind: "external", target: P.resume });
    (P.contact || []).forEach((c) =>
      cmds.push({
        id: c.cmd || c.label.toLowerCase(),
        title: c.label + " — " + c.value,
        hint: c.external ? "↗" : "↵",
        keywords: [c.label.toLowerCase(), c.value.toLowerCase(), "contact", "reach"],
        kind: c.external ? "external" : "link",
        target: c.href,
      })
    );
    cmds.push({ id: "whoami", title: "whoami", hint: "$", keywords: ["who", "bio", "about", "identity"], kind: "print",
      output: (P.identity.name + " — " + P.identity.tagline.join(" · ") + ". " + P.identity.blurb) });
    cmds.push({ id: "help", title: "help — list commands", hint: "?", keywords: ["help", "commands", "?"], kind: "help" });
    cmds.push({ id: "sudo-hire", title: "sudo hire pranaav", hint: "⚡", keywords: ["hire", "sudo", "job", "recruit", "offer"], kind: "hire" });
    cmds.push({ id: "theme", title: "Toggle accent theme", hint: "◐", keywords: ["theme", "accent", "color", "dark", "light"], kind: "theme" });
    cmds.push({ id: "matrix", title: "Enter the matrix", hint: "▓", keywords: ["matrix", "rain", "easter", "fun"], kind: "matrix" });
    cmds.push({ id: "clear", title: "clear output", hint: "⌫", keywords: ["clear", "reset", "cls"], kind: "clear" });
    return cmds;
  }

  /**
   * Filter + rank commands for a query. Pure + testable.
   * Empty query → all commands in registry order. Otherwise a lightweight
   * subsequence/substring match ranked by match quality.
   */
  function filterCommands(cmds, query) {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return cmds.slice();
    const scored = [];
    for (const c of cmds) {
      const hay = (c.title + " " + (c.keywords || []).join(" ")).toLowerCase();
      let score = -1;
      if (hay.startsWith(q)) score = 100;
      else if (c.title.toLowerCase().startsWith(q)) score = 90;
      else if (hay.includes(q)) score = 60 - hay.indexOf(q) * 0.01;
      else if (isSubsequence(q, hay)) score = 20;
      if (score >= 0) scored.push({ c, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.c);
  }

  function isSubsequence(needle, hay) {
    let i = 0;
    for (let j = 0; j < hay.length && i < needle.length; j++) if (hay[j] === needle[i]) i++;
    return i === needle.length;
  }

  /**
   * Deterministic-when-seeded node field for the neural hero. Pure + testable.
   * rng defaults to Math.random; tests pass a seeded rng for determinism.
   */
  function genNodes(count, w, h, rng) {
    rng = rng || Math.random;
    const nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: rng() * w,
        y: rng() * h,
        vx: (rng() - 0.5) * 0.25,
        vy: (rng() - 0.5) * 0.25,
        r: 1 + rng() * 1.6,
      });
    }
    return nodes;
  }

  /** Edges between nodes closer than maxDist. Pure + testable. */
  function connectNodes(nodes, maxDist) {
    const edges = [];
    const md2 = maxDist * maxDist;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < md2) edges.push({ a: i, b: j, alpha: 1 - Math.sqrt(d2) / maxDist });
      }
    }
    return edges;
  }

  /** Node count scaled to viewport area, capped for performance. Pure. */
  function nodeCountFor(w, h) {
    return clamp(Math.round((w * h) / 22000), 22, 90);
  }

  /** Format a counter value. Pure + testable. */
  function formatCount(value, { prefix = "", suffix = "", decimals = 0 } = {}) {
    const n = decimals > 0 ? Number(value).toFixed(decimals) : Math.round(value).toString();
    return prefix + n + suffix;
  }

  // ══════════════════════════════════════════════════════════════════════
  //  DOM — only runs in the browser
  // ══════════════════════════════════════════════════════════════════════

  const listeners = []; // teardown registry (used by tests / hot reload)
  function on(el, ev, fn, opts) { el.addEventListener(ev, fn, opts); listeners.push(() => el.removeEventListener(ev, fn, opts)); }

  // ── Base stylesheet (structural only; colors come from --pf-* on :root) ──
  function injectBaseCSS() {
    if (document.getElementById("pf-engine-css")) return;
    const css = `
    :root{
      --pf-accent: var(--accent, #c8ff00);
      --pf-bg: var(--bg, #0a0a0b);
      --pf-surface: var(--bg-elevated, #111113);
      --pf-fg: var(--fg, #e8e6e3);
      --pf-fg-dim: var(--fg-dim, #767472);
      --pf-border: var(--border, rgba(255,255,255,.08));
      --pf-mono: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
      --pf-display: var(--font-display, 'Syne', sans-serif);
      --pf-radius: 12px;
      --pf-ease: cubic-bezier(.16,1,.3,1);
    }
    /* Custom cursor */
    .pf-cursor-dot,.pf-cursor-ring{position:fixed;top:0;left:0;pointer-events:none;z-index:10000;border-radius:50%;transform:translate(-50%,-50%);will-change:transform}
    .pf-cursor-dot{width:8px;height:8px;background:var(--pf-accent);mix-blend-mode:difference;transition:width .3s,height .3s}
    .pf-cursor-ring{width:38px;height:38px;border:1px solid color-mix(in srgb,var(--pf-accent) 45%,transparent);transition:width .4s var(--pf-ease),height .4s var(--pf-ease),opacity .3s}
    .pf-cursor-dot.pf-hover{width:0;height:0}
    .pf-cursor-ring.pf-hover{width:66px;height:66px;border-color:var(--pf-accent)}
    body.pf-cursor-ready{cursor:none}
    body.pf-cursor-ready a,body.pf-cursor-ready button,body.pf-cursor-ready [data-project]{cursor:none}
    @media (hover:none),(pointer:coarse){.pf-cursor-dot,.pf-cursor-ring{display:none!important}body.pf-cursor-ready{cursor:auto}}
    /* Scroll progress */
    .pf-progress{position:fixed;top:0;left:0;height:2px;width:100%;background:var(--pf-accent);z-index:9999;transform:scaleX(0);transform-origin:left}
    /* Skip link */
    .pf-skip{position:fixed;left:12px;top:-60px;z-index:10002;background:var(--pf-accent);color:#000;padding:10px 16px;border-radius:6px;font:600 13px/1 var(--pf-mono);text-decoration:none;transition:top .2s}
    .pf-skip:focus{top:12px}
    /* Overlays (palette + drawer share the scrim) */
    .pf-scrim{position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;visibility:hidden;transition:opacity .28s var(--pf-ease),visibility .28s}
    .pf-scrim.pf-open{opacity:1;visibility:visible}
    /* ⌘K palette */
    .pf-palette{position:fixed;left:50%;top:14vh;transform:translate(-50%,-8px) scale(.98);width:min(640px,92vw);max-height:70vh;display:flex;flex-direction:column;
      background:var(--pf-surface);border:1px solid var(--pf-border);border-radius:var(--pf-radius);z-index:10002;opacity:0;visibility:hidden;overflow:hidden;
      box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 0 1px color-mix(in srgb,var(--pf-accent) 12%,transparent);transition:opacity .28s var(--pf-ease),transform .28s var(--pf-ease),visibility .28s}
    .pf-palette.pf-open{opacity:1;visibility:visible;transform:translate(-50%,0) scale(1)}
    .pf-palette-in{display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid var(--pf-border)}
    .pf-palette-in .pf-prompt{color:var(--pf-accent);font:600 15px/1 var(--pf-mono)}
    .pf-palette-in input{flex:1;background:none;border:none;outline:none;color:var(--pf-fg);font:400 15px/1.4 var(--pf-mono);caret-color:var(--pf-accent)}
    .pf-palette-in kbd{font:500 10px/1 var(--pf-mono);color:var(--pf-fg-dim);border:1px solid var(--pf-border);border-radius:4px;padding:4px 7px}
    .pf-list{list-style:none;margin:0;padding:8px;overflow-y:auto;overscroll-behavior:contain}
    .pf-list li{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:8px;cursor:pointer;color:var(--pf-fg)}
    .pf-list li .pf-i{width:22px;color:var(--pf-accent);font:500 12px/1 var(--pf-mono);text-align:center;flex-shrink:0}
    .pf-list li .pf-t{flex:1;font:400 14px/1.3 var(--pf-mono)}
    .pf-list li .pf-h{color:var(--pf-fg-dim);font:500 11px/1 var(--pf-mono)}
    .pf-list li[aria-selected="true"],.pf-list li:hover{background:color-mix(in srgb,var(--pf-accent) 12%,transparent);outline:1px solid color-mix(in srgb,var(--pf-accent) 30%,transparent)}
    .pf-out{padding:0 18px;color:var(--pf-fg-dim);font:400 12.5px/1.7 var(--pf-mono);max-height:34vh;overflow:auto}
    .pf-out:not(:empty){padding:14px 18px;border-top:1px solid var(--pf-border)}
    .pf-out .pf-line{white-space:pre-wrap}
    .pf-out .pf-ok{color:var(--pf-accent)}
    /* Project drawer */
    .pf-drawer{position:fixed;top:0;right:0;height:100%;width:min(560px,94vw);z-index:10002;background:var(--pf-surface);border-left:1px solid var(--pf-border);
      transform:translateX(102%);transition:transform .4s var(--pf-ease);overflow-y:auto;box-shadow:-30px 0 80px rgba(0,0,0,.5)}
    .pf-drawer.pf-open{transform:translateX(0)}
    .pf-drawer .pf-d-hd{position:sticky;top:0;background:var(--pf-surface);display:flex;justify-content:space-between;align-items:center;padding:20px 26px;border-bottom:1px solid var(--pf-border);z-index:1}
    .pf-drawer .pf-d-num{color:var(--pf-accent);font:500 12px/1 var(--pf-mono);letter-spacing:.15em}
    .pf-drawer .pf-d-close{background:none;border:1px solid var(--pf-border);color:var(--pf-fg);border-radius:8px;width:36px;height:36px;font-size:16px;cursor:pointer;transition:border-color .3s,color .3s}
    .pf-drawer .pf-d-close:hover{border-color:var(--pf-accent);color:var(--pf-accent)}
    .pf-drawer .pf-d-body{padding:26px 26px 60px}
    .pf-drawer .pf-d-img{width:100%;border-radius:10px;border:1px solid var(--pf-border);margin-bottom:24px;display:block}
    .pf-drawer h3{font:700 clamp(1.5rem,3vw,2.1rem)/1.1 var(--pf-display);color:var(--pf-fg);letter-spacing:-.02em;margin-bottom:8px}
    .pf-drawer .pf-d-tag{font:500 11px/1 var(--pf-mono);color:var(--pf-accent);letter-spacing:.12em;text-transform:uppercase;margin-bottom:20px}
    .pf-drawer .pf-d-desc{font:400 15px/1.75 var(--pf-mono,inherit);color:var(--pf-fg);opacity:.85;margin-bottom:26px}
    .pf-drawer .pf-d-tech{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:26px}
    .pf-drawer .pf-d-tech span{font:500 11px/1 var(--pf-mono);color:var(--pf-fg-dim);border:1px solid var(--pf-border);border-radius:100px;padding:6px 12px}
    .pf-drawer .pf-d-links{display:flex;gap:12px;flex-wrap:wrap}
    .pf-drawer .pf-d-links a{font:600 13px/1 var(--pf-mono);color:#000;background:var(--pf-accent);border-radius:8px;padding:12px 18px;text-decoration:none;transition:transform .2s var(--pf-ease)}
    .pf-drawer .pf-d-links a:hover{transform:translateY(-2px)}
    /* Easter eggs: toast + matrix rain */
    .pf-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(80px);z-index:10003;font:500 12px/1 var(--pf-mono);color:#000;background:var(--pf-accent);padding:12px 20px;border-radius:6px;opacity:0;transition:transform .5s var(--pf-ease),opacity .5s;white-space:nowrap;pointer-events:none;max-width:90vw;overflow:hidden;text-overflow:ellipsis}
    .pf-toast.pf-show{opacity:1;transform:translateX(-50%) translateY(0)}
    #pf-matrix{position:fixed;inset:0;z-index:9997;pointer-events:none;opacity:0;transition:opacity .5s}
    #pf-matrix.pf-on{opacity:.14}
    @media (prefers-reduced-motion:reduce){
      .pf-scrim,.pf-palette,.pf-drawer,.pf-cursor-dot,.pf-cursor-ring,.pf-toast{transition:none!important}
    }`;
    const el = document.createElement("style");
    el.id = "pf-engine-css";
    el.textContent = css;
    document.head.appendChild(el);
  }

  // ── Focus trap utility ───────────────────────────────────────────────────
  const FOCUSABLE = 'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    const f = [...container.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null || n === document.activeElement);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  let scrollLocks = 0;
  const lockScroll = () => { if (scrollLocks++ === 0) document.body.style.overflow = "hidden"; };
  const unlockScroll = () => { if (scrollLocks > 0 && --scrollLocks === 0) document.body.style.overflow = ""; };

  // ── Custom cursor ─────────────────────────────────────────────────────────
  function initCursor() {
    if (!finePointer()) return;
    const dot = document.createElement("div"); dot.className = "pf-cursor-dot"; dot.setAttribute("aria-hidden", "true");
    const ring = document.createElement("div"); ring.className = "pf-cursor-ring"; ring.setAttribute("aria-hidden", "true");
    document.body.append(dot, ring); document.body.classList.add("pf-cursor-ready");
    let mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0;
    on(document, "mousemove", (e) => { mx = e.clientX; my = e.clientY; });
    (function loop() {
      dx += (mx - dx) * 0.25; dy += (my - dy) * 0.25; rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      dot.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    const hoverSel = "a,button,[data-project],[data-open-palette],input,.pf-list li";
    on(document, "mouseover", (e) => { if (e.target.closest(hoverSel)) { dot.classList.add("pf-hover"); ring.classList.add("pf-hover"); } });
    on(document, "mouseout", (e) => { if (e.target.closest(hoverSel)) { dot.classList.remove("pf-hover"); ring.classList.remove("pf-hover"); } });
  }

  // ── Scroll progress ────────────────────────────────────────────────────────
  function initScrollProgress() {
    const bar = document.createElement("div"); bar.className = "pf-progress"; bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    let ticking = false;
    const upd = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? clamp(scrollY / h, 0, 1) : 0})`;
      ticking = false;
    };
    on(window, "scroll", () => { if (!ticking) { requestAnimationFrame(upd); ticking = true; } }, { passive: true });
    upd();
  }

  // ── Skip link ────────────────────────────────────────────────────────────
  function initSkipLink(mainSel) {
    if (document.querySelector(".pf-skip")) return;
    const a = document.createElement("a"); a.className = "pf-skip"; a.href = mainSel || "#main"; a.textContent = "Skip to content";
    document.body.insertBefore(a, document.body.firstChild);
  }

  // ── Smooth anchors ─────────────────────────────────────────────────────────
  function initSmoothAnchors(offset) {
    var off = typeof offset === "number" ? offset : 80;
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      on(a, "click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        const y = t.getBoundingClientRect().top + scrollY - off;
        scrollTo({ top: y, behavior: prefersReduced() ? "auto" : "smooth" });
      });
    });
  }

  // ── Scroll reveal (GSAP ScrollTrigger if present, else IO) ─────────────────
  function initReveal() {
    const els = [...document.querySelectorAll("[data-reveal]")];
    if (!els.length) return;
    if (prefersReduced()) { els.forEach((el) => el.classList.add("pf-revealed", "revealed")); return; }

    if (hasScrollTrigger()) {
      const groups = new Map();
      els.forEach((el) => {
        const p = el.parentElement; const n = groups.get(p) || 0; groups.set(p, n + 1);
        root.gsap.fromTo(el, { opacity: 0, y: 34 }, {
          opacity: 1, y: 0, duration: 0.7, ease: "expo.out", delay: (n * 60 + (+el.dataset.revealDelay || 0)) / 1000,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onStart: () => el.classList.add("pf-revealed", "revealed"),
        });
      });
      return;
    }
    // Fallback: IntersectionObserver + CSS classes (variant styles .pf-revealed)
    const groups = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const d = +en.target.dataset.revealDelay || 0;
        setTimeout(() => en.target.classList.add("pf-revealed", "revealed"), d);
        io.unobserve(en.target);
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => {
      const p = el.parentElement; const n = groups.get(p) || 0;
      el.dataset.revealDelay = String(n * 60 + (+el.dataset.revealDelay || 0)); groups.set(p, n + 1);
      io.observe(el);
    });
  }

  // ── Character split for headline stagger (SplitText is paid → hand-roll) ───
  function splitChars(el) {
    if (!el || el.dataset.pfSplit === "done") return;
    const text = el.textContent;
    el.textContent = "";
    el.setAttribute("aria-label", text);
    [...text].forEach((ch) => {
      const s = document.createElement("span");
      s.className = "pf-char";
      s.setAttribute("aria-hidden", "true");
      s.style.display = "inline-block";
      s.style.willChange = "transform,opacity";
      s.textContent = ch === " " ? " " : ch;
      el.appendChild(s);
    });
    el.dataset.pfSplit = "done";
    return el.querySelectorAll(".pf-char");
  }

  function initSplitReveal() {
    const targets = document.querySelectorAll("[data-split]");
    targets.forEach((el) => {
      const chars = splitChars(el);
      if (!chars) return;
      if (prefersReduced()) { chars.forEach((c) => { c.style.opacity = 1; c.style.transform = "none"; }); return; }
      if (hasGSAP()) {
        root.gsap.from(chars, { opacity: 0, yPercent: 110, rotateX: -40, duration: 0.7, stagger: 0.02, ease: "expo.out", delay: 0.1 });
      } else {
        chars.forEach((c, i) => {
          c.style.opacity = 0; c.style.transform = "translateY(90%)";
          c.style.transition = `opacity .6s var(--pf-ease) ${i * 20}ms, transform .7s var(--pf-ease) ${i * 20}ms`;
          requestAnimationFrame(() => requestAnimationFrame(() => { c.style.opacity = 1; c.style.transform = "translateY(0)"; }));
        });
      }
    });
  }

  // ── Count-up metrics ───────────────────────────────────────────────────────
  function initCountUp() {
    const els = [...document.querySelectorAll("[data-count]")];
    if (!els.length) return;
    const run = (el) => {
      const end = parseFloat(el.dataset.count);
      const opts = { prefix: el.dataset.prefix || "", suffix: el.dataset.suffix || "", decimals: +el.dataset.decimals || 0 };
      if (prefersReduced()) { el.textContent = formatCount(end, opts); return; }
      const dur = 1400; let t0 = null;
      const step = (ts) => {
        if (t0 === null) t0 = ts;
        const p = clamp((ts - t0) / dur, 0, 1);
        el.textContent = formatCount(end * easeOutExpo(p), opts);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = formatCount(end, opts);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.4 });
    els.forEach((el) => { el.textContent = formatCount(0, { prefix: el.dataset.prefix || "", suffix: el.dataset.suffix || "", decimals: +el.dataset.decimals || 0 }); io.observe(el); });
  }

  // ── Neural-net hero canvas ──────────────────────────────────────────────────
  function initNeuralHero() {
    const canvas = document.querySelector("[data-neural]");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let nodes = [], w = 0, h = 0, dpr = clamp(root.devicePixelRatio || 1, 1, 2), raf = 0, running = false;
    const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--pf-accent").trim() || "#c8ff00";
    const pointer = { x: -9999, y: -9999, active: false };
    const MAXD = 132;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = genNodes(nodeCountFor(w, h), w, h);
    }
    function hexA(hex, a) {
      hex = hex.replace("#", "");
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      const r = parseInt(hex.slice(0, 2), 16) || 200, g = parseInt(hex.slice(2, 4), 16) || 255, b = parseInt(hex.slice(4, 6), 16) || 0;
      return `rgba(${r},${g},${b},${a})`;
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const col = accent();
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        if (pointer.active) {
          const dx = n.x - pointer.x, dy = n.y - pointer.y, d = Math.hypot(dx, dy);
          if (d < 120 && d > 0.01) { n.x += (dx / d) * 0.6; n.y += (dy / d) * 0.6; }
        }
      }
      const edges = connectNodes(nodes, MAXD);
      for (const e of edges) {
        ctx.strokeStyle = hexA(col, e.alpha * 0.22);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(nodes[e.a].x, nodes[e.a].y); ctx.lineTo(nodes[e.b].x, nodes[e.b].y); ctx.stroke();
      }
      for (const n of nodes) {
        ctx.fillStyle = hexA(col, 0.5);
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!running && !prefersReduced() && !document.hidden) { running = true; frame(); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    resize();
    if (prefersReduced()) {
      // Draw a single static frame so the canvas isn't blank, then stay still.
      const edges = connectNodes(nodes, MAXD); const col = accent();
      edges.forEach((e) => { ctx.strokeStyle = hexA(col, e.alpha * 0.18); ctx.beginPath(); ctx.moveTo(nodes[e.a].x, nodes[e.a].y); ctx.lineTo(nodes[e.b].x, nodes[e.b].y); ctx.stroke(); });
      nodes.forEach((n) => { ctx.fillStyle = hexA(col, 0.45); ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill(); });
      return;
    }
    on(window, "resize", () => { dpr = clamp(root.devicePixelRatio || 1, 1, 2); resize(); });
    on(document, "visibilitychange", () => (document.hidden ? stop() : start()));
    if (finePointer()) {
      on(canvas, "mousemove", (e) => { const r = canvas.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.active = true; });
      on(canvas, "mouseleave", () => { pointer.active = false; pointer.x = pointer.y = -9999; });
    }
    // Only animate while the hero is on screen.
    const io = new IntersectionObserver((es) => es.forEach((en) => (en.isIntersecting ? start() : stop())), { threshold: 0.01 });
    io.observe(canvas);
    start();
  }

  // ── ⌘K command palette ──────────────────────────────────────────────────────
  function initPalette(P, hooks) {
    hooks = hooks || {};
    const commands = buildCommands(P);
    const scrim = document.createElement("div"); scrim.className = "pf-scrim";
    const pal = document.createElement("div");
    pal.className = "pf-palette"; pal.setAttribute("role", "dialog"); pal.setAttribute("aria-modal", "true"); pal.setAttribute("aria-label", "Command palette");
    pal.innerHTML =
      '<div class="pf-palette-in"><span class="pf-prompt">$</span>' +
      '<input type="text" autocomplete="off" spellcheck="false" aria-label="Type a command" placeholder="Type a command… (try &quot;help&quot;, &quot;projects&quot;, &quot;sudo hire&quot;)" />' +
      '<kbd>ESC</kbd></div>' +
      '<ul class="pf-list" role="listbox" aria-label="Commands"></ul>' +
      '<div class="pf-out" aria-live="polite"></div>';
    document.body.append(scrim, pal);
    const input = pal.querySelector("input");
    const list = pal.querySelector(".pf-list");
    const out = pal.querySelector(".pf-out");
    let filtered = commands.slice(), sel = 0, lastFocus = null, open = false;

    function render() {
      list.innerHTML = "";
      filtered.forEach((c, i) => {
        const li = document.createElement("li");
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", i === sel ? "true" : "false");
        li.id = "pf-opt-" + i;
        li.innerHTML = `<span class="pf-i">${c.hint || "›"}</span><span class="pf-t"></span><span class="pf-h">${c.kind}</span>`;
        li.querySelector(".pf-t").textContent = c.title;
        li.addEventListener("mouseenter", () => { sel = i; syncSel(); });
        li.addEventListener("click", () => exec(c));
        list.appendChild(li);
      });
      input.setAttribute("aria-activedescendant", filtered.length ? "pf-opt-" + sel : "");
    }
    function syncSel() {
      [...list.children].forEach((li, i) => li.setAttribute("aria-selected", i === sel ? "true" : "false"));
      const cur = list.children[sel];
      if (cur) cur.scrollIntoView({ block: "nearest" });
      input.setAttribute("aria-activedescendant", filtered.length ? "pf-opt-" + sel : "");
    }
    function print(html, ok) { out.innerHTML = `<div class="pf-line${ok ? " pf-ok" : ""}">${html}</div>`; }

    function exec(c) {
      if (!c) return;
      switch (c.kind) {
        case "nav": {
          close();
          const t = document.querySelector(c.target);
          if (t) { const y = t.getBoundingClientRect().top + scrollY - 80; scrollTo({ top: y, behavior: prefersReduced() ? "auto" : "smooth" }); }
          break;
        }
        case "external": window.open(c.target, "_blank", "noopener"); close(); break;
        case "link": location.href = c.target; break;
        case "print": print(c.output); break;
        case "help": print("Available: " + commands.filter((x) => x.kind !== "help").map((x) => x.id).join(", ")); break;
        case "clear": out.innerHTML = ""; break;
        case "hire": print("✓ offer queued. Reach me at <span class='pf-ok'>pranaav.iyer@gmail.com</span> — I read every message.", true); break;
        case "theme":
          if (hooks.onTheme) hooks.onTheme();
          else if (root.__pfEggs) { root.__pfEggs.toggleRainbow(); print("toggled rainbow accent (Konami code does this too)", true); }
          else print("This variant ships a single accent.");
          break;
        case "matrix":
          close();
          if (hooks.onMatrix) hooks.onMatrix();
          else if (root.__pfEggs) root.__pfEggs.toggleMatrix();
          break;
        default: print(c.title);
      }
    }

    function open_() {
      if (open) return; open = true;
      lastFocus = document.activeElement;
      input.value = ""; filtered = commands.slice(); sel = 0; render(); out.innerHTML = "";
      scrim.classList.add("pf-open"); pal.classList.add("pf-open");
      lockScroll();
      setTimeout(() => input.focus(), 30);
    }
    function close() {
      if (!open) return; open = false;
      scrim.classList.remove("pf-open"); pal.classList.remove("pf-open");
      unlockScroll();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    on(input, "input", () => { filtered = filterCommands(commands, input.value); sel = 0; render(); });
    on(pal, "keydown", (e) => {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); if (filtered.length) { sel = (sel + 1) % filtered.length; syncSel(); } }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (filtered.length) { sel = (sel - 1 + filtered.length) % filtered.length; syncSel(); } }
      else if (e.key === "Enter") { e.preventDefault(); exec(filtered[sel]); }
      else if (e.key === "Tab") { trapFocus(pal, e); }
    });
    on(scrim, "click", close);
    on(document, "keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open ? close() : open_(); }
      else if (e.key === "/" && !open && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) { e.preventDefault(); open_(); }
    });
    document.querySelectorAll("[data-open-palette]").forEach((b) => {
      // Make any non-natively-focusable trigger (e.g. a styled div) keyboard-reachable.
      if (b.tagName !== "BUTTON" && b.tagName !== "A" && !b.hasAttribute("tabindex")) b.tabIndex = 0;
      on(b, "click", (e) => { e.preventDefault(); open_(); });
      on(b, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open_(); } });
    });

    render();
    return { open: open_, close, exec, commands };
  }

  // ── Project detail drawer ─────────────────────────────────────────────────────
  function initDrawers(P) {
    const byNum = new Map((P.projects || []).map((p) => [p.num, p]));
    const scrim = document.createElement("div"); scrim.className = "pf-scrim";
    const drawer = document.createElement("aside");
    drawer.className = "pf-drawer"; drawer.setAttribute("role", "dialog"); drawer.setAttribute("aria-modal", "true"); drawer.setAttribute("aria-label", "Project detail"); drawer.tabIndex = -1;
    drawer.innerHTML =
      '<div class="pf-d-hd"><span class="pf-d-num"></span><button class="pf-d-close" aria-label="Close project detail">✕</button></div>' +
      '<div class="pf-d-body"></div>';
    document.body.append(scrim, drawer);
    const numEl = drawer.querySelector(".pf-d-num");
    const body = drawer.querySelector(".pf-d-body");
    const closeBtn = drawer.querySelector(".pf-d-close");
    let lastFocus = null, open = false;

    function fill(p) {
      numEl.textContent = p.num;
      const img = p.image ? `<img class="pf-d-img" src="${p.image}" alt="${p.title} screenshot" loading="lazy" onerror="this.remove()">` : "";
      const links = (p.links && p.links.length)
        ? `<div class="pf-d-links">${p.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener noreferrer">${l.label} ↗</a>`).join("")}</div>`
        : "";
      body.innerHTML =
        img +
        (p.tag ? `<div class="pf-d-tag">${p.tag}</div>` : "") +
        `<h3></h3>` +
        `<p class="pf-d-desc"></p>` +
        `<div class="pf-d-tech">${p.tech.map((t) => `<span></span>`).join("")}</div>` +
        links;
      body.querySelector("h3").textContent = p.title;
      body.querySelector(".pf-d-desc").textContent = p.detail || p.desc;
      body.querySelectorAll(".pf-d-tech span").forEach((s, i) => (s.textContent = p.tech[i]));
    }
    function open_(num) {
      const p = byNum.get(num); if (!p) return;
      fill(p); open = true; lastFocus = document.activeElement;
      scrim.classList.add("pf-open"); drawer.classList.add("pf-open"); lockScroll();
      setTimeout(() => drawer.focus(), 30);
    }
    function close() {
      if (!open) return; open = false;
      scrim.classList.remove("pf-open"); drawer.classList.remove("pf-open"); unlockScroll();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    on(closeBtn, "click", close);
    on(scrim, "click", close);
    on(drawer, "keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); close(); } else if (e.key === "Tab") trapFocus(drawer, e); });

    document.querySelectorAll("[data-project]").forEach((card) => {
      if (!card.hasAttribute("tabindex")) card.tabIndex = 0;
      if (!card.getAttribute("role")) card.setAttribute("role", "button");
      const num = card.getAttribute("data-project");
      card.setAttribute("aria-label", (byNum.get(num) ? byNum.get(num).title : "Project") + " — open details");
      on(card, "click", () => open_(num));
      on(card, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open_(num); } });
    });
    return { open: open_, close };
  }

  // ── Console signature (harmless easter egg, kept from the original) ───────────
  function consoleSignature(P) {
    try {
      console.log("%c" + P.identity.name + " — " + P.identity.role, "color:#c8ff00;font:700 14px monospace");
      console.log("%cPress ⌘K (or /) for the command palette.", "color:#8f8d8a;font:11px monospace");
      console.log("%cEaster eggs: Konami ↑↑↓↓←→←→BA · press M · click the logo · click the title", "color:#8f8d8a;font:11px monospace");
    } catch (e) {}
  }

  // ── Easter eggs (Konami→rainbow, M→matrix rain, logo/title clicks, toast) ────
  function initEasterEggs(P, config) {
    const toast = document.createElement("div");
    toast.className = "pf-toast"; toast.setAttribute("role", "status"); toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
    let tTimer;
    const showToast = (msg, dur) => { clearTimeout(tTimer); toast.textContent = msg; toast.classList.add("pf-show"); tTimer = setTimeout(() => toast.classList.remove("pf-show"), dur || 2600); };

    // Konami → rainbow accent
    const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let ki = 0, rainbow = false, hue = 0, rafR = 0;
    function cycle() {
      if (!rainbow) { cancelAnimationFrame(rafR); document.documentElement.style.removeProperty("--accent"); return; }
      hue = (hue + 0.6) % 360;
      document.documentElement.style.setProperty("--accent", "hsl(" + hue + ",100%,60%)");
      rafR = requestAnimationFrame(cycle);
    }
    function toggleRainbow() {
      rainbow = !rainbow;
      if (rainbow) {
        if (prefersReduced()) document.documentElement.style.setProperty("--accent", "hsl(300,100%,62%)");
        else cycle();
        showToast("✦ rainbow mode");
      } else {
        if (prefersReduced()) document.documentElement.style.removeProperty("--accent");
        else cycle();
        showToast("back to normal");
      }
    }

    // Matrix rain (press M)
    let mCanvas, mCtx, mOn = false, mInt, mCols, mDrops = [];
    const mChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()π∑Δ";
    function mInit() { mCanvas.width = innerWidth; mCanvas.height = innerHeight; mCols = Math.floor(innerWidth / 14); mDrops = Array.from({ length: mCols }, (_, i) => (mDrops[i] == null ? Math.random() * innerHeight / 14 : mDrops[i])); }
    function mDraw() {
      if (document.hidden) return;
      mCtx.fillStyle = "rgba(10,10,11,0.07)"; mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);
      mCtx.fillStyle = (getComputedStyle(document.documentElement).getPropertyValue("--pf-accent").trim() || "#c8ff00");
      mCtx.font = "14px JetBrains Mono, monospace";
      for (let i = 0; i < mCols; i++) {
        mCtx.fillText(mChars[Math.floor(Math.random() * mChars.length)], i * 14, mDrops[i] * 14);
        if (mDrops[i] * 14 > mCanvas.height && Math.random() > 0.975) mDrops[i] = 0;
        mDrops[i]++;
      }
    }
    function toggleMatrix() {
      if (prefersReduced()) { showToast("matrix needs motion — enable it in your OS"); return; }
      if (!mCanvas) { mCanvas = document.createElement("canvas"); mCanvas.id = "pf-matrix"; mCanvas.setAttribute("aria-hidden", "true"); document.body.appendChild(mCanvas); mCtx = mCanvas.getContext("2d"); if (!mCtx) return; }
      mOn = !mOn; mCanvas.classList.toggle("pf-on", mOn);
      if (mOn) { mDrops = []; mInit(); mInt = setInterval(mDraw, 50); showToast("⟩ matrix — press M to exit"); }
      else { clearInterval(mInt); mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height); }
    }
    on(window, "resize", () => { if (mOn) mInit(); });

    on(document, "keydown", (e) => {
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const k = e.key && e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === seq[ki]) { ki++; if (ki === seq.length) { ki = 0; toggleRainbow(); } } else { ki = k === seq[0] ? 1 : 0; }
      if (k === "m" && !e.metaKey && !e.ctrlKey && !e.altKey) toggleMatrix();
    });

    // Logo (7 clicks) + title (message cycle) — opt-in via data attributes
    const logo = document.querySelector("[data-egg-logo]");
    if (logo) { let n = 0; on(logo, "click", () => { if (++n === 7) { showToast("🔓 the real résumé is the friends we compiled along the way"); n = 0; } }); }
    const title = document.querySelector("[data-egg-title]");
    if (title) {
      const msgs = ["Hmm, interesting click.", "Clicking again? Bold.", "Persistent. I like that.", "Five stages of debugging.", "Try the Konami code ↑↑↓↓←→←→BA"];
      let n = 0; on(title, "click", () => { showToast(msgs[Math.min(n, msgs.length - 1)]); if (++n > msgs.length + 1) n = 0; });
    }

    root.__pfEggs = { toggleRainbow, toggleMatrix, showToast };
    root.__pfToast = showToast;
  }

  // ── Orchestrator ──────────────────────────────────────────────────────────────
  function mount(P, config) {
    if (!hasDOM) return;
    config = config || {};
    const go = () => {
      injectBaseCSS();
      if (config.skipLink !== false) initSkipLink(config.mainSelector);
      if (config.scrollProgress !== false) initScrollProgress();
      if (config.cursor) initCursor();
      if (config.smoothAnchors !== false) initSmoothAnchors(config.anchorOffset);
      if (config.neural !== false) initNeuralHero();
      if (config.split !== false) initSplitReveal();
      initReveal();
      initCountUp();
      if (config.easterEggs !== false) initEasterEggs(P, config);
      const palette = config.palette !== false ? initPalette(P, config.paletteHooks) : null;
      const drawers = config.drawers !== false ? initDrawers(P) : null;
      consoleSignature(P);
      root.__PF__ = { palette, drawers };
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
    else go();
  }

  const API = {
    // orchestration
    mount, injectBaseCSS,
    // individual features
    initCursor, initScrollProgress, initSkipLink, initSmoothAnchors, initReveal,
    initSplitReveal, initCountUp, initNeuralHero, initPalette, initDrawers, splitChars, consoleSignature, initEasterEggs,
    // pure helpers (tested)
    buildCommands, filterCommands, isSubsequence, genNodes, connectNodes, nodeCountFor, formatCount,
    easeOutExpo, easeOutCubic, clamp,
    // env
    prefersReduced, finePointer, hasGSAP, hasScrollTrigger,
  };
  root.PortfolioEngine = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : globalThis);
