# Offering Hope — Full Website Redesign · Design Spec

**Date:** 2026-07-08
**Author:** Joe (BizPleaser.AI) with Claude
**Source of truth for content:** Hope's `Offering_Hope_Website_Brief_for_Joe` (July 2026). Where this spec and the brief disagree, the brief wins. Copy inside the brief's gold-bordered blocks is final website copy — used verbatim, not smoothed out. If a layout genuinely needs shorter or longer text than the brief supplies, **ask Hope before rewriting** — do not paraphrase her voice to fit.
**Repo:** `Jortega1085/offering-hope-landing` · live at `offeringhope.co` (GitHub Pages, CNAME already set)

---

## 1. Goal

Replace the single expired-event landing page (Built To Break, June 27 — now past) with a full multi-page business site covering Hope Kimple's speaking, workshops, 1:1 coaching, shop, and the Aho pain-relief line — built so Hope can keep it current (via Claude) without a developer.

**The one rule that governs every page:** each page ends in exactly one primary button. Through August 8, the site's #1 job is filling the room at **Break the Spell (Aug 8)** and the **five founding 90-day coaching spots**. Every page moves a visitor toward one of those two doors.

---

## 2. Scope & phasing

Time pressure: `earlybird` promo code dies **July 11**; Break the Spell is **August 8**.

- **Phase 1 (now):** Home, Workshops, **Coaching, and Contact** — both money doors working end to end. Both time-boxed offers (Break the Spell seats **and** the 5 founding 90-day spots) must convert from day one; the founding-spot CTA ("Claim a founding spot") routes to Contact, so Coaching and Contact ship with Phase 1, not stubbed. Plus the shared design system, the editable events component, Jotform wiring, early-bird banner, GHL-backed Contact form, and lightweight "coming soon" stub pages for the remaining nav/footer destinations so nothing 404s.
- **Phase 2 (right behind it):** Speaking, Shop, About, Free Reset, Aho — replacing their stubs with full content.

**Why Coaching + Contact are in Phase 1:** the brief's own timing note (Part 4) sanctions launching Home + Workshops first, but the site's #1 job through Aug 8 is *both* doors. Stubbing Coaching/Contact would leave the founding-spot path (deadline Aug 8, "gone when they're gone") a dead end for the entire early-bird window. Contact is also the cheapest page in the site and the routing target for two offers, so it earns its place in Phase 1.

Each phase is its own implementation plan. This spec covers the whole site; the phase-1 plan builds only the Phase 1 set.

---

## 3. Brand kit (applies to every page except Aho's page body)

| Token | Value |
|---|---|
| Gold | `#B8962E` — accents, buttons, headings, dividers |
| Near-black (ink) | `#1A1A1A` — body text, dark sections |
| Backgrounds | warm white / cream family. Airy. **Not** a dark-mode site. |
| Headings font | Cormorant Garamond |
| Body / UI font | Jost |
| Tagline | "There's Always Hope." — sign-off in footer / end of pages only, never a repeated header |
| Logo | OH lotus mark (Hope supplying full-color / black / white-reversed) |

**Titles for Hope, site-wide:** "Nervous System Coach · Intuitive Life Coach". **Never** the words "somatic practitioner" — the current landing page uses it and it must not carry over.

**Contact / handles (site-wide):** `offeringhope.co` · `hope@offeringhope.co` · `510-209-6744` · Instagram `@offering_hope_coach` (note: NOT `@offering_hope_life_coach` — the old handle in prior docs is stale).

**The Method — reinforce on every page (brief Part 1, "quietly reinforce that structure"):** the three pillars — **Somatic Awareness · Mental Awareness · Intuitive Awareness** — taught through the four-workshop series (Reset & Realign, Fear vs. Intuition, Break the Spell, Boundaries & Becoming), with the Built To Break keynote as the front door into that series. This is a design directive, not a copy block: every page should quietly echo the body/mind/gut → workshops → keynote structure (in section framing, the "three doors," the About narrative), without hammering it.

---

## 4. Site map & navigation

**Main nav (this order):** Home · Workshops · Coaching · Speaking · Shop · About · Contact

**Not in main nav:**
- **Free Reset** (email-capture page) — linked from Home, About, and the footer.
- **Aho** (info page) — linked from the footer and one small card at the bottom of Shop. Nowhere else.

