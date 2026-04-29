const SITE_NAME = "Nairobi Eats"
const SITE_DESCRIPTION = "Restaurant reviews, food guides, and dining picks from Nairobi and beyond."

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
  getAbsoluteUrl("/opengraph-image")

export { SITE_NAME, SITE_DESCRIPTION }
