/**
 * Dev: Vite proxies /api to PHP (vite.config.js). Run:
 *   php -S 127.0.0.1:8080 -t backend
 * Production: same host, /api/contact.php + config.local.php on server.
 */
function parseErrorFromBody(status, text) {
  const trimmed = (text || '').trim()
  if (!trimmed) {
    const devHint =
      import.meta.env.DEV &&
      ' Run Vite + PHP: npm run dev:with-php (or php -S 127.0.0.1:8080 -t backend).'
    const liveHint =
      !import.meta.env.DEV &&
      ' On the server: ensure api/contact.php and api/config.local.php exist and PHP+cURL are enabled.'
    return `HTTP ${status}: empty response.${devHint || liveHint || ''}`
  }
  try {
    const data = JSON.parse(trimmed)
    if (data && typeof data.error === 'string' && data.error.length > 0) {
      return data.error
    }
    return `HTTP ${status}: ${JSON.stringify(data)}`
  } catch {
    const snippet = trimmed.replace(/\s+/g, ' ').slice(0, 280)
    return `HTTP ${status}: not JSON (proxy/gateway or PHP crash?). Starts with: ${snippet}`
  }
}

export async function submitContact({ name, email, message, company = '', timeline = '' }) {
  const res = await fetch('/api/contact.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message, company, timeline }),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(parseErrorFromBody(res.status, text))
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Unexpected response (not JSON): ${text.slice(0, 200)}`)
  }
}