**Footer (every page), verbatim:**
> Offering Hope · Hands of Hope Wellness Center LLC · Hayward, CA
> Workshops · Coaching · Speaking · Shop · About · Free Reset · Aho · Contact
> There's Always Hope.

**One-primary-button rule, mechanically:** each page has exactly one *primary-style* button treatment (the dark/gold `.btn` filled style). Pages with many actions (Workshops has event rows, five tier cards, and the banner) are fine — only ONE gets the primary visual weight per view; everything else is visually secondary (outline/text link). The rule is about visual hierarchy pointing at one door, not about literally one clickable element.

### Aho separation — hard rule
- **No** Aho link from Home, Speaking, Coaching, or About. Aho is reachable from only two link *locations*: the site-wide footer (which appears on all 9 pages) and one card at the bottom of Shop.
- Aho page carries a `noindex` meta tag.
- Reason: Hope sends her Speaking page to corporate bookers and business materials to lenders; cannabis content one click away costs her real money.

---

## 5. Architecture

**Static HTML/CSS/JS, no build step.** Keeps GitHub Pages trivial and lets Claude edit any page directly.

```
index.html          Home
workshops.html      Workshops
coaching.html       Coaching
speaking.html       Speaking
shop.html           Shop
about.html          About
contact.html        Contact
free-reset.html     Free Reset  (not in main nav)
aho.html            Aho         (not in main nav; noindex; own palette)
styles.css          shared design system (tokens, type, buttons, cards, event rows, nav, footer)
main.js             mobile nav toggle, events renderer, form helpers
events.js           the editable events data list
assets/             logos, portrait, lotus bg, og image, product/photo placeholders
```

**Header & footer are duplicated into each HTML file, not JS-injected.** Nav links live in the HTML → better SEO, no content flash, resilient if JS is slow. Claude edits the 9 files together when the nav changes. Only the *events* data is centralized (see §6), because that's what Hope changes often.

**Design system in `styles.css`:** CSS custom properties for the brand tokens; reusable classes for `.btn` (one primary style), section labels, cards, the event row, pricing cards, the masthead nav, and the footer. Carry over the existing page's proven visual language (Cormorant/Jost, lotus background, gold rules) — it already matches Hope's brand board — but rebuild markup to the new structure and strip "somatic practitioner."

**Mobile-first.** Most traffic arrives from Instagram on a phone. Home hero = one sentence + one button visible without scrolling. No hero video backgrounds, no heavy animation libraries — the site should "feel like a nervous system that's regulated."

---

## 6. The events component (editable by Hope)

The brief's central build requirement. One data list, rendered in two places.

- **Data:** `events.js` exports an array. Each entry: `{ name, dateISO | cycleWindow, timeVenue, buttonLabel, buttonLink }`.
  - Dated event → `dateISO` set; button links to registration (Jotform).
  - Cycle event ("this fall", Workshop 1/2/4) → `cycleWindow` string instead of a date; button links to the Full Series pass / Free Reset list.
- **Render (`main.js`):**
  - **Workshops page** — full "Upcoming events" list at the top.
  - **Home page** — "Upcoming" strip showing the *next* dated event only, plus a secondary "See all upcoming events" link that anchors to the Upcoming Events section at the top of Workshops (`workshops.html#upcoming`) — per brief.
  - **Roll-off timing:** an event counts as "past" only *after the end of its event day in America/Los_Angeles* (not UTC midnight). Break the Spell (Aug 8, 11 AM–1 PM) must stay on the site through the whole event day while Hope fills walk-in seats — it rolls off Aug 9, not the morning of Aug 8.
  - **Never empty:** if no dated event remains (e.g., just after Aug 8 before fall dates are added), the render falls back to the first cycle row or a Full Series / "join the list for dates" CTA. The strip is never blank.
- **Crash-safety:** the render is wrapped in try/catch. A malformed `events.js` entry (a stray quote from a Hope-via-Claude edit) must not blank the section on either money page — on error, fall back to a static hardcoded "Break the Spell — Aug 8 · Save my seat" line. Include a `<noscript>` line with the same static event so JS-off visitors still see the next event. (Workshops also keeps its static "Break the Spell featured" section below the list as a second safety net.)
- **Editing model:** Hope (via Claude) adds/edits/removes one array entry — no design or markup touched. Corporate/private bookings never appear here; only public events.

