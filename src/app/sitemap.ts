import type { MetadataRoute } from "next"
import { getPayload } from "payload"
import config from "@payload-config"
import { getAbsoluteUrl } from "@/lib/seo"

type SlugDoc = {
  slug?: string
  updatedAt?: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const [reviews, categories] = await Promise.all([
    payload.find({
      collection: "reviews",
      limit: 1000,
      depth: 0,
      sort: "-updatedAt",
    }),
    payload.find({
      collection: "categories",
      limit: 1000,
      depth: 0,
      sort: "-updatedAt",
    }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: getAbsoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: getAbsoluteUrl("/reviews"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: getAbsoluteUrl("/categories"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  const reviewPages: MetadataRoute.Sitemap = (reviews.docs as SlugDoc[])
    .filter((review) => Boolean(review.slug))
    .map((review) => ({
      url: getAbsoluteUrl(`/reviews/${review.slug}`),
      lastModified: review.updatedAt ? new Date(review.updatedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }))

  const categoryPages: MetadataRoute.Sitemap = (categories.docs as SlugDoc[])
    .filter((category) => Boolean(category.slug))
    .map((category) => ({
      url: getAbsoluteUrl(`/categories/${category.slug}`),
      lastModified: category.updatedAt ? new Date(category.updatedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    }))

  return [...staticPages, ...reviewPages, ...categoryPages]
}
