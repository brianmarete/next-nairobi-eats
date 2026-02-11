import { getPayload } from 'payload'
import config from '@payload-config'
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReviewGridCard } from "@/components/ReviewGridCard";

export default async function ReviewsPage() {
  const payload = await getPayload({ config })
  const reviewsData = await payload.find({
    collection: 'reviews',
    limit: 12,
    sort: '-publishedDate',
  })

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[40vh] bg-black flex items-center justify-center text-white">
          <h1 className="text-5xl font-light tracking-wide font-sans text-gray-200">Reviews</h1>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 px-6 container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewsData.docs.map((review: any, index: number) => (
            <div key={review.id || index} className="h-full">
               <ReviewGridCard
                title={review.title}
                description={review.description}
                image={typeof review.coverImage === 'object' ? review.coverImage?.url : review.coverImage}
                slug={review.slug}
              />
            </div>
          ))}
          {reviewsData.docs.length === 0 && (
             <div className="col-span-full text-center text-gray-500 py-12">
               No reviews found.
             </div>
           )}
        </div>

        {/* Pagination - TODO: Implement real pagination */}
        {/* <div className="flex justify-center mt-16 gap-2">
            <button className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-300 transition-colors">1</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">2</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">3</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">4</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">5</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">&gt;</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">&gt;&gt;</button>
        </div> */}
      </section>

      <Footer />
    </div>
  );
}
