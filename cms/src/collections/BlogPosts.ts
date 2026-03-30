import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishDate', 'status'],
    description: 'Educational content for organic SEO.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
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
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 300,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: { description: 'Article content with embedded CTAs' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Walkout Basements', value: 'walkout-basements' },
        { label: 'Egress Windows', value: 'egress-windows' },
        { label: 'Basement Remodeling', value: 'basement-remodeling' },
        { label: 'Retaining Walls', value: 'retaining-walls' },
        { label: 'ADU Compliance', value: 'adu-compliance' },
        { label: 'Financing', value: 'financing' },
        { label: 'Local Guides', value: 'local-guides' },
        { label: 'Safety', value: 'safety' },
      ],
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'leadMagnetCTA',
      type: 'relationship',
      relationTo: 'lead-magnets',
      admin: { description: 'Embedded lead magnet CTA (FR-040)' },
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      maxLength: 60,
    },
    {
      name: 'publishDate',
      type: 'date',
      required: true,
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
