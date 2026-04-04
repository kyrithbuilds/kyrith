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

### What your cPanel screenshot confirms

| Field | Exact value to use |
|--------|---------------------|
| **FTP server** | `ftp.kyrithbuilds.com` |
| **FTP username** | `tirth@kyrithbuilds.com` |
| **Port** | `21` (FTP and explicit FTPS) |
| **This user’s root on the server** | The **Path** column (truncated as `…/tirth`) — that folder **must exist on disk**. The action uploads to **`public_html/` inside that folder only** (not your main account `public_html` unless this user’s home is pointed there). |

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

1. **See the full home path**  
   cPanel → **FTP Accounts** → next to `tirth@kyrithbuilds.com`, open **Configure FTP Client** or note the full **Path** (not truncated). Example shape: `/home/ACCOUNT/kyrithbuilds.com/tirth` (yours may differ).

2. **File Manager**  
   Navigate to that **exact** path.  
   - **If the folder is missing or renamed** → that is why you get 421. **Create** the missing folder **or** edit the FTP account so its directory points to a folder that **already exists**.  
   - **If it exists** → open it. Create **`public_html`** inside it if you want uploads there (the workflow expects `./public_html/` under this user’s home).

3. **Recreate the FTP user (if step 2 doesn’t fix it)**  
   **Delete** `tirth@kyrithbuilds.com` → **Add** a new FTP account with the same username (or a new one — then update `FTP_USERNAME` in GitHub), set **Directory** to a path you can see in File Manager, set password, update **`FTP_PASSWORD`** in GitHub.

4. **Run deploy again**  
   **Actions → Deploy FTP → Run workflow** (or push to `main`).

5. **If it still fails with 421**  
   cPanel says **explicit FTPS** also uses port **21**. Add a repository **Variable**: **`USE_EXPLICIT_FTPS`** = **`true`** (exactly), push or re-run workflow. That switches the action to **FTPS** on port 21.

6. **Live site still wrong?**  
   Your domain may use **`/home/…/public_html`** while this FTP user only writes under **`…/tirth/public_html`**. Move or copy files from **`tirth/public_html`** to the real **`public_html`** for the domain (or change the FTP account directory to **`public_html`** in cPanel if your host allows it).

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
