# GEO / Structured-Data Build Report

**Date:** 2026-07-08  
**Branch:** redesign/full-site  

## Summary

All tasks from the geo-schema-brief completed and verified.

## §1 — Canonicals

Added exactly one `<link rel="canonical">` to each of the 8 existing content pages (right after `<title>`):

| Page | Canonical |
|------|-----------|
| index.html | https://offeringhope.co/ |
| workshops.html | https://offeringhope.co/workshops.html |
| coaching.html | https://offeringhope.co/coaching.html |
| speaking.html | https://offeringhope.co/speaking.html |
| shop.html | https://offeringhope.co/shop.html |
| about.html | https://offeringhope.co/about.html |
| contact.html | https://offeringhope.co/contact.html |
| free-reset.html | https://offeringhope.co/free-reset.html |

aho.html: untouched (0 canonicals, 0 JSON-LD).

## §2 — Per-page JSON-LD

| Page | Schema Type | JSON.parse |
|------|-------------|------------|
| index.html | LocalBusiness + Person (@graph) | ok |
| workshops.html | Event | ok |
| coaching.html | Service | ok |
| speaking.html | Service | ok |
| shop.html | Product | ok |
| about.html | Person | ok |
| contact.html | ContactPage | ok |
| free-reset.html | (none — canonical only) | n/a |

## §3 — faq.html (new page)

- Created with identical chrome (head meta structure, header, footer) from about.html
- Title: `Frequently Asked Questions | Offering Hope`
- Meta description and canonical set per brief
- 9 Q&A h2/p pairs rendered in body
- FAQPage JSON-LD with 9 mainEntity items — all parse ok
- Not in main nav (no aria-current on faq link)
- Sitewide footer not modified

## §4 — FAQ visible links

- **index.html**: `<div class="cta-row"><a href="faq.html" class="btn-secondary">Common questions</a></div>` added at end of "Who I am" section
- **contact.html**: `<div class="cta-row" style="margin-top:18px;"><a href="faq.html" class="btn-secondary">Read common questions</a></div>` added below `.contact-meta` block

## §5 — sitemap.xml

Added:
```xml
<url><loc>https://offeringhope.co/faq.html</loc><lastmod>2026-07-08</lastmod><priority>0.7</priority></url>
```
aho.html remains excluded.

## §6 — Verification Results (Node.js JSON.parse)

| Page | Canonicals | ld+json count | JSON.parse | somatic practitioner |
|------|-----------|--------------|------------|---------------------|
| index.html | 1 | 1 | ok | false |
| workshops.html | 1 | 1 | ok | false |
| coaching.html | 1 | 1 | ok | false |
| speaking.html | 1 | 1 | ok | false |
| shop.html | 1 | 1 | ok | false |
| about.html | 1 | 1 | ok | false |
| contact.html | 1 | 1 | ok | false |
| free-reset.html | 1 | 0 | n/a | false |
| faq.html | 1 | 1 | ok | false |
| aho.html | 0 | 0 | n/a | false |

All JSON-LD blocks parse without errors. No page contains "somatic practitioner". aho.html has 0 canonicals and 0 JSON-LD (untouched). sitemap includes faq.html and excludes aho.html.

**Verification method:** Node.js `JSON.parse` on each extracted `<script type="application/ld+json">` block via `ctx_execute`.
