import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'
import { getCloudflareContext } from '@opennextjs/cloudflare'

// On Cloudflare Workers a bare setTimeout dies with the request, so the wait
// runs inside ctx.waitUntil — which allows ~30s after the response, hence 20s.
// Edits that land on the same isolate within the window share one deploy.
const DEBOUNCE_MS = 20_000
let pending = false

async function triggerDeploy() {
  const token = process.env.GITHUB_DEPLOY_TOKEN
  if (!token) return

  try {
    const res = await fetch(
      'https://api.github.com/repos/birtbog3873/basescapeutah.com/actions/workflows/deploy-site.yml/dispatches',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
        body: JSON.stringify({ ref: 'main' }),
      },
    )
    if (res.ok) {
      console.log('[deployHook] Deploy triggered')
    } else {
      console.error('[deployHook] GitHub API error:', res.status, await res.text())
    }
  } catch (err) {
    console.error('[deployHook] Failed to trigger deploy:', err)
  }
}

function debouncedDeploy() {
  if (pending) return
  pending = true
  const run = new Promise<void>((resolve) => setTimeout(resolve, DEBOUNCE_MS))
    .then(triggerDeploy)
    .finally(() => {
      pending = false
    })
  try {
    getCloudflareContext().ctx.waitUntil(run)
  } catch {
    // Outside the Workers runtime (local `next dev`) the promise just runs.
  }
}

export const deployHookCollection: CollectionAfterChangeHook = ({ doc }) => {
  debouncedDeploy()
  return doc
}

export const deployHookGlobal: GlobalAfterChangeHook = ({ doc }) => {
  debouncedDeploy()
  return doc
}
