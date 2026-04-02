const SERVICE_LABELS: Record<string, string> = {
  'walkout-basement': 'Walkout Basement',
  'basement-remodeling': 'Basement Remodeling',
  'pavers-hardscapes': 'Pavers & Hardscapes',
  'retaining-walls': 'Retaining Walls',
  'artificial-turf': 'Artificial Turf',
  'egress-windows': 'Egress Windows',
  'not-sure': 'Basement Consultation',
}

interface ConfirmationEmailData {
  name: string
  serviceType?: string
  phone: string
  businessName: string
}

export function generateConfirmationEmail(data: ConfirmationEmailData) {
  const serviceName = data.serviceType
    ? SERVICE_LABELS[data.serviceType] || data.serviceType
    : 'estimate'

  return {
    subject: `Thanks, ${data.name} — We received your ${serviceName} estimate request`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1B3B5E;">
        <h1 style="font-size: 24px; color: #1B3B5E; margin-bottom: 16px;">
          Thanks, ${data.name}!
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #3E6B89;">
          We've received your ${serviceName} estimate request. Our team will review
          your project details and reach out within 24 hours.
        </p>
        <h2 style="font-size: 18px; color: #1B3B5E; margin-top: 24px;">What Happens Next</h2>
        <ol style="font-size: 16px; line-height: 1.8; color: #3E6B89; padding-left: 20px;">
          <li>A BaseScape specialist will call you to discuss your project</li>
          <li>We'll schedule a free on-site structural assessment</li>
          <li>You'll receive a detailed written estimate</li>
        </ol>
        <p style="font-size: 16px; line-height: 1.6; color: #3E6B89; margin-top: 24px;">
          Need to reach us sooner? Call us directly:
        </p>
        <p style="margin-top: 8px;">
          <a href="tel:${data.phone.replace(/[^\d+]/g, '')}"
             style="display: inline-block; background: #1B3B5E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500;">
            ${data.phone}
          </a>
        </p>
        <hr style="border: none; border-top: 1px solid #E3E8EF; margin: 32px 0;" />
        <p style="font-size: 13px; color: #697686;">
          <strong>Licensed &middot; Bonded &middot; Insured</strong> — Utah Wasatch Front
        </p>
        <p style="font-size: 12px; color: #9AA5B4; margin-top: 8px;">
          This is an automated confirmation from ${data.businessName}. Please do not reply to this email.
        </p>
      </div>
    `,
  }
}
