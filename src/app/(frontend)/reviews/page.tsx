import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReviewGridCard } from "@/components/ReviewGridCard";

const MOCK_REVIEWS = [
  {
    title: "Céline and Lolo",
    description: "Are we still saying happy new year? 😂 or counting to Valentine's Day? Whatever the case, it's 2026 and Céline & Lolo is our 1st review of what I believe will be a great foodie year ahead! Céline & Lolo is located on Kabarsiran drive, and it actually used to be a very stunning white mansion before they turned it into an equally stunning boutique hotel. First things first - DO NOT drive here.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?w=800&q=80",
    slug: "celine-and-lolo"
  },
  {
    title: "Top Restaurants 2025",
    description: "So here's a list of my top restaurants of 2025!",
    image: "https://placehold.co/600x400/png?text=Nairobi+Eats", // Placeholder logo
    slug: "top-restaurants-2025"
  },
  {
    title: "Sazón Mexican Kitchen",
    description: "I had the chance to visit the fairly new Mexican spot called Sazón a few weeks back. I had been wanting to try it for a while because it reminds me so much of the US food chain Chipotle which I love so much! Located at Westfield Mall, Sazón is a nice little eatery serving up fresh Mexican dishes, bringing a nice burst of colorful cuisine to the Nairobi food scene.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    slug: "sazon-mexican-kitchen"
  },
  {
    title: "Birdy's Chicken & Chips",
    description: "I had the pleasure of trying out Birdy's Chicken & Chips a while back and I'm here to tell the tale 😋 Birdys is a vibrant chicken and chips shop tucked away in a nice corner of the Parklands area. I love their very bright yellow theme running throughout the restaurant, it really makes it stand out. I came here for lunch with my girlies and we tried a few things from their nice succinct menu: Chili mango cheese burger (KSH400), fried quarter chicken & chips (KSH300), quarter poussin chicken & chips (KSH350), corn ribs (KSH250), an Oreo milkshake (KSH400) and passion and strawberry lemonades (KSH250).",
    image: "https://images.unsplash.com/photo-1562967963-4d56d649ae52?w=800&q=80",
    slug: "birdys-chicken-chips"
  },
  {
    title: "The Pot Belly",
    description: "Today we're talking about the underrated Pot Belly restaurant & bar. I had not heard about this place until a few months ago and I immediately paid a visit when I discovered it along Maundu lane in Westlands. Their decor is quite simple, a little too simple for me. However, I think we know by now that what a place lacks in decor it makes up for it 10x more with the food!",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800",
    slug: "the-pot-belly"
  },
  {
    title: "Bang Bang Thai",
    description: "Bang Bang Thai is a stunning restaurant located at the village market - new wing (do we still call that side new?). It's gives off a very welcoming aura right from the entrance that's adorned with so much foliage you feel like you're entering an enchanted forest 🌳 The decor feels very eclectic and alternative compared to what you'd think a Thai restaurant would typically look like. They have expansive seating in their main area and cozy booths and isolated rooms further in that provide more privacy for groups that don't wanna people watch while dining.",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800",
    slug: "bang-bang-thai"
  }
];

export default function ReviewsPage() {
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
          {MOCK_REVIEWS.map((review, index) => (
            <div key={index} className="h-full">
               <ReviewGridCard
                title={review.title}
                description={review.description}
                image={review.image}
                slug={review.slug}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-16 gap-2">
            <button className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-300 transition-colors">1</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">2</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">3</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">4</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">5</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">&gt;</button>
            <button className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">&gt;&gt;</button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
