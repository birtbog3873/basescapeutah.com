import { describe, it, expect } from 'vitest'
import {
  leadStepOneSchema,
  leadStepTwoSchema,
  leadStepThreeSchema,
  quickCallbackSchema,
  leadMagnetSchema,
} from '../../src/lib/validation'

const validUUID = '550e8400-e29b-41d4-a716-446655440000'

const validSource = {
  page: '/services/walkout-basements',
}

// ---------------------------------------------------------------------------
// leadStepOneSchema
// ---------------------------------------------------------------------------
describe('leadStepOneSchema', () => {
  const validData = {
    step: 1 as const,
    sessionId: validUUID,
    serviceType: 'walkout-basement' as const,
    zipCode: '84020',
    honeypot: '',
    source: validSource,
  }

  it('accepts valid data', () => {
    const result = leadStepOneSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepts all valid serviceType enum values', () => {
    const types = ['walkout-basement', 'egress-window', 'window-well-upgrade', 'not-sure'] as const
    for (const serviceType of types) {
      const result = leadStepOneSchema.safeParse({ ...validData, serviceType })
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid serviceType', () => {
    const result = leadStepOneSchema.safeParse({ ...validData, serviceType: 'roofing' })
    expect(result.success).toBe(false)
  })

  it('rejects wrong step literal', () => {
    const result = leadStepOneSchema.safeParse({ ...validData, step: 2 })
    expect(result.success).toBe(false)
  })

  it('rejects non-UUID sessionId', () => {
    const result = leadStepOneSchema.safeParse({ ...validData, sessionId: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid zip code formats', () => {
    const badZips = ['1234', '123456', 'abcde', '84 020', '']
    for (const zipCode of badZips) {
      const result = leadStepOneSchema.safeParse({ ...validData, zipCode })
      expect(result.success).toBe(false)
    }
  })

  it('rejects non-empty honeypot', () => {
    const result = leadStepOneSchema.safeParse({ ...validData, honeypot: 'spam' })
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const requiredFields = ['step', 'sessionId', 'serviceType', 'zipCode', 'honeypot', 'source'] as const
    for (const field of requiredFields) {
      const data = { ...validData }
      delete (data as Record<string, unknown>)[field]
      const result = leadStepOneSchema.safeParse(data)
      expect(result.success).toBe(false)
    }
  })

  it('accepts source with optional UTM fields', () => {
    const result = leadStepOneSchema.safeParse({
      ...validData,
      source: {
        page: '/',
        utmSource: 'google',
        utmMedium: 'cpc',
        utmCampaign: 'spring-2026',
        utmContent: 'ad-1',
        utmTerm: 'basement',
        referrer: 'https://google.com',
      },
    })
    expect(result.success).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// leadStepTwoSchema
// ---------------------------------------------------------------------------
describe('leadStepTwoSchema', () => {
  const validData = {
    step: 2 as const,
    sessionId: validUUID,
    projectPurpose: 'rental-unit' as const,
    timeline: 'asap' as const,
    honeypot: '',
  }

  it('accepts valid data', () => {
    const result = leadStepTwoSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepts all valid projectPurpose enum values', () => {
    const purposes = ['rental-unit', 'family-space', 'home-office', 'safety-compliance', 'other'] as const
    for (const projectPurpose of purposes) {
      const result = leadStepTwoSchema.safeParse({ ...validData, projectPurpose })
      expect(result.success).toBe(true)
    }
  })

  it('accepts all valid timeline enum values', () => {
    const timelines = ['asap', '1-3-months', '3-6-months', '6-plus-months', 'just-researching'] as const
    for (const timeline of timelines) {
      const result = leadStepTwoSchema.safeParse({ ...validData, timeline })
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid projectPurpose', () => {
    const result = leadStepTwoSchema.safeParse({ ...validData, projectPurpose: 'swimming-pool' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid timeline', () => {
    const result = leadStepTwoSchema.safeParse({ ...validData, timeline: 'next-year' })
    expect(result.success).toBe(false)
  })

  it('rejects wrong step literal', () => {
    const result = leadStepTwoSchema.safeParse({ ...validData, step: 1 })
    expect(result.success).toBe(false)
  })

  it('rejects non-UUID sessionId', () => {
    const result = leadStepTwoSchema.safeParse({ ...validData, sessionId: '12345' })
    expect(result.success).toBe(false)
  })

  it('rejects non-empty honeypot', () => {
    const result = leadStepTwoSchema.safeParse({ ...validData, honeypot: 'bot-fill' })
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const requiredFields = ['step', 'sessionId', 'projectPurpose', 'timeline', 'honeypot'] as const
    for (const field of requiredFields) {
      const data = { ...validData }
      delete (data as Record<string, unknown>)[field]
      const result = leadStepTwoSchema.safeParse(data)
      expect(result.success).toBe(false)
    }
  })
})

// ---------------------------------------------------------------------------
// leadStepThreeSchema
// ---------------------------------------------------------------------------
describe('leadStepThreeSchema', () => {
  const validData = {
    step: 3 as const,
    sessionId: validUUID,
    name: 'Jane Doe',
    phone: '(801) 555-1234',
    email: 'jane@example.com',
    honeypot: '',
  }

  it('accepts valid data without optional address', () => {
    const result = leadStepThreeSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepts valid data with optional address', () => {
    const result = leadStepThreeSchema.safeParse({
      ...validData,
      address: '123 Main St, Draper, UT 84020',
    })
    expect(result.success).toBe(true)
  })

  it('rejects wrong step literal', () => {
    const result = leadStepThreeSchema.safeParse({ ...validData, step: 2 })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = leadStepThreeSchema.safeParse({ ...validData, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects name exceeding 100 characters', () => {
    const result = leadStepThreeSchema.safeParse({ ...validData, name: 'A'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('accepts name at max length boundary (100 chars)', () => {
    const result = leadStepThreeSchema.safeParse({ ...validData, name: 'A'.repeat(100) })
    expect(result.success).toBe(true)
  })

  it('accepts valid US phone formats', () => {
    const validPhones = ['(801) 555-1234', '801-555-1234', '8015551234', '801.555.1234', '+18015551234']
    for (const phone of validPhones) {
      const result = leadStepThreeSchema.safeParse({ ...validData, phone })
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid phone formats', () => {
    const badPhones = ['555', '123-456', 'not-a-phone', '']
    for (const phone of badPhones) {
      const result = leadStepThreeSchema.safeParse({ ...validData, phone })
      expect(result.success).toBe(false)
    }
  })

  it('rejects invalid email', () => {
    const badEmails = ['not-email', 'foo@', '@bar.com', '']
    for (const email of badEmails) {
      const result = leadStepThreeSchema.safeParse({ ...validData, email })
      expect(result.success).toBe(false)
    }
  })

  it('rejects address exceeding 200 characters', () => {
    const result = leadStepThreeSchema.safeParse({ ...validData, address: 'A'.repeat(201) })
    expect(result.success).toBe(false)
  })

  it('accepts address at max length boundary (200 chars)', () => {
    const result = leadStepThreeSchema.safeParse({ ...validData, address: 'A'.repeat(200) })
    expect(result.success).toBe(true)
  })

  it('rejects non-empty honeypot', () => {
    const result = leadStepThreeSchema.safeParse({ ...validData, honeypot: 'gotcha' })
    expect(result.success).toBe(false)
  })

  it('rejects non-UUID sessionId', () => {
    const result = leadStepThreeSchema.safeParse({ ...validData, sessionId: 'abc123' })
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const requiredFields = ['step', 'sessionId', 'name', 'phone', 'email', 'honeypot'] as const
    for (const field of requiredFields) {
      const data = { ...validData }
      delete (data as Record<string, unknown>)[field]
      const result = leadStepThreeSchema.safeParse(data)
      expect(result.success).toBe(false)
    }
  })
})

// ---------------------------------------------------------------------------
// quickCallbackSchema
// ---------------------------------------------------------------------------
describe('quickCallbackSchema', () => {
  const validData = {
    sessionId: validUUID,
    name: 'John Smith',
    phone: '(801) 555-9876',
    honeypot: '',
    source: validSource,
  }

  it('accepts valid data without optional notes', () => {
    const result = quickCallbackSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepts valid data with optional notes', () => {
    const result = quickCallbackSchema.safeParse({
      ...validData,
      notes: 'Please call after 5pm',
    })
    expect(result.success).toBe(true)
  })

  it('rejects notes exceeding 1000 characters', () => {
    const result = quickCallbackSchema.safeParse({ ...validData, notes: 'X'.repeat(1001) })
    expect(result.success).toBe(false)
  })

  it('accepts notes at max length boundary (1000 chars)', () => {
    const result = quickCallbackSchema.safeParse({ ...validData, notes: 'X'.repeat(1000) })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = quickCallbackSchema.safeParse({ ...validData, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects name exceeding 100 characters', () => {
    const result = quickCallbackSchema.safeParse({ ...validData, name: 'A'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('rejects invalid phone', () => {
    const result = quickCallbackSchema.safeParse({ ...validData, phone: '123' })
    expect(result.success).toBe(false)
  })

  it('rejects non-empty honeypot', () => {
    const result = quickCallbackSchema.safeParse({ ...validData, honeypot: 'filled' })
    expect(result.success).toBe(false)
  })

  it('rejects non-UUID sessionId', () => {
    const result = quickCallbackSchema.safeParse({ ...validData, sessionId: 'bad-id' })
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const requiredFields = ['sessionId', 'name', 'phone', 'honeypot', 'source'] as const
    for (const field of requiredFields) {
      const data = { ...validData }
      delete (data as Record<string, unknown>)[field]
      const result = quickCallbackSchema.safeParse(data)
      expect(result.success).toBe(false)
    }
  })
})

// ---------------------------------------------------------------------------
// leadMagnetSchema
// ---------------------------------------------------------------------------
describe('leadMagnetSchema', () => {
  const validData = {
    sessionId: validUUID,
    email: 'user@example.com',
    leadMagnetId: 'basement-cost-guide',
    honeypot: '',
    source: validSource,
  }

  it('accepts valid data without optional name', () => {
    const result = leadMagnetSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepts valid data with optional name', () => {
    const result = leadMagnetSchema.safeParse({ ...validData, name: 'Alice' })
    expect(result.success).toBe(true)
  })

  it('rejects name exceeding 100 characters', () => {
    const result = leadMagnetSchema.safeParse({ ...validData, name: 'B'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('accepts name at max length boundary (100 chars)', () => {
    const result = leadMagnetSchema.safeParse({ ...validData, name: 'B'.repeat(100) })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = leadMagnetSchema.safeParse({ ...validData, email: 'not-valid' })
    expect(result.success).toBe(false)
  })

  it('rejects missing email', () => {
    const { email: _, ...noEmail } = validData
    const result = leadMagnetSchema.safeParse(noEmail)
    expect(result.success).toBe(false)
  })

  it('rejects missing leadMagnetId', () => {
    const { leadMagnetId: _, ...noId } = validData
    const result = leadMagnetSchema.safeParse(noId)
    expect(result.success).toBe(false)
  })

  it('rejects non-empty honeypot', () => {
    const result = leadMagnetSchema.safeParse({ ...validData, honeypot: 'spam-text' })
    expect(result.success).toBe(false)
  })

  it('rejects non-UUID sessionId', () => {
    const result = leadMagnetSchema.safeParse({ ...validData, sessionId: 'xyz' })
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const requiredFields = ['sessionId', 'email', 'leadMagnetId', 'honeypot', 'source'] as const
    for (const field of requiredFields) {
      const data = { ...validData }
      delete (data as Record<string, unknown>)[field]
      const result = leadMagnetSchema.safeParse(data)
      expect(result.success).toBe(false)
    }
  })
})
