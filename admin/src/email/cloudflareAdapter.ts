import type { EmailAdapter, SendEmailOptions } from 'payload'
import { getCloudflareContext } from '@opennextjs/cloudflare'

// Payload email adapter for Cloudflare Email Service (the `EMAIL` send_email
// binding in wrangler.jsonc). Replaced @payloadcms/email-resend 2026-10-13.
// Used only for user invites and password resets — lead emails go out from
// the site's Astro action.

type SendEmailBinding = {
  send(message: {
    to: string | string[]
    from: { email: string; name?: string }
    replyTo?: string
    subject: string
    text?: string
    html?: string
  }): Promise<{ messageId?: string }>
}

function addressList(value: SendEmailOptions['to']): string[] {
  if (!value) return []
  const list = Array.isArray(value) ? value : [value]
  return list.map((entry) => (typeof entry === 'string' ? entry : entry.address))
}

function parseFrom(
  from: SendEmailOptions['from'],
  fallback: { email: string; name: string },
): { email: string; name?: string } {
  if (!from) return fallback
  if (typeof from !== 'string') return { email: from.address, name: from.name }
  const match = from.match(/^\s*"?(.+?)"?\s*<([^>]+)>\s*$/)
  return match ? { name: match[1], email: match[2] } : { email: from }
}

export const cloudflareEmailAdapter =
  ({
    defaultFromAddress,
    defaultFromName,
  }: {
    defaultFromAddress: string
    defaultFromName: string
  }): EmailAdapter =>
  () => ({
    name: 'cloudflare-email',
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message) => {
      const { env } = getCloudflareContext()
      const binding = (env as unknown as { EMAIL?: SendEmailBinding }).EMAIL
      if (!binding) {
        throw new Error('EMAIL binding missing — check send_email in wrangler.jsonc')
      }
      const replyTo = addressList(message.replyTo)[0]
      return binding.send({
        from: parseFrom(message.from, { email: defaultFromAddress, name: defaultFromName }),
        to: addressList(message.to),
        replyTo,
        subject: message.subject ?? '',
        html: typeof message.html === 'string' ? message.html : undefined,
        text: typeof message.text === 'string' ? message.text : undefined,
      })
    },
  })
