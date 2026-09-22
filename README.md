# Quick Step School Limited — Website

Nursery & Primary school website for the Meanwood and PHI campuses in Lusaka, Zambia.
Originally exported from Google Stitch. Live at https://buman-heing.github.io/Quick-step/

## Files

- `index.html` — the whole site (9 tabs). Each tab has its own link, e.g. `#fees`, `#campuses`, `#contact`.
- `assets/styles.css` — built CSS (generated, don't edit by hand)
- `images/` — built web images (generated from `src/`)
- `src/photos/` — original campus photos; `src/logo.png`, `src/quality-websites.png` — original logos
- `tools/build-images.js` — makes the WebP photos, favicons and the link-preview image (`images/og-image.jpg`)
- `screen.html`, `screenshot.png` — the original Stitch export, kept for reference

## Making changes

Install the build tools once:

```
npm install
```

- **Changed text or Tailwind classes in `index.html`?** Rebuild the CSS: `npm run build:css`
  (or `npm run watch:css` while editing). New classes won't style anything until you do.
- **Added or replaced a photo in `src/photos/`?** Run `npm run build:images`, then reference it in
  `index.html` as `images/<name>-640.webp` with `srcset` including `images/<name>-1280.webp 1280w`.
- `npm run build` does both.

Commit the generated `assets/` and `images/` files too — GitHub Pages serves the repo as-is.

If the site moves to its own domain, update the `canonical`, `og:url`, `og:image` and the
JSON-LD `url` values in the `<head>` of `index.html`.
