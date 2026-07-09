# Offering Hope — Full Website Redesign · Design Spec

**Date:** 2026-07-08
**Author:** Joe (BizPleaser.AI) with Claude
**Source of truth for content:** Hope's `Offering_Hope_Website_Brief_for_Joe` (July 2026). Where this spec and the brief disagree, the brief wins. Copy inside the brief's gold-bordered blocks is final website copy — used verbatim, not smoothed out.
**Repo:** `Jortega1085/offering-hope-landing` · live at `offeringhope.co` (GitHub Pages, CNAME already set)

---

## 1. Goal

Replace the single expired-event landing page (Built To Break, June 27 — now past) with a full multi-page business site covering Hope Kimple's speaking, workshops, 1:1 coaching, shop, and the Aho pain-relief line — built so Hope can keep it current (via Claude) without a developer.

**The one rule that governs every page:** each page ends in exactly one primary button. Through August 8, the site's #1 job is filling the room at **Break the Spell (Aug 8)** and the **five founding 90-day coaching spots**. Every page moves a visitor toward one of those two doors.

---

## 2. Scope & phasing

Time pressure: `earlybird` promo code dies **July 11**; Break the Spell is **August 8**.

- **Phase 1 (now):** Home + Workshops — the two money pages. Plus shared design system, the editable events component, Jotform wiring, early-bird banner, and lightweight "coming soon" stub pages for every other nav/footer destination so nothing 404s.
- **Phase 2 (right behind it):** Coaching, Speaking, Shop, About, Free Reset, Aho, Contact — replacing their stubs with full content.

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

### Aho separation — hard rule
- **No** Aho link from Home, Speaking, Coaching, or About. Footer and Shop card only (two internal links total).
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
  - **Home page** — "Upcoming" strip showing the *next* dated event only.
  - Events whose `dateISO` is in the past auto-roll-off. The list never shows a stale date and never sits empty (cycle rows keep it populated).
- **Editing model:** Hope (via Claude) adds/edits/removes one array entry — no design or markup touched. Corporate/private bookings never appear here; only public events.

---

## 7. Forms, payments, wiring

- **Workshop registration:** existing **Jotform `261404619331047`** — has all five tiers + early-bird wired. **Do not rebuild.** Embed as an iframe on Workshops; Home hero "Save my seat" links full-screen to it (`https://form.jotform.com/261404619331047`).
- **Early-bird banner** (Workshops): one clearly-marked, single-element text banner — code `earlybird`, $20 off, **expires July 11**. Built to lift out in one edit (removable by Hope, or auto-removed July 12). Not baked into any image.
- **BNI code "Magic" (15% off):** lives only inside the Jotform, shared by Hope in person. **Never appears anywhere on the website.** Don't touch it in the form; just never surface it.
- **Coaching** → routes to Contact ("book a call") — sells through conversation, no cart.
- **Speaking** → "Check Hope's availability" → Contact form / `hope@offeringhope.co`. Fee range **not published**; use "Fees vary by format and audience — request the speaker one-sheet."
- **Contact form** → routes submissions to `hope@offeringhope.co` with the "What are you reaching out about?" dropdown value (Workshop / Coaching / Speaking / Something else) in the subject line, so Hope triages from her phone.
- **Free Reset** → first name + email capture → delivers the Hope Reset audio, then her monthly newsletter. Which email tool it feeds is TBD — confirm with Hope (§11).

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
- **Aho page: `noindex`.** Everything else indexes normally.
- Google Business Profile setup/claim recommended alongside launch (local search matters for workshops) — out of scope for the code build, noted for Hope/Joe.

---

## 10. Page content reference (verbatim copy lives in Hope's brief)

All final copy is in `Offering_Hope_Website_Brief_for_Joe`, Part 3. Summary of each page's structure and its single primary button:

| Page | Structure | Primary button |
|---|---|---|
| **Home** (P1) | hero → problem → three doors (Workshop/Coaching/Speaking cards) → upcoming-events strip (next event) → who Hope is (short) → free-reset link → footer | **Save my seat — August 8** (→ Jotform); secondary: Start with the free reset |
| **Workshops** (P1) | upcoming-events list (top) → Break the Spell featured → 5 pricing tier cards ($67 sliding / $97 standard / $147 supporter / $194 buddy / $497 full series) + early-bird banner → four-workshop series | **Save my seat**; secondary: Get the Full Series pass |
| **Coaching** (P2) | 90-day container ($1,200 founding, first 5 before Aug 8; official $2,497) leads → other offers table (single $175, intensives $197–$225, VIP $800, full-year $3,600) | **Claim a founding spot** → Contact |
| **Speaking** (P2) | hero (Built To Break, plain language, no jargon, **no Aho**) → what bookers get → speaker-video slot → one-sheet request | **Check Hope's availability** → Contact |
| **Shop** (P2) | The Body Speaks oracle deck $39 (**pre-order/notify until inventory confirmed**) → 3 journals (lunar / year-long / companion — names/prices TBD placeholders) → one quiet Aho card at bottom | product CTA |
| **About** (P2) | "I spent sixteen years listening to bodies" narrative (verbatim) → three doors again + free-reset. Heritage stays a quiet thread — no "Native-owned" iconography, don't expand | three doors |
| **Free Reset** (P2) | minimal, standard header only, no nav distractions → audio-for-email trade | **Send me the reset** |
| **Aho** (P2) | own visual world (deep forest green / gold / parchment cream); hero → 2 products (salve 2oz, roll-on 30ml) → 3 testimonial slots (TBD) → where-to-buy dispensary links → compliance disclaimer; `noindex` | where-to-buy (external) |
| **Contact** (P2) | "Let's talk" → form (name, email, reason dropdown, message) + `hope@offeringhope.co` / phone / Hayward / IG | send message |

### Aho compliance — non-negotiable (P2)
No health/medical claims anywhere ("treats/cures/heals/relieves" forbidden). Bottom disclaimer required verbatim: *"These products contain cannabis and are available only through licensed California retailers to adults 21 and over. These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease."* Dispensary list (Cookies-Hayward, Park Social-Alameda, Berners-Merced, The Station-Fresno, Cookies-Redding; Platinum Distribution) confirmed with Hope right before launch — it changes as batches sell.

---

## 11. Open confirmations from Hope (block launch, not the build)

Carried from the brief's Part 5. None block starting Phase 1; items 1–2 are the phase-1-relevant ones.

1. **Assets:** OH + Aho logo files, headshots/working/workshop-room photos, product photos, speaker video / video business card, Hope Reset audio.
2. **Journal names, prices, descriptions** (Shop) — placeholders until supplied.
3. **Three Aho testimonials.**
4. Confirmations: (a) The Body Speaks — pre-order or in stock? (b) Aho salve price — $35 / $45 / no price shown? (c) dispensary list still accurate? (d) which email tool the Free Reset form feeds?

---

## 12. Out of scope

- Rebuilding the Jotform or building a custom cart/checkout.
- Cannabis e-commerce (Aho sells nothing on-site — brochure only).
- Backend/CMS. Content edits happen in the HTML via Claude.
- Google Business Profile setup (recommended to Hope separately).
- Migrating the newsletter system (already built on Hope's side; Free Reset just feeds it).
