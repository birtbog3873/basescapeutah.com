import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        // Exclude landing pages
        if (page.includes('/lp/')) return false
        // Exclude gallery when hidden (showGallery defaults to false)
        if (page.includes('/gallery')) return false
        return true
      },
    }),
  ],
  site: 'https://basescapeutah.com',
  redirects: {
    '/services/window-well-upgrades': '/',
  },
  vite: {
    plugins: [vanillaExtractPlugin()],
  },
})
