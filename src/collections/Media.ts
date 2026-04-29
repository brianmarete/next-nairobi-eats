import type { CollectionConfig } from 'payload'
import sharp from 'sharp'

const ONE_MB = 1024 * 1024

const getIntEnv = (name: string, fallback: number, min: number, max: number): number => {
  const rawValue = process.env[name]
  if (!rawValue) return fallback

  const parsedValue = Number.parseInt(rawValue, 10)
  if (Number.isNaN(parsedValue)) return fallback

  return Math.min(max, Math.max(min, parsedValue))
}

const MAX_DIMENSION = getIntEnv('IMAGE_MAX_DIMENSION', 2560, 640, 8192)
const AVIF_QUALITY = getIntEnv('IMAGE_AVIF_QUALITY', 55, 30, 90)
const AVIF_EFFORT = getIntEnv('IMAGE_AVIF_EFFORT', 4, 0, 9)
const JPEG_QUALITY = getIntEnv('IMAGE_JPEG_QUALITY', 78, 40, 95)
const PNG_COMPRESSION_LEVEL = getIntEnv('IMAGE_PNG_COMPRESSION_LEVEL', 9, 0, 9)
const LARGE_ASSET_THRESHOLD_BYTES = getIntEnv(
  'IMAGE_LARGE_ASSET_THRESHOLD_BYTES',
  ONE_MB,
  250000,
  25000000,
)

const inferMimeType = (format: string): string => {
  switch (format) {
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'avif':
      return 'image/avif'
    default:
      return 'image/jpeg'
  }
}

const inferExtension = (format: string): string => {
  switch (format) {
    case 'jpeg':
      return '.jpg'
    case 'png':
      return '.png'
    case 'webp':
      return '.webp'
    case 'avif':
      return '.avif'
    default:
      return '.jpg'
  }
}

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
      async ({ req, data }) => {
        const uploadedFile = req.file as
          | {
              data?: Buffer
              mimetype?: string
              name?: string
              size?: number
            }
          | undefined

        if (!uploadedFile?.data || !uploadedFile.mimetype?.startsWith('image/')) {
          return data
        }

        const sourceBuffer = uploadedFile.data
        const sourceMetadata = await sharp(sourceBuffer).metadata()
        const width = sourceMetadata.width ?? null
        const height = sourceMetadata.height ?? null

        const shouldResize = Boolean(
          (width && width > MAX_DIMENSION) || (height && height > MAX_DIMENSION),
        )

        const baseSharp = sharp(sourceBuffer).rotate()
        const resizedSharp = shouldResize
          ? baseSharp.resize(MAX_DIMENSION, MAX_DIMENSION, {
              fit: 'inside',
              withoutEnlargement: true,
            })
          : baseSharp

        const isLargeAsset = sourceBuffer.length > LARGE_ASSET_THRESHOLD_BYTES
        const canUseAvif = sourceMetadata.hasAlpha !== true

        let optimizedBuffer: Buffer
        let outputFormat: 'jpeg' | 'png' | 'webp' | 'avif'

        if (canUseAvif && isLargeAsset) {
          optimizedBuffer = await resizedSharp
            .avif({ quality: AVIF_QUALITY, effort: AVIF_EFFORT })
            .toBuffer()
          outputFormat = 'avif'
        } else if (sourceMetadata.hasAlpha) {
          optimizedBuffer = await resizedSharp
            .png({ compressionLevel: PNG_COMPRESSION_LEVEL, palette: true })
            .toBuffer()
          outputFormat = 'png'
        } else {
          optimizedBuffer = await resizedSharp.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer()
          outputFormat = 'jpeg'
        }

        if (optimizedBuffer.length >= sourceBuffer.length) {
          return data
        }

        const originalName = uploadedFile.name ?? 'image'
        const baseName = originalName.replace(/\.[^.]+$/, '')
        const outputExtension = inferExtension(outputFormat)
        const outputMimeType = inferMimeType(outputFormat)

        uploadedFile.data = optimizedBuffer
        uploadedFile.size = optimizedBuffer.length
        uploadedFile.mimetype = outputMimeType
        uploadedFile.name = `${baseName}${outputExtension}`

        return data
      },
    ],
  },
}
