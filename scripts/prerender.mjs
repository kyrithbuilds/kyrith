/**
 * Pre-render the built SPA so crawlers and AI engines get real HTML.
 *
 * Runs after `vite build`. Serves dist/ locally, opens every route from
 * public/sitemap.xml in headless Chrome (so effects run and <head> tags,
 * JSON-LD and page copy exist), then writes the resulting HTML back to dist/:
 *   /            → dist/index.html
 *   /services    → dist/services.html   (Apache serves it via public/.htaccess)
 *
 * The React app still boots on top of this HTML (createRoot), so behaviour
 * for visitors is unchanged.
 *
 * Chrome: uses CHROME_PATH, or a system Chrome/Edge/Chromium.
 *   Local, no Chrome found → warns and skips (site still works as a SPA).
 *   PRERENDER_STRICT=1 (set in CI) → fails the build instead of skipping.
 */
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')
const strict = process.env.PRERENDER_STRICT === '1'

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
}

function fail(message) {
  if (strict) {
    console.error(`prerender: ${message}`)
    process.exit(1)
  }
  console.warn(`prerender: ${message} Skipping, the site will still work as a SPA.`)
  process.exit(0)
}

function routesFromSitemap() {
  const xml = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8')
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  return [...new Set(paths)]
}

function outputFileFor(route) {
  return route === '/' ? join(distDir, 'index.html') : join(distDir, `${route.replace(/^\//, '')}.html`)
}

const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!existsSync(join(distDir, 'index.html'))) fail('dist/index.html not found. Run vite build first.')
if (!executablePath) fail('No Chrome, Edge or Chromium found (set CHROME_PATH).')

// Keep the untouched SPA shell: unknown paths fall back to it, and it is never overwritten mid-run.
const shell = await readFile(join(distDir, 'index.html'))

const server = createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  const filePath = normalize(join(distDir, urlPath))
  const inside = filePath.startsWith(distDir)
  if (inside && urlPath !== '/' && existsSync(filePath) && statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' })
    res.end(readFileSync(filePath))
    return
  }
  res.writeHead(200, { 'Content-Type': MIME['.html'] })
  res.end(shell)
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${server.address().port}`

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const routes = routesFromSitemap()
const written = []
try {
  for (const route of routes) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 900 })
    // Never talk to the outside world: no analytics hits from the build.
    await page.setRequestInterception(true)
    page.on('request', (request) => {
      if (request.url().startsWith(origin) || request.url().startsWith('data:')) request.continue()
      else request.abort()
    })

    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle0', timeout: 30000 })
    await page.waitForSelector('main h1', { timeout: 15000 })
    await page.waitForFunction(() => document.head.querySelector('link[rel="canonical"]'), { timeout: 15000 })

    await page.evaluate(() => {
      // Drop the analytics loader injected at runtime.
      document.querySelectorAll('script[src*="googletagmanager"]').forEach((el) => el.remove())
      // Match the first client render so nothing flickers when React takes over.
      document.querySelectorAll('.is-visible').forEach((el) => el.classList.remove('is-visible'))
      // Without JS the scroll-reveal elements would stay transparent.
      const noscript = document.createElement('noscript')
      noscript.innerHTML =
        '<style>.reveal-on-scroll{opacity:1!important;transform:none!important}</style>'
      document.head.appendChild(noscript)
    })

    const html = await page.content()
    if (!html.includes('<h1')) throw new Error(`No <h1> rendered for ${route}`)
    const target = outputFileFor(route)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, html)
    written.push(`${route} → ${target.replace(distDir, 'dist')}`)
    await page.close()
  }
} catch (error) {
  await browser.close()
  server.close()
  fail(`Failed while rendering: ${error.message}`)
}

await browser.close()
server.close()
console.log(`prerender: wrote ${written.length} pages\n  ${written.join('\n  ')}`)
