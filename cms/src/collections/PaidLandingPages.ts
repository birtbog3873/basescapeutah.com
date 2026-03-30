import type { CollectionConfig } from 'payload'

export const PaidLandingPages: CollectionConfig = {
  slug: 'paid-landing-pages',
  admin: {
    useAsTitle: 'headline',
    defaultColumns: ['campaignSlug', 'headline', 'status'],
    description: 'Campaign-specific conversion pages with suppressed navigation.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'campaignSlug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL path under /lp/ (e.g., "walkout-spring-2026")' },
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      maxLength: 100,
      admin: { description: 'Aligned with ad copy' },
    },
    {
      name: 'subheadline',
      type: 'text',
      maxLength: 200,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bodyContent',
      type: 'richText',
      required: true,
      admin: { description: 'Focused offer content' },
    },
    {
      name: 'trustBadges',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Licensed', value: 'licensed' },
        { label: 'Insured', value: 'insured' },
        { label: 'Bonded', value: 'bonded' },
        { label: 'Free Estimate', value: 'free-estimate' },
        { label: 'No Hidden Charges', value: 'no-hidden-charges' },
        { label: 'Dust Containment', value: 'dust-containment' },
      ],
    },
    {
      name: 'formType',
      type: 'select',
      required: true,
      options: [
        { label: 'Multi-Step Form', value: 'multi-step' },
        { label: 'Quick Callback', value: 'quick-callback' },
      ],
    },
    {
      name: 'offer',
      type: 'relationship',
      relationTo: 'offers',
    },
    {
      name: 'targetService',
      type: 'relationship',
      relationTo: 'services',
      admin: { description: 'Pre-selects service on the embedded form' },
    },
    {
      name: 'suppressNavigation',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Suppress standard header/footer navigation (FR-041)' },
    },
    {
      name: 'utmCampaign',
      type: 'text',
      admin: { description: 'Expected campaign tag for analytics matching' },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', required: true, maxLength: 60 },
        { name: 'metaDescription', type: 'textarea', required: true, maxLength: 160 },
        {
          name: 'noindex',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Landing pages are typically noindex' },
        },
      ],
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
      admin: { position: 'sidebar' },
    },
  ],
}
