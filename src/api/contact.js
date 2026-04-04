/**
 * Dev: proxy to PHP (see vite.config.js). Start backend:
 *   php -S 127.0.0.1:8080 -t backend
 * Production: serve /api from the same host as the built SPA.
 */
export async function testContactApi() {
  const res = await fetch('/api/contact.php')
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  const data = await res.json()
  console.log('Contact API response:', data)
  return data
}
