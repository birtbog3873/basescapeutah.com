import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: 'Review',
    plural: 'Reviews',
  },
  admin: {
    useAsTitle: 'reviewerName',
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
      name: 'reviewerName',
      type: 'text',
      required: true,
      maxLength: 60,
    },
    {
      name: 'reviewText',
      type: 'textarea',
      required: true,
      maxLength: 500,
    },
    {
      name: 'starRating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'city',
      type: 'relationship',
      relationTo: 'service-areas',
    },
    {
      name: 'serviceType',
      type: 'relationship',
      relationTo: 'services',
    },
    {
      name: 'source',
      type: 'text',
      required: true,
      maxLength: 60,
    },
    {
      name: 'reviewDate',
      type: 'date',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
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
