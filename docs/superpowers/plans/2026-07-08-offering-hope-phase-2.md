# Offering Hope — Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Replace the five "coming soon" stubs (Speaking, Shop, About, Free Reset, Aho) with their real content, completing the site.

**Architecture:** Same as Phase 1 — plain static HTML/CSS/JS, no build step. The shared design system (`styles.css`), chrome (duplicated header/footer), and `main.js` already exist. Each task fills one stub page's `<main>` with verbatim brief copy using existing classes; Aho adds a scoped palette to `styles.css` and a GHL-style form is added for Free Reset.

**Tech Stack:** HTML5, existing CSS design system, vanilla JS, GoHighLevel webhook (Free Reset capture).

**Spec:** `docs/superpowers/specs/2026-07-08-offering-hope-site-design.md`. **Content source of truth:** Hope's July 2026 brief — copy is VERBATIM, never smoothed/expanded.

## Global Constraints

- Brand: gold `#B8962E`, ink `#1A1A1A`, cream backgrounds. Cormorant Garamond (headings) + Jost (body). Never "somatic practitioner" — titles are "Nervous System Coach · Intuitive Life Coach".
- Contact/handles: `hope@offeringhope.co` · `510-209-6744` · `@offering_hope_coach`.
- One primary-style `.btn` per page (visual hierarchy → one door). Button labels are literal actions.
- Copy VERBATIM from the brief. Bracketed `[ALL-CAPS]` items are placeholders Hope still owes — render them as clearly-marked placeholder text, do not invent content.
- **Aho hard rule:** Aho is linked ONLY from the site footer (present on every page) and ONE card at the bottom of Shop. Nowhere else — not Speaking, About, etc. Aho page keeps `<meta name="robots" content="noindex">`. Speaking, Shop, About, Free Reset get their `noindex` REMOVED (they should index).
- Speaking page: plain language only, NO wellness jargon, and per the hard rule NOTHING on it links to or mentions Aho (the footer link is the sitewide chrome exception, allowed).
- Aho compliance: no health/medical claims ("treats/cures/heals/relieves" forbidden); required disclaimer verbatim at the page bottom.
- Footer (every page) unchanged from Phase 1.

## File Structure

```
speaking.html    Speaking   (fill stub, remove noindex)
shop.html        Shop       (fill stub, remove noindex; Aho card at bottom)
about.html       About      (fill stub, remove noindex)
free-reset.html  Free Reset (fill stub, remove noindex; GHL form)
aho.html         Aho        (fill stub, KEEP noindex; own palette)
styles.css       add scoped .aho-* palette + a few shared helpers
main.js          add initResetForm() + RESET_WEBHOOK_URL
```

