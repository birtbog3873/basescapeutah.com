import { defineAction } from 'astro:actions'
import { z } from 'zod'
import {
  leadStepOneSchema,
  leadStepTwoSchema,
  leadStepThreeSchema,
  quickCallbackSchema,
  leadMagnetSchema,
} from '../lib/validation'
import { createLead, updateLead, findLeadBySessionId } from '../lib/payload'

// Retry CMS operations once on 500 errors per edge case spec (T085)
async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error: any) {
    if (error?.message?.includes('500') || error?.message?.includes('Internal Server Error')) {
      // Single retry
      return await fn()
    }
    throw error
  }
}

/**
 * Fire the Google Sheets webhook as background work using Cloudflare
 * Worker's ctx.waitUntil. Apps Script is slow (5-15s) so we must NOT
 * block the user response. This used to live in the Payload afterChange
 * hook on Vercel but waitUntil wasn't being respected there — moving it
 * to the Cloudflare Worker runtime gives us reliable fire-and-forget.
 */
function fireLeadWebhook(lead: any, ctx: any) {
  const webhookUrl = import.meta.env.GOOGLE_SHEETS_WEBHOOK_URL
  const webhookSecret = import.meta.env.GOOGLE_SHEETS_WEBHOOK_SECRET
  if (!webhookUrl || !webhookSecret) return

  // Google Apps Script doPost(e) does NOT expose HTTP headers — the secret
  // must travel in the POST body and be checked against data.secret on the
  // script side. See cms/google-apps-script/lead-webhook.gs line 49.
  const promise = fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: webhookSecret,
      timestamp: lead.createdAt || new Date().toISOString(),
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      zipCode: lead.zipCode,
      serviceType: lead.serviceType,
      preferredDate: lead.preferredDate,
      timePreference: lead.timePreference,
      address: lead.address,
      additionalNotes: lead.additionalNotes,
      formType: lead.formType,
      isOutOfServiceArea: lead.isOutOfServiceArea,
      source: lead.source?.page,
      utmSource: lead.source?.utmSource,
      utmMedium: lead.source?.utmMedium,
      utmCampaign: lead.source?.utmCampaign,
      gaClientId: lead.source?.gaClientId,
      gclid: lead.source?.gclid,
    }),
  })
    .then(() => console.log('[LEADS] Webhook sent for lead', lead.id))
    .catch((err: any) => console.error('[LEADS] Webhook failed:', err?.message))

  // ctx.waitUntil tells the Cloudflare Worker to keep running the promise
  // after the response has been returned to the user. Fallback to a bare
  // promise if ctx isn't available (shouldn't happen in prod).
  if (ctx?.waitUntil) {
    ctx.waitUntil(promise)
  }
}

