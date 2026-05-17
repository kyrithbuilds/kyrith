/**
 * Builds kyrithbuilds-upload.zip: dist/ contents at zip root + api/contact.php
 * Upload this ONE file to cPanel → public_html → Extract. No manual folders.
 */
import { createWriteStream } from 'fs'
import { access } from 'fs/promises'
import { readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import archiver from 'archiver'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')
const apiDir = join(root, 'backend', 'api')
const contactPhp = join(apiDir, 'contact.php')
const apiHtaccess = join(apiDir, '.htaccess')
const outZip = join(root, 'kyrithbuilds-upload.zip')

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

await access(distDir)
await access(contactPhp)

const output = createWriteStream(outZip)
const archive = archiver('zip', { zlib: { level: 9 } })

archive.on('warning', (err) => {
  if (err.code !== 'ENOENT') throw err
})
archive.on('error', (err) => {
  throw err
})

archive.pipe(output)
addDirRecursive(archive, distDir)
archive.file(contactPhp, { name: 'api/contact.php' })
archive.file(apiHtaccess, { name: 'api/.htaccess' })
await archive.finalize()

await new Promise((resolve, reject) => {
  output.on('close', resolve)
  output.on('error', reject)
})

console.log('Done. Upload this ONE file to your hosting and extract it:')
console.log(outZip)
