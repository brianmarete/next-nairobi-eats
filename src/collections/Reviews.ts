import type { CollectionConfig } from 'payload'
import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'
import { ContentGallery } from '@/blocks/ContentGallery'

const extractRichTextText = (value: unknown): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(extractRichTextText).filter(Boolean).join(' ')
  if (typeof value !== 'object') return ''

  const node = value as {
    text?: unknown
    children?: unknown
    root?: unknown
    fields?: unknown
    caption?: unknown
  }

  const chunks: string[] = []
  if (typeof node.text === 'string') chunks.push(node.text)
  if (node.children) chunks.push(extractRichTextText(node.children))
  if (node.root) chunks.push(extractRichTextText(node.root))
  if (node.fields) chunks.push(extractRichTextText(node.fields))
  if (typeof node.caption === 'string') chunks.push(node.caption)

  return chunks.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
}

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data) return data

        const title = typeof data.title === 'string' ? data.title : ''
        const description = typeof data.description === 'string' ? data.description : ''
        const locationName =
          data.location && typeof data.location === 'object' && typeof data.location.name === 'string'
            ? data.location.name
            : ''
        const tags =
          data.details && typeof data.details === 'object' && Array.isArray(data.details.tags)
            ? data.details.tags
                .map((item: unknown) =>
                  item && typeof item === 'object' && typeof (item as { tag?: unknown }).tag === 'string'
                    ? (item as { tag: string }).tag
                    : '',
                )
                .filter(Boolean)
                .join(' ')
            : ''
        const contentText = extractRichTextText(data.content)

        data.searchText = [title, description, locationName, tags, contentText]
          .filter(Boolean)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()

        return data
      },
    ],
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
      name: 'searchText',
      type: 'textarea',
      admin: {
        hidden: true,
      },
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
