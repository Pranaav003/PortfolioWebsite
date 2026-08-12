# Portfolio Front-Page Variants — Build Spec

Three **standalone** front-page variants for Pranaav Iyer's portfolio, each a distinct
art direction but sharing ONE behavior engine so they're a fair design comparison.

- `variant-neon.html`     — "Neon Terminal, Refined" (evolution of the current site)
- `variant-editorial.html`— "Editorial Mono, Minimal" (light, typographic, calm)
- `variant-cyber.html`    — "Cyberpunk HUD, Bold" (neon, terminal-forward, high energy)

All three ship **all four signature features**: ⌘K command palette, generative
neural-net hero canvas, animated count-up metrics, and click-to-open project drawers.

---

## Non-negotiables (every variant)

1. **Standalone HTML file** in `variants/`. Content is **hard-coded in the HTML**
   (mirroring `assets/content.js`) so the page works with **no JS** and is SEO-crawlable.
   The engine only ADDS behavior; it never renders the primary content.
2. Load order at end of `<body>`:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
   <script>if(window.gsap&&window.ScrollTrigger)gsap.registerPlugin(ScrollTrigger);</script>
   <script src="assets/content.js"></script>
   <script src="assets/engine.js"></script>
   <script>PortfolioEngine.mount(PORTFOLIO, { cursor: true /* per brief */ });</script>
   ```
   GSAP is a **progressive enhancement** — the engine works without it. **Do NOT use
   `SplitText`** (it's a paid GSAP plugin); the engine hand-rolls character splitting.
3. **No-JS reveal pattern** (critical). Put this in `<head>` BEFORE your stylesheet:
   ```html
   <script>document.documentElement.classList.add('js')</script>
   ```
   Scope every "hidden-until-revealed" style under `html.js`:
   ```css
   html.js [data-reveal]{opacity:0;transform:translateY(28px)}
   [data-reveal].pf-revealed,[data-reveal].revealed{opacity:1;transform:none;
     transition:opacity .7s var(--pf-ease),transform .7s var(--pf-ease)}
   @media (prefers-reduced-motion:reduce){html.js [data-reveal]{opacity:1;transform:none}}
   ```
   Without JS the `js` class is never added → content is fully visible. Never hide
   content with plain `opacity:0` outside `html.js`.
4. **Accessibility:** `<html lang="en">`, `<meta name="viewport">`, one `<h1>`, semantic
   landmarks (`<nav> <main id="main"> <footer>`), `alt` on images, visible focus (the
   engine adds `:focus-visible` outlines via `--pf-accent`; don't remove outlines),
   AA contrast. The engine injects the skip-link, cursor, palette, drawer, scroll-progress.
5. **Reduced motion:** the engine already guards its own animations. Your CSS
   animations/marquees/parallax MUST also be disabled under
   `@media (prefers-reduced-motion:reduce)`.
6. **Responsive:** looks right at 375 / 768 / 1440. Single-column on mobile; disable
   hover-only effects (tilt/magnetic) and the custom cursor on touch (the engine already
   hides its cursor on coarse pointers — mirror that for any variant-specific hover FX).
7. **No console errors.** Guard optional globals. Test that removing the GSAP `<script>`
   tags still yields a working page (IntersectionObserver fallback).
8. Reuse the **SEO/OG/JSON-LD** head block from the current `../index.html` (canonical
   `https://pranaaviyer.onrender.com/`). You may tune `<title>`/`theme-color` to the variant.

---

## Engine contract (what to annotate)

`PortfolioEngine.mount(PORTFOLIO, config)` wires everything. Add these hooks to YOUR markup:

| Hook | Put it on | Effect |
|------|-----------|--------|
| `id="main"` | `<main>` | skip-link target |
| `data-open-palette` | a nav button/chip (label it "⌘K") | opens the palette (also global ⌘K / `/`) |
| `data-neural` | a `<canvas>` behind the hero | generative neural-net field |
| `data-split` | ONE hero headline element | per-character stagger reveal |
| `data-count="150"` (+ `data-prefix` `data-suffix` `data-decimals`) | the number span in each metric | count-up on scroll |
| `data-project="001"` | each project card (nums 001–006) | opens the detail drawer for that project |
| `data-reveal` (+ optional `data-reveal-delay`) | sections/cards to animate in | staggered scroll reveal |

