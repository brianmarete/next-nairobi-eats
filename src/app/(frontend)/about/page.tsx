import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDefaultOgImage } from "@/lib/seo";

const ABOUT_DESCRIPTION =
  "Meet Diana, the food lover and writer behind Nairobi Eats, sharing restaurant reviews and dining experiences one restaurant at a time.";

export const metadata: Metadata = {
  title: "About",
  description: ABOUT_DESCRIPTION,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    url: "/about",
    title: "About Nairobi Eats",
    description: ABOUT_DESCRIPTION,
    images: [getDefaultOgImage()],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Nairobi Eats",
    description: ABOUT_DESCRIPTION,
    images: [getDefaultOgImage()],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900">
      <Header />

      <section className="relative h-[45vh] min-h-[320px] bg-black flex items-center justify-center overflow-hidden text-white">
        <Image
          src="/images/Nairobi.webp"
          alt="Nairobi skyline"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center px-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-gray-200">
            Nairobi Eats
          </p>
          <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight">
            About
          </h1>
        </div>
      </section>

      <main className="px-6 py-16 md:py-24">
        <article className="mx-auto max-w-3xl bg-white px-6 py-10 md:px-12 md:py-14 shadow-sm">
          <div className="space-y-6 text-base md:text-lg leading-8 text-gray-700">
            <p className="text-2xl md:text-3xl font-serif italic text-gray-950">
              Hey there!
            </p>

            <p>
              My name is Diana and I&apos;m a self-professed food lover. I&apos;m
              also a writer who spends her time working diligently from 9-5 but
              deep down all I want to do is eat... and I particularly always want
              to eat good food. The culinary world is a wonderful place that
              takes you on a journey of sights, sounds, smells and of course
              tastes. What&apos;s my taste you may ask? Delicious. Delectable.
              Delightful. Three words that demonstrate what I look for in the
              food served, the service given and the ambience provided when I
              visit any food establishment.
            </p>

            <p>
              Through this blog, I&apos;m excited to share my thoughts and
              experiences exploring the food world one restaurant at a time, one
              city at a time. I hope these reviews bring you one step closer to
              choosing the perfect date spot, that cool brunch spot and the best
              happy hour in town... Thank you so much for visiting, reading and
              sharing.
            </p>

            <p className="text-xl md:text-2xl font-serif italic text-gray-950">
              Happy Eating!
            </p>
          </div>

          <p className="mt-12 border-t border-gray-200 pt-6 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
            Feature Image courtesy of Peter Ndungu
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
