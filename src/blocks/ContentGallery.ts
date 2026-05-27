import type { Block } from 'payload'

export const ContentGallery: Block = {
  slug: 'contentGallery',
  labels: {
    singular: 'Content Gallery',
    plural: 'Content Galleries',
  },
  fields: [
    {
      name: 'images',
      type: 'relationship',
      required: true,
      relationTo: 'media',
      hasMany: true,
      minRows: 1,
      maxRows: 4,
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
