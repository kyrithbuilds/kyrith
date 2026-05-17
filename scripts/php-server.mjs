/**
 * Starts PHP built-in server for /api (contact.php). Finds PHP when XAMPP is installed
 * but not on PATH. Override with env: XAMPP_PHP or PHP_BINARY = full path to php.exe
 */
import { execSync, spawn } from 'child_process'
import { existsSync, readdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function isPhpOnPath() {
  try {
    if (process.platform === 'win32') {
      execSync('where php', { stdio: 'ignore', shell: true })
    } else {
      execSync('command -v php', { stdio: 'ignore' })
    }
    return true
  } catch {
    return false
  }
}

/** @type {string[]} */
const fileCandidates = []
for (const envKey of ['XAMPP_PHP', 'PHP_BINARY']) {
  const v = process.env[envKey]
  if (v) fileCandidates.push(v)
}

if (process.platform === 'win32') {
  const pf = process.env['ProgramFiles'] || 'C:\\Program Files'
  const pfx86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)'
  fileCandidates.push(
    'C:\\xampp\\php\\php.exe',
    'D:\\xampp\\php\\php.exe',
    join(pf, 'xampp', 'php', 'php.exe'),
    join(pfx86, 'xampp', 'php', 'php.exe'),
    // Non-default XAMPP root (e.g. installed to D:\dell\php\)
    'D:\\dell\\php\\php\\php.exe',
    'D:\\Dell\\php\\php\\php.exe',
  )
  const laragonBase = join(process.env.SystemDrive || 'C:', 'laragon', 'bin', 'php')
  if (existsSync(laragonBase)) {
    try {
      const dirs = readdirSync(laragonBase)
        .filter((d) => d.startsWith('php-'))
        .sort()
        .reverse()
      for (const d of dirs) {
        const p = join(laragonBase, d, 'php.exe')
        if (existsSync(p)) {
          fileCandidates.push(p)
          break
        }
      }
    } catch {
      /* ignore */
    }
  }
}

let exe = null
for (const c of fileCandidates) {
  if (c && existsSync(c)) {
    exe = c
    break
  }
}

if (!exe && isPhpOnPath()) {
  exe = 'php'
}

if (!exe) {
  console.error(
    '[php-server] PHP not found.\n' +
      '  • XAMPP: set user env XAMPP_PHP to your php.exe, e.g. C:\\xampp\\php\\php.exe\n' +
      '  • Or add the folder containing php.exe (e.g. C:\\xampp\\php) to your user PATH, then open a new terminal.',
  )
  process.exit(1)
}

console.log(`[php-server] Using: ${exe}`)
console.log('[php-server] API at http://127.0.0.1:8080/api/contact.php (Vite proxies /api → here)')

const child = spawn(exe, ['-S', '127.0.0.1:8080', '-t', 'backend'], {
  cwd: root,
  stdio: 'inherit',
})

child.on('error', (err) => {
  console.error('[php-server] Failed to start PHP:', err.message)
  if (process.platform === 'win32' && err.code === 'ENOENT') {
    console.error(
      '  Set user env XAMPP_PHP to php.exe, e.g. D:\\dell\\php\\php\\php.exe, then open a new terminal.',
    )
  }
  process.exit(1)
})

child.on('exit', (code, signal) => {
  if (signal) process.exit(1)
  if (code && code !== 0) {
    console.error(
      '[php-server] PHP exited. If you see "Address already in use", port 8080 is taken — close the other PHP terminal or stop XAMPP Apache using that port.',
    )
    process.exit(code)
  }
})