`config` flags (all optional): `{ cursor, scrollProgress, skipLink, smoothAnchors, neural,
split, palette, drawers, anchorOffset, paletteHooks:{onTheme,onMatrix} }`. Defaults are ON
except `cursor` (opt-in). Set `cursor:false` for the calm editorial variant if you prefer.

**Theming:** the engine's injected UI reads `--pf-*`, which fall back to your `--accent`,
`--bg`, `--bg-elevated`, `--fg`, `--fg-dim`, `--border`, `--font-mono`, `--font-display`.
So just define those on `:root` and the palette/drawer/cursor match your theme automatically.
For a **light** theme, set light `--bg`/`--bg-elevated`, dark `--fg`, and a dark `--border`
(e.g. `rgba(0,0,0,.12)`) — the overlays adapt.

`data-count` values to use (from `PORTFOLIO.metrics`, all honest, already on the live site):
`<150ms` latency · `+15%` OCR accuracy · `+40%` test coverage · `2` papers · `4.0` GPA
(`data-decimals="1"`) · `6+` projects.

Images live at `/public/*` (served from repo root). Map: 001→`/public/Asl.png`,
002→`/public/TradingBotImg.png`, 003→`/public/Voicely.png`. 004/005/006 have no image —
render a generated visual (CSS gradient + big mono project number/glyph). The drawer
handles images itself from `PORTFOLIO`; card thumbnails are the variant's choice.

---

## Content (mirror `assets/content.js` exactly — do not invent)

Identity: **Pranaav Iyer** · ML Engineer · Full Stack Developer · CS @ NYU · Fremont, CA ·
Status **Open to opportunities**. Sections + `n`: About 01, Skills 02, Work 03, Projects 04,
Education 05, Contact 06.

- **About lead:** "I build **intelligent systems** that bridge the gap between **raw data**
  and **real-world impact** — from real-time ASL translation to automated trading engines."
  Detail rows: Location Fremont CA · Education M.S. CS NYU · 4.0 GPA · Languages Python·React·SQL·C/C++·Java · Status Open to opportunities.
- **Skills (6):** Programming 92 · AI/ML 88 · Development Tools 85 · Computer Vision 90 ·
  Research & Writing 82 · Leadership 78 (details in content.js).
- **Experience (2):** Avyay Solutions — ML Intern (May 2022–Aug 2022); Krypt, Inc. —
  Documentation Intern (May 2019–Aug 2020).
- **Projects (6):** 001 ASL Video Translator · 002 Thinkorswim Trading Bot · 003 HearSay ·
  004 Debrief · 005 Signal · 006 Centra (titles/desc/tech verbatim from content.js).
- **Education (2):** NYU (M.S. CS, GPA 4.0, Expected May 2027); Purdue Fort Wayne (B.S. CS,
  GPA 3.7, Jul 2021–May 2025).
- **Contact (5):** Email pranaav.iyer@gmail.com · LinkedIn in/pranaav-iyer · GitHub @Pranaav003 ·
  Website pranaaviyer.onrender.com · Phone +1 408 863 2110. Résumé: `/public/PranaavIyer_Resume.pdf`.

---

## Art direction A — `variant-neon.html` : "Neon Terminal, Refined"

The current site, leveled up. **Evolution, not revolution.**
- **Palette:** `--bg:#0a0a0b; --bg-elevated:#111113; --fg:#e8e6e3; --fg-dim:#767472;
  --accent:#c8ff00; --accent-secondary:#ff6b35; --border:rgba(255,255,255,.08)`.
- **Fonts:** Syne (display) · Space Grotesk (body) · JetBrains Mono (mono/labels).
- **Feel:** premium, recruiter-safe, confident. Generous 140–160px section padding, a
  radial-masked grid + faint neural canvas behind a huge 3-line stacked hero title
  (`Pranaav` / `Iyer` outline-stroke / `Engineer_` lime). `data-split` on one hero line.
