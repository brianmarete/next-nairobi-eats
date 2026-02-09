import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReviewCard } from "@/components/ReviewCard";
import { Utensils } from "lucide-react";

export default function Home() {
  const reviews = [
    {
      title: "Céline and Lolo",
      description: "Are we still saying happy new year? 😂 or counting to Valentine's Day? Whatever the case, it's 2026 and Céline & Lolo is our 1st review of what I believe will be a great foodie year ahead! Céline & Lolo is located on Kabarsiran drive, and it actually used to be a very stunning white mansion before they turned it into an equally stunning boutique hotel. First things first - DO NOT drive here.",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?w=800&q=80",
      slug: "celine-and-lolo"
    },
    {
      title: "Biscotti Cafe",
      description: "If you've seen the video of the cheesecake with syrup being poured all over it then you know about Biscotti Cafe. Located in the Westlands Eatery Strip Mall, Biscotti Cafe is a cute little cafe that is very inviting from aesthetics alone. With a light airy colour scheme of whites, pinks and light greys, entering Biscotti feels like stepping into a cloud.",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
      slug: "biscotti-cafe"
    },
    {
      title: "Cuban Code",
      description: "A new joint that's giving Instagram girlies a run for their money is Cuban Code, a restaurant + cigar lounge located on Muthangari Road. I really have to say though for a restaurant this fancy, why don't they have signage on the road? I really thought Google maps had failed me because it leads you to this big office block called African Guarantee Fund - a building that looks VERY closed on weekends.",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
      slug: "cuban-code"
    }
  ];

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
            <h3 className="text-xl font-bold mb-8">More</h3>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-8">
              <a href="#" className="hover:text-black">Birdy's Chicken & Chips</a>
              <a href="#" className="hover:text-black">The Pot Rally</a>
              <a href="#" className="hover:text-black">Bang Bang Thai</a>
              <a href="#" className="hover:text-black">Cafe Concerto</a>
            </div>
            <button className="px-6 py-3 bg-gray-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors rounded-sm">
              All Reviews
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
