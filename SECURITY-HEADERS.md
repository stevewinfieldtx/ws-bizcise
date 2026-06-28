# Security headers for bizcise (audit fix: Security 15→A, 6/6 headers)

Security headers are **HTTP response headers** — they can't be set from inside an HTML file, so they live at the server/edge layer. The audit ran against `bizcise.com` (WordPress + Cloudflare). Below are two ways to add all six missing headers.

The audit flagged these 6 as missing — set all of them:

| Header | Recommended value |
|---|---|
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| Content-Security-Policy | `default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; form-action 'self' https://formspree.io; frame-ancestors 'self'; upgrade-insecure-requests` |
| X-Frame-Options | `SAMEORIGIN` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `geolocation=(), microphone=(), camera=(), interest-cohort=()` |

> Note: the `'unsafe-inline'` in `style-src` is required because the page uses a single inline `<style>` block (standard for Claude CMS templates). If you serve YouTube/Vimeo embeds, add `frame-src https://www.youtube.com https://player.vimeo.com` to the CSP.

---

## Option A — Cloudflare (fastest; bizcise.com is already on Cloudflare)

Dashboard → your domain → **Rules → Transform Rules → Modify Response Header → Create rule**.
Set "If incoming requests match… All incoming requests", then add one "Set static" entry per header above. Deploy. Done in minutes, no code.

(You can also enable **HSTS** under SSL/TLS → Edge Certificates → HTTP Strict Transport Security.)

## Option B — Express (if this site is served by the Claude CMS Railway app)

Add once, near the top of `server.mjs`, before your routes:

```js
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; form-action 'self' https://formspree.io; frame-ancestors 'self'; upgrade-insecure-requests");
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), interest-cohort=()');
  next();
});
```

After deploying, re-test at https://securityheaders.com and you should jump from F to A.
