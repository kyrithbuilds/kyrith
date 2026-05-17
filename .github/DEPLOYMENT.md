# Deployment (GitHub Actions → cPanel)

## What went wrong before

| Issue | Cause |
|-------|--------|
| **421 Home directory not available** | FTP account home folder missing, wrong path, or invalid mapping in cPanel |
| **Site not updating** | Deploy targeted FTP login root (`./` or `…/tirth/`) instead of **`public_html/`** (live document root) |
| **Artifact step failed** | Staging folder `.deploy-api/` is ignored by `upload-artifact` (dot-directory); fixed by using `deploy-api/` |
| **Auth confusion during debug** | Old account `tirth@` vs new deploy account; secrets must match the account that logs into `public_html` |

## Working configuration

| Setting | Value |
|---------|--------|
| **FTP account** | `githubdeploy@kyrithbuilds.com` (example — use your deploy user) |
| **FTP home / chroot** | `public_html` (FileZilla lands in document root) |
| **Protocol** | FTPS explicit, port **21** (`USE_EXPLICIT_FTPS=true`) |
| **Secrets** | `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` |
| **Variable** | `FTP_SITE_DIR` = `public_html/` |
| **Frontend upload** | `dist/` → `public_html/` |
| **API upload** | `deploy-api/` → `public_html/api/` |
| **Protected on server** | `public_html/api/config.local.php` (never in CI bundle) |

## Automatic deploy

Every **`git push` to `main`** runs `.github/workflows/deploy-ftp.yml`.

Manual fallback: `npm run pack-upload` → zip to `public_html`.
