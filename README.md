# Adolescent Studio — website

Static single-page site for GitHub Pages. No build step, no frameworks, no secrets.

```
index.html            the page — self-contained (CSS, JS and logo are inlined by build.py)
assets/styles.css     source styles (palette + fonts at the top)  → edit, then run `python3 build.py`
assets/main.js        source behaviour (nav, carousel, contact form) → edit, then run `python3 build.py`
build.py              inlines the two files above (and the logo) into index.html
assets/fonts/         self-hosted Manrope + Instrument Serif (subset woff2)
assets/logo.png       handwritten wordmark
assets/og-image.png   social share image (1200×630)
assets/favicon.svg    favicon  ·  assets/apple-touch-icon.png
_archive/             previous versions and generator scripts (not needed for deploy)
```

## Connect the contact form (2 minutes)

The form posts to **Formspree**, which works on static hosting and needs no server or API key.

1. Create a free account at https://formspree.io and add a new form.
2. Copy the form ID (looks like `xabcdefg`).
3. In `index.html`, replace `YOUR_FORM_ID` in
   `<form ... action="https://formspree.io/f/YOUR_FORM_ID">`.
4. In Formspree, set the notification email and (optionally) restrict the allowed domain to your site.

Until it's connected, submitting shows a clear "Form not connected yet" message. The form ID is a public endpoint — it is safe to commit; there are no secrets in this repo.

## Before going live

- Replace `https://adolescent-studio.github.io/` in `<link rel="canonical">`, the `og:*` / `twitter:*` tags and the JSON-LD with your real URL.
- Add social profile links to the footer if/when they exist.
- The “reply within one working day” promise in the contact section — keep it only if you can honour it.
- Pricing assumptions to confirm against your actual contract: domain registrar fees billed separately at cost; one-time plan hosting paid by the client to the provider.

## Deploy to GitHub Pages

Push to `main`, then Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
