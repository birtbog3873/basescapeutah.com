import type { CollectionConfig } from 'payload'

export const ServiceAreas: CollectionConfig = {
  slug: 'service-areas',
  admin: {
    useAsTitle: 'cityName',
    defaultColumns: ['cityName', 'stateAbbrev', 'county', 'status'],
    description: 'Geographic markets BaseScape serves. Each generates a unique location page.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'cityName',
      type: 'text',
      required: true,
      maxLength: 60,
    },
    {
      name: 'stateAbbrev',
      type: 'text',
      required: true,
      defaultValue: 'UT',
      maxLength: 2,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'county',
      type: 'select',
      required: true,
      options: [
        { label: 'Utah County', value: 'utah' },
        { label: 'Salt Lake County', value: 'salt-lake' },
        { label: 'Davis County', value: 'davis' },
      ],
    },
    {
      name: 'coordinates',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number', required: true, min: 39.0, max: 42.0 },
        { name: 'lng', type: 'number', required: true, min: -113.0, max: -109.0 },
      ],
    },
    {
      name: 'serviceRadius',
      type: 'number',
      required: true,
      defaultValue: 15,
      admin: { description: 'Service radius in miles' },
    },
    {
      name: 'localContent',
      type: 'richText',
      required: true,
      admin: { description: 'Unique localized copy — not template-swapped' },
    },
    {
      name: 'localReferences',
      type: 'textarea',
      required: true,
      admin: { description: 'Genuine local references (landmarks, neighborhoods, concerns)' },
    },
    {
      name: 'localProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
    },
    {
      name: 'localReviews',
      type: 'relationship',
      relationTo: 'reviews',
      hasMany: true,
    },
    {
      name: 'localFAQs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', required: true, maxLength: 60 },
        { name: 'metaDescription', type: 'textarea', required: true, maxLength: 160 },
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
