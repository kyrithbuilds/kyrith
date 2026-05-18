# Production deployment — KyrithBuilds

This document describes how **kyrithbuilds.com** is built, deployed, verified, rolled back, and troubleshooted. It reflects the **current** production pipeline (lftp + explicit FTPS on cPanel).

**Repository:** [github.com/kyrithbuilds/kyrith](https://github.com/kyrithbuilds/kyrith)  
**Live site:** https://kyrithbuilds.com  
**Hosting:** cPanel shared hosting (`public_html` document root)

---

## Architecture overview

```text
┌─────────────────┐     push to main      ┌──────────────────────┐
│  GitHub (main)  │ ────────────────────► │  GitHub Actions      │
│  React + Vite   │                       │  ubuntu-latest       │
│  PHP API source │                       └──────────┬───────────┘
└─────────────────┘                                  │
                                                     │ npm ci && npm run build
                                                     │ lftp explicit FTPS :21
                                                     ▼
                                          ┌──────────────────────┐
                                          │  cPanel / Apache     │
                                          │  public_html/        │
                                          │    index.html, assets│
                                          │    api/contact.php   │
                                          │    api/config.local  │  ◄── server-only (not in git)
                                          └──────────────────────┘
                                                     │
                                                     ▼
                                          https://kyrithbuilds.com
```

| Layer | Technology | Deployed path |
|-------|------------|---------------|
| **Frontend** | React 19, Vite 8, Tailwind 4 (SPA) | `public_html/` (contents of `dist/`) |
| **Contact API** | PHP (`backend/api/contact.php`, SendGrid) | `public_html/api/` |
| **Routing** | Apache `.htaccess` (SPA fallback) | `public_html/.htaccess`, `public_html/api/.htaccess` |
| **Secrets (email)** | `config.local.php` on server only | `public_html/api/config.local.php` |

**CI never uploads** `config.local.php`, `.env`, `logs/`, or `uploads/` on the server. The API mirror step does **not** use `--delete`, so production-only files in `public_html/api/` are preserved.

---

## GitHub Actions workflows

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| **Deploy FTP** | [`.github/workflows/deploy-ftp.yml`](workflows/deploy-ftp.yml) | Push to `main`, `workflow_dispatch` | Build, deploy via **lftp**, health checks |
| **CI** | [`.github/workflows/ci.yml`](workflows/ci.yml) | Push / PR to `main` | `npm ci` + `npm run build` only (no deploy) |

Deploy FTP uses **concurrency** group `deploy-ftp` with `cancel-in-progress: true` so only one deploy runs at a time.

### Deploy FTP — step summary

1. Validate FTP secrets exist  
2. Checkout, Node 20, `npm ci`, `npm run build`  
3. Stage `deploy-api/` (`contact.php`, `.htaccess`, `config.local.example.php`)  
4. Resolve `FTP_SITE_DIR` (default `public_html`)  
5. Install `lftp` on the runner  
6. **Deploy** (single FTPS session):
   - Frontend: `mirror -R --delete` from `dist/` → `public_html/` (excludes `api/` and protected paths)  
   - API: `mirror -R` from `deploy-api/` → `public_html/api/` (no `--delete`)  
7. Post-deploy HTTP checks  
8. Job summary (always)

### FTPS settings (must match FileZilla)

These are applied in the lftp deploy step:

```text
set ftp:passive-mode true
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ssl:verify-certificate no
open -u USER,PASS ftp://HOST
```

| FileZilla | Workflow |
|-----------|----------|
| Port **21** | Port **21** (default) |
| **Explicit TLS** | `ftp:ssl-force` + `ftp://` URL (explicit FTPS) |
| **Passive mode** | `ftp:passive-mode true` |
| Accept self-signed cert | `ssl:verify-certificate no` |

**Do not use** implicit FTPS (port 990 / `ftps-legacy`). The old `SamKirkland/FTP-Deploy-Action` was removed because it failed with `530` while lftp with the same credentials succeeded.

---

## Required secrets

Configure at: **GitHub repo → Settings → Secrets and variables → Actions → Secrets**

| Secret | Example | Notes |
|--------|---------|--------|
| `FTP_SERVER` | `ftp.kyrithbuilds.com` | Hostname only — **no** `ftp://` prefix |
| `FTP_USERNAME` | `githubdeploy@kyrithbuilds.com` | Dedicated deploy FTP user |
| `FTP_PASSWORD` | *(account password)* | Re-paste when rotating; no trailing spaces/newlines |

Secrets are read only in the deploy job. They are **not** printed in logs.

### cPanel FTP account (one-time setup)

1. Create an FTP account whose home/chroot is **`public_html`** (document root).  
2. Set **`FTP_SITE_DIR`** to **`.`** (or leave the variable unset). Do **not** use `public_html` if FileZilla already opens inside `public_html` — that uploads to a nested `public_html/public_html/` folder and the live site will not update.  
3. Confirm in **FileZilla**:
   - Host: `ftp.kyrithbuilds.com`  
   - Port: `21`  
   - Encryption: **Explicit FTP over TLS**  
   - Logon type: Normal  
3. Copy the **exact** host, username, and password into GitHub Secrets.

---

## Required variables

Configure at: **Settings → Secrets and variables → Actions → Variables** (optional; defaults exist)

| Variable | Recommended | Default if unset |
|----------|-------------|------------------|
| `FTP_SITE_DIR` | `.` (omit variable) | `.` — FTP login root is already `public_html` for `githubdeploy@` |
| `DEPLOY_URL` | `https://kyrithbuilds.com` | `https://kyrithbuilds.com` |

`FTP_SITE_DIR` may be written with or without a trailing slash; the workflow normalizes it.

---

## Deployment steps

### Automatic (primary)

```bash
git checkout main
git pull origin main
# make changes, commit
git push origin main
```

1. GitHub runs **Deploy FTP**.  
2. Watch: **Actions → Deploy FTP** → latest run.  
3. Green run = build + upload + health checks passed.

### Manual trigger

**Actions → Deploy FTP → Run workflow** → branch `main` → **Run workflow**.

Use after fixing secrets or when you need a redeploy without a code change.

### Manual fallback (zip)

When GitHub Actions is unavailable or you need to ship `config.local.php` from your machine:

```bash
npm run pack-upload
```

Creates **`kyrithbuilds-upload.zip`** containing `dist/`, `api/`, and local `backend/api/config.local.php` (if present).

1. cPanel **File Manager** → **`public_html`**  
2. Upload zip → **Extract** (overwrite when prompted)  
3. Confirm `api/config.local.php` exists on the server for contact email  
4. Test https://kyrithbuilds.com and `/contact`

See root [README.md](../README.md) for local dev commands.

---

## Health checks

After each deploy, the workflow requests:

| Check | URL | Pass criteria |
|-------|-----|----------------|
| **Home** | `https://kyrithbuilds.com/` | HTTP 2xx and body contains `KyrithBuilds` |
| **Contact** | `https://kyrithbuilds.com/contact` | HTTP 2xx and body contains `KyrithBuilds` |

The contact route is a **SPA** route: the server returns `index.html`; there is no literal `"Contact"` in static HTML. The check intentionally greps for `KyrithBuilds`.

If upload succeeds but health checks fail, the workflow exits with a warning — the site may be partially updated. Inspect the run log and live URLs.

---

## Server paths and protected files

| Local (CI) | Remote | Sync mode |
|------------|--------|-----------|
| `dist/` | `public_html/` | `mirror -R --delete` |
| `deploy-api/` | `public_html/api/` | `mirror -R` (no delete) |

**Protected on server** (excluded from mirror / never in CI bundle):

- `public_html/api/config.local.php` — SendGrid and mail settings  
- `.env`, `.env.*`  
- `logs/`, `uploads/`, `mail/`  
- `*.log`  

**First-time API email setup:** copy `config.local.example.php` to `config.local.php` on the server (or use `pack-upload` with a local `config.local.php`). CI only deploys the example file as documentation.

---

## How to rotate FTP credentials

1. **cPanel** → FTP Accounts → change password for the deploy user (or create a new user and disable the old one).  
2. **FileZilla** — verify login with the new password.  
3. **GitHub** → Secrets → update `FTP_PASSWORD` (and `FTP_USERNAME` / `FTP_SERVER` if they changed).  
4. **Actions → Deploy FTP → Run workflow** to confirm.  
5. If the old password was ever committed to git, assume it is compromised — rotation is mandatory.

Never commit FTP passwords to the repository or workflow files.

---

## How to rollback

### Option A — Revert git and redeploy (preferred)

```bash
git log --oneline -10          # find last good commit on main
git revert <bad-commit-sha>    # or: git reset --hard <good-sha>  (coordinate with team)
git push origin main
```

A push to `main` triggers a full deploy of the reverted build.

### Option B — Redeploy a previous workflow artifact

1. **Actions → Deploy FTP** → open a **successful** run from before the bad deploy.  
2. If your org enables re-run: **Re-run all jobs** only helps if `main` still points at that commit; otherwise use Option A.  
3. For urgent frontend-only rollback without git: download **`site-dist`** artifact from a good run (if artifacts were enabled in that era) or rebuild locally from the good tag and use **manual zip**.

### Option C — Manual zip from a known-good commit

```bash
git checkout <good-sha>
npm ci && npm run build
npm run pack-upload
# upload kyrithbuilds-upload.zip to public_html
git checkout main
```

### API rollback

PHP changes live in git under `backend/api/`. Revert the commit and push, or upload a single file via FileZilla/cPanel from a known-good revision. **`config.local.php` on the server is not overwritten by CI.**

---

## Troubleshooting

### Deploy FTP fails at “Validate FTP secrets”

| Symptom | Fix |
|---------|-----|
| Missing secret error | Add `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` under Actions secrets |

### Deploy fails during “Deploy via lftp”

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| `Login failed` / `530` | Wrong secrets vs FileZilla | Re-enter secrets; match host **without** `ftp://` |
| `cd: Access failed` | Wrong `FTP_SITE_DIR` | Set variable to `public_html`; confirm chroot in cPanel |
| TLS / certificate errors | Strict verify on host | Workflow uses `ssl:verify-certificate no` for shared hosting |
| Timeout | Firewall / passive mode | Passive mode is enabled; confirm port 21 in hosting firewall |

**Verify credentials outside CI:** use FileZilla with the same host, user, port 21, explicit TLS.

### Deploy succeeds; health checks fail

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| HTTP 404 on `/contact` | Missing SPA `.htaccess` | Ensure `public/.htaccess` is in `dist/` after build |
| Missing `KyrithBuilds` in body | Wrong site / empty `index.html` | Check `public_html/index.html` on server |
| HTTP 5xx | Server/PHP error | Check cPanel error logs |

### Contact form does not send email

| Check | Action |
|-------|--------|
| `config.local.php` on server | Must exist under `public_html/api/` (not deployed by CI) |
| SendGrid key | Valid in `config.local.php` |
| API reachable | `curl https://kyrithbuilds.com/api/contact.php` (expect JSON) |

### Site updated in wrong folder

Deploy user must be jailed to **`public_html`**. If files appear under `tirth/` or FTP root, fix the FTP account directory in cPanel and set `FTP_SITE_DIR` to `public_html`.

### Concurrent / stuck deploys

Only one deploy runs at a time (`concurrency`). Cancel a stuck run: **Actions → run → Cancel workflow**, then push again or re-run.

### Historical issues (resolved)

| Issue | Resolution |
|-------|------------|
| FTP 421 home directory | FTP account must use valid `public_html` home |
| FTP-Deploy-Action `530` | Replaced with **lftp**; secrets must match FileZilla |
| Artifact failed on `.deploy-api/` | Use `deploy-api/` (no leading dot) |
| Debug commits with hardcoded passwords | Reverted; rotate password if exposed |

---

## Quick reference

```text
Push main
  → build (npm ci, npm run build)
  → lftp FTPS → public_html/     (frontend, mirror --delete)
  → lftp FTPS → public_html/api/ (API, mirror, no delete)
  → curl / and /contact
```

| Task | Command / location |
|------|---------------------|
| Deploy | `git push origin main` |
| Manual deploy | `npm run pack-upload` → upload zip to `public_html` |
| Workflow | `.github/workflows/deploy-ftp.yml` |
| Secrets | GitHub → Settings → Actions → Secrets |
| Variables | GitHub → Settings → Actions → Variables |
| Local dev | `npm run start` (Vite + PHP API) |

---

*Last updated for lftp-based Deploy FTP (post FTP-Deploy-Action removal).*
