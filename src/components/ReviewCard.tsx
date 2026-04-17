import Image from 'next/image';
import Link from 'next/link';

interface ReviewCardProps {
  title: string;
  description: string;
  image: string | null;
  slug: string;
}

export function ReviewCard({ title, description, image, slug }: ReviewCardProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start py-12 border-b border-gray-100 last:border-0 group">
      <div className="w-full md:w-[400px] shrink-0 aspect-[4/3] relative overflow-hidden bg-gray-100">
         {image ? (
            <Image 
              src={image} 
              alt={title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
         ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                <span className="text-xs uppercase tracking-widest">No Image</span>
            </div>
         )}
      </div>
      <div className="flex-1 space-y-4 pt-2">
        <h3 className="text-xl font-serif font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed font-light">{description}</p>
        <div className="pt-2">
          <Link 
            href={`/reviews/${slug}`} 
            className="inline-block px-5 py-2 bg-gray-100 text-[10px] uppercase tracking-widest text-gray-600 hover:bg-black hover:text-white transition-all duration-300 rounded-sm"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}
