import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  access: {
    read: () => true,
  },
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 200,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'card',
        width: 600,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1200,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'full',
        width: 2400,
        height: undefined,
        position: 'centre',
      },
    ],
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'application/pdf',
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
