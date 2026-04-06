import type { CollectionConfig } from 'payload'
import { afterLeadCreate } from '../hooks/afterLeadCreate'
import { sendOfflineConversion } from '../hooks/sendOfflineConversion'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'serviceType', 'status', 'preferredDate', 'createdAt'],
    description: 'Submitted prospect records from website forms.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // API key auth handled at action layer
    update: ({ req: { user } }) => Boolean(user),
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

        // Google Sheets webhook (skip emails for now)
        const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
        const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET
        if (webhookUrl && webhookSecret) {
          try {
            // TODO: Apps Script doPost(e) cannot read HTTP headers — see afterLeadCreate.ts
            await fetch(webhookUrl, {
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
            console.log('[LEADS] Webhook sent for lead', doc.id)
          } catch (err: any) {
            console.error('[LEADS] Webhook failed:', err?.message)
          }
        }

        // Mark as processed
        try {
          await req.payload.update({
            collection: 'leads',
            id: doc.id,
            data: { teamNotifiedAt: new Date().toISOString() },
          })
        } catch { /* ignore */ }

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
    { name: 'phone', type: 'text' },
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
