import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { Star, MapPin, DollarSign, Calendar, Info, Twitter } from "lucide-react";

// Mock data to simulate CMS content
const MOCK_REVIEW = {
  title: "The Pot Belly",
  date: "December 3, 2024",
  coverImage: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop",
  heroImage: null, // Optional override
  content: [
    "Located along the quiet Thigiri Ridge road, The Pot Belly is a charming spot that feels confusingly cozy. I say confusingly because the decor is a mix of rustic, industrial and modern.",
    "The menu is extensive, featuring a mix of Indian and Continental cuisines. We started with the Chicken Tikka, which was succulent and well-spiced, served with a mint chutney that had the perfect kick.",
    "For the mains, we tried the Mutton Rogan Josh and the Butter Chicken. Both were creamy and rich, paired perfectly with the garlic naan. The portion sizes are generous, making it great for sharing.",
    "I must mention the outdoor seating area - it's surrounded by greenery and feels like an escape from the city. Perfect for a Sunday brunch or a lazy afternoon.",
    "The service was attentive without being intrusive. Our waiter knew the menu well and made great recommendations."
  ],
  ratings: {
    food: 4.5,
    service: 4.0,
    ambience: 4.5
  },
  details: {
    priceRange: "expensive", // cheap, moderate, expensive, very_expensive
    locationName: "Thigiri Ridge, New Muthaiga",
    tags: ["Bar", "Late Night", "Views", "Outdoor Seating"],
    googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.36435839088!2d36.799729!3d-1.267814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c3a1e0b5f%3A0x546456456456!2sWestlands!5e0!3m2!1sen!2ske!4v1625645645645!5m2!1sen!2ske"
  },
  gallery: [
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070",
    "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2070",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2157"
  ],
  menuImages: [
      "https://images.unsplash.com/photo-1541544744-5e3a01994119?q=80&w=1000",
      "https://images.unsplash.com/photo-1541544744-5e3a01994119?q=80&w=1000"
  ],
  relatedReviews: [
      {
          title: "Céline and Lolo",
          image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?w=800&q=80",
          slug: "celine-and-lolo"
      },
      {
          title: "Biscotti Cafe",
          image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
          slug: "biscotti-cafe"
      },
      {
          title: "Cuban Code",
          image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
          slug: "cuban-code"
      }
  ]
};

export default function ReviewPage() {
  const review = MOCK_REVIEW;

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= rating ? "fill-current" : "text-gray-300"}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full flex items-center justify-center text-white overflow-hidden bg-black">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={review.heroImage || review.coverImage}
            alt={review.title}
            fill
            priority
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Title in Hero */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-light tracking-wide">{review.title}</h1>
        </div>
      </div>

      <main className="container mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Review Header Info */}
            <div className="mb-8 border-b border-gray-100 pb-8">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-6 block">Reviews</span>
                
                <div className="mb-6">
                   <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#1DA1F2] hover:text-white transition-colors cursor-pointer">
                        <Twitter className="w-4 h-4 fill-current" />
                   </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-900 leading-tight">{review.title}</h1>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">{review.date}</p>
            </div>

            {/* Intro Text */}
            <div className="prose prose-lg text-gray-600 font-light leading-relaxed">
              <p>{review.content[0]}</p>
            </div>

            {/* Gallery Grid 1 */}
            <div className="grid grid-cols-2 gap-2 md:gap-4">
                {review.gallery.slice(0, 2).map((img, i) => (
                    <div key={i} className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden">
                        <Image src={img} alt="Gallery" fill className="object-cover" />
                    </div>
                ))}
            </div>

            {/* More Text */}
            <div className="prose prose-lg text-gray-600 font-light leading-relaxed">
               <p>{review.content[1]}</p>
               <p>{review.content[2]}</p>
            </div>
             
             {/* Gallery Grid 2 (3 images) */}
            <div className="grid grid-cols-3 gap-2 md:gap-4">
                {review.gallery.slice(0, 3).map((img, i) => (
                    <div key={i} className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden">
                        <Image src={img} alt="Gallery" fill className="object-cover" />
                    </div>
                ))}
            </div>

            {/* More Text */}
            <div className="prose prose-lg text-gray-600 font-light leading-relaxed">
               <p>{review.content[3]}</p>
               <p>{review.content[4]}</p>
            </div>

            {/* Ratings Section */}
            <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm my-8">
              <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">Ratings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Food</span>
                  <div className="flex items-center gap-2">
                    {renderStars(review.ratings.food)}
                    <span className="text-sm text-gray-400 w-8">{review.ratings.food}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Service</span>
                  <div className="flex items-center gap-2">
                    {renderStars(review.ratings.service)}
                    <span className="text-sm text-gray-400 w-8">{review.ratings.service}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Ambience</span>
                  <div className="flex items-center gap-2">
                    {renderStars(review.ratings.ambience)}
                    <span className="text-sm text-gray-400 w-8">{review.ratings.ambience}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Section */}
            <div>
                 <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">Menu</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {review.menuImages.map((img, i) => (
                         <div key={i} className="relative aspect-[3/4] bg-gray-100 border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity">
                             <Image src={img} alt="Menu Page" fill className="object-cover" />
                         </div>
                     ))}
                 </div>
            </div>

             {/* Related Reviews */}
             <div className="pt-12 border-t border-gray-200 mt-12">
                 <h3 className="text-lg font-bold mb-8 uppercase tracking-wider">Related Reviews</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {review.relatedReviews.map((rel, i) => (
                         <a key={i} href={`/reviews/${rel.slug}`} className="group block">
                             <div className="relative aspect-video bg-gray-100 mb-3 overflow-hidden">
                                 <Image 
                                    src={rel.image} 
                                    alt={rel.title} 
                                    fill 
                                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                                 />
                             </div>
                             <h4 className="font-serif font-bold text-lg group-hover:underline decoration-1 underline-offset-4">{rel.title}</h4>
                         </a>
                     ))}
                 </div>
             </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
                
                {/* Info Box */}
                <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b pb-2">Details</h3>
                    
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                            <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <span className="block font-medium text-gray-900">Price Range</span>
                                <span className="text-gray-500 capitalize">{review.details.priceRange.replace('_', ' ')}</span>
                            </div>
                        </div>

                         <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <span className="block font-medium text-gray-900">Location</span>
                                <span className="text-gray-500">{review.details.locationName}</span>
                            </div>
                        </div>

                         <div className="flex items-start gap-3">
                            <Info className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <span className="block font-medium text-gray-900">Tags</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {review.details.tags.map(tag => (
                                        <span key={tag} className="inline-block px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Component */}
                <div className="bg-gray-100 h-[300px] w-full rounded-sm overflow-hidden relative border border-gray-200">
                    <iframe 
                        src={review.details.googleMapsUrl} 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        className="grayscale hover:grayscale-0 transition-all duration-500"
                    />
                </div>
            
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
