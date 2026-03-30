import type { CollectionConfig } from 'payload'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  admin: {
    useAsTitle: 'question',
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      maxLength: 200,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Cost', value: 'cost' },
        { label: 'Code Compliance', value: 'code-compliance' },
        { label: 'City Variability', value: 'city-variability' },
        { label: 'Timeline', value: 'timeline' },
        { label: 'Disruption', value: 'disruption' },
        { label: 'Financing & Rebates', value: 'financing-rebates' },
        { label: 'Drainage & Moisture', value: 'drainage-moisture' },
        { label: 'Rental Readiness', value: 'rental-readiness' },
        { label: 'General', value: 'general' },
      ],
    },
    {
      name: 'applicableServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'applicableAreas',
      type: 'relationship',
      relationTo: 'service-areas',
      hasMany: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
