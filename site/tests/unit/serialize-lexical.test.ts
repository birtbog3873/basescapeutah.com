import { describe, it, expect } from 'vitest'
import { serializeLexical } from '../../src/lib/serialize-lexical'

// Helper to wrap text in a Lexical root structure
function lexicalDoc(...children: any[]) {
  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function textNode(text: string, format = 0) {
  return { type: 'text', text, format, detail: 0, mode: 'normal', style: '', version: 1 }
}

function paragraph(...children: any[]) {
  return { type: 'paragraph', children, direction: 'ltr', format: '', indent: 0, textFormat: 0, version: 1 }
}

function heading(tag: string, ...children: any[]) {
  return { type: 'heading', tag, children, direction: 'ltr', format: '', indent: 0, version: 1 }
}

function list(listType: string, ...children: any[]) {
  return { type: 'list', listType, children, direction: 'ltr', format: '', indent: 0, start: 1, tag: listType === 'bullet' ? 'ul' : 'ol', version: 1 }
}

function listitem(...children: any[]) {
  return { type: 'listitem', children, direction: 'ltr', format: '', indent: 0, value: 1, version: 1 }
}

function link(url: string, ...children: any[]) {
  return { type: 'link', fields: { url }, children, direction: 'ltr', format: '', indent: 0, version: 1 }
}

function linebreak() {
  return { type: 'linebreak', version: 1 }
}

describe('serializeLexical', () => {
  it('returns empty string for null/undefined input', () => {
    expect(serializeLexical(null)).toBe('')
    expect(serializeLexical(undefined)).toBe('')
  })

  it('returns the string as-is if input is already a string', () => {
    expect(serializeLexical('<p>Hello</p>')).toBe('<p>Hello</p>')
  })

  it('returns empty string for empty root', () => {
    expect(serializeLexical(lexicalDoc())).toBe('')
  })

  it('serializes a simple paragraph', () => {
    const doc = lexicalDoc(paragraph(textNode('Hello world')))
    expect(serializeLexical(doc)).toBe('<p>Hello world</p>')
  })

  it('serializes multiple paragraphs', () => {
    const doc = lexicalDoc(
      paragraph(textNode('First')),
      paragraph(textNode('Second')),
    )
    expect(serializeLexical(doc)).toBe('<p>First</p><p>Second</p>')
  })

  it('serializes headings h1-h6', () => {
    for (let i = 1; i <= 6; i++) {
      const doc = lexicalDoc(heading(`h${i}`, textNode(`Heading ${i}`)))
      expect(serializeLexical(doc)).toBe(`<h${i}>Heading ${i}</h${i}>`)
    }
  })

  it('serializes bold text (format: 1)', () => {
    const doc = lexicalDoc(paragraph(textNode('bold text', 1)))
    expect(serializeLexical(doc)).toBe('<p><strong>bold text</strong></p>')
  })

  it('serializes italic text (format: 2)', () => {
    const doc = lexicalDoc(paragraph(textNode('italic text', 2)))
    expect(serializeLexical(doc)).toBe('<p><em>italic text</em></p>')
  })

  it('serializes underline text (format: 8)', () => {
    const doc = lexicalDoc(paragraph(textNode('underlined', 8)))
    expect(serializeLexical(doc)).toBe('<p><u>underlined</u></p>')
  })

  it('serializes strikethrough text (format: 4)', () => {
    const doc = lexicalDoc(paragraph(textNode('struck', 4)))
    expect(serializeLexical(doc)).toBe('<p><s>struck</s></p>')
  })

  it('serializes code text (format: 16)', () => {
    const doc = lexicalDoc(paragraph(textNode('code', 16)))
    expect(serializeLexical(doc)).toBe('<p><code>code</code></p>')
  })

  it('serializes combined bold+italic (format: 3)', () => {
    const doc = lexicalDoc(paragraph(textNode('bold italic', 3)))
    expect(serializeLexical(doc)).toBe('<p><strong><em>bold italic</em></strong></p>')
  })

  it('serializes bullet list', () => {
    const doc = lexicalDoc(
      list('bullet',
        listitem(textNode('Item 1')),
        listitem(textNode('Item 2')),
      ),
    )
    expect(serializeLexical(doc)).toBe('<ul><li>Item 1</li><li>Item 2</li></ul>')
  })

  it('serializes numbered list', () => {
    const doc = lexicalDoc(
      list('number',
        listitem(textNode('First')),
        listitem(textNode('Second')),
      ),
    )
    expect(serializeLexical(doc)).toBe('<ol><li>First</li><li>Second</li></ol>')
  })

  it('serializes links', () => {
    const doc = lexicalDoc(
      paragraph(link('https://example.com', textNode('Click here'))),
    )
    expect(serializeLexical(doc)).toBe('<p><a href="https://example.com">Click here</a></p>')
  })

  it('serializes linebreaks', () => {
    const doc = lexicalDoc(
      paragraph(textNode('Line 1'), linebreak(), textNode('Line 2')),
    )
    expect(serializeLexical(doc)).toBe('<p>Line 1<br>Line 2</p>')
  })

  it('serializes mixed content', () => {
    const doc = lexicalDoc(
      heading('h2', textNode('Title')),
      paragraph(textNode('Normal '), textNode('bold', 1), textNode(' text')),
      list('bullet',
        listitem(textNode('Item')),
      ),
    )
    expect(serializeLexical(doc)).toBe('<h2>Title</h2><p>Normal <strong>bold</strong> text</p><ul><li>Item</li></ul>')
  })

  it('escapes HTML entities in text', () => {
    const doc = lexicalDoc(paragraph(textNode('<script>alert("xss")</script>')))
    expect(serializeLexical(doc)).toBe('<p>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</p>')
  })
})
