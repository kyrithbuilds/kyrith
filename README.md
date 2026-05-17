# KyrithBuilds

Minimal React (Vite + Tailwind) frontend and PHP API under `backend/`.

## Commands

```bash
npm install
npm run dev
```

API in dev: `php -S 127.0.0.1:8080 -t backend` (Vite proxies `/api` to it).

```bash
npm run build
```

Output: `dist/` — upload contents to your host’s web root when you deploy.

### Go live (manual zip — no localhost in the built app)

The production build calls **`/api/contact.php`** on the **same domain** only. Nothing points at `localhost` in the shipped JavaScript.

1. **`npm run pack-upload`** → creates **`kyrithbuilds-upload.zip`** in the project root.
2. cPanel **File Manager** → your domain’s **document root** (often `public_html`) → **Upload** the zip → **Extract** (you should see `index.html`, `assets/`, `.htaccess`, and folder **`api/`**).
3. **Upload `api/config.local.php` separately** (never commit it). Copy from your PC’s `backend/api/config.local.php`. Same SendGrid values as local. Without this file, the contact form returns “not configured.”
4. Test **`https://yourdomain.com`** and **`https://yourdomain.com/contact`**.  
   `public/.htaccess` is copied into `dist/` so routes like `/contact` work on Apache when a real file/folder (e.g. `/api/*`) doesn’t exist.

## Deploy with GitHub Actions (recommended)

Every push to **`main`** runs **Deploy FTP**: build → FTPS upload → live health checks.

Details: [`.github/DEPLOYMENT.md`](.github/DEPLOYMENT.md)

### Production FTP setup (verified)

Create a dedicated FTP user in cPanel whose **directory is `public_html`** (same as the live site). Test with FileZilla before relying on CI.

| Setting | Value |
|---------|--------|
| FTP server | `ftp.kyrithbuilds.com` |
| FTP username | `githubdeploy@kyrithbuilds.com` (your deploy user) |
| Port | `21` (explicit FTPS) |
| Remote folder | `public_html` |

### GitHub configuration

**Secrets** (Settings → Secrets and variables → Actions → Secrets):

| Secret | Purpose |
|--------|---------|
| `FTP_SERVER` | e.g. `ftp.kyrithbuilds.com` (no `ftp://` prefix) |
| `FTP_USERNAME` | Deploy FTP user, e.g. `githubdeploy@kyrithbuilds.com` |
| `FTP_PASSWORD` | That account’s password |

**Variables** (recommended):

| Variable | Value |
|----------|--------|
| `FTP_SITE_DIR` | `public_html/` |
| `USE_EXPLICIT_FTPS` | `true` |
| `DEPLOY_URL` | `https://kyrithbuilds.com` |

Workflow defaults if variables are unset: `FTP_SITE_DIR` → `public_html/`, protocol → **FTPS**.

### What gets uploaded

| Local | Remote |
|-------|--------|
| `dist/` | `public_html/` |
| `deploy-api/` (contact.php, .htaccess, example only) | `public_html/api/` |

**Not uploaded:** `api/config.local.php` (maintain on server only).

### Automatic flow

```text
git push origin main
  → npm ci && npm run build
  → FTPS: dist/ → public_html/
  → FTPS: deploy-api/ → public_html/api/
  → verify /, /contact, /api/contact.php
```

**Manual fallback:** `npm run pack-upload` → upload zip to `public_html` (see above).

## Layout

- `src/` — React app (`pages/Home.jsx`, `layouts/`, `components/`, `api/`)
- `backend/api/contact.php` — sample JSON endpoint
- `backend/config/db.php` — DB placeholder
- `public/.htaccess` — copied into `dist/` for SPA routing on Apache

Connect a new Git remote when your new account/repo is ready:

```bash
git remote add origin <your-new-repo-url>
git push -u origin main
```
