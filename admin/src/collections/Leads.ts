import { timingSafeEqual } from 'crypto'
import type { CollectionConfig } from 'payload'
import { sendOfflineConversion } from '../hooks/sendOfflineConversion'

function safeCompare(a: string, b: string): boolean {
  try {
    return a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    return false
  }
}

function hasValidApiKey(req: any): boolean {
  const apiKey = process.env.PAYLOAD_API_KEY?.trim()
  if (!apiKey) return false
  const auth = req.headers?.get?.('authorization')?.trim()
    ?? (req.headers as any)?.authorization?.trim()
  if (!auth) return false
  return safeCompare(auth, `Bearer ${apiKey}`)
}

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'serviceType', 'status', 'preferredDate', 'createdAt'],
    description: 'Submitted prospect records from website forms.',
  },
  access: {
    read: ({ req }) => Boolean(req.user) || hasValidApiKey(req),
    create: ({ req }) => Boolean(req.user) || hasValidApiKey(req),
    update: ({ req }) => Boolean(req.user) || hasValidApiKey(req),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (data?.zipCode) {
          try {
            const settings = await req.payload.findGlobal({ slug: 'site-settings' })
            const validZips = (settings as any)?.serviceAreaZipCodes
              ?.split('\n')
              .map((z: string) => z.trim())
              .filter(Boolean) || []
            if (validZips.length > 0 && !validZips.includes(data.zipCode)) {
              data.isOutOfServiceArea = true
            }
          } catch {
            // If settings unavailable, don't flag
          }
        }
        return data
      },
    ],
    afterChange: [
      // Google Sheets webhook is now fired from the Astro action
      // (site/src/actions/index.ts) using Cloudflare Worker's ctx.waitUntil,
      // because Vercel's waitUntil wasn't flushing the HTTP response early
      // when called from inside a Payload hook (Payload's transaction model
      // or Next.js route handler appears to wait for pending promises).
      sendOfflineConversion,
    ],
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      admin: { description: 'Client-generated UUID linking partial form steps' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'partial',
      options: [
        { label: 'Partial', value: 'partial' },
        { label: 'Complete', value: 'complete' },
        { label: 'Abandoned', value: 'abandoned' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Closed Won', value: 'closed_won' },
        { label: 'Closed Lost', value: 'closed_lost' },
      ],
    },
    {
      name: 'currentStep',
      type: 'number',
      required: true,
      min: 0,
      max: 3,
      defaultValue: 0,
    },
    {
      name: 'serviceType',
      type: 'select',
      options: [
        { label: 'Walkout Basement', value: 'walkout-basement' },
        { label: 'Basement Remodeling', value: 'basement-remodeling' },
        { label: 'Pavers & Hardscapes', value: 'pavers-hardscapes' },
        { label: 'Retaining Walls', value: 'retaining-walls' },
        { label: 'Artificial Turf', value: 'artificial-turf' },
        { label: 'Egress Windows', value: 'egress-windows' },
        { label: 'Not Sure', value: 'not-sure' },
      ],
    },
    { name: 'zipCode', type: 'text', maxLength: 5 },
    { name: 'preferredDate', type: 'text', admin: { description: 'ISO date string (YYYY-MM-DD)' } },
    {
      name: 'timePreference',
      type: 'select',
      options: [
        { label: 'Morning', value: 'morning' },
        { label: 'Afternoon', value: 'afternoon' },
        { label: 'Evening', value: 'evening' },
        { label: 'Not Sure', value: 'not-sure' },
      ],
    },
    { name: 'name', type: 'text', maxLength: 100 },
    { name: 'phone', type: 'text', maxLength: 20 },
    { name: 'email', type: 'email' },
    { name: 'address', type: 'text', maxLength: 200 },
    { name: 'additionalNotes', type: 'textarea', maxLength: 1000 },
    {
      name: 'source',
      type: 'group',
      fields: [
        { name: 'page', type: 'text', required: true },
        { name: 'utmSource', type: 'text' },
        { name: 'utmMedium', type: 'text' },
        { name: 'utmCampaign', type: 'text' },
        { name: 'utmContent', type: 'text' },
        { name: 'utmTerm', type: 'text' },
        { name: 'referrer', type: 'text' },
        { name: 'gaClientId', type: 'text', admin: { description: 'GA4 client_id from _ga cookie' } },
        { name: 'gclid', type: 'text', admin: { description: 'Google Ads click ID from URL' } },
      ],
    },
    {
      name: 'closedValue',
      type: 'number',
      admin: { description: 'Revenue amount for closed deals (USD)' },
    },
    {
      name: 'isOutOfServiceArea',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'formType',
      type: 'select',
      required: true,
      options: [
        { label: 'Multi-Step', value: 'multi-step' },
        { label: 'Quick Callback', value: 'quick-callback' },
        { label: 'Lead Magnet', value: 'lead-magnet' },
      ],
    },
    { name: 'confirmationSentAt', type: 'date' },
    { name: 'teamNotifiedAt', type: 'date' },
  ],
}
