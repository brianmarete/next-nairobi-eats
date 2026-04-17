import type { CollectionConfig } from 'payload'
import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'
import { ContentGallery } from '@/blocks/ContentGallery'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: {
        date: {
            pickerAppearance: 'dayOnly',
            displayFormat: 'd MMM yyyy',
        }
      }
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Image (Optional - overrides Cover Image on review page)',
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Location Name',
        },
        {
          name: 'placeId',
          type: 'text',
          label: 'Restaurant Location',
          admin: {
            components: {
              Field: '@/fields/LocationPicker#LocationPickerField',
            },
            description: 'Search for a place and save its Google place_id.',
          },
        },
      ]
    },
    {
        name: 'details',
        type: 'group',
        fields: [
            {
                name: 'priceRange',
                type: 'select',
                options: [
                    { label: '$ (Cheap)', value: 'cheap' },
                    { label: '$$ (Moderate)', value: 'moderate' },
                    { label: '$$$ (Expensive)', value: 'expensive' },
                    { label: '$$$$ (Very Expensive)', value: 'very_expensive' },
                ]
            },
            {
                name: 'tags',
                type: 'array',
                fields: [
                    {
                        name: 'tag',
                        type: 'text'
                    }
                ]
            }
        ]
    },
    {
        name: 'ratings',
        type: 'group',
        fields: [
            {
                name: 'food',
                type: 'number',
                min: 0,
                max: 5,
                step: 0.5,
            },
            {
                name: 'service',
                type: 'number',
                min: 0,
                max: 5,
                step: 0.5,
            },
            {
                name: 'ambience',
                type: 'number',
                min: 0,
                max: 5,
                step: 0.5,
            }
        ]
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [ContentGallery],
          }),
        ],
      }),
    },
    {
        name: 'gallery',
        type: 'array',
        label: 'Photo Gallery',
        fields: [
            {
                name: 'image',
                type: 'upload',
                relationTo: 'media'
            },
            {
                name: 'caption',
                type: 'text'
            }
        ]
    },
    {
        name: 'menu',
        type: 'array',
        label: 'Menu Images',
        fields: [
            {
                name: 'image',
                type: 'upload',
                relationTo: 'media'
            }
        ]
    }
  ],
}