- **Motion:** GSAP ScrollTrigger reveals; subtle parallax on big outline background text
  strips ("EXPERTISE · CRAFT"); marquee skill strip; **custom cursor ON**; project cards
  tilt on hover. Keep the console easter egg.
- **Sections:** hero → marquee → about (2-col) → **metrics band** (6 lime count-ups in a
  row) → skills 3-col grid (animated level bars) → experience timeline → projects 2-col
  cards (image/generated visual, drawer on click) → education 2-card → contact link list
  (terminal-style, arrow slide) → footer. Nav chip: **⌘K**.

## Art direction B — `variant-editorial.html` : "Editorial Mono, Minimal"

A calm, senior, **light** editorial take — maximum contrast with the two dark variants.
- **Palette (LIGHT):** `--bg:#f4f1ea; --bg-elevated:#eae5da; --fg:#1a1a17; --fg-dim:#6b675e;
  --accent:#e2432a` (a warm editorial red) `; --border:rgba(0,0,0,.12)`. (Set `--pf-*` via
  these so the palette/drawer/cursor render light.)
- **Fonts:** Fraunces (display serif, characterful) · Inter (body) · JetBrains Mono (labels/data).
- **Feel:** magazine layout — wide margins, single narrow content column, thin hairline
  rules, big numbered section markers ("01 —"), lots of whitespace. Restraint over spectacle.
- **Motion:** SUBTLE only — gentle fades/reveals, faint neural canvas in the ink-red accent
  at low opacity, NO tilt, NO marquee. **Cursor OFF** (`cursor:false`) for calm; keep ⌘K.
- **Sections:** editorial masthead hero (name as a large serif wordmark + a one-line role
  in mono) → about as a lead paragraph with the accent fragments → metrics as inline
  "figures" in a refined hairline-separated row (still count-up) → skills as a clean
  two-column definition list (name + detail, small level indicator) → experience as a
  minimal dated list → **projects as an editorial index** (numbered rows: number · title ·
  one-line · tech) that open the drawer on click → education as two calm entries → contact
  as a hairline-ruled list. Nav: thin, wordmark + section links + ⌘K link.

## Art direction C — `variant-cyber.html` : "Cyberpunk HUD, Bold"

Experimental, high-energy, **terminal-forward**. Bold departure.
- **Palette (DARK):** `--bg:#050506; --bg-elevated:#0b0d10; --fg:#e6f0ef; --fg-dim:#5a6b6a;
  --accent:#c8ff00` (primary) with **cyan `#00e5ff`** and **magenta `#ff2bd6`** as HUD
  secondaries `; --border:rgba(0,229,255,.16)`.
- **Fonts:** Space Grotesk (bold display) · JetBrains Mono (dominant, terminal). Uppercase
  mono labels with wide tracking.
- **Feel:** HUD dashboard — corner brackets on panels, scanline overlay (subtle
  `repeating-linear-gradient`), telemetry readouts (coords, "STATUS: OPEN_TO_WORK", a live
  clock/uptime), glitch on headings (short, tasteful). The **neural canvas is prominent**
  (higher opacity, lime/cyan). A faux always-visible **terminal window** in the hero doubles
  as a `data-open-palette` trigger ("press ⌘K").
- **Motion:** energetic but controlled — glitch reveals, scanline sweep, parallax, count-up
  telemetry. **Cursor ON** (crosshair ring feel). All disabled under reduced-motion.
- **Sections:** HUD hero (terminal + neural bg + telemetry) → **metrics as a telemetry grid**
  (count-up) → skills as HUD bento tiles with level meters → experience as a log/timeline →
  projects as neon-bordered **bento cards** (glitch hover, drawer on click) → education as
  two HUD panels → contact as a terminal command list → footer with live readout. Nav: HUD
  bar with ⌘K.

---

## Definition of done (per variant)
- [ ] All 6 sections present with verbatim content + one `<h1>`.
- [ ] All 4 features wired via the hooks above and demonstrably functional.
- [ ] `html.js` reveal pattern used; content visible with JS disabled.
- [ ] Reduced-motion + responsive (375/768/1440) + no console errors.
- [ ] GSAP absent → still works (IO fallback). SplitText NOT used.
- [ ] Distinct from the other two variants in palette, type, and layout.
