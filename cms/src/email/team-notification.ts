const SERVICE_LABELS: Record<string, string> = {
  'walkout-basement': 'Walkout Basement',
  'basement-remodeling': 'Basement Remodeling',
  'pavers-hardscapes': 'Pavers & Hardscapes',
  'retaining-walls': 'Retaining Walls',
  'artificial-turf': 'Artificial Turf',
  'egress-window': 'Egress Window',
  'not-sure': 'Not Sure',
}

const FORM_TYPE_LABELS: Record<string, string> = {
  'multi-step': 'Multi-Step Estimate',
  'quick-callback': 'Quick Callback',
  'lead-magnet': 'Lead Magnet',
}

const PURPOSE_LABELS: Record<string, string> = {
  'rental-unit': 'Rental Unit',
  'family-space': 'Family Space',
  'home-office': 'Home Office',
  'safety-compliance': 'Safety Compliance',
  'other': 'Other',
}

const TIMELINE_LABELS: Record<string, string> = {
  asap: 'ASAP',
  '1-3-months': '1-3 Months',
  '3-6-months': '3-6 Months',
  '6-plus-months': '6+ Months',
  'just-researching': 'Just Researching',
}

interface TeamNotificationData {
  id: string
  name?: string
  phone?: string
  email?: string
  address?: string
  serviceType?: string
  projectPurpose?: string
  timeline?: string
  zipCode?: string
  formType: string
  source?: {
    page?: string
    utmCampaign?: string
    referrer?: string
  }
  isOutOfServiceArea?: boolean
  createdAt: string
  payloadBaseUrl?: string
}

export function generateTeamNotification(data: TeamNotificationData) {
  const formLabel = FORM_TYPE_LABELS[data.formType] || data.formType
  const serviceLabel = data.serviceType ? SERVICE_LABELS[data.serviceType] || data.serviceType : 'Not specified'
  const outOfAreaFlag = data.isOutOfServiceArea ? ' ⚠️ OUT OF SERVICE AREA' : ''

  return {
    subject: `New ${formLabel} Lead: ${data.name || 'Unknown'} — ${serviceLabel} in ${data.zipCode || 'N/A'}${outOfAreaFlag}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1B3B5E;">
        ${data.isOutOfServiceArea ? '<div style="background: #FFF8EB; border: 2px solid #E8920A; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-weight: 600; color: #9A5D06;">⚠️ OUT OF SERVICE AREA — ZIP: ${data.zipCode}</div>' : ''}

        <h1 style="font-size: 20px; color: #1B3B5E; margin-bottom: 4px;">
          New ${formLabel} Lead
        </h1>
        <p style="font-size: 14px; color: #697686; margin-bottom: 24px;">
          ${new Date(data.createdAt).toLocaleString('en-US', { timeZone: 'America/Denver' })}
        </p>

        <h2 style="font-size: 16px; color: #1B3B5E; border-bottom: 1px solid #E3E8EF; padding-bottom: 8px;">
          Contact Information
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="padding: 6px 0; color: #697686; width: 120px;">Name</td><td style="padding: 6px 0; font-weight: 600;">${data.name || '—'}</td></tr>
          <tr><td style="padding: 6px 0; color: #697686;">Phone</td><td style="padding: 6px 0;"><a href="tel:${(data.phone || '').replace(/[^\d+]/g, '')}" style="color: #1B3B5E; font-weight: 600;">${data.phone || '—'}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #697686;">Email</td><td style="padding: 6px 0;"><a href="mailto:${data.email || ''}" style="color: #2A7B78;">${data.email || '—'}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #697686;">Address</td><td style="padding: 6px 0;">${data.address || '—'}</td></tr>
        </table>

        <h2 style="font-size: 16px; color: #1B3B5E; border-bottom: 1px solid #E3E8EF; padding-bottom: 8px;">
          Project Details
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="padding: 6px 0; color: #697686; width: 120px;">Service</td><td style="padding: 6px 0;">${serviceLabel}</td></tr>
          <tr><td style="padding: 6px 0; color: #697686;">Purpose</td><td style="padding: 6px 0;">${data.projectPurpose ? PURPOSE_LABELS[data.projectPurpose] || data.projectPurpose : '—'}</td></tr>
          <tr><td style="padding: 6px 0; color: #697686;">Timeline</td><td style="padding: 6px 0;">${data.timeline ? TIMELINE_LABELS[data.timeline] || data.timeline : '—'}</td></tr>
          <tr><td style="padding: 6px 0; color: #697686;">ZIP Code</td><td style="padding: 6px 0;">${data.zipCode || '—'}</td></tr>
        </table>

        <h2 style="font-size: 16px; color: #1B3B5E; border-bottom: 1px solid #E3E8EF; padding-bottom: 8px;">
          Attribution
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="padding: 6px 0; color: #697686; width: 120px;">Source Page</td><td style="padding: 6px 0;">${data.source?.page || '—'}</td></tr>
          <tr><td style="padding: 6px 0; color: #697686;">Campaign</td><td style="padding: 6px 0;">${data.source?.utmCampaign || '—'}</td></tr>
          <tr><td style="padding: 6px 0; color: #697686;">Referrer</td><td style="padding: 6px 0;">${data.source?.referrer || '—'}</td></tr>
        </table>

        ${data.payloadBaseUrl ? `
        <p style="margin-top: 16px;">
          <a href="${data.payloadBaseUrl}/admin/collections/leads/${data.id}"
             style="display: inline-block; background: #1B3B5E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-size: 14px;">
            View in Admin Panel →
          </a>
        </p>
        ` : ''}
      </div>
    `,
  }
}
