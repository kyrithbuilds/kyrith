# Deployment audit & FTP workflow

## 1. Previous workflow (`deploy-ftp.yml` before repair)

| Item | Value |
|------|--------|
| **FTP site target** | `server-dir: ./` (FTP account login root) |
| **FTP API target** | `server-dir: ./api/` |
| **Local sources** | `dist/` and full `backend/api/` |
| **Clean slate** | Not set (default `false`) |

### Historical failure modes

| Error | Cause |
|-------|--------|
| **421 Home directory not available** | FTP user home folder missing, wrong path, or permissions in cPanel |
| **Site not updating** | Files uploaded to FTP user folder (e.g. `…/tirth/`) while domain document root is **`public_html/`** |
| **`config.local.php` risk** | Syncing all of `backend/api/` could track/delete server-only files if ever present locally |

### `public_html` vs FTP root

- **Manual zip process** targets **`public_html`** (document root) per README.
- **Old GitHub Action** targeted **whatever folder the FTP user opens on login** (`./`), which may **not** be `public_html`.
- **Fix:** set repository variable **`FTP_SITE_DIR`** = `public_html/` when the live site is served from there.

## 2. Repaired workflow (current)

**Trigger:** push to `main`, or **Actions → Deploy FTP → Run workflow**

```
checkout → npm ci → npm run build
→ stage deploy-api/ (contact.php, .htaccess, config.local.example.php only)
→ FTP dist/ → ${FTP_SITE_DIR}
→ FTP deploy-api/ → ${FTP_SITE_DIR}api/
→ curl health checks on /, /contact, /api/contact.php
```

| Safeguard | Implementation |
|-----------|----------------|
| No full wipe | `dangerous-clean-slate: false` |
| Preserve `config.local.php` | Never in deploy bundle; excluded from API sync |
| Protect `api/` during site sync | `api/**` in site `exclude` |
| Staged API | Only 3 files uploaded to `api/` |

## 3. GitHub configuration

### Secrets (Settings → Secrets and variables → Actions → **Secrets**)

| Secret | Source in cPanel |
|--------|------------------|
| `FTP_SERVER` | FTP Accounts → **Configure FTP Client** → FTP server (e.g. `ftp.kyrithbuilds.com`) |
| `FTP_USERNAME` | FTP account username (e.g. `tirth@kyrithbuilds.com`) |
| `FTP_PASSWORD` | That account’s password |

### Variables (Settings → **Variables**)

| Variable | When to set |
|----------|-------------|
| `USE_EXPLICIT_FTPS` | `true` if plain FTP fails; uses FTPS on port 21 |
| `FTP_SITE_DIR` | `public_html/` if domain root is not the FTP login folder (must end with `/`) |
| `DEPLOY_URL` | Override health-check base URL (default `https://kyrithbuilds.com`) |

## 4. One-time server setup

Upload **`api/config.local.php`** manually (SendGrid). CI never deploys it.

## 5. Can GitHub Actions replace manual zip?

**YES**, after:

1. Secrets are set in GitHub.
2. **`FTP_SITE_DIR`** points at the same folder manual zip uses (often `public_html/`).
3. **`api/config.local.php`** exists on the server.
4. A workflow run passes post-deploy checks (or you confirm the site in a browser).

**NO** (keep manual `npm run pack-upload` as fallback) if:

- FTP still returns **421** (fix cPanel FTP user first).
- Health checks fail because files land in the wrong directory.
- Host blocks GitHub Actions IP ranges (rare).

Manual zip remains documented in README for emergency rollback.
