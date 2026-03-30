import type { CollectionBeforeValidateHook } from 'payload'

export const validateLead: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data?.zipCode) return data

  try {
    const settings = await req.payload.findGlobal({ slug: 'site-settings' })
    const zipList = (settings as any)?.serviceAreaZipCodes || ''
    const validZips = zipList
      .split('\n')
      .map((z: string) => z.trim())
      .filter(Boolean)

    if (validZips.length > 0 && !validZips.includes(data.zipCode)) {
      data.isOutOfServiceArea = true
    }
  } catch {
    // Settings unavailable — don't flag, accept the lead
  }

  return data
}
