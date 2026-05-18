/**
 * Production zip for cPanel manual upload.
 *
 * Output: kyrithbuilds-upload.zip
 *   - Frontend: everything from dist/ at zip root (index.html, assets/, .htaccess, …)
 *   - Backend:  api/contact.php, api/.htaccess, api/config.local.php (email)
 *
 * Run: npm run pack-upload
 * Upload zip to public_html → Extract (overwrite when prompted).
 */
import { createWriteStream } from 'fs'
import { access, unlink } from 'fs/promises'
import { readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import archiver from 'archiver'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')
const apiDir = join(root, 'backend', 'api')
const outZip = join(root, 'kyrithbuilds-upload.zip')

const apiFiles = [
  { file: 'contact.php', required: true },
  { file: '.htaccess', required: true },
  { file: 'config.local.php', required: true, note: 'SendGrid — required for contact form email' },
]

function addDirRecursive(archive, dir, zipPath = '') {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name)
    const nameInZip = zipPath ? `${zipPath}/${name.name}` : name.name
    if (name.isDirectory()) {
      addDirRecursive(archive, full, nameInZip)
    } else {
      archive.file(full, { name: nameInZip })
    }
  }
}

async function pathExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

// --- Preflight ---
if (!(await pathExists(distDir))) {
  console.error('Missing dist/. Run: npm run build')
  process.exit(1)
}

const missing = []
for (const { file, required, note } of apiFiles) {
  const full = join(apiDir, file)
  if (!(await pathExists(full))) {
    if (required) missing.push({ file, note })
  }
}

if (missing.length > 0) {
  console.error('Cannot create production zip — missing required API files:\n')
  for (const { file, note } of missing) {
    console.error(`  - backend/api/${file}${note ? ` (${note})` : ''}`)
  }
  if (missing.some((m) => m.file === 'config.local.php')) {
    console.error('\nFor email on production, copy:')
    console.error('  backend/api/config.local.example.php → backend/api/config.local.php')
    console.error('Then add your SendGrid API key and mail settings.')
  }
  process.exit(1)
}

// Remove previous zip
try {
  await unlink(outZip)
} catch {
  /* none yet */
}

const output = createWriteStream(outZip)
const archive = archiver('zip', { zlib: { level: 9 } })

archive.on('warning', (err) => {
  if (err.code !== 'ENOENT') throw err
})
archive.on('error', (err) => {
  throw err
})

const instructions = `KyrithBuilds — production upload
================================

1. cPanel → File Manager → public_html
2. Upload kyrithbuilds-upload.zip
3. Extract here (overwrite existing site files when asked)
4. Confirm these exist:
   - index.html
   - assets/
   - .htaccess
   - api/contact.php
   - api/.htaccess
   - api/config.local.php  (contact form email — included in this zip)

5. Test:
   - https://yourdomain.com/
   - https://yourdomain.com/contact  (submit form)

Generated: ${new Date().toISOString()}
`

archive.pipe(output)
addDirRecursive(archive, distDir)
for (const { file } of apiFiles) {
  archive.file(join(apiDir, file), { name: `api/${file}` })
}
archive.append(instructions, { name: 'UPLOAD-INSTRUCTIONS.txt' })

await archive.finalize()

await new Promise((resolve, reject) => {
  output.on('close', resolve)
  output.on('error', reject)
})

const sizeMb = (statSync(outZip).size / (1024 * 1024)).toFixed(2)
const distCount = readdirSync(distDir, { withFileTypes: true }).length

console.log('')
console.log('Production zip ready')
console.log('====================')
console.log(`File:   ${outZip}`)
console.log(`Size:   ${sizeMb} MB`)
console.log('')
console.log('Included:')
console.log(`  dist/          → zip root (${distCount} top-level items)`)
for (const { file, note } of apiFiles) {
  console.log(`  api/${file}${note ? ` — ${note}` : ''}`)
}
console.log('  UPLOAD-INSTRUCTIONS.txt')
console.log('')
console.log('Upload to public_html and extract. This zip includes api/config.local.php for email.')
console.log('Keep the zip private — it contains your SendGrid configuration.')
console.log('')
