import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const LeadMagnets: CollectionConfig = {
  slug: 'lead-magnets',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
    description: 'Gated educational resources (e.g., "Utah ADU Compliance Checklist").',
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
      name: 'description',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: { description: 'What the resource covers' },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Downloadable file (PDF)' },
    },
    {
      name: 'thumbnailImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Preview image for CTA' },
    },
    {
      type: 'group',
      name: 'landingPage',
      label: 'Landing Page Content',
      admin: {
        description: 'Content displayed on the dedicated guide landing page at /guides/[slug]',
      },
      fields: [
        {
          name: 'coverImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Front cover image of the PDF guide for the landing page' },
        },
        {
          name: 'benefits',
          type: 'richText',
          editor: lexicalEditor({}),
          admin: { description: 'Benefits/highlights shown on the landing page' },
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      required: true,
      defaultValue: 'Download Free Guide',
    },
    {
      name: 'requiredFields',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Name', value: 'name' },
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone' },
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
