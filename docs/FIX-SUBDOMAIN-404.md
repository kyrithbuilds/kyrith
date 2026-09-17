# Fix: admin.kyrithbuilds.com folder is empty

## Your server layout (from File Manager)

```
public_html/
├── admin.kyrithbuilds.com/   ← subdomain points HERE (was empty)
├── api/                      ← main website
├── assets/                   ← main website
├── db-test.php               ← admin files wrongly uploaded here (delete)
├── config.local.php          ← admin files wrongly uploaded here (delete)
└── includes/                 ← admin files wrongly uploaded here (delete)
```

CI was using `FTP_SITE_DIR=admin`, but your host has **`admin.kyrithbuilds.com`** (not `admin`).  
Files were dropped in `public_html/` instead of the subdomain folder.

## Fix (already done in code)

Default deploy target is now **`admin.kyrithbuilds.com`**.

### Step 1 — Update GitHub variable

1. GitHub → **kyrithbuilds/admin** → **Settings** → **Secrets and variables** → **Actions** → **Variables**
2. Edit **`FTP_SITE_DIR`**
3. Set value to: **`admin.kyrithbuilds.com`**
4. Save

(If the variable does not exist, add it with that value.)

### Step 2 — Re-deploy

**Actions** → **Deploy FTP** → **Run workflow** → **Run workflow**

Wait for green checkmark.

### Step 3 — Confirm in File Manager

Open **`public_html/admin.kyrithbuilds.com/`** — you should see:

- `db-test.php`
- `config.local.php`
- `includes/`
- `.htaccess`

### Step 4 — Test

**https://admin.kyrithbuilds.com/db-test.php**

### Step 5 — Clean up mistaken files in `public_html` root

In File Manager, inside **`public_html`** (not inside the subdomain folder), **delete** these if present — they were uploaded to the wrong place:

- `db-test.php`
- `config.local.php`
- `config.local.example.php`
- `includes/` folder (only if it contains `db.php` — that's the admin copy)

**Do not delete** `api/` or `assets/` — those belong to the main website.

Also delete `.htaccess` in `public_html` root **only if** it was added by the admin deploy and is not your main site's `.htaccess`. If unsure, skip this step and ask us.
