import { timingSafeEqual } from 'crypto'
import type { CollectionConfig } from 'payload'
import { waitUntil } from '@vercel/functions'
import { afterLeadCreate } from '../hooks/afterLeadCreate'
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
      async ({ doc, previousDoc, req, operation }) => {
        const statusChanged = operation === 'update'
          ? previousDoc?.status !== 'complete' && doc.status === 'complete'
          : operation === 'create' && doc.status === 'complete'
        if (!statusChanged) return doc

        // Background work: Google Sheets webhook (Apps Script takes 5-15s)
        // + teamNotifiedAt update. Use waitUntil so the HTTP response flushes
        // immediately and these run after the user gets their "thank you" page.
        const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
        const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET
        if (webhookUrl && webhookSecret) {
          waitUntil(
            fetch(webhookUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${webhookSecret}`,
              },
              body: JSON.stringify({
                timestamp: doc.createdAt,
                name: doc.name,
                phone: doc.phone,
                email: doc.email,
                zipCode: doc.zipCode,
                serviceType: doc.serviceType,
                preferredDate: doc.preferredDate,
                timePreference: doc.timePreference,
                address: doc.address,
                additionalNotes: doc.additionalNotes,
                formType: doc.formType,
                isOutOfServiceArea: doc.isOutOfServiceArea,
                source: doc.source?.page,
                utmSource: doc.source?.utmSource,
                utmMedium: doc.source?.utmMedium,
                utmCampaign: doc.source?.utmCampaign,
                gaClientId: doc.source?.gaClientId,
                gclid: doc.source?.gclid,
              }),
            })
              .then(() => console.log('[LEADS] Webhook sent for lead', doc.id))
              .catch((err: any) => console.error('[LEADS] Webhook failed:', err?.message)),
          )
        }

        // NOTE: teamNotifiedAt used to be set via req.payload.update() here,
        // but calling update() on the same row during afterChange causes
        // connection pool contention with the outer transaction and adds
        // 5-7 seconds to the response time. The field is nice-to-have; if
        // we need it back, set it via a write before the main update returns
        // (e.g. by setting doc.teamNotifiedAt in a beforeChange hook).

        return doc
      },
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
