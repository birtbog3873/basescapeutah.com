import type { CollectionAfterChangeHook } from 'payload'
import { generateConfirmationEmail } from '../email/lead-confirmation'
import { generateTeamNotification } from '../email/team-notification'

export const afterLeadCreate: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  // Only trigger on status change to "complete"
  const statusChanged = operation === 'update'
    ? previousDoc?.status !== 'complete' && doc.status === 'complete'
    : operation === 'create' && doc.status === 'complete'

  if (!statusChanged) return doc

  let settings: any = {}
  try {
    settings = await req.payload.findGlobal({ slug: 'site-settings' })
  } catch {
    // Continue with defaults
  }

  const businessPhone = settings?.phone || '(888) 414-0007'
  const businessName = settings?.businessName || 'BaseScape'
  const teamEmail = process.env.TEAM_NOTIFICATION_EMAIL || 'team@basescape.com'
  const payloadBaseUrl = process.env.PAYLOAD_BASE_URL || ''

  // Send homeowner confirmation email
  if (doc.email) {
    try {
      const confirmation = generateConfirmationEmail({
        name: doc.name || 'Homeowner',
        serviceType: doc.serviceType,
        phone: businessPhone,
        businessName,
      })

      await req.payload.sendEmail({
        to: doc.email,
        from: `${businessName} <noreply@basescape.com>`,
        replyTo: 'hello@basescape.com',
        subject: confirmation.subject,
        html: confirmation.html,
      })

      await req.payload.update({
        collection: 'leads',
        id: doc.id,
        data: { confirmationSentAt: new Date().toISOString() },
      })
    } catch (error) {
      req.payload.logger.error({
        msg: 'Failed to send confirmation email',
        leadId: doc.id,
        error,
      })
    }
  }

  // Send team notification email
  try {
    const notification = generateTeamNotification({
      id: doc.id,
      name: doc.name,
      phone: doc.phone,
      email: doc.email,
      address: doc.address,
      serviceType: doc.serviceType,
      projectPurpose: doc.projectPurpose,
      timeline: doc.timeline,
      zipCode: doc.zipCode,
      formType: doc.formType,
      source: doc.source,
      isOutOfServiceArea: doc.isOutOfServiceArea,
      createdAt: doc.createdAt,
      payloadBaseUrl,
    })

    await req.payload.sendEmail({
      to: teamEmail,
      from: `BaseScape Leads <leads@basescape.com>`,
      replyTo: doc.email || undefined,
      subject: notification.subject,
      html: notification.html,
    })

    await req.payload.update({
      collection: 'leads',
      id: doc.id,
      data: { teamNotifiedAt: new Date().toISOString() },
    })
  } catch (error) {
    req.payload.logger.error({
      msg: 'Failed to send team notification',
      leadId: doc.id,
      error,
    })
  }

  // Fire-and-forget Google Sheets webhook
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: doc.createdAt,
          name: doc.name,
          phone: doc.phone,
          email: doc.email,
          zipCode: doc.zipCode,
          serviceType: doc.serviceType,
          projectPurpose: doc.projectPurpose,
          timeline: doc.timeline,
          source: doc.source?.page,
          pageUrl: doc.source?.page,
        }),
      })
    } catch (error) {
      req.payload.logger.error({
        msg: 'Failed to POST to Google Sheets webhook',
        leadId: doc.id,
        error,
      })
    }
  }

  return doc
}
