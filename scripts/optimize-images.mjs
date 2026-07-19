/**
 * Optimize oversized raster assets → WebP (run manually: node scripts/optimize-images.mjs)
 */
import sharp from 'sharp'
import { access, stat, unlink } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const assets = join(root, 'src', 'assets')

/** @type {{ input: string; output: string; maxWidth: number; quality: number }} */
const jobs = [
  {
    input: 'blob.png',
    output: 'blob.webp',
    maxWidth: 1200,
    quality: 82,
  },
  {
    input: 'about-hero-illustration.png',
    output: 'about-hero-illustration.webp',
    maxWidth: 1600,
    quality: 88,
  },
]

function fmt(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  return `${(bytes / 1024).toFixed(1)} KB`
}

const rows = []

for (const job of jobs) {
  const inputPath = join(assets, job.input)
  const outputPath = join(assets, job.output)

  await access(inputPath)
  const before = (await stat(inputPath)).size
  const meta = await sharp(inputPath).metadata()
  const width = meta.width ?? job.maxWidth
  const resizeWidth = width > job.maxWidth ? job.maxWidth : undefined

  let pipeline = sharp(inputPath)
  if (resizeWidth) {
    pipeline = pipeline.resize({ width: resizeWidth, withoutEnlargement: true })
  }

  await pipeline.webp({ quality: job.quality, effort: 6 }).toFile(outputPath)

  const after = (await stat(outputPath)).size
  const pct = (((before - after) / before) * 100).toFixed(1)

  rows.push({
    file: job.input,
    output: job.output,
    dimensions: `${meta.width}×${meta.height}${resizeWidth ? ` → ${resizeWidth}w` : ''}`,
    before,
    after,
    pct,
  })
}

console.log('\nImage optimization report\n')
console.log('| Asset | Output | Dimensions | Before | After | Reduction |')
console.log('|-------|--------|------------|--------|-------|-----------|')
for (const r of rows) {
  console.log(
    `| ${r.file} | ${r.output} | ${r.dimensions} | ${fmt(r.before)} | ${fmt(r.after)} | ${r.pct}% |`,
  )
}
console.log('')
