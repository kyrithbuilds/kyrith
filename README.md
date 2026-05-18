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

### Go live (manual zip — recommended for now)

The production build calls **`/api/contact.php`** on the **same domain** only.

1. Ensure **`backend/api/config.local.php`** exists locally (copy from `config.local.example.php`, add SendGrid key). This file is gitignored but is **bundled into the zip** for email on the server.
2. Run **`npm run pack-upload`** → creates **`kyrithbuilds-upload.zip`** (replaces any old zip).
3. cPanel **File Manager** → **`public_html`** → **Upload** the zip → **Extract** (overwrite when prompted).
4. Confirm after extract:
   - `index.html`, `assets/`, `.htaccess`
   - `api/contact.php`, `api/.htaccess`, **`api/config.local.php`**
5. Test **`https://kyrithbuilds.com`** and submit the form on **`/contact`**.

`public/.htaccess` is in `dist/` so client routes like `/contact` work on Apache.

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

**CI note:** GitHub Actions never deploys `config.local.php`. The **zip** includes it from your machine when you run `pack-upload`.

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
