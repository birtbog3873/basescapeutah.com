import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'businessName',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'zip',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'operatingHours',
      type: 'array',
      fields: [
        {
          name: 'day',
          type: 'select',
          required: true,
          options: [
            { label: 'Monday', value: 'Monday' },
            { label: 'Tuesday', value: 'Tuesday' },
            { label: 'Wednesday', value: 'Wednesday' },
            { label: 'Thursday', value: 'Thursday' },
            { label: 'Friday', value: 'Friday' },
            { label: 'Saturday', value: 'Saturday' },
            { label: 'Sunday', value: 'Sunday' },
          ],
        },
        {
          name: 'open',
          type: 'text',
          required: true,
        },
        {
          name: 'close',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'licenseNumber',
      type: 'text',
    },
    {
      name: 'insuranceInfo',
      type: 'text',
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        {
          name: 'google',
          type: 'text',
        },
        {
          name: 'facebook',
          type: 'text',
        },
        {
          name: 'instagram',
          type: 'text',
        },
      ],
    },
    {
      type: 'group',
      label: 'Visibility Controls',
      admin: {
        description: 'Toggle visibility of site sections. Changes take effect on next site build.',
      },
      fields: [
        {
          name: 'showReviews',
          type: 'checkbox',
          label: 'Show Reviews',
          defaultValue: false,
          admin: {
            description: 'Show "What Homeowners Say" sections site-wide',
          },
        },
        {
          name: 'showGallery',
          type: 'checkbox',
          label: 'Show Gallery',
          defaultValue: false,
          admin: {
            description: 'Show Gallery page and navigation links',
          },
        },
      ],
    },
    {
      name: 'riskReversals',
      type: 'array',
      fields: [
        {
          name: 'statement',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'serviceAreaZipCodes',
      type: 'textarea',
      admin: {
        description: 'Newline-separated list of valid zip codes in the service area.',
      },
    },
  ],
}
