# KyrithBuilds Website — Technical Reference

Reference document for **the kyrithbuilds.com website itself**: stack, structure, deployment, SEO, analytics, and contact API.

For **company/business context** (what KyrithBuilds does as a business), see [KYRYTHBUILDS.md](./KYRYTHBUILDS.md).

For **logo assets and AI-friendly brand lockup specs**, see [BRAND-LOGOS.md](./BRAND-LOGOS.md).

For **deployment runbooks**, see [../.github/DEPLOYMENT.md](../.github/DEPLOYMENT.md).

---

## Overview

| | |
|---|---|
| **Live URL** | https://kyrithbuilds.com |
| **Repository** | https://github.com/kyrithbuilds/kyrith |
| **Type** | Marketing SPA + PHP contact API |
| **Hosting** | cPanel shared hosting (`public_html`) |

The site is a **single-page application (SPA)** with client-side routing. Apache `.htaccess` rewrites unknown paths to `index.html` so routes like `/contact` work on refresh.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 8, React Router 7 |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) |
| **Backend (contact only)** | PHP (`backend/api/contact.php`) |
| **Email** | SendGrid (via server-side `config.local.php`) |
| **Analytics** | Google Analytics 4 |
| **Deploy** | GitHub Actions + **lftp** (explicit FTPS) |
| **Manual deploy fallback** | `npm run pack-upload` → zip to cPanel |

---

## Site map & routes

| Route | Page | Notes |
|-------|------|--------|
| `/` | Home | Hero, what we build, process, proof, CTA |
| `/services` | Services | Offerings grid, why us, process, FAQ, tech strip |
| `/about` | About | Mission, beliefs, client experience, process, CTA |
| `/about-us` | — | Redirects to `/about` |
| `/contact` | Contact | Form, FAQ, explore links |
| `/privacy` | Privacy Policy | Legal document layout |
| `/terms` | Terms of Service | Legal document layout |

**Layout:** All pages share `AppLayout` (navbar + footer).

**Config sources:**

- Navigation labels: `src/config/navigation.js`
- SEO per page: `src/config/site.js` (`PAGE_SEO`)
- Contact / WhatsApp: `src/config/contact.js`
- FAQs (UI + schema): `src/config/faqs.js`
- Breadcrumbs (JSON-LD): `src/config/breadcrumbs.js`
- Analytics IDs/events: `src/config/analytics.js`

---

## Project structure

```text
KyrithBuilds/
├── src/
│   ├── pages/           # Route-level pages
│   ├── components/      # UI sections (home/, about/, services/, contact/, seo/, …)
│   ├── layouts/         # AppLayout
│   ├── config/          # Site-wide constants (single source of truth)
│   ├── lib/             # Schema helpers, analytics helpers
│   └── api/             # Frontend contact form client
├── backend/api/
│   ├── contact.php      # Contact form endpoint
│   ├── .htaccess
│   ├── config.local.example.php
│   └── config.local.php # Gitignored — SendGrid key (server only)
├── public/              # Static assets, favicons, .htaccess (copied to dist/)
├── scripts/             # Build/deploy utilities
├── dist/                # Production build output (gitignored)
└── .github/workflows/   # CI + Deploy FTP
```

---

## Local development

```bash
npm install
npm run start          # Vite :5173 + PHP API :8080 (proxied /api)
# or
npm run dev            # Frontend only
```

- Vite proxies `/api` → `http://127.0.0.1:8080` for local contact form testing.
- Copy `backend/api/config.local.example.php` → `config.local.php` and add SendGrid credentials for email.

**Other scripts:**

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build → `dist/` |
| `npm run pack-upload` | Build + zip for manual cPanel upload |
| `npm run optimize-images` | WebP optimization for large assets |
| `npm run lint` | ESLint |

---

## Production architecture

```text
Browser
  → https://kyrithbuilds.com/          (static SPA from public_html/)
  → https://kyrithbuilds.com/contact   (same index.html, React Router)
  → https://kyrithbuilds.com/api/contact.php  (PHP on same domain)
```

**Why same-domain API:** The contact form POSTs to `/api/contact.php` on the live domain (no separate API host).

**Protected on server (never deployed by CI):**

