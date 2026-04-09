import { buildConfig } from 'payload'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { s3Storage } from '@payloadcms/storage-s3'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

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

import { SiteSettings } from './src/globals/SiteSettings'
import { Navigation } from './src/globals/Navigation'

import { deployHookCollection, deployHookGlobal } from './src/hooks/deployHook'

export default buildConfig({
  cors: ['https://basescapeutah.com'],
  secret: process.env.PAYLOAD_SECRET ?? (() => { throw new Error('PAYLOAD_SECRET env var required') })(),
  editor: lexicalEditor(),
  db: sqliteD1Adapter({
    binding: 'DB',
  }),
  email: resendAdapter({
    defaultFromAddress: 'noreply@basescapeutah.com',
    defaultFromName: 'BaseScape',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  // Note: s3Storage plugin is configured in src/index.ts (Workers entry point)
  // with the real R2 credentials from Worker env bindings.
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
