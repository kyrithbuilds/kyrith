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

## Deploy with GitHub Actions (FTP — Hosting India / cPanel)

1. In GitHub: **Settings → Secrets and variables → Actions → New repository secret**
   - **`FTP_SERVER`** — from cPanel → *FTP Accounts* → *Configure FTP Client* (e.g. `ftp.yourdomain.com`)
   - **`FTP_USERNAME`** — full FTP username (e.g. `user@yourdomain.com`)
   - **`FTP_PASSWORD`** — that FTP user’s password

2. Push to **`main`** (or run **Actions → Deploy FTP → Run workflow**). The **Build** job uploads **artifacts**; **Upload to hosting (FTP)** syncs `dist/` and `backend/api/` to **`public_html/`** (relative to the FTP account).

3. If the live site does not update, files may be under a **nested** `public_html` in File Manager — move `index.html`, `assets/`, `.htaccess`, and `api/` into your real domain **`public_html`**.

4. If you see **`421 Home directory not available`**, the FTP account’s home path on the server is wrong — recreate the FTP user in cPanel or ask the host to fix it. Until then, download **`site-dist`** / **`site-api`** from the successful **Build** job and upload manually.

Deploy workflow uses **plain FTP on port 21** in YAML (no repo Variables required). If you added **`FTP_PROTOCOL` / `FTP_PORT`** variables earlier, **delete them** — wrong FTPS settings often break what used to work.

### Do you have to delete everything and re-upload every time?

**No.** Technology absolutely supports automation:

| Approach | What you do |
|----------|-------------|
| **Full automation** | Fix the FTP account so **421** stops (recreate user in cPanel with a valid home directory). Then **`git push`** → **Deploy FTP** uploads only what changed — no manual steps. |
| **Semi-automation (today)** | **`git push`** → Actions **Build** succeeds → download **`site-dist`** zip → in File Manager **upload/overwrite** (you do **not** need to delete every file first; replace `index.html`, `assets/`, etc.). One zip, not file-by-file from scratch. |
| **Local build** | **`npm run build`** → upload **`dist/`** contents the same way (overwrite, not delete-all). |

The blocker is **not** “there is no tech for this.” It’s that **your host’s FTP login is rejecting the session (421)** from GitHub’s servers until that account is fixed. After that, the workflow you already have is the automation.

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