export const server = {
  saveFormStep: defineAction({
    accept: 'json',
    input: z.discriminatedUnion('step', [
      leadStepOneSchema,
      leadStepTwoSchema,
      leadStepThreeSchema,
    ]),
    handler: async (input, context) => {
      // Cloudflare Worker execution context — used for fire-and-forget webhook
      const ctx = (context.locals as any)?.runtime?.ctx

      // Honeypot check — silent fake success with realistic response
      if (input.honeypot) {
        return { success: true, leadId: crypto.randomUUID(), step: input.step }
      }

      if (input.step === 1) {
        // Create new partial lead (with retry on CMS 500)
        const result = await withRetry(() => createLead({
          sessionId: input.sessionId,
          status: 'partial',
          currentStep: 1,
          serviceType: input.serviceType,
          zipCode: input.zipCode,
          formType: 'multi-step',
          source: input.source,
        }))
        return { success: true, leadId: result.doc?.id, step: 1 }
      }

      // Steps 2-3: Find existing lead (may fail if API key missing or CMS unreachable)
      let existing: any = null
      try {
        existing = await findLeadBySessionId(input.sessionId)
      } catch {
        // Read access requires auth — if API key is missing, fall through gracefully
      }

      if (input.step === 2) {
        if (!existing) {
          // Step 1 save may have failed — skip update, step 3 will create full lead
          return { success: true, leadId: null, step: 2 }
        }
        const result = await withRetry(() => updateLead(existing.id, {
          currentStep: 2,
          preferredDate: input.preferredDate,
          timePreference: input.timePreference,
        }))
        return { success: true, leadId: result.doc?.id, step: 2 }
      }

      if (input.step === 3) {
        const step3Data = {
          currentStep: 3,
          status: 'complete' as const,
          serviceType: input.serviceType,
          zipCode: input.zipCode,
          preferredDate: input.preferredDate,
          timePreference: input.timePreference,
          name: `${input.firstName} ${input.lastName}`,
          phone: input.phone,
          email: input.email,
          address: input.address,
          additionalNotes: input.comments,
        }
        try {
          let finalLead: any = null
          if (existing) {
            try {
              const result = await withRetry(() => updateLead(existing.id, step3Data))
              finalLead = result.doc
            } catch {
              // Update failed — fall through to create a new complete lead
            }
          }
          if (!finalLead) {
            const result = await withRetry(() => createLead({
              ...step3Data,
              sessionId: input.sessionId,
              formType: 'multi-step',
              source: input.source,
            }))
            finalLead = result.doc
          }

          // Fire Google Sheets webhook as background work via ctx.waitUntil
          // so the response flushes immediately, and Apps Script runs after.
          fireLeadWebhook({ ...finalLead, source: input.source }, ctx)

          return { success: true, leadId: finalLead?.id, step: 3 }
        } catch {
          return { success: false, leadId: null, step: 3 }
        }
      }

      return { success: false, leadId: null, step: input.step }
    },
  }),

  submitQuickCallback: defineAction({
    accept: 'json',
    input: quickCallbackSchema,
    handler: async (input, context) => {
      const ctx = (context.locals as any)?.runtime?.ctx

      // Honeypot check — silent fake success with realistic response
      if (input.honeypot) {
        return { success: true, leadId: crypto.randomUUID() }
      }

      const result = await withRetry(() => createLead({
        sessionId: input.sessionId,
        status: 'complete',
        currentStep: 1,
        name: input.name,
        phone: input.phone,
        additionalNotes: input.notes,
        formType: 'quick-callback',
        source: input.source,
      }))

      // Fire Google Sheets webhook as background work
      fireLeadWebhook({ ...result.doc, source: input.source }, ctx)

      return { success: true, leadId: result.doc?.id }
    },
  }),

  submitLeadMagnet: defineAction({
    accept: 'json',
    input: leadMagnetSchema,
    handler: async (input) => {
      // Honeypot check — silent fake success with realistic response
      if (input.honeypot) {
        return { success: true, leadId: crypto.randomUUID(), downloadUrl: '#' }
      }

      // Create lead with formType lead-magnet (with retry on CMS 500)
      const result = await withRetry(() => createLead({
        sessionId: input.sessionId,
        status: 'complete',
        currentStep: 1,
        name: input.name,
        email: input.email,
        formType: 'lead-magnet',
        source: input.source,
      }))

      // Fetch lead magnet file URL from Payload (query by slug)
      const PAYLOAD_URL = import.meta.env.PAYLOAD_URL || 'http://localhost:3000'
      let downloadUrl = `/downloads/${input.leadMagnetId}.pdf`
      try {
        const slug = encodeURIComponent(input.leadMagnetId)
        const res = await fetch(
          `${PAYLOAD_URL}/api/lead-magnets?where[slug][equals]=${slug}&depth=1`,
          { headers: { 'Content-Type': 'application/json' } },
        )
        if (res.ok) {
          const data = await res.json()
          const fileUrl = data.docs?.[0]?.file?.url
          if (fileUrl) downloadUrl = fileUrl
        }
      } catch {
        // CMS unavailable — falls back to static download URL
      }

      return { success: true, leadId: result.doc?.id, downloadUrl }
    },
  }),
}
