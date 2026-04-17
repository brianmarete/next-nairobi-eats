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
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
