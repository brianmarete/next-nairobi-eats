type MediaLike =
  | string
  | {
      url?: string | null
      filename?: string | null
      sizes?: Record<string, { url?: string | null } | undefined>
    }
  | null
  | undefined

export const resolveMediaUrl = (media: MediaLike): string | null => {
  if (!media) return null

  if (typeof media === 'string') {
    // Payload relationships may return an ID string when not populated.
    return media.startsWith('/') || media.startsWith('http') ? media : null
  }

  if (media.url) return media.url

  const thumbnailUrl = media.sizes?.thumbnail?.url
  if (thumbnailUrl) return thumbnailUrl

  if (media.filename) return `/media/${media.filename}`

  return null
}