Each page already has the shared header (no `aria-current` needed for Speaking/Shop/About since they're in nav — actually add `aria-current="page"` to the matching nav link for Speaking/Shop/About; Free Reset and Aho are not in the main nav so no `aria-current`). All already have the shared footer.

## Verification Tooling

- Local server: `cd /Users/joeortega/Documents/Projects/Hope && python3 -m http.server 8765`; open `http://localhost:8765/<page>.html`.
- Browser: use the `browse` tool for rendering/interaction checks.
- Content assertions: `grep` for required/forbidden strings per task.

---

### Task 1: Speaking page

Fills `speaking.html`. Audience: event bookers/HR — gets shared cold, must stand alone. Plain language, no jargon, no Aho.

**Files:** Modify `speaking.html`.

- [ ] **Step 1: Remove `noindex`, add `aria-current`, fill `<main>`**

Delete the `<meta name="robots" content="noindex" />` line. On the Speaking nav link add `aria-current="page"`. Replace the stub `<main class="page">` contents with:

```html
<section class="hero">
  <div class="kicker">Keynote Speaking</div>
  <div class="rule"></div>
  <h1>Built To <em>Break</em></h1>
  <p class="lede">What your body is carrying that your mind won't say.</p>
</section>

<section class="block" style="margin-top:24px;">
  <!-- SPEAKER VIDEO SLOT — Hope to supply file / YouTube link (Michael Brunner, Brogan Video) -->
  <div class="video-slot" aria-label="Speaker video coming soon">Speaker video coming soon</div>
  <div class="prose">
    <p>Your highest performers are running on empty and calling it normal. They look good on paper and still feel like something's off. Built To Break is a keynote for exactly those rooms — high performers, men, first responders, tradespeople — the people who'd never sit in a therapy circle, delivered by someone who spent sixteen years with her hands on what stress actually does to a body.</p>
    <p>No jargon. No incense. Real science, a true story, and tools your people will use that same week.</p>
  </div>
</section>

<section class="block">
  <div class="sec-label">What bookers get</div>
  <div class="outcomes">
    <div class="outcome"><div class="dot"></div><div class="body">A 60–90 minute keynote, customized to your audience and industry</div></div>
    <div class="outcome"><div class="dot"></div><div class="body">Workshop and half-day formats available</div></div>
    <div class="outcome"><div class="dot"></div><div class="body">A speaker who has stood in front of skeptical rooms and won them</div></div>
    <div class="outcome"><div class="dot"></div><div class="body">A follow-on path for attendees who want more — the Offering Hope workshop series</div></div>
  </div>
</section>

<section class="block" style="text-align:center;">
  <div class="prose"><p style="font-size:17px;">Fees vary by format and audience — request the speaker one-sheet.</p></div>
  <div class="cta-row" style="margin-top:20px;"><a href="contact.html" class="btn">Check Hope's availability</a></div>
</section>
```

Note: `.outcomes`/`.outcome`/`.dot` classes exist in the Phase-1 CSS? They were defined in the ORIGINAL landing page but may not be in `styles.css`. Verify — if absent, Task 5 adds them (see styles additions) OR use `.cards` instead. **Confirm `.outcomes` exists in `styles.css`; if not, use a simple `<ul>` list styled inline.** (See Task 5 Step 1 which adds `.outcomes` + `.video-slot` to styles.css — do Task 5's style additions FIRST if building out of order, or add them here.)

- [ ] **Step 2: Verify**

```bash
cd /Users/joeortega/Documents/Projects/Hope
grep -q 'name="robots"' speaking.html && echo "FAIL noindex still present" || echo "PASS no noindex"
grep -qi "aho" speaking.html && echo "FAIL: aho on Speaking body" || echo "PASS no aho ref"
grep -q "Fees vary by format and audience" speaking.html && echo PASS || echo FAIL
grep -q "Check Hope's availability" speaking.html && echo PASS || echo FAIL
grep -qiE "somatic|salve|cannabis|incense.{0,3}$" speaking.html && echo "check jargon" || echo "PASS plain"
```
Note: "No incense" appears in the copy (that's fine — it's the verbatim line). The grep above is a heuristic; the real check is: no "somatic practitioner", no Aho/cannabis/salve mentions. Browser: confirm one filled `.btn` → contact.html, video slot placeholder visible.

- [ ] **Step 3: Commit**

```bash
git add speaking.html && git commit -m "feat: Speaking page"
```

---

### Task 2: Shop page

Fills `shop.html`. The Body Speaks deck is real (pre-order until inventory confirmed); the three journals are placeholders Hope owes. One quiet Aho card at the bottom (one of only two Aho links on the site).

**Files:** Modify `shop.html`.

- [ ] **Step 1: Remove `noindex`, add `aria-current`, fill `<main>`**

Delete the robots meta. Add `aria-current="page"` to the Shop nav link. Replace `<main>` contents:

```html
<section class="hero">
  <div class="kicker">Shop</div>
  <div class="rule"></div>
  <h1>Tools for the <em>work</em></h1>
</section>

<section class="block" style="margin-top:24px;">
  <div class="cards" style="grid-template-columns:1fr 1fr;">
    <div class="card">
      <!-- PRODUCT PHOTO SLOT: The Body Speaks deck -->
      <div class="card-kicker">Oracle deck · Pre-order</div>
      <h4>The Body Speaks — $39</h4>
      <p>Fifty-five cards for learning your body's language. Drawn from sixteen years of listening to what pain is actually saying. Companion book included.</p>
      <a href="contact.html" class="btn-secondary">Notify me when it ships</a>
    </div>
    <div class="card">
      <div class="card-kicker">Journal</div>
      <h4>[LUNAR JOURNAL NAME] — $[PRICE]</h4>
      <p>[HOPE TO SUPPLY: one or two lines describing the lunar journal, in her voice.]</p>
    </div>
    <div class="card">
      <div class="card-kicker">Journal</div>
      <h4>[YEAR-LONG JOURNAL NAME] — $[PRICE]</h4>
      <p>[HOPE TO SUPPLY: one or two lines describing the year-long journal.]</p>
    </div>
    <div class="card">
      <div class="card-kicker">Journal · pairs with the workshops</div>
      <h4>[COMPANION JOURNAL NAME] — $[PRICE]</h4>
      <p>[HOPE TO SUPPLY: description. The journal used alongside the workshop cycle and 1:1 coaching.]</p>
    </div>
  </div>
  <p class="events-note" style="text-align:center;">The Body Speaks first print run is on its way — reserve yours and we'll tell you the moment it lands.</p>
</section>

<section class="block">
  <div class="aho-card">
    <div>
      <div class="card-kicker">From the same hands</div>
      <strong>Aho — handcrafted topical pain relief.</strong>
    </div>
    <a href="aho.html" class="btn-secondary">Learn more</a>
  </div>
</section>
```

`.aho-card` style is added in Task 5's style additions (a simple bordered flex row). If building Task 2 first, add this to `styles.css`:
```css
.aho-card { display:flex; align-items:center; justify-content:space-between; gap:16px; border:1px solid var(--line-gold); border-radius:3px; padding:20px 24px; background:rgba(244,238,225,0.5); }
.aho-card strong { font-family:var(--serif); font-size:20px; font-weight:500; }
```

- [ ] **Step 2: Verify**

```bash
cd /Users/joeortega/Documents/Projects/Hope
grep -q 'name="robots"' shop.html && echo "FAIL noindex" || echo "PASS no noindex"
grep -q "The Body Speaks — \$39" shop.html && echo PASS || echo FAIL
grep -c "HOPE TO SUPPLY" shop.html   # expect 3 (the three journals)
grep -c "aho.html" shop.html         # expect 2 (footer link + the Shop Aho card)
```
Browser: confirm 4 product cards + the Aho card at the bottom linking to aho.html.

- [ ] **Step 3: Commit**

```bash
git add shop.html styles.css && git commit -m "feat: Shop page + Aho card"
```

---

### Task 3: About page

Fills `about.html`. Buyer-facing bio, verbatim. Heritage stays a quiet thread — NO "Native-owned" iconography, do not expand. Ends with the three doors + free reset.

**Files:** Modify `about.html`.

- [ ] **Step 1: Remove `noindex`, add `aria-current`, fill `<main>`**

Delete robots meta. Add `aria-current="page"` to the About nav link. Replace `<main>`:

```html
<section class="hero">
  <div class="kicker">About Hope</div>
  <div class="rule"></div>
  <h1>I spent sixteen years <em>listening to bodies.</em></h1>
</section>

<section class="block" style="margin-top:24px;">
  <!-- WORKING-SHOT PHOTO SLOT: Hope to supply -->
  <div class="prose">
    <p>I started as a massage therapist specializing in chronic pain. Sixteen-plus years, thousands of hours, hands on people who had been hurting so long they stopped calling it pain. And here's what all those bodies taught me: the pain almost never starts where it hurts. It refers. It travels. It carries stories.</p>
    <p>I also learned it the hard way. I built a life that looked good on paper — and my body kept the receipts until I couldn't ignore them anymore. In 2013 it all came down. What I found on the other side of that collapse became the Offering Hope method: three pillars — what your body knows, what your mind repeats, what your gut has been trying to say all along.</p>
    <p>My heritage runs through this work like a quiet thread. I come from people who understood that the body, the land, and the spirit were never separate things. I don't teach ceremony. I teach you to listen.</p>
    <p>Now I do this work as a Nervous System Coach and Intuitive Life Coach — in workshops, one-on-one, and on stages in front of the exact people who'd never book a session on their own.</p>
    <p><em>There's always Hope. That's not just my name.</em></p>
  </div>
</section>

<section class="block">
  <div class="sec-label">Three ways in</div>
  <div class="cards">
    <a class="card" href="workshops.html"><div class="card-kicker">Come to a workshop</div><h4>Live, in person</h4><p>The next one is Break the Spell — August 8.</p></a>
    <a class="card" href="coaching.html"><div class="card-kicker">Work with me one-on-one</div><h4>Ninety days</h4><p>Your nervous system, your patterns, your plan.</p></a>
    <a class="card" href="speaking.html"><div class="card-kicker">Bring me to your people</div><h4>Built To Break</h4><p>The keynote for rooms full of people who'd never sit in a therapy circle.</p></a>
  </div>
  <div class="cta-row" style="margin-top:24px;"><a href="free-reset.html" class="btn-secondary">Start with the free reset</a></div>
</section>
```

- [ ] **Step 2: Verify**

```bash
cd /Users/joeortega/Documents/Projects/Hope
grep -q 'name="robots"' about.html && echo "FAIL noindex" || echo "PASS no noindex"
grep -q "I spent sixteen years" about.html && echo PASS || echo FAIL
grep -q "There's always Hope. That's not just my name." about.html && echo PASS || echo FAIL
grep -qi "native-owned" about.html && echo "FAIL: added iconography" || echo "PASS no added badge"
grep -qi "somatic practitioner" about.html && echo FAIL || echo PASS
```
Browser: confirm three-door cards + free-reset link; no filled `.btn` competing (the three doors are cards; free-reset is secondary) — this page's "primary" is the three doors, per spec §10.

- [ ] **Step 3: Commit**

```bash
git add about.html && git commit -m "feat: About page"
```

---

### Task 4: Free Reset page + GHL form handler

Fills `free-reset.html` — email-for-audio capture, minimal, no nav distractions beyond the standard header. Posts to a GHL webhook (placeholder until Hope's URL).

**Files:** Modify `free-reset.html`, `main.js`.

**Interfaces:** Produces `initResetForm()` + `RESET_WEBHOOK_URL` in `main.js`, called on `DOMContentLoaded`.

- [ ] **Step 1: Remove `noindex`, fill `<main>`** (no `aria-current` — not in main nav)

Delete robots meta. Replace `<main>`:

```html
<section class="hero">
  <div class="kicker">Free</div>
  <div class="rule"></div>
  <h1>Five minutes. <em>That's all this asks.</em></h1>
  <p class="lede">The Hope Reset is a short guided audio that settles your nervous system down from alarm — so you can hear yourself think again. Free. Yours. Use it in the car, at your desk, at 3 a.m.</p>
</section>

<section class="block" style="margin-top:8px;">
  <div class="form-wrap" id="resetWrap" style="max-width:460px;margin:0 auto;">
    <form id="resetForm" novalidate>
      <div class="field">
        <label for="reset_name">First name</label>
        <input id="reset_name" name="first_name" type="text" autocomplete="given-name" required />
        <div class="field-error">Required.</div>
      </div>
      <div class="field">
        <label for="reset_email">Email</label>
        <input id="reset_email" name="email" type="email" autocomplete="email" required />
        <div class="field-error">Please enter a valid email.</div>
      </div>
      <div class="cta-row" style="margin-top:8px;">
        <button type="submit" class="btn" id="resetSubmit">Send me the reset</button>
      </div>
    </form>
    <div class="form-success">
      <div class="rule"></div>
      <h3 style="font-size:26px;">Check your inbox.</h3>
      <p class="prose"><em>The Hope Reset is on its way.</em></p>
    </div>
  </div>
  <!-- HOPE TO SUPPLY: the Hope Reset audio file / hosted link, delivered by the GHL automation -->
</section>
```

- [ ] **Step 2: Add `initResetForm()` to `main.js`**

Append near `initContactForm()`:

```js
var RESET_WEBHOOK_URL = ""; // TODO before launch: GHL webhook that emails the Hope Reset audio + adds to newsletter

function initResetForm() {
  var form = document.getElementById("resetForm");
  var wrap = document.getElementById("resetWrap");
  if (!form || !wrap) return;
  var submit = document.getElementById("resetSubmit");

  function validate() {
    var ok = true;
    var name = document.getElementById("reset_name");
    var email = document.getElementById("reset_email");
    [name, email].forEach(function (el) {
      var f = el.closest(".field");
      if (!el.value.trim()) { f.classList.add("has-error"); ok = false; }
      else { f.classList.remove("has-error"); }
    });
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
    try {
      if (RESET_WEBHOOK_URL) {
        await fetch(RESET_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      } else {
        await new Promise(function (r) { setTimeout(r, 500); });
        console.log("Reset submit (no webhook set):", data);
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

Update the `DOMContentLoaded` handler to also call `initResetForm()` (keep `initNav()`, `renderEvents()`, `initContactForm()`).

- [ ] **Step 3: Verify**

```bash
cd /Users/joeortega/Documents/Projects/Hope
grep -q 'name="robots"' free-reset.html && echo "FAIL noindex" || echo "PASS no noindex"
grep -q "Send me the reset" free-reset.html && echo PASS || echo FAIL
grep -q "initResetForm" main.js && echo PASS || echo FAIL
node --check main.js && echo "PASS main.js syntax" || echo "FAIL syntax"
```
Browser: submit empty → 2 field errors; valid submit → success ("Check your inbox.").

- [ ] **Step 4: Commit**

```bash
git add free-reset.html main.js && git commit -m "feat: Free Reset page + GHL capture handler"
```

---

### Task 5: Aho page + scoped palette

Fills `aho.html` — a brochure (sells nothing), its own forest-green/gold/parchment world, KEEPS `noindex`, compliance disclaimer verbatim. Adds the scoped palette (and the shared `.outcomes`/`.video-slot`/`.aho-card` helpers if not already added) to `styles.css`.

**Files:** Modify `styles.css`, `aho.html`.

- [ ] **Step 1: Add styles to `styles.css`** (append at end)

```css
/* ---------- Shared helpers used by Phase 2 pages ---------- */
.outcomes { display:grid; grid-template-columns:1fr 1fr; gap:18px 32px; }
.outcome { display:flex; gap:14px; align-items:flex-start; }
.outcome .dot { flex:none; width:8px; height:8px; background:var(--gold); border-radius:50%; margin-top:10px; transform:rotate(45deg); }
.outcome .body { font-family:var(--serif); font-size:18px; line-height:1.5; color:var(--ink-soft); }
@media (max-width:600px){ .outcomes{ grid-template-columns:1fr; } }
.video-slot { aspect-ratio:16/9; width:100%; border:1px dashed var(--line-gold); border-radius:3px; display:flex; align-items:center; justify-content:center; color:var(--muted); font-family:var(--sans); font-size:13px; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:28px; background:rgba(244,238,225,0.4); }
.aho-card { display:flex; align-items:center; justify-content:space-between; gap:16px; border:1px solid var(--line-gold); border-radius:3px; padding:20px 24px; background:rgba(244,238,225,0.5); }
.aho-card strong { font-family:var(--serif); font-size:20px; font-weight:500; }

/* ---------- Aho — its own world (forest green / gold / parchment) ---------- */
.aho-page { --aho-green:#20392c; --aho-green-deep:#16281f; --aho-parch:#efe7d2; }
.aho-page { background:var(--aho-parch); position:relative; z-index:1; }
body.aho::before { opacity:0.08; } /* dial the sitewide lotus back on Aho */
.aho-hero { background:var(--aho-green); color:var(--aho-parch); text-align:center; padding:60px 32px; border-radius:3px; }
.aho-hero .kicker { color:var(--gold-soft); }
.aho-hero h1 { color:var(--aho-parch); font-size:clamp(48px,8vw,84px); margin:14px 0; }
.aho-hero .lede { font-family:var(--serif); font-style:italic; font-size:clamp(18px,2.3vw,22px); color:var(--gold-pale,#e7d9b0); max-width:620px; margin:0 auto 18px; line-height:1.5; }
.aho-hero .prose p { color:var(--aho-parch); }
.aho-page .sec-label { color:var(--aho-green); border-color:rgba(32,57,44,0.28); }
.aho-page h4, .aho-page h3 { color:var(--aho-green-deep); }
.aho-product { border:1px solid rgba(32,57,44,0.25); border-radius:3px; padding:24px; background:rgba(255,255,255,0.4); }
.aho-product h4 { font-family:var(--serif); font-size:24px; margin-bottom:8px; }
.aho-product p { font-family:var(--serif); font-size:17px; color:var(--ink-soft); line-height:1.6; }
.aho-where a { color:var(--aho-green); text-decoration:underline; text-underline-offset:3px; }
.aho-disclaimer { font-family:var(--sans); font-size:11px; line-height:1.6; color:var(--muted); border-top:1px solid rgba(32,57,44,0.25); margin-top:40px; padding-top:20px; }
```

- [ ] **Step 2: Fill `aho.html` — KEEP `noindex`, add `aho` body class**

Keep the `<meta name="robots" content="noindex" />` line (add a comment: `<!-- noindex per strategy; Hope may lift later -->`). Set `<body class="aho">`. Replace `<main class="page">` with `<main class="page aho-page">` and this content:

```html
<section class="aho-hero">
  <div class="kicker">Aho</div>
  <h1>Aho</h1>
  <p class="lede">Real pain relief. No high. Just hope.</p>
  <div class="prose" style="max-width:640px;margin:0 auto;">
    <p>"Aho" means so be it — I hear you. It's a word of affirmation from Indigenous tradition, and it's what I want your body to feel when this goes on: heard.</p>
    <p>I spent sixteen years as a massage therapist working chronic pain with my hands. Aho is what I made for the hours I couldn't be in the room — handcrafted, small-batch, built by someone who knows exactly where it hurts and why.</p>
  </div>
</section>

<section class="block">
  <div class="sec-label">The products</div>
  <div class="cards" style="grid-template-columns:1fr 1fr; background:transparent; border:none; gap:16px;">
    <div class="aho-product">
      <!-- PRODUCT PHOTO SLOT: Aho Salve -->
      <h4>Aho Salve — 2 oz jar</h4>
      <p>The original. Slow-release, deep-working. For the shoulders, the low back, the hands — the places that carry your day.</p>
    </div>
    <div class="aho-product">
      <!-- PRODUCT PHOTO SLOT: Aho Roll-On -->
      <h4>Aho Roll-On — 30 ml</h4>
      <p>Instant, targeted, mess-free. The one my massage clients reach for first. Roll it where it hurts and get on with your life.</p>
    </div>
  </div>
</section>

<section class="block">
  <div class="sec-label">What people say</div>
  <div class="outcomes">
    <div class="outcome"><div class="dot"></div><div class="body">[TESTIMONIAL 1 — roll-on, from a massage client — HOPE TO SUPPLY]</div></div>
    <div class="outcome"><div class="dot"></div><div class="body">[TESTIMONIAL 2 — from a BNI member — HOPE TO SUPPLY]</div></div>
    <div class="outcome"><div class="dot"></div><div class="body">[TESTIMONIAL 3 — salve, long-term user — HOPE TO SUPPLY]</div></div>
  </div>
</section>

<section class="block aho-where">
  <div class="sec-label">Where to find it</div>
  <div class="prose">
    <p>Available at licensed California dispensaries:</p>
  </div>
  <div class="outcomes" style="margin-top:12px;">
    <div class="outcome"><div class="dot"></div><div class="body"><a href="#">Cookies — Hayward</a></div></div>
    <div class="outcome"><div class="dot"></div><div class="body"><a href="#">Park Social — Alameda</a></div></div>
    <div class="outcome"><div class="dot"></div><div class="body"><a href="#">Berners — Merced</a></div></div>
    <div class="outcome"><div class="dot"></div><div class="body"><a href="#">The Station — Fresno</a></div></div>
    <div class="outcome"><div class="dot"></div><div class="body"><a href="#">Cookies — Redding</a></div></div>
  </div>
  <div class="prose" style="margin-top:16px;">
    <p>Distributed by Platinum Distribution. Ask your local shop to carry Aho.</p>
  </div>
  <!-- Confirm dispensary list + real links with Hope right before launch — it changes as batches sell. -->
  <p class="aho-disclaimer">These products contain cannabis and are available only through licensed California retailers to adults 21 and over. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
</section>
```

**No prices** on Aho (per spec — the page doesn't sell; safer default). **No health claims** — the copy above is written to stay on the right side; do not add "treats/cures/relieves".

- [ ] **Step 3: Verify**

```bash
cd /Users/joeortega/Documents/Projects/Hope
grep -q 'name="robots" content="noindex"' aho.html && echo "PASS noindex kept" || echo "FAIL noindex removed"
grep -q "These products contain cannabis" aho.html && echo "PASS disclaimer" || echo "FAIL"
grep -q "Real pain relief. No high. Just hope." aho.html && echo PASS || echo FAIL
grep -ciE "treats|cures|heals|relieves (arthritis|inflammation|pain)" aho.html   # expect 0 medical claims
grep -c "HOPE TO SUPPLY" aho.html   # expect 3 (testimonials)
```
Browser: confirm the forest-green hero renders (its own palette), two product cards, three testimonial placeholders, dispensary list, disclaimer at the bottom. Confirm the footer Aho link + Shop card are the only paths here (no new outbound Aho links added elsewhere).

- [ ] **Step 4: Commit**

```bash
git add styles.css aho.html && git commit -m "feat: Aho page (noindex, own palette, compliance)"
```

---

## Self-Review (completed during authoring)

**Spec coverage:** Speaking §10 (plain, no-Aho, one-sheet, video slot) → Task 1. Shop §10 (deck pre-order, 3 journal placeholders, Aho card = 2nd Aho link) → Task 2. About §10 (verbatim bio, quiet heritage, three doors) → Task 3. Free Reset §10 + §7 (GHL capture) → Task 4. Aho §10 + compliance + own palette + noindex kept → Task 5. `noindex` removed from the four indexable pages, kept on Aho → Tasks 1-5. Aho separation (footer + Shop only) → grep checks in Tasks 1/2/5.

**Placeholder scan:** Bracketed `[HOPE TO SUPPLY]` / `[NAME]` / `[PRICE]` / `[TESTIMONIAL]` are intentional, brief-mandated content placeholders rendered as visible placeholder text — NOT plan gaps. `RESET_WEBHOOK_URL` empty is the documented launch-blocker (mirrors CONTACT_WEBHOOK_URL). All code steps show complete code.

**Type/name consistency:** `initResetForm()`, `RESET_WEBHOOK_URL`, `#resetForm`/`#resetWrap`/`#resetSubmit`, `.aho-page`/`.aho-hero`/`.aho-product`/`.aho-card`/`.aho-disclaimer`/`.outcomes`/`.video-slot` defined once (Task 5 styles) and referenced consistently. `.outcomes`/`.video-slot`/`.aho-card` are added in Task 5 Step 1 — if executing strictly in order, Tasks 1 and 2 reference them before Task 5 creates them; therefore **Task 5's Step 1 style additions must be applied before verifying Tasks 1 and 2 in the browser.** Executor note: apply the Task 5 `styles.css` block first (it's additive and harmless), or accept that Speaking/Shop visual verification completes after Task 5. Grep/content checks for Tasks 1-2 do not depend on the CSS.

## Deferred to launch (not build)

- Paste real `RESET_WEBHOOK_URL` (Free Reset) and `CONTACT_WEBHOOK_URL` (Contact) from Hope's GHL sub-account.
- Hope's assets: product photos (deck, journals, both Aho products), working shot, speaker video, Hope Reset audio, journal names/prices/descriptions, three Aho testimonials, confirmed dispensary list + links, Body Speaks in-stock-vs-preorder confirmation.
- Remove/`noindex` legacy `Offering Hope - Built To Break (1).html` + `review.html`.
