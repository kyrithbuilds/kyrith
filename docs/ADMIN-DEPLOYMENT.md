# Admin panel deployment

**Live URL:** https://admin.kyrithbuilds.com  
**Source in this repo:** `admin/` (merged from [github.com/kyrithbuilds/admin](https://github.com/kyrithbuilds/admin))  
**Server folder:** `public_html/admin.kyrithbuilds.com/`

Pushing `admin/` on **`main`** runs **Deploy Admin FTP**. Marketing-site deploys skip this folder (`--delete` excludes `admin.kyrithbuilds.com/`).

## GitHub variables (this repo)

Use **different** variables from the marketing site so admin is not uploaded to `public_html/` root.

| Variable | Typical value |
|----------|----------------|
| `FTP_ADMIN_SITE_DIR` | `admin.kyrithbuilds.com` |
| `ADMIN_DEPLOY_URL` | `https://admin.kyrithbuilds.com` |

FTP secrets (`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`) are shared with the website deploy.

## `config.local.php`

CI does **not** upload this file. On the server, copy `admin/config.local.example.php` to `config.local.php` in the admin document root and fill in MySQL credentials from cPanel.

Locally: copy the example to `admin/config.local.php` (gitignored).
