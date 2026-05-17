import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Local PHP: php -S 127.0.0.1:8080 -t backend — or: npm run dev:with-php
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        configure(proxy) {
          proxy.on('error', (_err, _req, res) => {
            if (!res || res.headersSent) return
            try {
              res.writeHead(502, {
                'Content-Type': 'application/json; charset=utf-8',
              })
              res.end(
                JSON.stringify({
                  error:
                    'PHP is not running on port 8080. From the project folder run: npm run dev:with-php — or in a second terminal: php -S 127.0.0.1:8080 -t backend',
                }),
              )
            } catch {
              /* ignore */
            }
          })
        },
      },
    },
  },
})
