"use client"

import Image from "next/image"
import { useMemo, useState } from "react"

type GalleryImage = {
  url: string
  alt: string
}

type InlineGalleryBlockProps = {
  images: GalleryImage[]
  caption?: string
}

export function InlineGalleryBlock({ images, caption }: InlineGalleryBlockProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const totalImages = images.length
  const desktopColumnsClass =
    totalImages === 1
      ? "md:grid-cols-1"
      : totalImages === 2
        ? "md:grid-cols-2"
        : totalImages === 3
          ? "md:grid-cols-3"
          : "md:grid-cols-4"

  const activeImage = useMemo(() => {
    if (activeIndex === null) return null
    return images[activeIndex] ?? null
  }, [activeIndex, images])

  if (!totalImages) return null

  const closeLightbox = () => setActiveIndex(null)
  const showPrevious = () => {
    if (activeIndex === null) return
    setActiveIndex((activeIndex - 1 + totalImages) % totalImages)
  }
  const showNext = () => {
    if (activeIndex === null) return
    setActiveIndex((activeIndex + 1) % totalImages)
  }

  return (
    <>
      <figure className="my-8 mx-auto w-full max-w-3xl space-y-3">
        <div className={`mx-auto grid w-fit grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 ${desktopColumnsClass}`}>
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative aspect-[4/3] w-36 overflow-hidden rounded-sm border border-gray-100 bg-gray-100 text-left sm:w-40 md:w-36 lg:w-44"
              aria-label={`Open gallery image ${index + 1} of ${totalImages}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 18vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </button>
          ))}
        </div>
        {caption ? <figcaption className="text-center text-sm italic text-gray-500">{caption}</figcaption> : null}
      </figure>

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded bg-black/50 px-3 py-1 text-sm text-white hover:bg-black/70"
            onClick={closeLightbox}
          >
            Close
          </button>
          {totalImages > 1 ? (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="absolute left-4 rounded bg-black/50 px-3 py-2 text-white hover:bg-black/70"
                aria-label="Previous image"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute right-4 rounded bg-black/50 px-3 py-2 text-white hover:bg-black/70"
                aria-label="Next image"
              >
                Next
              </button>
            </>
          ) : null}
          <div className="relative h-[80vh] w-full max-w-5xl">
            <Image
              src={activeImage.url}
              alt={activeImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
