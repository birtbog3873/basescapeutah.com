import { handleEndpoints } from 'payload'
import type { D1Database } from '@cloudflare/workers-types'

interface Env {
  DB: D1Database
  R2_BUCKET: R2Bucket
  [key: string]: unknown
}

let cachedConfig: any = null

async function getConfig(env: Env) {
  if (cachedConfig) return cachedConfig

  // Expose Worker env bindings as process.env for Payload
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === 'string') {
      ;(globalThis as any).process ??= { env: {} }
      ;(globalThis as any).process.env[key] = value
    }
  }

  const { buildConfig } = await import('payload')
  const { sqliteD1Adapter } = await import('@payloadcms/db-d1-sqlite')
  const { s3Storage } = await import('@payloadcms/storage-s3')
  const { resendAdapter } = await import('@payloadcms/email-resend')
  const { lexicalEditor } = await import('@payloadcms/richtext-lexical')

  const { Media } = await import('./collections/Media')
  const { Services } = await import('./collections/Services')
  const { FAQs } = await import('./collections/FAQs')
  const { Reviews } = await import('./collections/Reviews')
  const { Projects } = await import('./collections/Projects')
  const { Leads } = await import('./collections/Leads')
  const { ServiceAreas } = await import('./collections/ServiceAreas')
  const { Offers } = await import('./collections/Offers')
  const { PaidLandingPages } = await import('./collections/PaidLandingPages')
  const { LeadMagnets } = await import('./collections/LeadMagnets')
  const { BlogPosts } = await import('./collections/BlogPosts')

  const { SiteSettings } = await import('./globals/SiteSettings')
  const { Navigation } = await import('./globals/Navigation')

  const { deployHookCollection, deployHookGlobal } = await import('./hooks/deployHook')
  const { afterLeadCreate } = await import('./hooks/afterLeadCreate')

  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET environment variable is required')
  }

  cachedConfig = buildConfig({
    secret: process.env.PAYLOAD_SECRET,
    editor: lexicalEditor(),
    db: sqliteD1Adapter({
      binding: env.DB,
    }),
    email: resendAdapter({
      defaultFromAddress: 'noreply@basescape.com',
      defaultFromName: 'BaseScape',
      apiKey: process.env.RESEND_API_KEY || '',
    }),
    plugins: [
      s3Storage({
        collections: {
          media: true,
        },
        bucket: process.env.R2_BUCKET_NAME || 'basescape-media',
        config: {
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
          },
          region: 'auto',
          endpoint: process.env.R2_ENDPOINT || '',
          forcePathStyle: true,
        },
      }),
    ],
    collections: [
      Media,
      {
        ...Services,
        hooks: {
          ...Services.hooks,
          afterChange: [...(Services.hooks?.afterChange || []), deployHookCollection],
        },
      },
      {
        ...ServiceAreas,
        hooks: {
          ...ServiceAreas.hooks,
          afterChange: [...(ServiceAreas.hooks?.afterChange || []), deployHookCollection],
        },
      },
      {
        ...FAQs,
        hooks: {
          ...FAQs.hooks,
          afterChange: [...(FAQs.hooks?.afterChange || []), deployHookCollection],
        },
      },
      {
        ...Reviews,
        hooks: {
          ...Reviews.hooks,
          afterChange: [...(Reviews.hooks?.afterChange || []), deployHookCollection],
        },
      },
      {
        ...Projects,
        hooks: {
          ...Projects.hooks,
          afterChange: [...(Projects.hooks?.afterChange || []), deployHookCollection],
        },
      },
      {
        ...Leads,
        hooks: {
          ...Leads.hooks,
          afterChange: [...(Leads.hooks?.afterChange || []), afterLeadCreate],
        },
      },
      Offers,
      PaidLandingPages,
      LeadMagnets,
      BlogPosts,
    ],
    globals: [
      {
        ...SiteSettings,
        hooks: {
          ...SiteSettings.hooks,
          afterChange: [...(SiteSettings.hooks?.afterChange || []), deployHookGlobal],
        },
      },
      {
        ...Navigation,
        hooks: {
          ...Navigation.hooks,
          afterChange: [...(Navigation.hooks?.afterChange || []), deployHookGlobal],
        },
      },
    ],
  })

  return cachedConfig
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const config = await getConfig(env)
    return handleEndpoints({
      config,
      request,
    })
  },
}
