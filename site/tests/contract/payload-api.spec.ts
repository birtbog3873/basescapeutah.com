import { test, expect } from '@playwright/test'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'

test.describe('Payload CMS REST API Contracts', () => {
  // Skip all tests until CMS is running locally
  test.skip()

  // -------------------------------------------------------------------------
  // Build-time read endpoints (GET)
  // -------------------------------------------------------------------------

  test('GET /api/services returns published services', async ({ request }) => {
    const response = await request.get(`${PAYLOAD_URL}/api/services`, {
      params: { where: { _status: { equals: 'published' } } },
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body).toHaveProperty('docs')
    expect(Array.isArray(body.docs)).toBe(true)
    expect(body).toHaveProperty('totalDocs')

    if (body.docs.length > 0) {
      const service = body.docs[0]
      expect(service).toHaveProperty('id')
      expect(service).toHaveProperty('title')
      expect(service).toHaveProperty('slug')
    }
  })

  test('GET /api/service-areas returns published areas', async ({ request }) => {
    const response = await request.get(`${PAYLOAD_URL}/api/service-areas`, {
      params: { where: { _status: { equals: 'published' } } },
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body).toHaveProperty('docs')
    expect(Array.isArray(body.docs)).toBe(true)

    if (body.docs.length > 0) {
      const area = body.docs[0]
      expect(area).toHaveProperty('id')
      expect(area).toHaveProperty('name')
    }
  })

  test('GET /api/site-settings returns global settings', async ({ request }) => {
    const response = await request.get(`${PAYLOAD_URL}/api/globals/site-settings`)

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body).toHaveProperty('businessName')
    expect(body).toHaveProperty('phone')
    expect(body).toHaveProperty('email')
  })

  test('GET /api/pages returns published pages', async ({ request }) => {
    const response = await request.get(`${PAYLOAD_URL}/api/pages`, {
      params: { where: { _status: { equals: 'published' } } },
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body).toHaveProperty('docs')
    expect(Array.isArray(body.docs)).toBe(true)
  })

  // -------------------------------------------------------------------------
  // Lead creation endpoints (POST / PATCH)
  // -------------------------------------------------------------------------

  test('POST /api/leads creates a partial lead', async ({ request }) => {
    const response = await request.post(`${PAYLOAD_URL}/api/leads`, {
      data: {
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        serviceType: 'walkout-basement',
        zipCode: '84020',
        source: { page: '/services/walkout-basements' },
      },
    })

    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body).toHaveProperty('doc')
    expect(body.doc).toHaveProperty('id')
    expect(body.doc.sessionId).toBe('550e8400-e29b-41d4-a716-446655440000')
  })

  test('PATCH /api/leads/:id updates lead with step 2 data', async ({ request }) => {
    // Create a lead first
    const createResponse = await request.post(`${PAYLOAD_URL}/api/leads`, {
      data: {
        sessionId: '550e8400-e29b-41d4-a716-446655440001',
        serviceType: 'egress-window',
        zipCode: '84043',
        source: { page: '/' },
      },
    })
    const created = await createResponse.json()
    const leadId = created.doc.id

    // Update with step 2 data
    const response = await request.patch(`${PAYLOAD_URL}/api/leads/${leadId}`, {
      data: {
        projectPurpose: 'rental-unit',
        timeline: '1-3-months',
      },
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.doc.projectPurpose).toBe('rental-unit')
    expect(body.doc.timeline).toBe('1-3-months')
  })

  test('POST /api/leads rejects invalid data with 400', async ({ request }) => {
    const response = await request.post(`${PAYLOAD_URL}/api/leads`, {
      data: {
        // Missing required fields
      },
    })

    expect(response.status()).toBe(400)
  })
})
