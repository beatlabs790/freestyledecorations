const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Serve static assets (images, CSS, JS) ──────────────
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// ── SEO & Security headers ──────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ── Page routes (SSR – serve HTML with injected meta) ──
const pages = {
  '/':          { file: 'index.html',    title: 'FreeStyle Balloon Decoration | Best Decorators in Patna, Bihar' },
  '/gallery':   { file: 'gallery.html',  title: 'Gallery | FreeStyle Balloon Decoration – Patna' },
  '/services':  { file: 'services.html', title: 'Services & Pricing | FreeStyle Balloon Decoration' },
  '/about':     { file: 'about.html',    title: 'About Us | FreeStyle Balloon Decoration – Patna' },
  '/contact':   { file: 'contact.html',  title: 'Contact & Book | FreeStyle Balloon Decoration' },
  '/reviews':   { file: 'reviews.html',  title: 'Customer Reviews | FreeStyle Balloon Decoration' },
  '/devs':      { file: 'devs.html',     title: 'Developers | ZephyrDevs' },
  '/terms':     { file: 'terms.html',    title: 'Terms of Service | FreeStyle Balloon Decoration' },
  '/privacy':   { file: 'privacy.html',  title: 'Privacy Policy | FreeStyle Balloon Decoration' },
};

Object.entries(pages).forEach(([route, { file, title }]) => {
  app.get(route, (req, res) => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return res.status(404).sendFile(path.join(__dirname, '404.html'));

    let html = fs.readFileSync(filePath, 'utf8');

    // SSR: inject server-side timestamp and canonical
    const host = req.headers.host || 'freestyledecor.in';
    const canonical = `https://${host}${route === '/' ? '' : route}`;
    html = html.replace(
      '</head>',
      `  <meta name="ssr-rendered" content="true"/>\n  <meta name="ssr-time" content="${new Date().toISOString()}"/>\n  <link rel="canonical" href="${canonical}"/>\n</head>`
    );

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  });
});

// ── 404 handler ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// ── Start server ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎈 FreeStyle Balloon Decoration`);
  console.log(`   Server running at → http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop\n`);
});
