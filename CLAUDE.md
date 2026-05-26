# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See `README.md` for the project layout overview. This file is for Claude-specific operating notes.

## Source of truth

**`Hope Landing Page/index.html`** is the editable source for the keynote landing page. It's a 30 KB plain HTML/CSS file with two real asset references (`assets/oh-logo.png`, `assets/lotus-bg.png`). All edits to the landing page should be made here.

`Hope Landing Page/Offering Hope Landing v1.html` is a separate, longer landing page — not the same content as `index.html`. Treat them as two distinct pages.

The 3.6 MB `Offering Hope - Built To Break.html` files (in the project root and inside `Hope Landing Page/`) are **bundled outputs** of `index.html`. They go stale whenever `index.html` is edited. The bundler tool that produced them is not in this repo.

## Bundle format (in case you ever need it)

The bundled HTML uses two inline JSON blobs:

- `<script type="__bundler/manifest">{uuid: {mime, compressed, data}}` — assets, base64-encoded, optionally gzip-compressed. In the current bundle nothing is compressed; payloads are pure base64.
- `<script type="__bundler/template">"<full HTML/CSS string>"` — the page HTML with UUID strings standing in for `src` / `url(...)` references. A bootstrap script (the only top-level `<script>`) decodes the manifest, builds blob URLs, and substitutes them into the template at runtime.

**Do not hand-edit base64 payloads.** If you must modify a bundle in place (e.g., to tweak CSS without re-running the external bundler), edit the decoded template JSON string — never the manifest entries.

## Local preview

```sh
cd "Hope Landing Page"
python3 -m http.server 8765
# open http://localhost:8765/index.html
```

A server may already be running on port 8765 from earlier in the session — check `lsof -i :8765` before starting a new one.

## File size cautions

- Never `Read` the bundled HTML in full — it exceeds context limits. Use `grep`/`offset+limit`, or use `ctx_execute_file` to process it in a sandbox.
- `assets/oh-logo.png` is 1.9 MB and `oh-logo-raw.png` is 1.6 MB; the bundled HTML inlines `oh-logo.png` as base64 which is most of its size.

## When the user says "the logo"

The logo PNG is `assets/oh-logo.png`, referenced from `index.html` as `<img class="logo">` inside `<header class="masthead">`. CSS rule: `.masthead .logo` at line ~140. A separate mobile override exists in a `@media (max-width: 600px)` block at line ~166.
