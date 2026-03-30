import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { s3Storage } from '@payloadcms/storage-s3'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// Collections (copied from cms/src/collections/)
import { Media } from './src/collections/Media'
import { Services } from './src/collections/Services'
import { FAQs } from './src/collections/FAQs'
import { Reviews } from './src/collections/Reviews'
import { Projects } from './src/collections/Projects'
import { Leads } from './src/collections/Leads'
import { ServiceAreas } from './src/collections/ServiceAreas'
import { Offers } from './src/collections/Offers'
import { PaidLandingPages } from './src/collections/PaidLandingPages'
import { LeadMagnets } from './src/collections/LeadMagnets'
import { BlogPosts } from './src/collections/BlogPosts'

// Globals (copied from cms/src/globals/)
import { SiteSettings } from './src/globals/SiteSettings'
import { Navigation } from './src/globals/Navigation'

// Deploy hook (copied from cms/src/hooks/)
import { deployHookCollection, deployHookGlobal } from './src/hooks/deployHook'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  editor: lexicalEditor(),
  db: sqliteAdapter({
    client: {
      url: process.env.TURSO_DATABASE_URL || 'file:./data/dev.db',
      authToken: process.env.TURSO_AUTH_TOKEN,
    },
  }),
  email: resendAdapter({
    defaultFromAddress: 'noreply@basescapeutah.com',
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
    Leads,
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
