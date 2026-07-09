# Offering Hope — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the two working conversion doors of Hope Kimple's redesigned site — Home, Workshops, Coaching, Contact — plus the shared design system, editable events component, Jotform wiring, and "coming soon" stubs for the rest, so nothing 404s.

**Architecture:** Plain static HTML/CSS/JS on GitHub Pages, no build step. One shared `styles.css` (design system) and `main.js` (nav toggle, events renderer, contact form) are linked by every page. Header/footer markup is duplicated into each HTML file (HTML-native nav for SEO/resilience); only the *events* data is centralized in `events.js`. Content is verbatim from Hope's brief.

**Tech Stack:** HTML5, CSS (custom properties, no framework), vanilla JS (no libraries), Google Fonts (Cormorant Garamond + Jost), Jotform (registration), GoHighLevel webhook (contact form).

**Spec:** `docs/superpowers/specs/2026-07-08-offering-hope-site-design.md` — read it before starting.

## Global Constraints

Copied verbatim from the spec. Every task implicitly includes these.

- **Brand colors:** gold `#B8962E`, near-black/ink `#1A1A1A`, warm-white/cream backgrounds. NOT dark mode. Airy.
- **Fonts:** headings = Cormorant Garamond; body/UI = Jost.
- **Never** use the words "somatic practitioner" anywhere. Hope's titles are "Nervous System Coach · Intuitive Life Coach".
- **Contact/handles:** `offeringhope.co` · `hope@offeringhope.co` · `510-209-6744` · Instagram `@offering_hope_coach` (NOT `@offering_hope_life_coach`).
- **Tagline** "There's Always Hope." — footer / end-of-page sign-off only, never a repeated header.
- **One primary-style button per page** (one filled `.btn` per view; everything else secondary/outline/text).
- **Copy is verbatim** from Hope's brief — do not smooth, formalize, or expand. If a layout needs different-length text, flag it, don't rewrite.
- **Buttons say what they do:** "Save my seat", "Claim a founding spot", "Send me the reset" — never "Submit"/"Learn more" as a primary button.
- **Aho hard rule:** no Aho link from Home/Speaking/Coaching/About. Footer + Shop card only. (Phase 1: Aho is a stub; the footer link is present, that's allowed.)
- **BNI code "Magic"** never appears on the site (it lives only in the Jotform — not our concern in Phase 1).
- **Mobile-first.** Home hero = one sentence + one button visible without scrolling. No hero-video backgrounds, no animation libraries.
- **Footer (every page), verbatim:**
  > Offering Hope · Hands of Hope Wellness Center LLC · Hayward, CA
  > Workshops · Coaching · Speaking · Shop · About · Free Reset · Aho · Contact
  > There's Always Hope.

## File Structure

```
index.html          Home        (rebuild — replaces the old Built To Break single page)
workshops.html      Workshops   (new)
coaching.html       Coaching    (new)
contact.html        Contact     (new)
speaking.html       stub        (new, noindex)
shop.html           stub        (new, noindex)
about.html          stub        (new, noindex)
free-reset.html     stub        (new, noindex)
aho.html            stub        (new, noindex)
styles.css          shared design system (new)
main.js             nav toggle + events renderer + contact form (new)
events.js           editable events data (new)
assets/             existing (oh-logo.png, hope-portrait.jpg, lotus-bg.png, og-image.jpg,
                    favicon.png, apple-touch-icon.png) + add new white logo
```

The old single-page content (Built To Break) is preserved in git history and will feed the Phase 2 Speaking page. Leave the stale bundled `Offering Hope - Built To Break*.html` files untouched in Phase 1 (Phase 2 cleanup removes them).

## Verification Tooling

- **Local preview:** `cd /Users/joeortega/Documents/Projects/Hope && python3 -m http.server 8765` then open `http://localhost:8765/<page>.html`. Check `lsof -i :8765` before starting a second server.
- **Browser checks:** use the `browse` skill/tool to navigate, screenshot, and assert element/state. Where this plan says "verify in browser," drive it with `browse`.
- **Content assertions:** `grep` for required/forbidden strings (shown per task).

---

### Task 1: Design system + shared chrome + all-page scaffold

Establishes `styles.css`, `main.js` (nav toggle only — events renderer comes in Task 2), the canonical header/footer used by every page, and all 9 HTML files scaffolded with correct titles/meta so the nav is fully navigable and nothing 404s. The five Phase-2 pages are finished as "coming soon" stubs in this task.

**Files:**
- Create: `styles.css`, `main.js`
- Create: `index.html`, `workshops.html`, `coaching.html`, `contact.html` (as chrome-only scaffolds — content added in Tasks 3–6)
- Create: `speaking.html`, `shop.html`, `about.html`, `free-reset.html`, `aho.html` (finished stubs)
- Add asset: copy `~/Downloads/New logo white .png` → `assets/oh-logo-white.png`

**Interfaces:**
- Produces: `styles.css` design tokens + component classes (`.btn`, `.btn-secondary`, `.masthead`, `.site-nav`, `.foot`, `.page`, `.sec-label`, `.card`, `.hero`, `.kicker`, `.rule`); `main.js` global `initNav()`; the canonical `<header class="masthead">` and `<footer class="foot">` HTML blocks (defined below) that Tasks 3–6 reuse verbatim.

- [ ] **Step 1: Add the new logo asset**

```bash
cd /Users/joeortega/Documents/Projects/Hope
cp "$HOME/Downloads/New logo white .png" assets/oh-logo-white.png
ls -la assets/oh-logo-white.png
```
Expected: file exists.

- [ ] **Step 2: Write `styles.css`**

Adapt the existing `index.html` `<style>` block into a shared stylesheet, extended with nav, secondary button, cards, pricing cards, and a table. Full file:

```css
:root {
  --gold: #b8962e;
  --gold-deep: #8a6f1f;
  --gold-soft: #d4b558;
  --ink: #1a1a1a;
  --ink-soft: #3a3530;
  --cream: #f6f1e8;
  --paper: #fbf8f1;
  --paper-2: #f4eee1;
  --line: #ddd0b3;
  --line-gold: rgba(184, 150, 46, 0.35);
  --muted: #6b6457;
  --serif: "Cormorant Garamond", Georgia, "Times New Roman", serif;
  --sans: "Jost", system-ui, -apple-system, sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; scroll-padding-top: 140px; }
body {
  background: var(--paper); color: var(--ink);
  font-family: var(--sans); font-weight: 300; font-size: 16px; line-height: 1.6;
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
  position: relative; min-height: 100vh;
}
::selection { background: var(--gold); color: var(--paper); }
body::before {
  content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image: url("assets/lotus-bg.png"); background-repeat: no-repeat;
  background-position: center center; background-size: min(1400px, 130vw) auto; opacity: 0.27;
}
h1, h2, h3, h4 { font-family: var(--serif); font-weight: 500; line-height: 1.08; color: var(--ink); }
a { color: inherit; }
.kicker { font-family: var(--sans); font-weight: 500; font-size: 11px; letter-spacing: 0.42em; text-transform: uppercase; color: var(--gold-deep); }
.rule { width: 56px; height: 1px; background: var(--gold); margin: 22px auto; position: relative; }
.rule::before, .rule::after { content: ""; position: absolute; top: 50%; width: 4px; height: 4px; background: var(--gold); border-radius: 50%; transform: translateY(-50%) rotate(45deg); }
.rule::before { left: -14px; } .rule::after { right: -14px; }

/* Page shell */
.page { position: relative; z-index: 1; width: 920px; max-width: 100%; margin: 0 auto; padding: 150px 72px 56px; }
@media (max-width: 760px) { .page { padding: 116px 22px 40px; } }

/* Masthead + nav */
.masthead { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: var(--paper); border-bottom: 1px solid var(--line-gold); }
.masthead-inner { width: 920px; max-width: 100%; margin: 0 auto; padding: 16px 72px; display: flex; align-items: center; gap: 16px; }
.masthead .logo { width: 56px; height: 56px; object-fit: contain; flex-shrink: 0; opacity: 0.85; }
.masthead-brand { font-family: var(--serif); font-size: 24px; font-weight: 500; letter-spacing: 0.04em; color: var(--ink); text-decoration: none; margin-right: auto; }
.site-nav { display: flex; gap: 22px; align-items: center; }
.site-nav a { font-family: var(--sans); font-weight: 400; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); text-decoration: none; transition: color .15s; }
.site-nav a:hover, .site-nav a[aria-current="page"] { color: var(--gold-deep); }
.nav-toggle { display: none; background: none; border: none; cursor: pointer; font-size: 22px; color: var(--ink); }
@media (max-width: 760px) {
  .masthead-inner { padding: 12px 22px; gap: 12px; }
  .masthead .logo { width: 44px; height: 44px; }
  .masthead-brand { font-size: 20px; }
  .nav-toggle { display: block; }
  .site-nav { position: absolute; top: 100%; left: 0; right: 0; background: var(--paper); border-bottom: 1px solid var(--line-gold); flex-direction: column; gap: 0; padding: 8px 22px 16px; display: none; }
  .site-nav.open { display: flex; }
  .site-nav a { padding: 12px 0; font-size: 13px; border-bottom: 1px solid var(--line-gold); }
}

/* Buttons */
.btn { display: inline-block; font-family: var(--sans); font-weight: 500; font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--paper); background: var(--ink); padding: 17px 36px; text-decoration: none; border: 1px solid var(--ink); cursor: pointer; transition: background .2s, border-color .2s; }
.btn:hover { background: var(--gold-deep); border-color: var(--gold-deep); }
.btn-secondary { display: inline-block; font-family: var(--sans); font-weight: 500; font-size: 12px; letter-spacing: 0.08em; color: var(--gold-deep); text-decoration: underline; text-underline-offset: 4px; background: none; border: none; cursor: pointer; }
.cta-row { text-align: center; margin-top: 8px; }
.cta-row .btn-secondary { display: block; margin-top: 16px; }

/* Sections */
section.block { margin-top: 68px; position: relative; }
.sec-label { font-family: var(--sans); font-weight: 500; font-size: 10.5px; letter-spacing: 0.34em; text-transform: uppercase; color: var(--gold-deep); padding-bottom: 12px; margin-bottom: 26px; border-bottom: 1px solid var(--line-gold); }
.prose p { font-family: var(--serif); font-weight: 400; font-size: 19px; line-height: 1.7; color: var(--ink-soft); margin-bottom: 18px; }
.prose p:last-child { margin-bottom: 0; }
.prose p em { color: var(--gold-deep); font-style: italic; }
@media (max-width: 600px) { .prose p { font-size: 17px; } }

/* Hero */
.hero { text-align: center; margin-bottom: 40px; }
.hero .kicker { display: inline-block; margin-bottom: 8px; }
.hero h1 { font-family: var(--serif); font-weight: 400; font-size: clamp(46px, 8vw, 84px); line-height: 1.02; color: var(--ink); margin-bottom: 20px; }
.hero h1 em { font-style: italic; font-weight: 400; color: var(--gold-deep); }
.hero .lede { font-family: var(--serif); font-style: italic; font-size: clamp(18px, 2.3vw, 22px); color: var(--ink-soft); max-width: 620px; margin: 0 auto 32px; line-height: 1.5; }

/* Cards grid (three doors, workshop series) */
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line-gold); border: 1px solid var(--line-gold); border-radius: 3px; overflow: hidden; }
.card { background: rgba(251, 248, 241, 0.9); padding: 28px 24px; text-decoration: none; color: inherit; display: block; transition: background .18s; }
a.card:hover { background: var(--cream); }
.card .card-kicker { font-family: var(--serif); font-style: italic; font-size: 13px; color: var(--gold); margin-bottom: 12px; }
.card h4 { font-family: var(--serif); font-size: 22px; font-weight: 500; margin-bottom: 10px; line-height: 1.15; }
.card p { font-family: var(--serif); font-size: 16px; line-height: 1.55; color: var(--ink-soft); }
@media (max-width: 600px) { .cards { grid-template-columns: 1fr; } }

/* Event rows */
.events { border: 1px solid var(--line-gold); border-radius: 3px; overflow: hidden; }
.event-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 18px 20px; border-bottom: 1px solid var(--line-gold); background: rgba(244, 238, 225, 0.5); }
.event-row:last-child { border-bottom: none; }
.event-row .ev-name { font-family: var(--serif); font-size: 20px; font-weight: 500; }
.event-row .ev-meta { font-family: var(--sans); font-size: 13px; color: var(--ink-soft); flex: 1 1 240px; }
.event-row .ev-cta { margin-left: auto; }
.events-note { font-family: var(--serif); font-style: italic; font-size: 16px; color: var(--ink-soft); margin-top: 14px; }

/* Pricing cards */
.tiers { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.tier { border: 1px solid var(--line-gold); border-radius: 3px; padding: 20px; background: rgba(251, 248, 241, 0.9); }
.tier.featured { border-color: var(--gold); box-shadow: 0 0 0 2px var(--line-gold); }
.tier .t-name { font-family: var(--sans); font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold-deep); }
.tier .t-price { font-family: var(--serif); font-size: 34px; font-weight: 500; margin: 6px 0 8px; }
.tier .t-note { font-family: var(--serif); font-size: 16px; color: var(--ink-soft); line-height: 1.4; }
@media (max-width: 600px) { .tiers { grid-template-columns: 1fr; } }

/* Simple offers table */
.offers { width: 100%; border-collapse: collapse; font-family: var(--sans); }
.offers th { background: var(--ink); color: #fff; text-align: left; font-size: 12px; letter-spacing: 0.06em; padding: 12px 14px; font-weight: 500; }
.offers td { padding: 12px 14px; border-bottom: 1px solid var(--line-gold); font-size: 14px; color: var(--ink-soft); vertical-align: top; }
.offers td:nth-child(2) { font-family: var(--serif); font-size: 18px; color: var(--ink); white-space: nowrap; }
.offers tr:nth-child(even) td { background: rgba(244, 238, 225, 0.5); }

/* Early-bird banner */
.earlybird { text-align: center; background: var(--ink); color: var(--paper); font-family: var(--sans); font-size: 13px; letter-spacing: 0.04em; padding: 12px 16px; border-radius: 3px; margin-bottom: 20px; }
.earlybird strong { color: var(--gold-soft); }

/* Forms */
.field { margin-bottom: 16px; }
.field label { display: block; font-family: var(--sans); font-size: 10px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 7px; }
.field input, .field select, .field textarea { width: 100%; padding: 13px 14px; border: 1px solid var(--line); background: rgba(255,255,255,0.85); font-family: var(--sans); font-size: 16px; color: var(--ink); border-radius: 2px; -webkit-appearance: none; appearance: none; }
.field textarea { resize: vertical; min-height: 110px; }
.field input:focus, .field select:focus, .field textarea:focus { outline: none; background: #fff; border-color: var(--gold); box-shadow: 0 0 0 3px rgba(184,150,46,0.14); }
.field.has-error input, .field.has-error select { border-color: #b94545; }
.field-error { color: #b94545; font-size: 12px; margin-top: 5px; display: none; }
.field.has-error .field-error { display: block; }
.form-success { display: none; text-align: center; padding: 24px 0; }
.form-wrap.submitted form { display: none; }
.form-wrap.submitted .form-success { display: block; }

/* Contact meta */
.contact-meta { font-family: var(--serif); font-size: 18px; color: var(--ink-soft); line-height: 1.8; margin-top: 24px; text-align: center; }
.contact-meta a { color: var(--gold-deep); text-decoration: none; }

/* Footer */
.foot { margin-top: 80px; padding-top: 28px; border-top: 1px solid var(--line-gold); text-align: center; }
.foot .foot-brand { font-family: var(--serif); font-size: 18px; color: var(--ink); margin-bottom: 12px; }
.foot .foot-nav { font-family: var(--sans); font-size: 12px; letter-spacing: 0.06em; color: var(--ink-soft); margin-bottom: 14px; }
.foot .foot-nav a { color: var(--ink-soft); text-decoration: none; margin: 0 6px; }
.foot .foot-nav a:hover { color: var(--gold-deep); }
.foot .foot-tag { font-family: var(--serif); font-style: italic; font-size: 18px; color: var(--gold-deep); }

/* Stub pages */
.stub { text-align: center; padding: 60px 0; }
.stub h1 { font-size: clamp(40px, 7vw, 64px); margin-bottom: 16px; }
.stub p { font-family: var(--serif); font-size: 20px; color: var(--ink-soft); margin-bottom: 28px; }
```

- [ ] **Step 3: Write `main.js` (nav toggle only for now)**

```js
// Mobile nav toggle. Events renderer is added in Task 2; contact form in Task 6.
function initNav() {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    nav.classList.toggle("open");
    var open = nav.classList.contains("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}
document.addEventListener("DOMContentLoaded", function () {
  initNav();
});
```

- [ ] **Step 4: Define the canonical header + footer (reused verbatim by every page)**

This is the reference markup Tasks 3–6 paste into each content page. The `<head>` common block and these two blocks are the shared chrome.

Common `<head>` (per-page `<title>`/description filled by each task):
```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link rel="icon" type="image/png" href="assets/favicon.png" />
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png" />
<meta name="theme-color" content="#fbf8f1" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="styles.css" />
```

Header (`aria-current="page"` goes on the current page's nav link):
```html
<header class="masthead">
  <div class="masthead-inner">
    <img src="assets/oh-logo.png" alt="Offering Hope" class="logo" />
    <a href="index.html" class="masthead-brand">Offering Hope</a>
    <button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="site-nav">☰</button>
    <nav class="site-nav" id="site-nav">
      <a href="index.html">Home</a>
      <a href="workshops.html">Workshops</a>
      <a href="coaching.html">Coaching</a>
      <a href="speaking.html">Speaking</a>
      <a href="shop.html">Shop</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
    </nav>
  </div>
</header>
```

Footer (verbatim, on every page):
```html
<footer class="foot">
  <div class="foot-brand">Offering Hope · Hands of Hope Wellness Center LLC · Hayward, CA</div>
  <div class="foot-nav">
    <a href="workshops.html">Workshops</a>·<a href="coaching.html">Coaching</a>·<a href="speaking.html">Speaking</a>·<a href="shop.html">Shop</a>·<a href="about.html">About</a>·<a href="free-reset.html">Free Reset</a>·<a href="aho.html">Aho</a>·<a href="contact.html">Contact</a>
  </div>
  <div class="foot-tag">There's Always Hope.</div>
</footer>
<script src="main.js"></script>
```

- [ ] **Step 5: Create the five "coming soon" stub pages**

Each Phase-2 page uses the chrome from Step 4 plus a `<meta name="robots" content="noindex" />` in the head and this body. Template (`speaking.html` shown; repeat for `shop.html`, `about.html`, `free-reset.html`, `aho.html` swapping the `<title>` and `<h1>`):

```html
<!doctype html>
<html lang="en">
<head>
<title>Speaking — Built To Break | Offering Hope</title>
<meta name="description" content="Built To Break — a keynote with Hope Kimple. Details coming soon." />
<meta name="robots" content="noindex" />
<!-- + common head block from Step 4 -->
</head>
<body>
<!-- header from Step 4, with no aria-current -->
<main class="page">
  <section class="stub">
    <div class="kicker">Coming Soon</div>
    <div class="rule"></div>
    <h1>Speaking</h1>
    <p>This page is on its way. In the meantime, come to a workshop or reach out directly.</p>
    <a href="workshops.html" class="btn">See upcoming workshops</a>
  </section>
</main>
<!-- footer from Step 4 -->
</body>
</html>
```

Titles/headings for the five stubs:
- `speaking.html` — title "Speaking — Built To Break | Offering Hope", h1 "Speaking"
- `shop.html` — title "Shop | Offering Hope", h1 "Shop"
- `about.html` — title "About Hope Kimple | Offering Hope", h1 "About Hope"
- `free-reset.html` — title "Free Reset | Offering Hope", h1 "The Hope Reset"
- `aho.html` — title "Aho | Offering Hope", h1 "Aho" (this stub also `noindex`; keep it — the real Aho page in Phase 2 stays noindex too)

- [ ] **Step 6: Create chrome-only scaffolds for the four content pages**

Create `index.html`, `workshops.html`, `coaching.html`, `contact.html` with the common head (per-page titles below), header (with the right `aria-current`), an empty `<main class="page"></main>`, and the footer. Content fills in Tasks 3–6.

Per-page `<title>` / description:
- `index.html` — "Nervous System Coaching in Northern CA | Offering Hope" / "A simpler path to a more comfortable life — through the nervous system. Workshops, 1:1 coaching, and the Built To Break keynote with Hope Kimple."
- `workshops.html` — "Workshops — Break the Spell, Aug 8 | Offering Hope" / "Live nervous-system workshops in the East Bay. Next: Break the Spell, August 8, Pleasanton."
- `coaching.html` — "1:1 Nervous System Coaching | Offering Hope" / "Ninety days, one-on-one, through all three pillars — body, mind, gut. Founding rate open now."
- `contact.html` — "Contact Hope Kimple | Offering Hope" / "Whether it's a seat, a spot, or a stage — start here."

(These four do NOT get `noindex`.)

- [ ] **Step 7: Verify the scaffold in the browser**

```bash
cd /Users/joeortega/Documents/Projects/Hope && python3 -m http.server 8765
```
Using the `browse` tool, open `http://localhost:8765/index.html`. Then:
- Confirm the masthead (logo + "Offering Hope" + nav) and footer render with brand styling (cream bg, gold accents, Cormorant/Jost).
- Click each of the 7 nav links + all 8 footer links → every page loads (no 404). Stub pages show "Coming Soon".
- Resize to mobile width (≤600px): the `☰` toggle appears; clicking it opens/closes the nav.

- [ ] **Step 8: Assert the hard rules with grep**

```bash
cd /Users/joeortega/Documents/Projects/Hope
grep -ril "somatic practitioner" *.html && echo "FAIL: forbidden term present" || echo "PASS: no somatic practitioner"
grep -l "offering_hope_life_coach" *.html && echo "FAIL: stale handle" || echo "PASS: no stale handle"
grep -c 'name="robots" content="noindex"' speaking.html shop.html about.html free-reset.html aho.html
grep -L 'name="robots"' index.html workshops.html coaching.html contact.html
```
Expected: PASS on both echos; each of the 5 stubs shows `1`; the 4 content pages are listed by `-L` (they have no robots meta).

- [ ] **Step 9: Commit**

```bash
cd /Users/joeortega/Documents/Projects/Hope
git add styles.css main.js index.html workshops.html coaching.html contact.html speaking.html shop.html about.html free-reset.html aho.html assets/oh-logo-white.png
git commit -m "feat: design system, shared chrome, and all-page scaffold"
```

---

### Task 2: Editable events component

Centralized `events.js` data + a renderer in `main.js` that fills the Home strip (next dated event) and the Workshops list (all events), with PT-correct roll-off, never-empty fallback, and crash-safety.

**Files:**
- Create: `events.js`
- Modify: `main.js` (add `renderEvents()` + call in `DOMContentLoaded`)

**Interfaces:**
- Consumes: `initNav()` from Task 1.
- Produces: global `OH_EVENTS` array (from `events.js`); `renderEvents()` which populates any `#events-list` (full list) and `#events-next` (next dated event only) containers present on a page. Home (Task 3) provides `#events-next`; Workshops (Task 4) provides `#events-list`.

- [ ] **Step 1: Write `events.js`**

`dateISO` = event date in `YYYY-MM-DD` (Pacific). Cycle rows omit `dateISO` and set `cycleWindow`. `regUrl` is the Jotform for dated events; cycle rows fall back to the Full Series pass link.

```js
// EDIT ME: Hope's living events calendar. Add/remove/edit one entry — nothing else changes.
// Dated event: set dateISO "YYYY-MM-DD" (Pacific) + regUrl. Cycle event: set cycleWindow, omit dateISO.
window.OH_EVENTS = [
  {
    name: "Break the Spell",
    dateISO: "2026-08-08",
    meta: "Saturday, August 8 · 11 AM–1 PM · Prodigy Fitness · 6689 Owens Dr., Suite 300, Pleasanton, CA 94588",
    buttonLabel: "Save my seat",
    regUrl: "https://form.jotform.com/261404619331047"
  },
  {
    name: "Reset & Realign",
    cycleWindow: "Next cycle begins this fall (Workshop 1)",
    meta: "Included with the Full Series pass",
    buttonLabel: "Get the Full Series pass",
    regUrl: "https://form.jotform.com/261404619331047"
  },
  {
    name: "Fear vs. Intuition",
    cycleWindow: "This fall cycle",
    meta: "Included with the Full Series pass",
    buttonLabel: "Get the Full Series pass",
    regUrl: "https://form.jotform.com/261404619331047"
  },
  {
    name: "Boundaries & Becoming",
    cycleWindow: "This fall cycle",
    meta: "Included with the Full Series pass",
    buttonLabel: "Get the Full Series pass",
    regUrl: "https://form.jotform.com/261404619331047"
  }
];
```

- [ ] **Step 2: Add the renderer to `main.js`**

Insert above the `DOMContentLoaded` handler. `isPast` treats an event as past only after its date in Pacific time (compares `YYYY-MM-DD` strings against "today in America/Los_Angeles"), so an all-day comparison keeps Aug 8 live through Aug 8.

```js
function pacificTodayISO() {
  // "YYYY-MM-DD" for the current date in America/Los_Angeles.
  var parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date());
  return parts; // en-CA gives YYYY-MM-DD
}

function eventRowHTML(ev) {
  var when = ev.dateISO ? ev.meta : (ev.cycleWindow + " · " + ev.meta);
  return '<div class="event-row">' +
    '<span class="ev-name">' + ev.name + '</span>' +
    '<span class="ev-meta">' + when + '</span>' +
    '<a class="btn ev-cta" href="' + ev.regUrl + '">' + ev.buttonLabel + '</a>' +
    '</div>';
}

function renderEvents() {
  var listEl = document.getElementById("events-list");
  var nextEl = document.getElementById("events-next");
  if (!listEl && !nextEl) return;
  try {
    var today = pacificTodayISO();
    var all = (window.OH_EVENTS || []).filter(function (ev) {
      return !ev.dateISO || ev.dateISO >= today; // keep undated (cycle) + today-or-future
    });
    if (listEl) {
      listEl.innerHTML = all.map(eventRowHTML).join("");
    }
    if (nextEl) {
      var nextDated = all.filter(function (e) { return e.dateISO; })[0];
      var pick = nextDated || all[0]; // never empty: fall back to first cycle row
      nextEl.innerHTML = pick ? eventRowHTML(pick) : "";
    }
  } catch (e) {
    var fallback = '<div class="event-row"><span class="ev-name">Break the Spell</span>' +
      '<span class="ev-meta">Saturday, August 8 · 11 AM–1 PM · Prodigy Fitness, Pleasanton</span>' +
      '<a class="btn ev-cta" href="https://form.jotform.com/261404619331047">Save my seat</a></div>';
    if (listEl) listEl.innerHTML = fallback;
    if (nextEl) nextEl.innerHTML = fallback;
  }
}
```

Update the `DOMContentLoaded` handler to call it:
```js
document.addEventListener("DOMContentLoaded", function () {
  initNav();
  renderEvents();
});
```

- [ ] **Step 3: Add a temporary probe to verify rendering**

Temporarily add to `workshops.html` `<main>`: `<div id="events-list"></div>` and `<script src="events.js"></script>` before `main.js`. (Task 4 replaces this with the real section.)

- [ ] **Step 4: Verify in the browser**

Restart the server if needed; open `http://localhost:8765/workshops.html` with `browse`.
- Confirm four event rows render: Break the Spell (with the full Prodigy address) + three cycle rows.
- Confirm each row has a working button linking to `form.jotform.com/261404619331047`.

- [ ] **Step 5: Verify roll-off + noscript reasoning**

In the browser console (via `browse`) run:
```js
pacificTodayISO()  // expect today's date as YYYY-MM-DD
window.OH_EVENTS.filter(e => !e.dateISO || e.dateISO >= "2026-08-09").map(e=>e.name)
// expect ["Reset & Realign","Fear vs. Intuition","Boundaries & Becoming"] — Break the Spell has rolled off by Aug 9
window.OH_EVENTS.filter(e => !e.dateISO || e.dateISO >= "2026-08-08").map(e=>e.name)
// expect all four — Break the Spell still present ON Aug 8
```
Expected results as commented. Remove the temporary probe markup from Step 3 after verifying (leave the real integration to Task 4).

- [ ] **Step 6: Commit**

```bash
cd /Users/joeortega/Documents/Projects/Hope
git add events.js main.js
git commit -m "feat: editable events component with PT roll-off and crash-safety"
```

---

### Task 3: Home page

Fill `index.html` `<main>` with the hero (one sentence + one button above the fold), problem prose, three-door cards, upcoming-events strip (uses Task 2's `#events-next`), short Hope bio, and free-reset link. All copy verbatim from the brief.

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: chrome from Task 1; `renderEvents()` + `#events-next` from Task 2 (include `<script src="events.js"></script>` before `main.js`).

- [ ] **Step 1: Write the Home `<main>`**

Paste inside `<main class="page">`. `aria-current="page"` on the Home nav link. Add `<script src="events.js"></script>` immediately before `<script src="main.js"></script>`.

```html
<section class="hero">
  <div class="kicker">Nervous System Coach · Intuitive Life Coach</div>
  <div class="rule"></div>
  <h1>You look good on paper.<br /><em>And something still feels off.</em></h1>
  <p class="lede">There's a simpler path to a more comfortable life — through the nervous system. I'll show you.</p>
  <div class="cta-row">
    <a href="https://form.jotform.com/261404619331047" class="btn">Save my seat — August 8</a>
    <a href="free-reset.html" class="btn-secondary">Start with the free reset</a>
  </div>
</section>

<section class="block">
  <div class="prose">
    <p>You've been carrying pain so long you stopped calling it pain. The tight jaw. The 3 a.m. wake-ups. The short fuse you keep apologizing for. That's not who you are. That's your nervous system doing what it was trained to do.</p>
  </div>
</section>

<section class="block">
  <div class="sec-label">Three ways in</div>
  <div class="cards">
    <a class="card" href="workshops.html">
      <div class="card-kicker">Come to a workshop</div>
      <h4>Live, in person</h4>
      <p>The next one is Break the Spell — August 8.</p>
    </a>
    <a class="card" href="coaching.html">
      <div class="card-kicker">Work with me one-on-one</div>
      <h4>Ninety days</h4>
      <p>Your nervous system, your patterns, your plan.</p>
    </a>
    <a class="card" href="speaking.html">
      <div class="card-kicker">Bring me to your people</div>
      <h4>Built To Break</h4>
      <p>The keynote for rooms full of people who'd never sit in a therapy circle.</p>
    </a>
  </div>
</section>

<section class="block">
  <div class="sec-label">Upcoming</div>
  <div class="events" id="events-next"></div>
  <div class="cta-row"><a href="workshops.html#upcoming" class="btn-secondary">See all upcoming events</a></div>
</section>

<section class="block">
  <div class="sec-label">Who I am</div>
  <div class="prose">
    <p>I'm Hope Kimple. I spent sixteen years with my hands on bodies in chronic pain — and I learned the pain almost never starts where it hurts. Now I teach people to read what their body's been trying to tell them. Body. Mind. Gut. All three.</p>
  </div>
</section>
```

- [ ] **Step 2: Verify in the browser (desktop + mobile)**

Open `http://localhost:8765/index.html` with `browse`.
- Desktop: hero headline, lede, and the "Save my seat — August 8" button all visible; three door-cards link to Workshops/Coaching/Speaking; the Upcoming strip shows Break the Spell (from `events.js`); "See all upcoming events" anchors to `workshops.html#upcoming`.
- Mobile (≤600px): the hero sentence + primary button are visible without scrolling; cards stack to one column.
- Confirm exactly one filled `.btn` above the fold (the secondary is an underlined text link).

- [ ] **Step 3: Assert copy is verbatim**

```bash
cd /Users/joeortega/Documents/Projects/Hope
grep -q "You've been carrying pain so long you stopped calling it pain" index.html && echo PASS || echo FAIL
grep -q "Save my seat — August 8" index.html && echo PASS || echo FAIL
grep -q "Body. Mind. Gut. All three." index.html && echo PASS || echo FAIL
```
Expected: three PASS.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: Home page content"
```

---

### Task 4: Workshops page

Fill `workshops.html`: upcoming-events list (Task 2's `#events-list`, with `id="upcoming"` anchor), Break the Spell featured block, five pricing-tier cards, removable early-bird banner, and the four-workshop series. Verbatim copy.

**Files:**
- Modify: `workshops.html`

**Interfaces:**
- Consumes: chrome (Task 1); `renderEvents()` + `#events-list` (Task 2). Add `<script src="events.js"></script>` before `main.js`.

- [ ] **Step 1: Write the Workshops `<main>`**

`aria-current="page"` on the Workshops nav link.

```html
<section class="block" id="upcoming" style="margin-top:0;">
  <div class="sec-label">Upcoming events</div>
  <div class="events" id="events-list"></div>
  <p class="events-note">The workshops run in cycles, so you never miss one. Get the Full Series pass and attend all four as they come around — or join the list for dates.</p>
</section>

<section class="block">
  <div class="sec-label">Featured</div>
  <div class="hero" style="margin-bottom:24px;">
    <h1>Break the <em>Spell</em></h1>
    <p class="lede">Saturday, August 8 · 11 AM–1 PM<br />Prodigy Fitness · 6689 Owens Dr., Suite 300, Pleasanton, CA 94588</p>
  </div>
  <div class="prose">
    <p>At some point, you made agreements about who you are. What you're worth. What strength is allowed to feel like. You didn't sign them on purpose — and most of them are still running your life today, quietly, from the driver's seat.</p>
    <p>In two hours, we name the agreement that's steering you now, and we start writing a new one. Not the version that kept you small — the one that moves you forward. You leave with a workbook, the tools to keep going, and a room of people who get it.</p>
  </div>
</section>

<section class="block">
  <div class="sec-label">Reserve your seat</div>
  <!-- EARLY-BIRD BANNER — DELETE THIS ENTIRE DIV AFTER JULY 11 -->
  <div class="earlybird">Early bird: use code <strong>earlybird</strong> for $20 off — expires July 11.</div>
  <!-- END EARLY-BIRD BANNER -->
  <div class="tiers">
    <div class="tier"><div class="t-name">Sliding scale</div><div class="t-price">$67</div><div class="t-note">“Money shouldn't be the reason you don't come.”</div></div>
    <div class="tier featured"><div class="t-name">Standard seat</div><div class="t-price">$97</div><div class="t-note">The workshop + workbook</div></div>
    <div class="tier"><div class="t-name">Supporter seat</div><div class="t-price">$147</div><div class="t-note">Your seat covers part of someone else's</div></div>
    <div class="tier"><div class="t-name">Buddy pass</div><div class="t-price">$194</div><div class="t-note">Two seats — bring someone who needs this</div></div>
    <div class="tier"><div class="t-name">Full Series pass</div><div class="t-price">$497</div><div class="t-note">All four workshops + workbooks · attend any cycle, anytime</div></div>
  </div>
  <div class="cta-row" style="margin-top:24px;">
    <a href="https://form.jotform.com/261404619331047" class="btn">Save my seat</a>
    <a href="https://form.jotform.com/261404619331047" class="btn-secondary">Get the Full Series pass</a>
  </div>
</section>

<section class="block">
  <div class="sec-label">The series</div>
  <div class="hero" style="margin-bottom:24px;">
    <h1>Four workshops. <em>One rebuild.</em></h1>
    <p class="lede">Each one stands alone. Together, they rebuild your foundation.</p>
  </div>
  <div class="cards" style="grid-template-columns:repeat(2,1fr);">
    <div class="card"><h4>Reset &amp; Realign</h4><p>Map your life honestly. Leave with a plan small enough to actually start tomorrow.</p></div>
    <div class="card"><h4>Fear vs. Intuition</h4><p>Fear and your gut feel almost identical in the body. Learn to tell them apart — and trust what you hear.</p></div>
    <div class="card"><h4>Break the Spell</h4><p>Find the agreement running your life. Start rewriting it.</p></div>
    <div class="card"><h4>Boundaries &amp; Becoming</h4><p>Everything lands in real life. Boundaries, not walls — and the tools to hold them when your alarm system fires.</p></div>
  </div>
  <div class="prose" style="margin-top:24px;text-align:center;">
    <p>The series runs in cycles all year. The Full Series pass — <em>$497</em> — is your seat at all four, every time they come around. Come once. Come again when it hits different.</p>
  </div>
</section>
```

- [ ] **Step 2: Verify in the browser**

Open `http://localhost:8765/workshops.html` with `browse`.
- Events list renders four rows at top; the section has `id="upcoming"` (so `workshops.html#upcoming` from Home scrolls here).
- Break the Spell featured block + both paragraphs present.
- Five tier cards show $67 / $97 / $147 / $194 / $497 with correct notes; Standard seat is visually featured.
- Early-bird banner visible with code `earlybird`.
- Four series cards render 2-up (1-up on mobile).

- [ ] **Step 3: Assert prices, code, and removability**

```bash
cd /Users/joeortega/Documents/Projects/Hope
for p in 67 97 147 194 497; do grep -q "\$$p" workshops.html && echo "PASS $p" || echo "FAIL $p"; done
grep -q "code <strong>earlybird</strong>" workshops.html && echo "PASS code" || echo "FAIL code"
grep -q "DELETE THIS ENTIRE DIV AFTER JULY 11" workshops.html && echo "PASS marker" || echo "FAIL marker"
grep -qi "magic" workshops.html && echo "FAIL: BNI code leaked" || echo "PASS: no BNI code"
```
Expected: five price PASS, PASS code, PASS marker, PASS no BNI code.

- [ ] **Step 4: Commit**

```bash
git add workshops.html
git commit -m "feat: Workshops page — events, Break the Spell, tiers, series"
```

---

### Task 5: Coaching page

Fill `coaching.html`: the 90-day container leads (founding scarcity stated plainly, no countdown widget), then the other-offers table, primary button routes to Contact.

**Files:**
- Modify: `coaching.html`

**Interfaces:**
- Consumes: chrome (Task 1). No events/forms. `aria-current="page"` on Coaching.

- [ ] **Step 1: Write the Coaching `<main>`**

```html
<section class="hero">
  <div class="kicker">1:1 Coaching</div>
  <div class="rule"></div>
  <h1>Ninety days.<br /><em>Your nervous system, your patterns, your plan.</em></h1>
</section>

<section class="block" style="margin-top:32px;">
  <div class="prose">
    <p>This is the deep work. One-on-one, over ninety days, we go through all three pillars — body, mind, gut — applied to your actual life. Not a course. Not a curriculum on autopilot. Me, with you, week after week, until the new way of operating is yours.</p>
    <p><em>Founding rate: $1,200 — first five clients, before August 8.</em> The official rate is $2,497. When the five spots fill, the founding rate is gone for good.</p>
  </div>
  <div class="cta-row" style="margin-top:28px;">
    <a href="contact.html" class="btn">Claim a founding spot</a>
  </div>
</section>

<section class="block">
  <div class="sec-label">Other ways to work with me</div>
  <table class="offers">
    <thead><tr><th>Offer</th><th>Price</th><th>What it is</th></tr></thead>
    <tbody>
      <tr><td>Single session</td><td>$175</td><td>One focused hour on what's loudest right now</td></tr>
      <tr><td>Reset &amp; Realign private intensive</td><td>$197</td><td>The workshop, one-on-one, built around your life</td></tr>
      <tr><td>Break the Spell private intensive</td><td>$197</td><td>Find and rewrite your agreement, privately</td></tr>
      <tr><td>Fear vs. Intuition private intensive</td><td>$225</td><td>Trauma-aware, nervous-system-first, recorded for you</td></tr>
      <tr><td>VIP half-day</td><td>$800</td><td>One deep afternoon. Come with a knot, leave with a plan</td></tr>
      <tr><td>Full-year mentorship</td><td>$3,600</td><td>A year of ongoing support while the change takes root</td></tr>
    </tbody>
  </table>
</section>
```

- [ ] **Step 2: Verify in the browser**

Open `http://localhost:8765/coaching.html` with `browse`.
- 90-day container copy + "$1,200 founding / $2,497 official / five spots" present.
- Exactly one filled `.btn` — "Claim a founding spot" → `contact.html`.
- Offers table shows all six rows with correct prices.
- No countdown/timer widget anywhere.

- [ ] **Step 3: Assert prices + routing**

```bash
cd /Users/joeortega/Documents/Projects/Hope
for p in "1,200" "2,497" 175 197 225 800 "3,600"; do grep -q "\$$p" coaching.html && echo "PASS $p" || echo "FAIL $p"; done
grep -q '<a href="contact.html" class="btn">Claim a founding spot</a>' coaching.html && echo "PASS route" || echo "FAIL route"
```
Expected: all price PASS + PASS route.

- [ ] **Step 4: Commit**

```bash
git add coaching.html
git commit -m "feat: Coaching page — 90-day container + offers"
```

---

### Task 6: Contact page + GHL form handler

Fill `contact.html` with the "Let's talk" form (name, email, reason dropdown, message) posting to a GHL webhook, plus contact details. Add the form handler to `main.js`.

**Files:**
- Modify: `contact.html`, `main.js`

**Interfaces:**
- Consumes: chrome (Task 1), form styles from `styles.css` (Task 1).
- Produces: `initContactForm()` in `main.js`, called on `DOMContentLoaded`.

> **Launch-blocker note:** the GHL webhook URL below is a named placeholder (`CONTACT_WEBHOOK_URL`). Before launch, create an Inbound Webhook trigger in Hope's GHL sub-account (location `21LM8fQd0yonyBxXNzxY`) whose workflow emails `hope@offeringhope.co` with the `reason` value in the subject, and paste its URL here. The form validates and shows success regardless; only delivery depends on the real URL.

- [ ] **Step 1: Write the Contact `<main>`**

`aria-current="page"` on Contact.

```html
<section class="hero">
  <div class="kicker">Contact</div>
  <div class="rule"></div>
  <h1>Let's <em>talk</em>.</h1>
  <p class="lede">Whether it's a seat, a spot, or a stage — start here.</p>
</section>

<section class="block" style="margin-top:24px;">
  <div class="form-wrap" id="contactWrap" style="max-width:560px;margin:0 auto;">
    <form id="contactForm" novalidate>
      <div class="field">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" autocomplete="name" required />
        <div class="field-error">Required.</div>
      </div>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="email" required />
        <div class="field-error">Please enter a valid email.</div>
      </div>
      <div class="field">
        <label for="reason">What are you reaching out about?</label>
        <select id="reason" name="reason" required>
          <option value="">Select one…</option>
          <option value="Workshop">Workshop</option>
          <option value="Coaching">Coaching</option>
          <option value="Speaking">Speaking</option>
          <option value="Something else">Something else</option>
        </select>
        <div class="field-error">Required.</div>
      </div>
      <div class="field">
        <label for="message">Message</label>
        <textarea id="message" name="message" required></textarea>
        <div class="field-error">Required.</div>
      </div>
      <div class="cta-row" style="margin-top:8px;">
        <button type="submit" class="btn" id="contactSubmit">Send message</button>
      </div>
    </form>
    <div class="form-success">
      <div class="rule"></div>
      <h3 style="font-size:28px;">Thank you — it's on its way.</h3>
      <p class="prose"><em>I'll be in touch soon.</em></p>
    </div>
  </div>
  <div class="contact-meta">
    <a href="mailto:hope@offeringhope.co">hope@offeringhope.co</a> · <a href="tel:+15102096744">510-209-6744</a><br />
    Hayward, California<br />
    <a href="https://instagram.com/offering_hope_coach">@offering_hope_coach</a>
  </div>
</section>
```

- [ ] **Step 2: Add `initContactForm()` to `main.js`**

```js
var CONTACT_WEBHOOK_URL = ""; // TODO before launch: GHL inbound-webhook trigger URL (Hope's sub-account)

function initContactForm() {
  var form = document.getElementById("contactForm");
  var wrap = document.getElementById("contactWrap");
  if (!form || !wrap) return;
  var submit = document.getElementById("contactSubmit");

  function validate() {
    var ok = true;
    ["name", "email", "reason", "message"].forEach(function (id) {
      var el = document.getElementById(id);
      var f = el.closest(".field");
      if (!el.value.trim()) { f.classList.add("has-error"); ok = false; }
      else { f.classList.remove("has-error"); }
    });
    var email = document.getElementById("email");
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.closest(".field").classList.add("has-error"); ok = false;
    }
    return ok;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validate()) return;
    submit.disabled = true;
    submit.textContent = "Sending…";
    var data = Object.fromEntries(new FormData(form).entries());
    data.subject = "[Website] " + (data.reason || "Contact") + " — " + (data.name || "");
    try {
      if (CONTACT_WEBHOOK_URL) {
        await fetch(CONTACT_WEBHOOK_URL, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
        });
      } else {
        await new Promise(function (r) { setTimeout(r, 500); }); // demo when URL not yet set
        console.log("Contact submit (no webhook set):", data);
      }
      wrap.classList.add("submitted");
    } catch (err) {
      console.error(err);
      submit.disabled = false;
      submit.textContent = "Try again";
    }
  });
}
```

Update `DOMContentLoaded`:
```js
document.addEventListener("DOMContentLoaded", function () {
  initNav();
  renderEvents();
  initContactForm();
});
```

- [ ] **Step 3: Verify in the browser**

Open `http://localhost:8765/contact.html` with `browse`.
- Submit empty → four fields show "Required."/validation, no navigation.
- Fill name + invalid email + reason + message → email field errors.
- Fill valid values, submit → form hides, success message shows ("Thank you — it's on its way.").
- Confirm the email/phone/IG links: `mailto:hope@offeringhope.co`, `tel:+15102096744`, `instagram.com/offering_hope_coach`.

- [ ] **Step 4: Assert contact details + subject wiring**

```bash
cd /Users/joeortega/Documents/Projects/Hope
grep -q "mailto:hope@offeringhope.co" contact.html && echo PASS || echo FAIL
grep -q "offering_hope_coach" contact.html && echo PASS || echo FAIL
grep -q 'data.subject = ' main.js && echo PASS || echo FAIL
grep -q "CONTACT_WEBHOOK_URL" main.js && echo PASS || echo FAIL
```
Expected: four PASS.

- [ ] **Step 5: Commit**

```bash
git add contact.html main.js
git commit -m "feat: Contact page + GHL-backed form handler"
```

---

### Task 7: Cross-page polish, OG meta, and final verification

Add Open Graph/Twitter meta to the four content pages (the old page's OG copy was Built-To-Break-specific and stale), do a whole-site link + hard-rule sweep, and confirm the deliverable.

**Files:**
- Modify: `index.html`, `workshops.html`, `coaching.html`, `contact.html`

- [ ] **Step 1: Add OG/Twitter meta to the four content pages**

Into each `<head>` (values per page). Example for `index.html`:
```html
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Offering Hope" />
<meta property="og:title" content="Offering Hope — Nervous System Coaching with Hope Kimple" />
<meta property="og:description" content="A simpler path to a more comfortable life — through the nervous system. Workshops, 1:1 coaching, and the Built To Break keynote." />
<meta property="og:url" content="https://offeringhope.co/" />
<meta property="og:image" content="https://offeringhope.co/assets/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
```
- `workshops.html` — og:title "Break the Spell — August 8 · Offering Hope", og:description "A live nervous-system workshop in Pleasanton. Save your seat.", og:url `https://offeringhope.co/workshops.html`.
- `coaching.html` — og:title "1:1 Nervous System Coaching · Offering Hope", og:description "Ninety days, one-on-one, through body, mind, and gut. Founding rate open now.", og:url `.../coaching.html`.
- `contact.html` — og:title "Contact · Offering Hope", og:description "A seat, a spot, or a stage — start here.", og:url `.../contact.html`.

- [ ] **Step 2: Whole-site link + no-404 sweep**

With the server running, use `browse` to visit all 9 pages and click every nav + footer link. Confirm zero 404s and that `aria-current="page"` highlights the right nav item on each of the four content pages.

- [ ] **Step 3: Final hard-rule grep across all pages**

```bash
cd /Users/joeortega/Documents/Projects/Hope
echo "== forbidden term ==";  grep -ril "somatic practitioner" *.html && echo FAIL || echo PASS
echo "== stale handle ==";    grep -ril "offering_hope_life_coach" *.html && echo FAIL || echo PASS
echo "== BNI code ==";        grep -ril "magic" *.html && echo FAIL || echo PASS
echo "== aho walls ==";       grep -l "aho.html" index.html speaking.html coaching.html about.html | grep -v footer && echo "check: aho only in footer" ; grep -o 'aho.html' index.html | wc -l
echo "== tagline present =="; grep -L "There's Always Hope." index.html workshops.html coaching.html contact.html && echo "FAIL: missing footer tagline" || echo PASS
```
Expected: PASS on forbidden term, stale handle, BNI code; `aho.html` appears in each page exactly once (the footer link); all four content pages contain the tagline.

- [ ] **Step 4: Mobile spot-check**

With `browse` at ≤600px width, confirm on Home + Workshops: nav collapses to `☰`, hero fits above the fold, cards/tiers stack to one column, no horizontal scroll.

- [ ] **Step 5: Commit**

```bash
git add index.html workshops.html coaching.html contact.html
git commit -m "feat: OG/Twitter meta + final Phase 1 verification"
```

---

## Self-Review (completed during authoring)

**Spec coverage:** §3 brand kit → Task 1 CSS tokens/fonts + grep bans. §4 nav/footer/one-button → Task 1 chrome + per-task single-`.btn` checks. §5 architecture (static, duplicated chrome, shared CSS/JS) → Task 1. §6 events component (PT roll-off, never-empty, crash-safety, "see all" link) → Task 2 + Home/Workshops integration. §7 Jotform wiring, early-bird removable banner, no-countdown, GHL contact backend, BNI code absent → Tasks 4/5/6. §9 SEO titles + noindex stubs → Tasks 1/7. §10 verbatim page copy → Tasks 3–6. Phase-2 pages → stubs in Task 1. Aho separation → footer-only link, grep-checked in Task 7.

**Placeholder scan:** No "TBD/TODO" left as work items except the intentional, clearly-scoped `CONTACT_WEBHOOK_URL` launch-blocker (documented, with a working demo fallback) and Hope's asset placeholders (out of Phase-1 code scope). All code steps show complete code.

**Type/name consistency:** `renderEvents()`, `#events-next` (Home), `#events-list` (Workshops), `OH_EVENTS`, `eventRowHTML()`, `pacificTodayISO()`, `initNav()`, `initContactForm()`, `CONTACT_WEBHOOK_URL` are defined once and referenced consistently. Jotform URL `https://form.jotform.com/261404619331047` identical everywhere. `.btn` / `.btn-secondary` used consistently.

## Deferred to Phase 2

Speaking, Shop, About, Free Reset, Aho full builds (replace stubs, remove their `noindex`); Aho green/gold/parchment palette + compliance disclaimer + dispensary links; Free Reset GHL capture; removing stale bundled `Offering Hope - Built To Break*.html` files; wiring the real `CONTACT_WEBHOOK_URL`; swapping placeholder photos/video for Hope's real assets.
