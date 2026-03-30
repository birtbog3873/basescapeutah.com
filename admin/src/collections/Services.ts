import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Service',
    plural: 'Services',
  },
  admin: {
    useAsTitle: 'title',
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
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      maxLength: 200,
    },
    {
      name: 'primaryValuePillar',
      type: 'select',
      required: true,
      options: [
        { label: 'Financial', value: 'financial' },
        { label: 'Safety', value: 'safety' },
        { label: 'Transformation', value: 'transformation' },
      ],
    },
    {
      name: 'supportingPillars',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Financial', value: 'financial' },
        { label: 'Safety', value: 'safety' },
        { label: 'Transformation', value: 'transformation' },
      ],
    },
    {
      name: 'serviceType',
      type: 'select',
      defaultValue: 'core',
      options: [
        { label: 'Core', value: 'core' },
        { label: 'Specialized', value: 'specialized' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Core services are primary offerings. Specialized services are complementary.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'overview',
      type: 'richText',
      required: true,
    },
    {
      name: 'process',
      type: 'array',
      minRows: 3,
      fields: [
        {
          name: 'stepTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'stepDescription',
          type: 'richText',
          required: true,
        },
        {
          name: 'stepImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'anxietyStack',
      type: 'group',
      fields: [
        {
          name: 'structuralSafety',
          type: 'richText',
        },
        {
          name: 'codeCompliance',
          type: 'richText',
        },
        {
          name: 'drainageMoisture',
          type: 'richText',
        },
        {
          name: 'dustDisruption',
          type: 'richText',
        },
        {
          name: 'costAffordability',
          type: 'richText',
        },
        {
          name: 'aesthetics',
          type: 'richText',
        },
        {
          name: 'timeline',
          type: 'richText',
        },
      ],
    },
    {
      name: 'differentiator',
      type: 'richText',
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
    },
    {
      name: 'reviews',
      type: 'relationship',
      relationTo: 'reviews',
      hasMany: true,
    },
    {
      name: 'ctaHeadline',
      type: 'text',
      maxLength: 100,
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          required: true,
          maxLength: 60,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          required: true,
          maxLength: 160,
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
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
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
