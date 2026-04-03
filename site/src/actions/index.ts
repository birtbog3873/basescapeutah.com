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

export const server = {
  saveFormStep: defineAction({
    accept: 'json',
    input: z.discriminatedUnion('step', [
      leadStepOneSchema,
      leadStepTwoSchema,
      leadStepThreeSchema,
    ]),
    handler: async (input) => {
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
          if (existing) {
            try {
              const result = await withRetry(() => updateLead(existing.id, step3Data))
              return { success: true, leadId: result.doc?.id, step: 3 }
            } catch {
              // Update failed — fall through to create a new complete lead
            }
          }
          // No partial lead found or update failed — create complete lead with all data
          const result = await withRetry(() => createLead({
            ...step3Data,
            sessionId: input.sessionId,
            formType: 'multi-step',
            source: input.source,
          }))
          return { success: true, leadId: result.doc?.id, step: 3 }
        } catch (err: any) {
          // DEBUG: Return the actual CMS error so we can see it in the UI
          return { success: false, leadId: null, step: 3, debugError: err?.message || String(err) }
        }
      }

      return { success: false, leadId: null, step: input.step }
    },
  }),

  submitQuickCallback: defineAction({
    accept: 'json',
    input: quickCallbackSchema,
    handler: async (input) => {
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
