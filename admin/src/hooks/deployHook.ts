import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

let debounceTimer: ReturnType<typeof setTimeout> | null = null
const DEBOUNCE_MS = 30_000

async function triggerDeploy() {
  const url = process.env.DEPLOY_HOOK_URL
  if (!url) return

  try {
    await fetch(url, { method: 'POST' })
    console.log('[deployHook] Deploy triggered')
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