---

## 7. Forms, payments, wiring

- **Workshop registration:** existing **Jotform `261404619331047`** — has all five tiers + early-bird wired. **Do not rebuild.** Embed as an iframe on Workshops; Home hero "Save my seat" links full-screen to it (`https://form.jotform.com/261404619331047`).
- **Early-bird banner** (Workshops): one clearly-marked, single-element text banner — code `earlybird`, $20 off, **expires July 11**. Implement as a plain HTML block wrapped in an HTML comment marker (`<!-- EARLY-BIRD BANNER — DELETE AFTER JULY 11 -->`) so Claude/Hope removes it in one edit on July 12. Do **not** gate it behind a JS date check (inherits the crash-safety/timezone fragility) and do **not** bake it into any image.
- **BNI code "Magic" (15% off):** lives only inside the Jotform, shared by Hope in person. **Never appears anywhere on the website.** Don't touch it in the form; just never surface it.
- **Coaching** → "Claim a founding spot" routes to Contact ("book a call") — sells through conversation, no cart. **No fake-urgency countdown widgets** (brief); the five-spot scarcity is stated plainly in copy.
- **Speaking** (Phase 2) → "Check Hope's availability" → Contact form / `hope@offeringhope.co`. Fee range **not published**; use "Fees vary by format and audience — request the speaker one-sheet."

### Form backend — GoHighLevel (Hope's account)

GitHub Pages is static (no server), so Contact and Free Reset post to **GHL webhooks on Hope's location** — the same GoHighLevel account the old landing page already posted to (`services.leadconnectorhq.com/hooks/21LM8fQd0yonyBxXNzxY/...`), where her branded email (`mg.offeringhope.co`) is live. One system, already wired, and it settles the newsletter hand-off.

- **Contact form** → GHL webhook → routes to `hope@offeringhope.co` with the "What are you reaching out about?" dropdown value (Workshop / Coaching / Speaking / Something else) in the subject line, so Hope triages from her phone. Form is a plain HTML form + `fetch()` POST to the webhook (same pattern as the old page's JS), with client-side validation and a success state.
- **Free Reset** (Phase 2) → first name + email → GHL webhook → delivers the Hope Reset audio, then drops the contact into Hope's existing GHL newsletter. This resolves the brief's "which email tool" question: GHL.
- Each webhook URL is a per-form trigger created in Hope's GHL sub-account; store the URLs as clearly-named constants in `main.js`. (Coordinate the exact trigger/automation setup with Hope's GHL sub-account when wiring.)

Primary-button labels are literal actions, never "Submit" / "Learn more": **"Save my seat" · "Claim a founding spot" · "Check Hope's availability" · "Send me the reset."**

---

## 8. Placeholders & assets

Build with tasteful, clearly-labeled placeholder slots for everything Hope still owes; professional photography is scheduled on her side.

Photo/video slots to leave room for: hero headshot (Home), working shot (About), workshop-room photos (Workshops), product shots (Shop + Aho), two video embeds (Speaker Video on Speaking; Video Business Card on Home or About).

On hand today: `assets/oh-logo.png`, `assets/hope-portrait.jpg`, `assets/lotus-bg.png`, `assets/og-image.jpg`, favicon/apple-touch-icon, plus Hope's **new white logo** (`~/Downloads/New logo white .png`) to add to `assets/`.

---

## 9. SEO

- Per-page `<title>` on the pattern **"Nervous System Coaching in Northern CA | Offering Hope"**; targeted terms: nervous system coach, life coach Hayward, workshops East Bay, chronic stress.
- Keep OG/Twitter meta per page (update the stale Built-To-Break OG copy).
- **Aho page: `noindex`.** Everything else indexes normally. Add a code comment in `aho.html` noting Hope may lift the `noindex` later if the strategy changes (per brief).
- **Phase-1 "coming soon" stubs get `noindex`** while they're thin — a bare stub indexing under the title pattern hurts a fresh SEO profile more than helping. Remove the `noindex` from each page as its real content ships in Phase 2.
- Google Business Profile setup/claim recommended alongside launch (local search matters for workshops) — out of scope for the code build, noted for Hope/Joe.

