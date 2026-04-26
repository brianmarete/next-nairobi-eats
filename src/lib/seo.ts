const SITE_NAME = "Nairobi Eats"

const FALLBACK_SITE_URL = "http://localhost:3000"

export const getSiteUrl = (): string => {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")

  if (!configuredUrl) return FALLBACK_SITE_URL

  return configuredUrl.startsWith("http") ? configuredUrl : `https://${configuredUrl}`
}

export const getMetadataBase = (): URL => new URL(getSiteUrl())

export const getAbsoluteUrl = (path: string): string => {
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  return new URL(path.startsWith("/") ? path : `/${path}`, getSiteUrl()).toString()
}

export const getDefaultOgImage = (): string =>
  "https://images.unsplash.com/photo-1626084795995-1262d5b62b08?q=80&w=2072&auto=format&fit=crop"

export const buildTitle = (title: string): string => `${title} | ${SITE_NAME}`

export { SITE_NAME }
