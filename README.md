# bizcise — new site (Claude CMS compatible)

A single-file, zero-JavaScript homepage that **reuses all of bizcise.com's existing copy** (Home, Platform, Market Activation, About, Contact) and is engineered to fix the WinTech audit (44/100 → targeted fixes).

## Files
- **index.html** — the site. Drop into Claude CMS (Add a website → paste URL or this HTML).
- **llms.txt** — serve at `https://bizcise.com/llms.txt` (AEO fix).
- **security.txt** — serve at `https://bizcise.com/.well-known/security.txt` (Security fix).
- **SECURITY-HEADERS.md** — Cloudflare/Express config for the 6 missing security headers.
- **structured-data.jsonld.html** — optional JSON-LD (microdata is already inline in index.html).

## How the audit findings are addressed

| # | Finding | Status | Where |
|---|---|---|---|
| 10 | No H1 tag | ✅ Fixed | Single `<h1>` in hero |
| 11 | No meta description | ✅ Fixed | `<head>` |
| 01 | No Open Graph tags | ✅ Fixed | Full `og:*` set |
| 06 | No Twitter Card tags | ✅ Fixed | `twitter:*` set |
| 12/13 | Zero structured data / no Org+FAQ schema | ✅ Fixed (CMS-durable) | schema.org **microdata** (Organization + FAQPage). JSON-LD also provided for server injection |
| 04 | No lead capture forms | ✅ Fixed | Two `<form>`s (hero email + full contact). Wire `action` to Formspree or CMS handler |
| 05/09 | No privacy policy / consent | ✅ Fixed | `#privacy` section + CSS-only consent notice + footer links |
| 08 | 15 render-blocking scripts | ✅ Fixed | Zero scripts (CMS rule) |
| 15 | No lazy-loaded images | ✅ Fixed | `loading="lazy"` on non-hero images |
| 16 | Non-descriptive links | ✅ Fixed | All links descriptive |
| 17 | No hreflang | ✅ Fixed | `hreflang` en + x-default |
| — | Title 25 chars / Word count 522 / weak CTAs / alt text | ✅ Fixed | 58-char title, ~3,900 words, CTA buttons, alt on every image |
| 07 | No llms.txt | ⚙ Server | `llms.txt` (deploy at root) |
| 02/03/14 | Security headers / grade F / security.txt | ⚙ Server | `SECURITY-HEADERS.md` + `security.txt` |
| 18 | No conversion/ad pixel | ⚙ Server | Pixels are JS (stripped by CMS) — add at Railway/Cloudflare or via GTM server-side |

✅ = handled inside the HTML. ⚙ = server/edge-level (can't live in CMS HTML); files + instructions included.

## Two manual steps before launch
1. **Forms:** replace `https://formspree.io/f/REPLACE_WITH_FORM_ID` in `index.html` (2 places) with a real endpoint.
2. **Phone:** the contact phone is a safe placeholder `+1 (555) 010-0100` — swap for the real number in the CMS editor (or delete it).

All copy is the client's own wording (lightly reworded for scannability); every paragraph from the live site is represented.
# ws-bizcise
