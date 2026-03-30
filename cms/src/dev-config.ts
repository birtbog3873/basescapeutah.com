import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Media } from './collections/Media.js'
import { Services } from './collections/Services.js'
import { FAQs } from './collections/FAQs.js'
import { Reviews } from './collections/Reviews.js'
import { Projects } from './collections/Projects.js'
import { Leads } from './collections/Leads.js'
import { ServiceAreas } from './collections/ServiceAreas.js'
import { Offers } from './collections/Offers.js'
import { PaidLandingPages } from './collections/PaidLandingPages.js'
import { LeadMagnets } from './collections/LeadMagnets.js'
import { BlogPosts } from './collections/BlogPosts.js'

import { SiteSettings } from './globals/SiteSettings.js'
import { Navigation } from './globals/Navigation.js'

// Environment variables:
// PAYLOAD_SECRET        — CMS auth secret
// RESEND_API_KEY        — Email service
// TEAM_NOTIFICATION_EMAIL — Lead notification recipient
// GOOGLE_SHEETS_WEBHOOK_URL — (optional) Google Apps Script web app URL for lead logging

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  editor: lexicalEditor(),
  db: sqliteAdapter({
    client: {
      url: 'file:./data/dev.db',
    },
  }),
  email: resendAdapter({
    defaultFromAddress: 'noreply@basescape.com',
    defaultFromName: 'BaseScape',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  collections: [
    Media,
    Services,
    ServiceAreas,
    FAQs,
    Reviews,
    Projects,
    Leads,
    Offers,
    PaidLandingPages,
    LeadMagnets,
    BlogPosts,
  ],
  globals: [SiteSettings, Navigation],
})
