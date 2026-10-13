import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '..'),
  // Next traces only libsql's Node entries. On Workers, OpenNext resolves the
  // `workerd`/`browser` exports (web.js etc.), so ship every @libsql package whole.
  outputFileTracingIncludes: {
    '/**': ['../node_modules/.pnpm/@libsql+*/node_modules/@libsql/**'],
  },
}

export default withPayload(nextConfig)

// Cloudflare bindings (EMAIL) during `next dev` only — under `next build` the
// parallel build workers fight over Miniflare's SQLite and the build fails.
if (process.env.NODE_ENV === 'development') initOpenNextCloudflareForDev()
