import { describe, it, expect } from 'vitest'
import { generateArticleSchema } from '../../src/lib/schema'

const mockArticle = {
  headline: 'How to Waterproof Your Basement Before Finishing',
  author: 'BaseScape',
  publishDate: '2026-03-10',
  description: 'A step-by-step guide to basement waterproofing for Utah homeowners.',
  url: 'https://basescapeutah.com/blog/basement-waterproofing-guide',
}

// ---------------------------------------------------------------------------
// T109 — generateArticleSchema
// ---------------------------------------------------------------------------
describe('generateArticleSchema', () => {
  it('returns @type Article', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema['@type']).toBe('Article')
  })

  it('includes @context schema.org', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema['@context']).toBe('https://schema.org')
  })

  it('maps headline correctly', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema.headline).toBe('How to Waterproof Your Basement Before Finishing')
  })

  it('sets author as Organization named BaseScape', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema.author).toEqual({
      '@type': 'Organization',
      name: 'BaseScape',
    })
  })

  it('maps datePublished from publishDate', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema.datePublished).toBe('2026-03-10')
  })

  it('includes description', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema.description).toBe(
      'A step-by-step guide to basement waterproofing for Utah homeowners.',
    )
  })

  it('includes url', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema.url).toBe('https://basescapeutah.com/blog/basement-waterproofing-guide')
  })

  it('sets publisher as BaseScape Organization with url', () => {
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
      image: 'https://basescapeutah.com/images/waterproofing.jpg',
    })
    expect(schema.image).toBe('https://basescapeutah.com/images/waterproofing.jpg')
  })

  it('omits image when not provided', () => {
    const schema = generateArticleSchema(mockArticle)
    expect(schema).not.toHaveProperty('image')
  })
})
