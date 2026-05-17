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

## Deploy with GitHub Actions (FTP — Hosting India / cPanel)

### What your cPanel screenshot confirms

| Field | Exact value to use |
|--------|---------------------|
| **FTP server** | `ftp.kyrithbuilds.com` |
| **FTP username** | `tirth@kyrithbuilds.com` |
| **Port** | `21` (FTP and explicit FTPS) |

**What “path” means (you’re not missing a secret screen):**  
**Configure FTP Client** only shows **Manual Settings** (host, user, port). The **folder on the server** is the **Path** column in the **same table row** as `tirth@kyrithbuilds.com` — in your screenshot it’s truncated (`/home/kyrith…ds.com/tirth`). That is **one real directory** on the server; when this user logs in via FTP, that directory is their **top level**. You can open the same place in **File Manager** by browsing under your account until you see the **`tirth`** folder (or whatever path cPanel assigned when the FTP user was created).

**Deploy workflow:** uploads the built site into **that FTP top level** (`./`) and PHP API files into **`./api/`**. No extra `public_html` folder is required for the upload to succeed.

### GitHub Secrets (character-for-character)

Repo → **Settings → Secrets and variables → Actions → Secrets**:

| Secret name | Value |
|-------------|--------|
| `FTP_SERVER` | `ftp.kyrithbuilds.com` |
| `FTP_USERNAME` | `tirth@kyrithbuilds.com` |
| `FTP_PASSWORD` | The current password for **that** FTP user (change in cPanel → *Change Password* if unsure, then update the secret). |

No extra spaces, no `ftp://` prefix in `FTP_SERVER`.

### Fix **`421 Home directory not available`** (exact order)

421 means: after login, the server cannot use this user’s **home directory** (missing folder, wrong path, or permissions). **Fix it in cPanel first** — the workflow cannot bypass that.

1. **Find that folder on disk**  
   cPanel → **FTP Accounts** → read the **Path** column for `tirth@kyrithbuilds.com` (hover or widen the column if needed). Then **File Manager** → go to that folder (e.g. `…/tirth`).

2. **Fix 421**  
   - **If that folder is missing or renamed** → 421. **Create** it **or** change the FTP account’s directory to a folder that **already exists**.  
   - **If it exists** → you’re done for path setup; deploy writes files **directly there** (and under **`api/`**).

3. **Recreate the FTP user (if step 2 doesn’t fix it)**  
   **Delete** `tirth@kyrithbuilds.com` → **Add** a new FTP account with the same username (or a new one — then update `FTP_USERNAME` in GitHub), set **Directory** to a path you can see in File Manager, set password, update **`FTP_PASSWORD`** in GitHub.

4. **Run deploy again**  
   **Actions → Deploy FTP → Run workflow** (or push to `main`).

5. **If it still fails with 421**  
   cPanel says **explicit FTPS** also uses port **21**. Add a repository **Variable**: **`USE_EXPLICIT_FTPS`** = **`true`** (exactly), push or re-run workflow. That switches the action to **FTPS** on port 21.

6. **Live site still wrong?**  
   The domain’s **document root** might be **`public_html`** for the main account while FTP only fills **`…/tirth/`**. In that case either point the FTP user at **`public_html`** when creating/editing the account (if cPanel allows), or copy/move the uploaded files from **`tirth/`** into the domain’s real web root.

### After it works

Every **`git push`** to **`main`** runs **Deploy FTP** and syncs the built site. If FTP is ever broken, the workflow still produces **Artifacts** (`site-dist`, `site-api`) for a one-shot upload.

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
