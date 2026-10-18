import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const ADSENSE_CLIENT_PATTERN = /^ca-pub-\d{10,20}$/

// Adds the Google AdSense loader script, account meta tag, and ads.txt
// when VITE_ADSENSE_CLIENT is configured (see README and .env.example).
function googleAdSense(client) {
  return {
    name: 'google-adsense',
    transformIndexHtml() {
      if (!client) return []

      return [
        {
          tag: 'meta',
          attrs: { name: 'google-adsense-account', content: client },
          injectTo: 'head',
        },
        {
          tag: 'script',
          attrs: {
            async: true,
            crossorigin: 'anonymous',
            src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`,
          },
          injectTo: 'head',
        },
      ]
    },
    generateBundle() {
      if (!client) return

      this.emitFile({
        type: 'asset',
        fileName: 'ads.txt',
        source: `google.com, ${client.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const adsenseClient = env.VITE_ADSENSE_CLIENT?.trim() ?? ''

  if (adsenseClient && !ADSENSE_CLIENT_PATTERN.test(adsenseClient)) {
    throw new Error(
      `VITE_ADSENSE_CLIENT must look like "ca-pub-1234567890123456" (received "${adsenseClient}").`,
    )
  }

  return {
    plugins: [react(), googleAdSense(adsenseClient)],
  }
})
