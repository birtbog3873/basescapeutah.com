import { z } from 'zod'

const phoneRegex = /^[\+]?1?[-\s.]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/

// Service slug pattern: kebab-case, 2-80 chars. Validates format without
// enumerating every page slug. Forms pass `service.slug` from the Astro page,
// so this allows any current/future service page to submit without code edits.
// (Previously a strict enum, which silently broke the concrete hub + 8 new
// concrete sub-pages added in commit fc7333d, and walkout-basements which has
// always been slugged as plural but enumerated as singular.)
const serviceSlugSchema = z
  .string()
  .min(2, 'Service type required')
  .max(80, 'Service type too long')
  .regex(/^[a-z][a-z0-9-]*[a-z0-9]$/, 'Invalid service type')

export const sourceSchema = z.object({
  page: z.string().max(2048, 'Page URL too long'),
  utmSource: z.string().max(500).optional(),
  utmMedium: z.string().max(500).optional(),
  utmCampaign: z.string().max(500).optional(),
  utmContent: z.string().max(500).optional(),
  utmTerm: z.string().max(500).optional(),
  referrer: z.string().max(2048).optional(),
  gaClientId: z.string().max(500).optional(),
  gclid: z.string().max(500).optional(),
})

export const honeypotSchema = z.string().max(0, 'Invalid submission')

export const leadStepOneSchema = z.object({
  step: z.literal(1),
  sessionId: z.string().uuid('Invalid session'),
  serviceType: serviceSlugSchema,
  zipCode: z.string().regex(/^\d{5}$/, 'Enter a valid 5-digit zip code'),
  honeypot: honeypotSchema,
  source: sourceSchema,
})

export const leadStepTwoSchema = z.object({
  step: z.literal(2),
  sessionId: z.string().uuid('Invalid session'),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  timePreference: z.enum(['morning', 'afternoon', 'evening', 'not-sure']),
  honeypot: honeypotSchema,
})

export const leadStepThreeSchema = z.object({
  step: z.literal(3),
  sessionId: z.string().uuid('Invalid session'),
  serviceType: serviceSlugSchema,
  zipCode: z.string().regex(/^\d{5}$/, 'Enter a valid 5-digit zip code'),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  timePreference: z.enum(['morning', 'afternoon', 'evening', 'not-sure']).optional(),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(phoneRegex, 'Enter a valid phone number'),
  address: z.string().max(200, 'Address too long').optional(),
  comments: z.string().max(1000, 'Comments too long').optional(),
  smsConsent: z.boolean(),
  honeypot: honeypotSchema,
  source: sourceSchema,
})

export const quickCallbackSchema = z.object({
  sessionId: z.string().uuid('Invalid session'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  phone: z.string().regex(phoneRegex, 'Enter a valid phone number'),
  notes: z.string().max(1000, 'Notes too long').optional(),
  serviceType: serviceSlugSchema.optional(),
  honeypot: honeypotSchema,
  source: sourceSchema,
})

export const leadMagnetSchema = z.object({
  sessionId: z.string().uuid('Invalid session'),
  name: z.string().max(100, 'Name too long').optional(),
  email: z.string().email('Enter a valid email address'),
  leadMagnetId: z.string().regex(/^[a-z0-9][a-z0-9-]{0,98}[a-z0-9]$/, 'Invalid lead magnet ID'),
  honeypot: honeypotSchema,
  source: sourceSchema,
})

export type LeadStepOne = z.infer<typeof leadStepOneSchema>
export type LeadStepTwo = z.infer<typeof leadStepTwoSchema>
export type LeadStepThree = z.infer<typeof leadStepThreeSchema>
export type QuickCallback = z.infer<typeof quickCallbackSchema>
export type LeadMagnet = z.infer<typeof leadMagnetSchema>
