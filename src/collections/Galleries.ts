import type { CollectionConfig } from 'payload'

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  admin: {
    useAsTitle: 'key',
  },
  fields: [
    {
      name: 'key', // To match legacy "3dee" keys
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
        }
      ]
    }
  ]
}
