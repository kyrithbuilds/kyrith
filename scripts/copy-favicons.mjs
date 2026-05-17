/**
 * Copies favicon_io assets to /public so Vite serves them at stable root URLs
 * (e.g. /favicon.ico) in dev and copies them unchanged into dist/ on build.
 */
import { copyFile, mkdir } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const sourceDir = join(root, 'src', 'assets', 'favicon_io')
const publicDir = join(root, 'public')

const files = [
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'site.webmanifest',
]

await mkdir(publicDir, { recursive: true })

for (const name of files) {
  await copyFile(join(sourceDir, name), join(publicDir, name))
}

console.log('Favicons copied to public/')
