import { z } from 'zod'

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

export const sourceSchema = z.object({
  page: z.string(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  referrer: z.string().optional(),
})

export const honeypotSchema = z.string().max(0, 'Invalid submission')

export const leadStepOneSchema = z.object({
  step: z.literal(1),
  sessionId: z.string().uuid('Invalid session'),
  serviceType: z.enum([
    'walkout-basement',
    'basement-remodeling',
    'pavers-hardscapes',
    'retaining-walls',
    'artificial-turf',
    'egress-windows',
  ]),
  zipCode: z.string().regex(/^\d{5}$/, 'Enter a valid 5-digit zip code'),
  honeypot: honeypotSchema,
  source: sourceSchema,
})

export const leadStepTwoSchema = z.object({
  step: z.literal(2),
  sessionId: z.string().uuid('Invalid session'),
  preferredDate: z.string().min(1, 'Please select a date'),
  timePreference: z.enum(['morning', 'afternoon', 'evening', 'not-sure']),
  honeypot: honeypotSchema,
})

export const leadStepThreeSchema = z.object({
  step: z.literal(3),
  sessionId: z.string().uuid('Invalid session'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(phoneRegex, 'Enter a valid phone number'),
  address: z.string().max(200, 'Address too long').optional(),
  comments: z.string().max(1000, 'Comments too long').optional(),
  smsConsent: z.boolean(),
  honeypot: honeypotSchema,
})

export const quickCallbackSchema = z.object({
  sessionId: z.string().uuid('Invalid session'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  phone: z.string().regex(phoneRegex, 'Enter a valid phone number'),
  notes: z.string().max(1000, 'Notes too long').optional(),
  honeypot: honeypotSchema,
  source: sourceSchema,
})

export const leadMagnetSchema = z.object({
  sessionId: z.string().uuid('Invalid session'),
  name: z.string().max(100, 'Name too long').optional(),
  email: z.string().email('Enter a valid email address'),
  leadMagnetId: z.string(),
  honeypot: honeypotSchema,
  source: sourceSchema,
})

export type LeadStepOne = z.infer<typeof leadStepOneSchema>
export type LeadStepTwo = z.infer<typeof leadStepTwoSchema>
export type LeadStepThree = z.infer<typeof leadStepThreeSchema>
export type QuickCallback = z.infer<typeof quickCallbackSchema>
export type LeadMagnet = z.infer<typeof leadMagnetSchema>
