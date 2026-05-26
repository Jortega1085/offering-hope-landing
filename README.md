# Offering Hope — Built To Break

Static landing page and keynote artifact for **Hope Kimple's** keynote *"Built To Break — what your body is carrying that your mind won't admit."*

## Layout

```
Hope/
├── Hope Landing Page/                       ← editable source
│   ├── index.html                           ← keynote landing page (the one to edit)
│   ├── Offering Hope Landing v1.html        ← earlier/sibling longer landing page
│   ├── Offering Hope - Built To Break.html  ← bundled single-file output of index.html
│   ├── assets/
│   │   ├── oh-logo.png        (1.9 MB — used)
│   │   ├── oh-logo-raw.png    (1.6 MB — original)
│   │   ├── lotus-bg.png       (background, used)
│   │   └── lotus-bg-raw.jpg   (original)
│   ├── uploads/                             ← brand assets, source images, related HTML
│   │   ├── Offering_Hope_Brand_Summary.docx.pdf
│   │   ├── New logo white  (1) (1).png
│   │   ├── workshop-register.html
│   │   └── grok-*.png/jpg                   ← AI-generated source images
│   └── screenshots/                         ← reference captures
└── Offering Hope - Built To Break (1).html  ← duplicate of the bundled output, project-root copy
```

## Working with this project

**Edit `Hope Landing Page/index.html` directly.** It is plain HTML/CSS with two real asset references (`assets/oh-logo.png`, `assets/lotus-bg.png`). Open it via a local HTTP server — `file://` works for most things, but localhost is safer for fonts and any future JS.

```sh
cd "Hope Landing Page"
python3 -m http.server 8765
# then open http://localhost:8765/index.html
```

## Bundled vs source

The `Offering Hope - Built To Break.html` files (the 3.6 MB ones, both in the project root and inside `Hope Landing Page/`) are **bundled artifacts** produced from `index.html` by an external tool. All assets are gzip+base64-inlined into two `<script type="__bundler/...">` tags (a `manifest` and a `template`). A bootstrap script decompresses everything at runtime via `DecompressionStream('gzip')` and rewrites the document.

The bundler itself is **not in this repo**. If you need to regenerate the single-file artifact after editing `index.html`, you need access to that external bundling tool. In-place editing of the bundle is possible (the format is documented inside the file's bootstrap script) but not recommended for normal changes — edit the source.

## Recent change

- `.masthead .logo` in `Hope Landing Page/index.html` now has `opacity: 0.8` (logo rendered 20% more transparent). The bundled artifact has NOT been regenerated — it still shows the original opacity until rebundled.
