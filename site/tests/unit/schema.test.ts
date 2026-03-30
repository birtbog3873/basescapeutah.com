import { describe, it, expect } from 'vitest'
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateServiceSchema,
  generateFAQPageSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
} from '../../src/lib/schema'

const mockSettings = {
  businessName: 'BaseScape',
  phone: '(801) 555-1234',
  email: 'hello@basescapeutah.com',
  address: { street: '123 Main St', city: 'Draper', state: 'UT', zip: '84020' },
  operatingHours: [
    { day: 'Mon', open: '08:00', close: '18:00' },
    { day: 'Tue', open: '08:00', close: '18:00' },
  ],
  licenseNumber: 'UT-12345',
}

// ---------------------------------------------------------------------------
// generateOrganizationSchema
// ---------------------------------------------------------------------------
describe('generateOrganizationSchema', () => {
  it('returns correct @context and @type', () => {
    const schema = generateOrganizationSchema(mockSettings)
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Organization')
  })

  it('maps business name and contact info', () => {
    const schema = generateOrganizationSchema(mockSettings)
    expect(schema.name).toBe('BaseScape')
    expect(schema.telephone).toBe('(801) 555-1234')
    expect(schema.email).toBe('hello@basescapeutah.com')
  })

  it('maps address fields to PostalAddress', () => {
    const schema = generateOrganizationSchema(mockSettings)
    expect(schema.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: '123 Main St',
      addressLocality: 'Draper',
      addressRegion: 'UT',
      postalCode: '84020',
      addressCountry: 'US',
    })
  })

  it('omits sameAs when no socialLinks provided', () => {
    const schema = generateOrganizationSchema(mockSettings)
    expect(schema).not.toHaveProperty('sameAs')
  })

  it('includes sameAs when socialLinks provided', () => {
    const settings = {
      ...mockSettings,
      socialLinks: {
        google: 'https://g.page/basescape',
        facebook: 'https://facebook.com/basescape',
      },
    }
    const schema = generateOrganizationSchema(settings)
    expect(schema.sameAs).toContain('https://g.page/basescape')
    expect(schema.sameAs).toContain('https://facebook.com/basescape')
  })

  it('filters falsy socialLinks values from sameAs', () => {
    const settings = {
      ...mockSettings,
      socialLinks: {
        google: 'https://g.page/basescape',
        facebook: undefined,
        instagram: undefined,
      },
    }
    const schema = generateOrganizationSchema(settings)
    expect(schema.sameAs).toEqual(['https://g.page/basescape'])
  })
})

// ---------------------------------------------------------------------------
// generateLocalBusinessSchema
// ---------------------------------------------------------------------------
describe('generateLocalBusinessSchema', () => {
  it('returns @type HomeAndConstructionBusiness', () => {
    const schema = generateLocalBusinessSchema(mockSettings)
    expect(schema['@type']).toBe('HomeAndConstructionBusiness')
  })

  it('includes formatted operating hours', () => {
    const schema = generateLocalBusinessSchema(mockSettings)
    expect(schema.openingHoursSpecification).toHaveLength(2)
    expect(schema.openingHoursSpecification[0]).toEqual({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Monday',
      opens: '08:00',
      closes: '18:00',
    })
    expect(schema.openingHoursSpecification[1]).toMatchObject({
      dayOfWeek: 'Tuesday',
    })
  })

  it('omits aggregateRating when not provided', () => {
    const schema = generateLocalBusinessSchema(mockSettings)
    expect(schema).not.toHaveProperty('aggregateRating')
  })

  it('includes aggregateRating when provided', () => {
    const schema = generateLocalBusinessSchema(mockSettings, {
      aggregateRating: { ratingValue: 4.8, reviewCount: 127 },
    })
    expect(schema.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 127,
      bestRating: 5,
      worstRating: 1,
    })
  })

  it('includes geo coordinates when provided', () => {
    const schema = generateLocalBusinessSchema(mockSettings, {
      coordinates: { lat: 40.5247, lng: -111.8638 },
    })
    expect(schema.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: 40.5247,
      longitude: -111.8638,
    })
  })

  it('omits geo when coordinates not provided', () => {
    const schema = generateLocalBusinessSchema(mockSettings)
    expect(schema).not.toHaveProperty('geo')
  })

  it('includes areaServed with serviceRadius', () => {
    const schema = generateLocalBusinessSchema(mockSettings, {
      coordinates: { lat: 40.5247, lng: -111.8638 },
      serviceRadius: 50,
    })
    expect(schema.areaServed).toMatchObject({
      '@type': 'GeoCircle',
      geoRadius: '50 mi',
    })
    expect(schema.areaServed.geoMidpoint).toMatchObject({
      latitude: 40.5247,
    })
  })

  it('includes hasOfferCatalog when servicesOffered provided', () => {
    const schema = generateLocalBusinessSchema(mockSettings, {
      servicesOffered: ['Walkout Basements', 'Egress Windows'],
    })
    expect(schema.hasOfferCatalog).toMatchObject({
      '@type': 'OfferCatalog',
      name: 'BaseScape Services',
    })
    expect(schema.hasOfferCatalog.itemListElement).toHaveLength(2)
    expect(schema.hasOfferCatalog.itemListElement[0].itemOffered.name).toBe('Walkout Basements')
  })
})

