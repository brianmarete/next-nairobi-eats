import { getPayload } from 'payload'
import config from '@payload-config'
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReviewCard } from "@/components/ReviewCard";
import { Utensils } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media";

export default async function Home() {
  const payload = await getPayload({ config })
  const reviewsData = await payload.find({
    collection: 'reviews',
    limit: 3,
    sort: '-publishedDate', // Assuming we want the latest
    depth: 1,
  })

  const reviews = reviewsData.docs.map((review: any) => ({
    title: review.title,
    description: review.description,
    image: resolveMediaUrl(review.coverImage),
    slug: review.slug
  }));

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8F9FA]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1626084795995-1262d5b62b08?q=80&w=2072&auto=format&fit=crop"
            alt="Nairobi Skyline"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-8xl font-serif italic mb-2 tracking-tighter">Nairobi</h1>
            <div className="flex items-center justify-center gap-2 md:gap-4">
              <div className="h-[2px] w-12 md:w-24 bg-white rounded-full"></div>
              <span className="text-3xl md:text-5xl font-bold tracking-widest uppercase">EATS</span>
              <Utensils className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-16 md:py-24 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed">
            Welcome to Nairobi Eats, your one-stop shop for restaurant reviews within Nairobi and beyond!
          </p>
        </div>
      </section>

      {/* Featured Reviews */}
      <section className="pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-12 text-gray-900 border-l-4 border-black pl-4">
            Featured Reviews
          </h2>
          
          <div className="flex flex-col">
            {reviews.map((review, index) => (
              <ReviewCard
                key={index}
                title={review.title}
                description={review.description}
                image={review.image}
                slug={review.slug}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/reviews" className="inline-block px-6 py-3 bg-gray-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors rounded-sm">
              All Reviews
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
