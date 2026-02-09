import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import Image from "next/image"
import { Star, MapPin, DollarSign, Info, Twitter, Tag } from "lucide-react"

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'reviews',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2, // Ensure categories are populated
  })

  const review = result.docs[0]

  if (!review) {
    notFound()
  }

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

  const getImageUrl = (image: any) => {
    if (!image) return null
    if (typeof image === 'string') return image
    return image.url
  }

  const coverImageUrl = getImageUrl(review.coverImage)
  const heroImageUrl = getImageUrl(review.heroImage) || coverImageUrl

  const renderContent = (content: any) => {
    if (!content?.root?.children) return null;
    return content.root.children.map((node: any, i: number) => {
      if (node.type === 'paragraph') {
         return <p key={i}>{node.children?.map((c: any) => c.text).join('')}</p>
      }
      if (node.type === 'heading') {
         const Tag = node.tag as keyof JSX.IntrinsicElements || 'h2';
         return <Tag key={i} className="font-bold my-4">{node.children?.map((c: any) => c.text).join('')}</Tag>
      }
      return null;
    })
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full flex items-center justify-center text-white overflow-hidden bg-black">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {heroImageUrl && (
            <Image
              src={heroImageUrl}
              alt={review.title}
              fill
              priority
              className="object-cover opacity-80"
            />
          )}
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
                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                  {new Date(review.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* Intro Text / Description */}
            <div className="prose prose-lg text-gray-600 font-light leading-relaxed">
              <p>{review.description}</p>
            </div>

            {/* Content */}
             <div className="prose prose-lg text-gray-600 font-light leading-relaxed space-y-4">
                {renderContent(review.content)}
             </div>

            {/* Gallery */}
            {review.gallery && review.gallery.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mt-8">
                    {review.gallery.map((item: any, i: number) => (
                        <div key={i} className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden">
                            <Image src={getImageUrl(item.image)} alt={item.caption || "Gallery image"} fill className="object-cover" />
                        </div>
                    ))}
                </div>
            )}

            {/* Ratings Section */}
            {review.ratings && (
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
            )}

            {/* Menu Section */}
            {review.menu && review.menu.length > 0 && (
              <div>
                   <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">Menu</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {review.menu.map((item: any, i: number) => (
                           <div key={i} className="relative aspect-[3/4] bg-gray-100 border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity">
                               <Image src={getImageUrl(item.image)} alt="Menu Page" fill className="object-cover" />
                           </div>
                       ))}
                   </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
                
                {/* Info Box */}
                <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b pb-2">Details</h3>
                    
                    <div className="space-y-4 text-sm">
                        {review.details?.priceRange && (
                          <div className="flex items-start gap-3">
                              <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                  <span className="block font-medium text-gray-900">Price Range</span>
                                  <span className="text-gray-500 capitalize">{review.details.priceRange.replace('_', ' ')}</span>
                              </div>
                          </div>
                        )}

                        {review.location?.name && (
                           <div className="flex items-start gap-3">
                              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                  <span className="block font-medium text-gray-900">Location</span>
                                  <span className="text-gray-500">{review.location.name}</span>
                              </div>
                          </div>
                        )}

                        {review.details?.tags && (
                           <div className="flex items-start gap-3">
                              <Info className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                  <span className="block font-medium text-gray-900">Tags</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                      {review.details.tags.map((tagItem: any) => (
                                          <span key={tagItem.tag} className="inline-block px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded-sm">
                                              {tagItem.tag}
                                          </span>
                                      ))}
                                  </div>
                              </div>
                          </div>
                        )}

                        {review.category && review.category.length > 0 && (
                          <div className="flex items-start gap-3">
                              <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                  <span className="block font-medium text-gray-900">Categories</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                      {review.category.map((cat: any) => (
                                          <Link href={`/categories/${cat.slug}`} key={cat.id} className="inline-block px-2 py-0.5 bg-gray-100 text-xs text-blue-600 hover:text-blue-800 hover:underline rounded-sm">
                                              {cat.name}
                                          </Link>
                                      ))}
                                  </div>
                              </div>
                          </div>
                        )}

                    </div>
                </div>

                {/* Map Component */}
                {review.location?.googleMapsUrl && (
                  <div className="bg-gray-100 h-[300px] w-full rounded-sm overflow-hidden relative border border-gray-200">
                      <iframe 
                          src={review.location.googleMapsUrl} 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                          className="grayscale hover:grayscale-0 transition-all duration-500"
                      />
                  </div>
                )}
            
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
