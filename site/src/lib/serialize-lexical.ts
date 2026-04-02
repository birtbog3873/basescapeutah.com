/**
 * Lightweight Lexical JSON → HTML serializer for Payload CMS richText fields.
 * Supports: paragraph, heading, list, listitem, text (with formatting), link, linebreak.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Lexical text format flags (bitmask)
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16

function serializeTextFormat(text: string, format: number): string {
  let result = escapeHtml(text)

  if (format & IS_CODE) result = `<code>${result}</code>`
  if (format & IS_UNDERLINE) result = `<u>${result}</u>`
  if (format & IS_STRIKETHROUGH) result = `<s>${result}</s>`
  if (format & IS_ITALIC) result = `<em>${result}</em>`
  if (format & IS_BOLD) result = `<strong>${result}</strong>`

  return result
}

function serializeNode(node: any): string {
  if (!node) return ''

  switch (node.type) {
    case 'text':
      return serializeTextFormat(node.text || '', node.format || 0)

    case 'linebreak':
      return '<br>'

    case 'paragraph':
      return `<p>${serializeChildren(node.children)}</p>`

    case 'heading': {
      const tag = node.tag || 'h2'
      return `<${tag}>${serializeChildren(node.children)}</${tag}>`
    }

    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      return `<${tag}>${serializeChildren(node.children)}</${tag}>`
    }

    case 'listitem':
      return `<li>${serializeChildren(node.children)}</li>`

    case 'link': {
      const raw = (node.fields?.url || '#').trim()
      const safe = /^(https?:|mailto:|tel:|\/|#)/i.test(raw) ? raw : '#'
      return `<a href="${escapeHtml(safe)}">${serializeChildren(node.children)}</a>`
    }

    default:
      // Unknown node type — serialize children if any
      return serializeChildren(node.children)
  }
}

function serializeChildren(children: any[] | undefined): string {
  if (!children || !Array.isArray(children)) return ''
  return children.map(serializeNode).join('')
}

/**
 * Convert Payload CMS Lexical richText JSON to an HTML string.
 * Pass-through for strings. Returns '' for null/undefined.
 */
export function serializeLexical(content: any): string {
  if (content == null) return ''
  if (typeof content === 'string') return content
  if (!content?.root?.children) return ''
  return serializeChildren(content.root.children)
}
