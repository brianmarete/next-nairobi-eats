import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from "next"
import Link from 'next/link'
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { getAbsoluteUrl, getDefaultOgImage } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Categories",
  description: "Explore Nairobi Eats categories to find restaurants by cuisine, vibe, and occasion.",
  alternates: {
    canonical: "/categories",
  },
  openGraph: {
    type: "website",
    url: "/categories",
    title: "Nairobi Eats Categories",
    description: "Explore Nairobi Eats categories to find restaurants by cuisine, vibe, and occasion.",
    images: [getDefaultOgImage()],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nairobi Eats Categories",
    description: "Explore Nairobi Eats categories to find restaurants by cuisine, vibe, and occasion.",
    images: [getDefaultOgImage()],
  },
}

export default async function CategoriesPage() {
  const payload = await getPayload({ config })
  const categories = await payload.find({
    collection: 'categories',
    sort: 'name',
  })

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: getAbsoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: getAbsoluteUrl("/categories"),
      },
    ],
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Review categories",
    itemListElement: categories.docs.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getAbsoluteUrl(`/categories/${category.slug}`),
      name: category.name,
    })),
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <Header />

      {/* Hero Section */}
      <section className="relative h-[40vh] bg-black flex items-center justify-center text-white">
        <h1 className="text-5xl font-light tracking-wide font-sans text-gray-200">Categories</h1>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-6 container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.docs.map((category) => (
            <Link 
              href={`/categories/${category.slug}`} 
              key={category.id}
              className="group block bg-white p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-2xl font-serif font-bold mb-4 group-hover:text-gray-600 transition-colors">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-gray-600 font-light leading-relaxed line-clamp-3">
                  {category.description}
                </p>
              )}
              <div className="mt-6 flex items-center text-sm font-bold uppercase tracking-widest text-gray-900 group-hover:underline decoration-1 underline-offset-4">
                View Reviews
              </div>
            </Link>
          ))}
          {categories.docs.length === 0 && (
              <div className="col-span-full text-center text-gray-500">
                  No categories found.
              </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