- `public_html/api/config.local.php` — SendGrid / mail settings
- `.env`, logs, uploads

---

## Deployment (summary)

**Automatic:** Push to `main` → `.github/workflows/deploy-ftp.yml`

1. `npm ci` + `npm run build`
2. Stage `deploy-api/` (PHP files only, no secrets)
3. **lftp** explicit FTPS upload:
   - `dist/` → FTP login root (`.`) — deploy user chroots to `public_html`
   - `deploy-api/` → `api/` (mirror without `--delete`)
4. Post-deploy HTTP checks on `/` and `/contact`

**GitHub secrets:** `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`  
**Optional variable:** `FTP_SITE_DIR` — default `.` (do **not** set `public_html` if FTP already opens inside document root)

**Manual fallback:** `npm run pack-upload` → upload `kyrithbuilds-upload.zip` to `public_html`

Full details: [`.github/DEPLOYMENT.md`](../.github/DEPLOYMENT.md)

---

## CI

**`.github/workflows/ci.yml`** — runs on push/PR to `main`:

- `npm ci`
- `npm run build`

Build-only; no deploy on PRs.

---

## SEO & structured data

### Per-page meta

Managed in `src/config/site.js` (`PAGE_SEO`) and applied via `PageSEO` component on each page.

Homepage OG/Twitter tags also in root `index.html`.

### JSON-LD (structured data)

| Schema | Where |
|--------|--------|
| Organization, WebSite, ProfessionalService | Global — `StructuredData.jsx` |
| FAQPage | `/services`, `/contact` — `FaqPageStructuredData.jsx` + `src/config/faqs.js` |
| BreadcrumbList | Inner pages only (`/services`, `/about`, `/contact`, `/privacy`, `/terms`) |

Breadcrumb and FAQ copy must stay in sync between UI components and config files.

---

## Analytics

- **GA4 property:** configured in `src/config/analytics.js`
- **Component:** `GoogleAnalytics.jsx` (loads gtag, tracks route changes)
- **Events:** `page_view`, `cta_click`, `whatsapp_click`, `contact_form_submit`, `footer_contact` (via `data-track-*` attributes)

---

## Contact form flow

1. User submits form on `/contact`
2. Frontend: `src/api/contact.js` → `POST /api/contact.php`
3. Backend: `backend/api/contact.php` validates input, sends email via SendGrid
4. Requires `api/config.local.php` on production server (not in git)

---

## Assets & performance

- Hero/About images optimized to **WebP** (`blob.webp`, `about-hero-illustration.webp`)
- Favicons copied to `public/` via `scripts/copy-favicons.mjs` before build
- Vite hashes JS/CSS filenames each build; deploy purges `assets/` before mirror to avoid stale bundles

---

## Key files to know

| File | Role |
|------|------|
| `src/App.jsx` | Routes |
| `src/config/site.js` | Site name, URL, SEO titles/descriptions |
| `src/config/contact.js` | Phone / WhatsApp numbers |
| `src/components/Footer.jsx` | Global footer |
| `src/components/Navbar.jsx` | Global nav |
| `backend/api/contact.php` | Contact API |
| `.github/workflows/deploy-ftp.yml` | Production deploy |
| `public/.htaccess` | SPA fallback + security headers (copied to dist) |

---

## Environment & secrets

| Item | Location |
|------|----------|
| `VITE_SITE_URL` | Optional env for canonical URL in dev |
| SendGrid API key | `backend/api/config.local.php` (local + server, gitignored) |
| FTP credentials | GitHub Actions secrets only |
| GA4 measurement ID | `src/config/analytics.js` |

---

## Common maintenance tasks

| Task | Where to change |
|------|-----------------|
| Update phone / WhatsApp | `src/config/contact.js` |
| Change page title/description | `src/config/site.js` |
| Add/edit FAQ | `src/config/faqs.js` + FAQ components |
| Edit service copy | `src/components/services/` |
| Edit legal pages | `src/pages/Privacy.jsx`, `Terms.jsx` |
| Rotate FTP password | cPanel + GitHub secret (see DEPLOYMENT.md) |

---

*Last updated for lftp-based deploy pipeline and current site structure.*