// ---------------------------------------------------------------------------
// generateServiceSchema
// ---------------------------------------------------------------------------
describe('generateServiceSchema', () => {
  const mockService = {
    title: 'Walkout Basement Finishing',
    slug: 'walkout-basements',
    tagline: 'Transform your walkout basement into premium living space',
  }

  it('returns @type Service', () => {
    const schema = generateServiceSchema(mockService, mockSettings)
    expect(schema['@type']).toBe('Service')
  })

  it('maps service name and description', () => {
    const schema = generateServiceSchema(mockService, mockSettings)
    expect(schema.name).toBe('Walkout Basement Finishing')
    expect(schema.description).toBe('Transform your walkout basement into premium living space')
  })

  it('builds URL from slug', () => {
    const schema = generateServiceSchema(mockService, mockSettings)
    expect(schema.url).toBe('https://basescapeutah.com/services/walkout-basements')
  })

  it('includes provider as HomeAndConstructionBusiness', () => {
    const schema = generateServiceSchema(mockService, mockSettings)
    expect(schema.provider['@type']).toBe('HomeAndConstructionBusiness')
    expect(schema.provider.name).toBe('BaseScape')
    expect(schema.provider.telephone).toBe('(801) 555-1234')
  })

  it('includes areaServed as Utah', () => {
    const schema = generateServiceSchema(mockService, mockSettings)
    expect(schema.areaServed).toEqual({
      '@type': 'State',
      name: 'Utah',
    })
  })
})

// ---------------------------------------------------------------------------
// generateFAQPageSchema
// ---------------------------------------------------------------------------
describe('generateFAQPageSchema', () => {
  const faqs = [
    { question: 'How long does a basement take?', answer: 'Typically 4-8 weeks.' },
    { question: 'Do you handle permits?', answer: 'Yes, we handle all permitting.' },
  ]

  it('returns @type FAQPage', () => {
    const schema = generateFAQPageSchema(faqs)
    expect(schema['@type']).toBe('FAQPage')
  })

  it('creates Question entities for each FAQ item', () => {
    const schema = generateFAQPageSchema(faqs)
    expect(schema.mainEntity).toHaveLength(2)
    expect(schema.mainEntity[0]['@type']).toBe('Question')
    expect(schema.mainEntity[1]['@type']).toBe('Question')
  })

  it('maps question text to name field', () => {
    const schema = generateFAQPageSchema(faqs)
    expect(schema.mainEntity[0].name).toBe('How long does a basement take?')
  })

  it('nests Answer inside acceptedAnswer', () => {
    const schema = generateFAQPageSchema(faqs)
    expect(schema.mainEntity[0].acceptedAnswer).toEqual({
      '@type': 'Answer',
      text: 'Typically 4-8 weeks.',
    })
  })

  it('handles empty FAQ array', () => {
    const schema = generateFAQPageSchema([])
    expect(schema.mainEntity).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// generateBreadcrumbSchema
// ---------------------------------------------------------------------------
describe('generateBreadcrumbSchema', () => {
  const items = [
    { name: 'Home', url: 'https://basescapeutah.com/' },
    { name: 'Services', url: 'https://basescapeutah.com/services/' },
    { name: 'Walkout Basements', url: 'https://basescapeutah.com/services/walkout-basements/' },
  ]

  it('returns @type BreadcrumbList', () => {
    const schema = generateBreadcrumbSchema(items)
    expect(schema['@type']).toBe('BreadcrumbList')
  })

  it('assigns 1-based positions to each ListItem', () => {
    const schema = generateBreadcrumbSchema(items)
    expect(schema.itemListElement).toHaveLength(3)
    expect(schema.itemListElement[0].position).toBe(1)
    expect(schema.itemListElement[1].position).toBe(2)
    expect(schema.itemListElement[2].position).toBe(3)
  })

  it('maps name and item (url) correctly', () => {
    const schema = generateBreadcrumbSchema(items)
    expect(schema.itemListElement[0]).toMatchObject({
      '@type': 'ListItem',
      name: 'Home',
      item: 'https://basescapeutah.com/',
    })
  })

  it('handles single-item breadcrumb', () => {
    const schema = generateBreadcrumbSchema([{ name: 'Home', url: '/' }])
    expect(schema.itemListElement).toHaveLength(1)
    expect(schema.itemListElement[0].position).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// generateArticleSchema
// ---------------------------------------------------------------------------
describe('generateArticleSchema', () => {
  const mockArticle = {
    headline: '5 Signs You Need Egress Windows',
    author: 'BaseScape',
    publishDate: '2026-01-15',
    description: 'Learn the warning signs that your basement needs egress windows.',
    url: 'https://basescapeutah.com/blog/egress-window-signs',
  }

  it('returns @type Article', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema['@type']).toBe('Article')
  })

  it('maps headline, datePublished, and description', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema.headline).toBe('5 Signs You Need Egress Windows')
    expect(schema.datePublished).toBe('2026-01-15')
    expect(schema.description).toBe('Learn the warning signs that your basement needs egress windows.')
  })

  it('sets author as Organization named BaseScape', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema.author).toEqual({
      '@type': 'Organization',
      name: 'BaseScape',
    })
  })

  it('sets publisher with name and url', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema.publisher).toEqual({
      '@type': 'Organization',
      name: 'BaseScape',
      url: 'https://basescapeutah.com',
    })
  })

  it('includes image when provided', () => {
    const schema = generateArticleSchema({
      ...mockArticle,
      image: 'https://basescapeutah.com/images/egress.jpg',
    })
    expect(schema.image).toBe('https://basescapeutah.com/images/egress.jpg')
  })

  it('omits image when not provided', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema).not.toHaveProperty('image')
  })

  it('includes url field', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema.url).toBe('https://basescapeutah.com/blog/egress-window-signs')
  })
})