---

## 10. Page content reference (verbatim copy lives in Hope's brief)

All final copy is in `Offering_Hope_Website_Brief_for_Joe`, Part 3. Summary of each page's structure and its single primary button:

| Page | Structure | Primary button |
|---|---|---|
| **Home** (P1) | hero → problem → three doors (Workshop/Coaching/Speaking cards) → upcoming-events strip (next event) → who Hope is (short) → free-reset link → footer | **Save my seat — August 8** (→ Jotform); secondary: Start with the free reset |
| **Workshops** (P1) | upcoming-events list (top) → Break the Spell featured → 5 pricing tier cards ($67 sliding / $97 standard / $147 supporter / $194 buddy / $497 full series) + early-bird banner → four-workshop series | **Save my seat**; secondary: Get the Full Series pass |
| **Coaching** (P1) | 90-day container ($1,200 founding, first 5 before Aug 8; official $2,497) leads → other offers table (single $175, intensives $197–$225, VIP $800, full-year $3,600). Founding scarcity stated plainly, **no countdown widgets** | **Claim a founding spot** → Contact |
| **Contact** (P1) | "Let's talk" → GHL-backed form (name, email, reason dropdown, message) + `hope@offeringhope.co` / phone / Hayward / IG | send message |
| **Speaking** (P2) | hero (Built To Break, plain language, no jargon, **no Aho**) → what bookers get → speaker-video slot → one-sheet request | **Check Hope's availability** → Contact |
| **Shop** (P2) | The Body Speaks oracle deck $39 (**pre-order/notify until inventory confirmed**) → 3 journals (lunar / year-long / companion — names/prices TBD placeholders) → one quiet Aho card at bottom. **Provisional page:** Hope noted she has nothing made for Shop yet — treat as an extended stub / last P2 page, not just missing photos | product CTA |
| **About** (P2) | "I spent sixteen years listening to bodies" narrative (verbatim) → three doors again + free-reset. Heritage stays a quiet thread — no "Native-owned" iconography, don't expand. **Reconciles with / replaces** Joe's existing bio — the two must not run side by side | three doors |
| **Free Reset** (P2) | minimal, standard header only, no nav distractions → audio-for-email trade (GHL-backed) | **Send me the reset** |
| **Aho** (P2) | own visual world (deep forest green / gold / parchment cream); hero → 2 products (salve 2oz, roll-on 30ml — roll-on $40 direct) → 3 testimonial slots (TBD) → where-to-buy dispensary links → compliance disclaimer; `noindex` | where-to-buy (external) |

### Aho compliance — non-negotiable (P2)
No health/medical claims anywhere ("treats/cures/heals/relieves" forbidden). Bottom disclaimer required verbatim: *"These products contain cannabis and are available only through licensed California retailers to adults 21 and over. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease."* Dispensary list (Cookies-Hayward, Park Social-Alameda, Berners-Merced, The Station-Fresno, Cookies-Redding; Platinum Distribution) confirmed with Hope right before launch — it changes as batches sell.

---

## 11. Open confirmations from Hope (block launch, not the build)

Carried from the brief's Part 5. None block starting Phase 1; items 1–2 are the phase-1-relevant ones.

1. **Assets:** OH + Aho logo files, headshots/working/workshop-room photos, product photos, speaker video / video business card, Hope Reset audio.
2. **Journal names, prices, descriptions** (Shop) — placeholders until supplied.
3. **Three Aho testimonials.**
4. Confirmations: (a) The Body Speaks — pre-order or in stock? (b) Aho pricing — salve $35 vs $45, roll-on $40; **recommended default is to omit all Aho prices** (the page doesn't sell, retailers set price) unless Hope wants them shown. (c) dispensary list still accurate? (d) ~~which email tool the Free Reset form feeds~~ — **resolved: GHL** (see §7).

---

## 12. Out of scope

- Rebuilding the Jotform or building a custom cart/checkout.
- Cannabis e-commerce (Aho sells nothing on-site — brochure only).
- Backend/CMS. Content edits happen in the HTML via Claude.
- Google Business Profile setup (recommended to Hope separately).
- Migrating the newsletter system (already built on Hope's side; Free Reset just feeds it).
