# Contract: Google Sheets Webhook

**Direction**: CMS → Google Apps Script (outbound POST)
**Trigger**: Lead status transitions to "complete" in afterLeadCreate hook

## Request

**Method**: POST
**URL**: Value of `GOOGLE_SHEETS_WEBHOOK_URL` environment variable
**Content-Type**: `application/json`

### Payload

```json
{
  "timestamp": "2026-03-30T14:30:00.000Z",
  "name": "Jane Smith",
  "phone": "(801) 555-1234",
  "email": "jane@example.com",
  "zipCode": "84645",
  "serviceType": "walkout-basement",
  "projectPurpose": "family-space",
  "timeline": "1-3-months",
  "source": "https://basescapeutah.com/contact",
  "pageUrl": "https://basescapeutah.com/contact"
}
```

### Field Mapping

| JSON Field | Lead Document Field | Type | Required |
|------------|-------------------|------|----------|
| `timestamp` | `doc.createdAt` | ISO 8601 string | Yes |
| `name` | `doc.name` | string | Yes |
| `phone` | `doc.phone` | string | Yes |
| `email` | `doc.email` | string | Yes |
| `zipCode` | `doc.zipCode` | string (5 digits) | Yes |
| `serviceType` | `doc.serviceType` | enum string | Yes |
| `projectPurpose` | `doc.projectPurpose` | enum string | No (may be null) |
| `timeline` | `doc.timeline` | enum string | No (may be null) |
| `source` | `doc.source?.page` | URL string | No (may be null) |
| `pageUrl` | `doc.source?.page` | URL string | No (may be null) |

## Response

The CMS does **not** inspect the response. The webhook call is fire-and-forget:

- Success (2xx): Logged, no further action
- Failure (4xx, 5xx, network error): Caught silently, logged to console, no retry
- Missing env var: Call is skipped entirely (no error)

## Google Apps Script Receiver (Out of Scope)

For reference, the receiving endpoint should:

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents)
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.phone,
    data.email,
    data.zipCode,
    data.serviceType,
    data.projectPurpose,
    data.timeline,
    data.source,
    data.pageUrl
  ])
  return ContentService.createTextOutput('OK')
}
```

Sheet columns: Timestamp | Name | Phone | Email | ZIP | Service | Purpose | Timeline | Source | Page URL
