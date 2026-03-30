import { describe, it, expect } from 'vitest'
import { generateLocalBusinessSchema } from '../../src/lib/schema'

const mockSettings = {
  businessName: 'BaseScape',
  phone: '(801) 555-1234',
  email: 'hello@basescapeutah.com',
  address: { street: '123 Main St', city: 'Draper', state: 'UT', zip: '84020' },
  operatingHours: [
    { day: 'Mon', open: '08:00', close: '18:00' },
    { day: 'Tue', open: '08:00', close: '18:00' },
    { day: 'Wed', open: '08:00', close: '18:00' },
    { day: 'Thu', open: '08:00', close: '18:00' },
    { day: 'Fri', open: '08:00', close: '17:00' },
  ],
  licenseNumber: 'UT-12345',
}

const defaultOptions = {
  coordinates: { lat: 40.5246, lng: -111.8638 },
  serviceRadius: 15,
  aggregateRating: { ratingValue: 4.8, reviewCount: 12 },
}

// ---------------------------------------------------------------------------
// T104 — generateLocalBusinessSchema (location-specific)
// ---------------------------------------------------------------------------
describe('generateLocalBusinessSchema — location details', () => {
  it('returns @type HomeAndConstructionBusiness', () => {
    const schema = generateLocalBusinessSchema(mockSettings, defaultOptions)
    expect(schema['@type']).toBe('HomeAndConstructionBusiness')
  })

  it('includes geo with @type GeoCoordinates and correct lat/lng', () => {
    const schema = generateLocalBusinessSchema(mockSettings, defaultOptions)
    expect(schema.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: 40.5246,
      longitude: -111.8638,
    })
  })

  it('includes areaServed with geoRadius in miles', () => {
    const schema = generateLocalBusinessSchema(mockSettings, defaultOptions)
    expect(schema.areaServed).toBeDefined()
    expect(schema.areaServed).toMatchObject({
      '@type': 'GeoCircle',
      geoRadius: '15 mi',
    })
  })

  it('sets areaServed geoMidpoint to provided coordinates', () => {
    const schema = generateLocalBusinessSchema(mockSettings, defaultOptions)
    expect(schema.areaServed!.geoMidpoint).toEqual({
      '@type': 'GeoCoordinates',
      latitude: 40.5246,
      longitude: -111.8638,
    })
  })

  it('includes aggregateRating with correct values and bounds', () => {
    const schema = generateLocalBusinessSchema(mockSettings, defaultOptions)
    expect(schema.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 12,
      bestRating: 5,
      worstRating: 1,
    })
  })

  it('formats all five operating hours with full day names', () => {
    const schema = generateLocalBusinessSchema(mockSettings, defaultOptions)
    expect(schema.openingHoursSpecification).toHaveLength(5)
    expect(schema.openingHoursSpecification[0]).toEqual({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Monday',
      opens: '08:00',
      closes: '18:00',
    })
    expect(schema.openingHoursSpecification[4]).toMatchObject({
      dayOfWeek: 'Friday',
      opens: '08:00',
      closes: '17:00',
    })
  })

  it('includes @context schema.org', () => {
    const schema = generateLocalBusinessSchema(mockSettings, defaultOptions)
    expect(schema['@context']).toBe('https://schema.org')
  })

  it('maps business name and contact info', () => {
    const schema = generateLocalBusinessSchema(mockSettings, defaultOptions)
    expect(schema.name).toBe('BaseScape')
    expect(schema.telephone).toBe('(801) 555-1234')
    expect(schema.email).toBe('hello@basescapeutah.com')
  })

  it('maps address to PostalAddress', () => {
    const schema = generateLocalBusinessSchema(mockSettings, defaultOptions)
    expect(schema.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: '123 Main St',
      addressLocality: 'Draper',
      addressRegion: 'UT',
      postalCode: '84020',
      addressCountry: 'US',
    })
  })

  it('omits geo when coordinates not provided', () => {
    const schema = generateLocalBusinessSchema(mockSettings, {
      serviceRadius: 15,
      aggregateRating: { ratingValue: 4.8, reviewCount: 12 },
    })
    expect(schema).not.toHaveProperty('geo')
  })

  it('omits areaServed when serviceRadius not provided', () => {
    const schema = generateLocalBusinessSchema(mockSettings, {
      coordinates: { lat: 40.5246, lng: -111.8638 },
    })
    expect(schema).not.toHaveProperty('areaServed')
  })

  it('omits aggregateRating when not provided', () => {
    const schema = generateLocalBusinessSchema(mockSettings, {
      coordinates: { lat: 40.5246, lng: -111.8638 },
      serviceRadius: 15,
    })
    expect(schema).not.toHaveProperty('aggregateRating')
  })

  it('works with no options at all', () => {
    const schema = generateLocalBusinessSchema(mockSettings)
    expect(schema['@type']).toBe('HomeAndConstructionBusiness')
    expect(schema).not.toHaveProperty('geo')
    expect(schema).not.toHaveProperty('areaServed')
    expect(schema).not.toHaveProperty('aggregateRating')
  })
})
