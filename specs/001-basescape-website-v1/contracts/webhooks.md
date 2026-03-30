# Contract: FSM Webhooks (Deferred — Post-Launch Phase)

> **Status**: DEFERRED. FSM software selection is pending (spec Assumption 7). This contract documents the target integration pattern for when a vendor (Jobber or Housecall Pro) is selected.

## Overview

When a lead reaches `status: "complete"`, Payload CMS's `afterChange` hook will dispatch an authenticated webhook to the selected FSM API. V1 stores leads in the CMS and sends email notifications for manual follow-up instead.

## Target Pipeline (Post-Launch)

```
Lead submitted → Payload creates Lead record
                → afterChange hook fires
                → Webhook dispatched to FSM API (< 2 seconds)
                → FSM creates customer profile + job ticket
                → Team sees lead on dispatch board
```

## Webhook Payload (Draft Schema)

The webhook payload sent from Payload CMS to the FSM endpoint:

```json
{
  "event": "lead.created",
  "timestamp": "2026-03-23T12:00:00.000Z",
  "data": {
    "leadId": "string",
    "name": "Jane Smith",
    "phone": "801-555-1234",
    "email": "jane@example.com",
    "address": "123 Mountain View Dr, Draper, UT 84020",
    "serviceType": "walkout-basement",
    "projectPurpose": "rental-unit",
    "timeline": "1-3-months",
    "zipCode": "84020",
    "notes": "string",
    "source": {
      "page": "/services/walkout-basements",
      "campaign": "walkout-basements-utah"
    }
  }
}
```

## Security Requirements (Constitution Article XI)

- All webhook payloads MUST use HTTPS
- Payloads MUST include cryptographic signature verification via `X-Payload-Signature` header (HMAC-SHA256 of request body with shared secret)
- FSM endpoint MUST validate signature before processing
- Shared secret stored in Cloudflare Workers environment variable

## V1 Replacement

Until FSM is selected, the same trigger point sends an email notification to the BaseScape team with all lead details. See [email.md](./email.md) for the notification email contract.
