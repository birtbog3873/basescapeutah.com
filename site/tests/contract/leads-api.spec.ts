import { test, expect } from '@playwright/test'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'

test.describe('Leads Collection API Contracts', () => {
  // Skip all tests — requires Payload CMS running locally on PAYLOAD_URL.
  // Run `pnpm --filter cms dev` before un-skipping.
  test.skip()

  // -------------------------------------------------------------------------
  // Multi-step form: Step 1 — Create partial lead
  // -------------------------------------------------------------------------

  test('POST /api/leads creates a partial lead with step 1 data', async ({ request }) => {
    const response = await request.post(`${PAYLOAD_URL}/api/leads`, {
      data: {
        sessionId: 'test-session-leads-001',
        serviceType: 'walkout-basement',
        zipCode: '84020',
        formType: 'multi-step',
        source: { page: '/services/walkout-basements', referrer: '' },
      },
    })

    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body).toHaveProperty('doc')
    expect(body.doc).toHaveProperty('id')
    expect(body.doc.sessionId).toBe('test-session-leads-001')
    expect(body.doc.status).toBe('partial')
    expect(body.doc.serviceType).toBe('walkout-basement')
    expect(body.doc.zipCode).toBe('84020')
    expect(body.doc.formType).toBe('multi-step')
  })

  // -------------------------------------------------------------------------
  // Multi-step form: Step 2 — Update with project details
  // -------------------------------------------------------------------------

  test('PATCH /api/leads/:id updates lead with step 2 data', async ({ request }) => {
    // Create the lead first (step 1)
    const createResponse = await request.post(`${PAYLOAD_URL}/api/leads`, {
      data: {
        sessionId: 'test-session-leads-002',
        serviceType: 'egress-window',
        zipCode: '84043',
        formType: 'multi-step',
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
    // Status should still be partial after step 2
    expect(body.doc.status).toBe('partial')
  })

  // -------------------------------------------------------------------------
  // Multi-step form: Step 3 — Complete lead with contact info
  // -------------------------------------------------------------------------

  test('PATCH /api/leads/:id with step 3 data transitions status to complete', async ({
    request,
  }) => {
    // Create + update through steps 1-2
    const createResponse = await request.post(`${PAYLOAD_URL}/api/leads`, {
      data: {
        sessionId: 'test-session-leads-003',
        serviceType: 'walkout-basement',
        zipCode: '84020',
        formType: 'multi-step',
        source: { page: '/services/walkout-basements' },
      },
    })
    const created = await createResponse.json()
    const leadId = created.doc.id

    await request.patch(`${PAYLOAD_URL}/api/leads/${leadId}`, {
      data: {
        projectPurpose: 'add-living-space',
        timeline: '3-6-months',
      },
    })

    // Step 3: complete the lead with contact info
    const response = await request.patch(`${PAYLOAD_URL}/api/leads/${leadId}`, {
      data: {
        name: 'Test User',
        phone: '801-555-0000',
        email: 'test@example.com',
        status: 'complete',
      },
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.doc.name).toBe('Test User')
    expect(body.doc.phone).toBe('801-555-0000')
    expect(body.doc.email).toBe('test@example.com')
    expect(body.doc.status).toBe('complete')
  })

  // -------------------------------------------------------------------------
  // Honeypot field — bot protection
  // -------------------------------------------------------------------------

  test('POST /api/leads with honeypot filled returns fake 200 success', async ({ request }) => {
    // The CMS should still accept the lead creation at the API level.
    // The action layer handles honeypot rejection, but we verify the CMS
    // doesn't reject the payload outright.
    const response = await request.post(`${PAYLOAD_URL}/api/leads`, {
      data: {
        sessionId: 'test-session-leads-honeypot',
        serviceType: 'walkout-basement',
        zipCode: '84020',
        formType: 'multi-step',
        source: { page: '/' },
        honeypot: 'bot-filled-this-in',
      },
    })

    // CMS accepts the document — honeypot filtering is handled at the
    // action/middleware layer, not by collection validation
    expect(response.ok()).toBe(true)
  })

  // -------------------------------------------------------------------------
  // Validation — Missing required fields
  // -------------------------------------------------------------------------

  test('POST /api/leads with missing required fields returns 400', async ({ request }) => {
    const response = await request.post(`${PAYLOAD_URL}/api/leads`, {
      data: {
        // Missing sessionId, serviceType, zipCode — all required for a lead
      },
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body).toHaveProperty('errors')
    expect(Array.isArray(body.errors)).toBe(true)
    expect(body.errors.length).toBeGreaterThan(0)
  })

  // -------------------------------------------------------------------------
  // Quick Callback form — Single-step complete lead
  // -------------------------------------------------------------------------

  test('POST /api/leads with formType "quick-callback" creates complete lead', async ({
    request,
  }) => {
    const response = await request.post(`${PAYLOAD_URL}/api/leads`, {
      data: {
        sessionId: 'test-session-leads-qc-001',
        name: 'Quick Callback User',
        phone: '801-555-1234',
        formType: 'quick-callback',
        status: 'complete',
        source: { page: '/', referrer: '' },
      },
    })

    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body.doc.formType).toBe('quick-callback')
    expect(body.doc.status).toBe('complete')
    expect(body.doc.name).toBe('Quick Callback User')
    expect(body.doc.phone).toBe('801-555-1234')
  })

  // -------------------------------------------------------------------------
  // Lead Magnet form — Single-step complete lead with download context
  // -------------------------------------------------------------------------

  test('POST /api/leads with formType "lead-magnet" creates complete lead', async ({
    request,
  }) => {
    const response = await request.post(`${PAYLOAD_URL}/api/leads`, {
      data: {
        sessionId: 'test-session-leads-lm-001',
        name: 'Lead Magnet User',
        email: 'magnet@example.com',
        formType: 'lead-magnet',
        status: 'complete',
        source: { page: '/blog/basement-finishing-guide', referrer: '' },
      },
    })

    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body.doc.formType).toBe('lead-magnet')
    expect(body.doc.status).toBe('complete')
    expect(body.doc.name).toBe('Lead Magnet User')
    expect(body.doc.email).toBe('magnet@example.com')
  })
})
