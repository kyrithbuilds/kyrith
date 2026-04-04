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
