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
      // Honeypot check — silent fake success
      if (input.honeypot) {
        return { success: true, leadId: 'ok', step: input.step }
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

      // Steps 2-3: Find and update existing lead
      const existing = await findLeadBySessionId(input.sessionId)

      if (input.step === 2) {
        if (!existing) {
          // Step 1 save may have failed — skip update, step 3 will create full lead
          return { success: true, leadId: null, step: 2 }
        }
        const result = await withRetry(() => updateLead(existing.id, {
          currentStep: 2,
          preferredDate: input.preferredDate,
          timeline: input.timePreference,
        }))
        return { success: true, leadId: result.doc?.id, step: 2 }
      }

      if (input.step === 3) {
        if (existing) {
          const result = await withRetry(() => updateLead(existing.id, {
            currentStep: 3,
            status: 'complete',
            name: `${input.firstName} ${input.lastName}`,
            phone: input.phone,
            email: input.email,
            address: input.address,
            additionalNotes: input.comments,
          }))
          return { success: true, leadId: result.doc?.id, step: 3 }
        }
        // No partial lead found — create complete lead with all data
        const result = await withRetry(() => createLead({
          sessionId: input.sessionId,
          status: 'complete',
          currentStep: 3,
          name: `${input.firstName} ${input.lastName}`,
          phone: input.phone,
          email: input.email,
          address: input.address,
          additionalNotes: input.comments,
          formType: 'multi-step',
        }))
        return { success: true, leadId: result.doc?.id, step: 3 }
      }

      return { success: false, leadId: null, step: input.step }
    },
  }),

  submitQuickCallback: defineAction({
    accept: 'json',
    input: quickCallbackSchema,
    handler: async (input) => {
      // Honeypot check
      if (input.honeypot) {
        return { success: true, leadId: 'ok' }
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
      // Honeypot check
      if (input.honeypot) {
        return { success: true, leadId: 'ok', downloadUrl: '#' }
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

      // Fetch lead magnet file URL from Payload
      const PAYLOAD_URL = import.meta.env.PAYLOAD_URL || 'http://localhost:3000'
      let downloadUrl = '#'
      try {
        const res = await fetch(
          `${PAYLOAD_URL}/api/lead-magnets/${input.leadMagnetId}?depth=1`,
          { headers: { 'Content-Type': 'application/json' } },
        )
        if (res.ok) {
          const leadMagnet = await res.json()
          downloadUrl = leadMagnet.file?.url || '#'
        }
      } catch {
        // Lead still created; download URL may not resolve
      }

      return { success: true, leadId: result.doc?.id, downloadUrl }
    },
  }),
}
