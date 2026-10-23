# Vinay Muppalla — Software Engineering Portfolio

Responsive static portfolio with three interactive project simulations, source links, architecture documentation, and the supplied resume.

## Local preview

```sh
python -m http.server 8000
```

Open http://127.0.0.1:8000. No build step or dependency installation is required.

## Content integrity

Education, existing academic projects and contact details come from the supplied resume. New repositories are independent engineering projects using synthetic examples; no employer, customer, commercial impact, or production deployment is claimed. Public demos run in browser memory. Each project's Python implementation supports a local API and CLI.

## Publish

GitHub Pages: Settings → Pages → Deploy from a branch → main → / (root). The `.nojekyll` file disables Jekyll processing. The resume PDF is included unchanged. MIT license applies to code; resume personal content remains the owner's material.

## Visual design

An editorial dark theme with a lavender accent, optional warm light theme, self-hosted subset fonts, native SVG system artwork, illustrated project cards, and scroll/hover transitions. The theme choice is stored locally when browser storage is available. Navigation and content work without JavaScript. `prefers-reduced-motion` disables animated transitions and continuous artwork motion.

Font files are subsets of DejaVu Sans and DejaVu Serif, served locally without a third-party font request. Their license is included in `assets/fonts/LICENSE.txt`. The code MIT license does not replace the font license.
