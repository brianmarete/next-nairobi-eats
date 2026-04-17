import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ReviewGridCard } from "@/components/ReviewGridCard"
import { resolveMediaUrl } from "@/lib/media"

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })
  
  const categoryResult = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const category = categoryResult.docs[0]

  if (!category) {
    notFound()
  }

  const reviews = await payload.find({
    collection: 'reviews',
    where: {
      category: {
        equals: category.id,
      },
    },
    depth: 1,
  })

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[40vh] bg-black flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-5xl font-light tracking-wide font-sans text-gray-200 mb-4">{category.name}</h1>
        {category.description && (
             <p className="max-w-2xl text-lg font-light text-gray-300">{category.description}</p>
        )}
      </section>

      {/* Reviews Grid */}
      <section className="py-16 px-6 container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.docs.map((review: any) => (
            <div key={review.id} className="h-full">
               <ReviewGridCard
                title={review.title}
                description={review.description}
                image={resolveMediaUrl(review.coverImage)}
                slug={review.slug}
              />
            </div>
          ))}
          {reviews.docs.length === 0 && (
               <div className="col-span-full text-center text-gray-500 py-12">
                  No reviews found in this category.
              </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
