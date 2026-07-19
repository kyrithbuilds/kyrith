import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const assets = join(root, 'src/assets')

function darkFullLogo(svg) {
  return svg
    .replaceAll('fill="#021D41"', 'fill="#FFFFFF"')
    .replaceAll('stroke="#FEFEFE"', 'stroke="#021D41"')
    .replaceAll('fill="white"', 'fill="#021D41"')
    .replaceAll('fill="black"', 'fill="#FFFFFF"')
}

function darkCircleLogo(svg) {
  return svg
    .replaceAll('fill="#021D41"', 'fill="__LIGHT__"')
    .replace('fill="white"', 'fill="#021D41"')
    .replaceAll('fill="__LIGHT__"', 'fill="#FFFFFF"')
}

writeFileSync(
  join(assets, 'Full Logo Dark.svg'),
  darkFullLogo(readFileSync(join(assets, 'Full Logo.svg'), 'utf8')),
)
writeFileSync(
  join(assets, 'Circle Logo Dark.svg'),
  darkCircleLogo(readFileSync(join(assets, 'Circle Logo.svg'), 'utf8')),
)

console.log('Wrote Full Logo Dark.svg and Circle Logo Dark.svg')
