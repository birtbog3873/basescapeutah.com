import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

let debounceTimer: ReturnType<typeof setTimeout> | null = null
const DEBOUNCE_MS = 30_000

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
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(triggerDeploy, DEBOUNCE_MS)
}

export const deployHookCollection: CollectionAfterChangeHook = ({ doc }) => {
  debouncedDeploy()
  return doc
}

export const deployHookGlobal: GlobalAfterChangeHook = ({ doc }) => {
  debouncedDeploy()
  return doc
}
