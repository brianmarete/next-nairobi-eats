type MediaLike =
  | string
  | number
  | {
      url?: string | null
      filename?: string | null
      sizes?: Record<string, { url?: string | null } | undefined>
    }
  | null
  | undefined

type MediaVariant = 'thumbnail' | 'card' | 'hero' | 'gallery' | 'full'

const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, '') || ''

const imageVariants: Record<MediaVariant, { quality: number; width: number }> = {
  thumbnail: { width: 400, quality: 75 },
  card: { width: 800, quality: 78 },
  gallery: { width: 1000, quality: 78 },
  hero: { width: 1600, quality: 80 },
  full: { width: 1920, quality: 82 },
}

const buildMediaBaseUrl = (path: string): string => {
  if (!MEDIA_BASE_URL) return path

  try {
    return new URL(path).toString()
  } catch {
    return `${MEDIA_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  }
}

const normalizeMediaUrl = (url: string): string => {
  if (!MEDIA_BASE_URL) return url

  try {
    const mediaBaseUrl = new URL(MEDIA_BASE_URL)
    const sourceUrl = new URL(url)

    return `${mediaBaseUrl.origin}${sourceUrl.pathname}${sourceUrl.search}`
  } catch {
    return buildMediaBaseUrl(url)
  }
}

const transformMediaUrl = (url: string, variant?: MediaVariant): string => {
  const normalizedUrl = normalizeMediaUrl(url)

  if (!variant || !MEDIA_BASE_URL) return normalizedUrl

  try {
    const sourceUrl = new URL(normalizedUrl)
    const mediaBaseUrl = new URL(MEDIA_BASE_URL)

    if (sourceUrl.origin !== mediaBaseUrl.origin) {
      return normalizedUrl
    }

    const { quality, width } = imageVariants[variant]
    const options = [`width=${width}`, `quality=${quality}`, 'format=auto'].join(',')

    return `${sourceUrl.origin}/cdn-cgi/image/${options}${sourceUrl.pathname}${sourceUrl.search}`
  } catch {
    return normalizedUrl
  }
}

export const resolveMediaUrl = (media: MediaLike, variant?: MediaVariant): string | null => {
  if (!media) return null

  if (typeof media === 'string') {
    // Payload relationships may return an ID string when not populated.
    return media.startsWith('/') || media.startsWith('http') ? transformMediaUrl(media, variant) : null
  }

  if (typeof media === 'number') {
    // Payload Postgres relationships may return a numeric ID when not populated.
    return null
  }

  if (media.url) return transformMediaUrl(media.url, variant)

  const thumbnailUrl = media.sizes?.thumbnail?.url
  if (thumbnailUrl) return transformMediaUrl(thumbnailUrl, variant)

  if (media.filename) {
    const fallbackPath = MEDIA_BASE_URL ? media.filename : `/media/${media.filename}`
    return transformMediaUrl(buildMediaBaseUrl(fallbackPath), variant)
  }

  return null
}
