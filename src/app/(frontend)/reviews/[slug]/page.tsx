import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GoogleMapsEmbed } from '@next/third-parties/google'
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import Image from "next/image"
import type { ElementType } from "react"
import { Star, MapPin, DollarSign, Info, Twitter, Tag } from "lucide-react"
import { resolveMediaUrl } from "@/lib/media"
import { InlineGalleryBlock } from "@/components/content/InlineGalleryBlock"

type RichTextNode = {
  type?: string
  tag?: string
  format?: string
  text?: string
  relationTo?: string
  value?: unknown
  fields?: {
    blockType?: string
    caption?: string
    images?: Array<{
      image?: unknown
      alt?: string
    }>
  }
  children?: RichTextNode[]
}

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function ReviewPage({ params }: Props) {
  const MAP_DEFAULT_ZOOM = '17'
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
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

  const coverImageUrl = resolveMediaUrl(review.coverImage)
  const heroImageUrl = resolveMediaUrl(review.heroImage) || coverImageUrl

  const mapQuery = review.location?.placeId
    ? `place_id:${review.location.placeId}`
    : review.location?.name || null
  const mapsOpenUrl =
    review.location?.placeId
      ? `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(review.location.placeId)}`
      : review.location?.name
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(review.location.name)}`
        : null

  const extractText = (children?: RichTextNode[]): string => {
    if (!children?.length) return ''
    return children
      .map((child) => {
        if (typeof child.text === 'string') return child.text
        if (child.children?.length) return extractText(child.children)
        return ''
      })
      .join('')
  }

  const getUploadNodeMedia = (node: RichTextNode): unknown => {
    const value = node.value
    if (value && typeof value === 'object') {
      const uploadValue = value as { value?: unknown; url?: string; filename?: string }
      if (uploadValue.value) return uploadValue.value
      if (uploadValue.url || uploadValue.filename) return uploadValue
    }

    return value
  }

  const renderContent = (content: { root?: { children?: RichTextNode[] } } | null | undefined) => {
    if (!content?.root?.children) return null

    return content.root.children.map((node, i) => {
      if (node.type === 'paragraph') {
        return <p key={i}>{extractText(node.children)}</p>
      }

      if (node.type === 'heading') {
        const headingTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag ?? '') ? node.tag : 'h2'
        const HeadingTag = headingTag as ElementType
        return (
          <HeadingTag key={i} className="font-bold my-4">
            {extractText(node.children)}
          </HeadingTag>
        )
      }

      if (node.type === 'upload' && node.relationTo === 'media') {
        const media = getUploadNodeMedia(node)
        const imageUrl = resolveMediaUrl(media as Parameters<typeof resolveMediaUrl>[0])
        if (!imageUrl) return null

        return (
          <figure key={i} className="relative my-8 overflow-hidden rounded-sm border border-gray-100 bg-gray-100">
            <Image
              src={imageUrl}
              alt={extractText(node.children) || review.title}
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
            />
          </figure>
        )
      }

      if (node.type === 'block' && node.fields?.blockType === 'contentGallery') {
        const images = (node.fields.images ?? [])
          .map((galleryItem) => {
            const imageUrl = resolveMediaUrl(galleryItem.image as Parameters<typeof resolveMediaUrl>[0])
            if (!imageUrl) return null
            return {
              url: imageUrl,
              alt: galleryItem.alt || review.title,
            }
          })
          .filter((item): item is { url: string; alt: string } => Boolean(item))

        if (!images.length) return null

        return <InlineGalleryBlock key={i} images={images} caption={node.fields.caption} />
      }

      return null
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
                            {(() => {
                              const imageUrl = resolveMediaUrl(item.image)
                              if (!imageUrl) return null
                              return (
                                <Image
                                  src={imageUrl}
                                  alt={item.caption || "Gallery image"}
                                  fill
                                  className="object-cover"
                                />
                              )
                            })()}
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
                               {(() => {
                                 const imageUrl = resolveMediaUrl(item.image)
                                 if (!imageUrl) return null
                                 return (
                                   <Image
                                     src={imageUrl}
                                     alt="Menu Page"
                                     fill
                                     className="object-cover"
                                   />
                                 )
                               })()}
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
                {mapQuery && googleMapsApiKey && (
                  <div className="bg-gray-100 h-[300px] w-full rounded-sm overflow-hidden relative border border-gray-200">
                    <GoogleMapsEmbed
                      apiKey={googleMapsApiKey}
                      height={300}
                      width="100%"
                      mode="place"
                      q={mapQuery}
                      zoom={MAP_DEFAULT_ZOOM}
                    />
                  </div>
                )}
                {mapsOpenUrl && (
                  <Link
                    href={mapsOpenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Open map in Google Maps
                  </Link>
                )}

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
