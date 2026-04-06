interface LeadMagnetDeliveryData {
  name?: string
  leadMagnetTitle: string
  downloadUrl: string
  description: string
  businessPhone: string
  businessName: string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function generateLeadMagnetDeliveryEmail(data: LeadMagnetDeliveryData): string {
  const greeting = data.name ? `Hi ${escapeHtml(data.name)},` : 'Hi there,'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your free guide: ${data.leadMagnetTitle}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
    <tr>
      <td style="padding:32px 24px;text-align:center;background:#1B3B5E;">
        <span style="font-size:24px;font-weight:800;color:#ffffff;">Base</span><span style="font-size:24px;font-weight:800;color:#5EA03C;">Scape</span>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 24px;">
        <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 16px;">
          ${greeting}
        </p>
        <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 16px;">
          Thank you for your interest! Here's your free resource:
        </p>
        <h2 style="font-size:20px;font-weight:700;color:#1B3B5E;margin:0 0 8px;">
          ${data.leadMagnetTitle}
        </h2>
        <p style="font-size:14px;line-height:1.5;color:#666;margin:0 0 24px;">
          ${data.description}
        </p>
        <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
          <tr>
            <td style="background:#E8920A;border-radius:6px;padding:14px 32px;">
              <a href="${data.downloadUrl}" style="color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;display:inline-block;">
                Download Your Free Guide
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;background:#f0f4f8;border-top:1px solid #e2e8f0;">
        <p style="font-size:15px;line-height:1.6;color:#333;margin:0 0 12px;">
          <strong>Ready to take the next step?</strong> Schedule a free, no-obligation estimate with our team.
        </p>
        <p style="font-size:15px;margin:0 0 8px;">
          <a href="tel:${data.businessPhone.replace(/[^\d+]/g, '')}" style="color:#1B3B5E;font-weight:600;text-decoration:none;">
            Call ${data.businessPhone}
          </a>
        </p>
        <p style="font-size:13px;color:#888;margin:0;">
          Licensed &middot; Bonded &middot; Insured — Utah
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 24px;text-align:center;background:#1B3B5E;">
        <p style="font-size:12px;color:#8ba3be;margin:0;">
          &copy; ${new Date().getFullYear()} ${escapeHtml(data.businessName)}. This email was sent because you requested a resource from our website.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function generateLeadMagnetDeliverySubject(leadMagnetTitle: string): string {
  return `Your free guide: ${leadMagnetTitle}`
}
