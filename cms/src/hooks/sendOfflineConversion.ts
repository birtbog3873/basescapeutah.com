import type { CollectionAfterChangeHook } from 'payload'

const GA4_MEASUREMENT_ID = 'G-TB1P7B508Q'

export const sendOfflineConversion: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (operation !== 'update') return doc

  const apiSecret = process.env.GA4_MP_API_SECRET
  if (!apiSecret) return doc

  const clientId = doc.source?.gaClientId
  if (!clientId) return doc

  const previousStatus = previousDoc?.status
  const newStatus = doc.status

  if (previousStatus === newStatus) return doc

  let eventName: string | null = null
  const params: Record<string, any> = {}

  if (newStatus === 'qualified') {
    eventName = 'qualify_lead'
  } else if (newStatus === 'closed_won') {
    eventName = 'close_convert_lead'
    if (doc.closedValue) {
      params.value = doc.closedValue
      params.currency = 'USD'
    }
  }

  if (!eventName) return doc

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${apiSecret}`

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        events: [{ name: eventName, params }],
      }),
    })
    req.payload.logger.info({
      msg: `Sent GA4 offline conversion: ${eventName}`,
      leadId: doc.id,
    })
  } catch (error) {
    req.payload.logger.error({
      msg: `Failed to send GA4 offline conversion: ${eventName}`,
      leadId: doc.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }

  return doc
}
