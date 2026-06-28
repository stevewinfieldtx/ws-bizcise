/**
 * bizcise marketing site server.
 * Serves the static index.html with the security headers, CSP, and well-known
 * files (llms.txt, security.txt) that a plain static host can't send. Single page,
 * so any path renders index.html; the two well-known files are routed explicitly.
 */
const express = require('express');
const path = require('path');

const app = express();
const ROOT = __dirname;

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' blob: https://www.clarity.ms https://*.clarity.ms https://unpkg.com https://*.elevenlabs.io",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com https://*.elevenlabs.io data:",
  "img-src 'self' data: https:",
  "connect-src 'self' blob: https://*.clarity.ms https://formspree.io https://*.elevenlabs.io wss://*.elevenlabs.io",
  "media-src 'self' blob: https://*.elevenlabs.io",
  "worker-src 'self' blob: https://*.elevenlabs.io",
  "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://*.elevenlabs.io",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self' https://formspree.io",
  'upgrade-insecure-requests',
].join('; ');

app.use((req, res, next) => {
  res.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.set('X-Frame-Options', 'SAMEORIGIN');
  res.set('Permissions-Policy', 'geolocation=(), microphone=(self), camera=(), interest-cohort=()');
  res.set('Content-Security-Policy', CSP);
  next();
});

// AEO + responsible-disclosure files
app.get(['/.well-known/security.txt', '/security.txt'], (_req, res) =>
  res.type('text/plain; charset=utf-8').sendFile(path.join(ROOT, 'security.txt')));
app.get('/llms.txt', (_req, res) =>
  res.type('text/plain; charset=utf-8').sendFile(path.join(ROOT, 'llms.txt')));

// public assets (images, etc.) — served from /assets so repo source stays private
app.use('/assets', express.static(path.join(ROOT, 'assets'), { maxAge: '7d' }));

// single-page site — everything else renders the page (repo source files stay private)
app.get('*', (_req, res) => res.sendFile(path.join(ROOT, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('bizcise site listening on :' + PORT));
