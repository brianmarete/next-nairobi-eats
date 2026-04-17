import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
  hooks: {
    beforeChange: [
      // TODO: Implement Sharp compression here
      // async ({ req, data }) => {
      //   if (req.file) {
      //      // compress req.file.data
      //   }
      // }
    ],
  },
}
