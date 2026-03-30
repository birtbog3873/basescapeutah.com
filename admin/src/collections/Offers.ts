import type { CollectionConfig } from 'payload'

export const Offers: CollectionConfig = {
  slug: 'offers',
  admin: {
    useAsTitle: 'headline',
    defaultColumns: ['headline', 'status', 'startDate', 'endDate'],
    description: 'Time-bound or evergreen promotions displayed on pages and landing pages.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'terms',
      type: 'textarea',
      maxLength: 500,
      admin: { description: 'Offer terms and conditions' },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      admin: { description: 'Leave empty for evergreen offers' },
    },
    {
      name: 'applicableServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'applicablePages',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Homepage', value: 'homepage' },
        { label: 'Service Pages', value: 'service' },
        { label: 'Location Pages', value: 'location' },
        { label: 'Landing Pages', value: 'landing-page' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
