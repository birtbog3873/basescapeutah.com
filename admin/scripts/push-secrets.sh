#!/usr/bin/env bash
# Copy the admin's production secrets into the basescape-admin Worker.
# Source: an env file pulled from Vercel (default admin/.env.vercel-snapshot,
# or refresh it first with `vercel env pull --environment=production <file>`).
# Only the keys the admin code reads are sent; nothing is printed.
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="${1:-.env.vercel-snapshot}"
KEYS='PAYLOAD_SECRET|PAYLOAD_API_KEY|TURSO_DATABASE_URL|TURSO_AUTH_TOKEN|R2_BUCKET_NAME|R2_ACCESS_KEY_ID|R2_SECRET_ACCESS_KEY|R2_ENDPOINT|GITHUB_DEPLOY_TOKEN|GA4_MP_API_SECRET'

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT
grep -E "^(${KEYS})=" "$SRC" > "$TMP" || true

echo "Sending these keys (values hidden):"
sed 's/=.*//' "$TMP"
for k in ${KEYS//|/ }; do
  grep -q "^${k}=" "$TMP" || echo "  missing: $k"
done

CLOUDFLARE_ACCOUNT_ID=5fb6312e5d59070b140c5324777cc652 npx wrangler secret bulk "$TMP"
