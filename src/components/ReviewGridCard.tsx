import Image from 'next/image';
import Link from 'next/link';

interface ReviewGridCardProps {
  title: string;
  description: string;
  image: string;
  slug: string;
}

export function ReviewGridCard({ title, description, image, slug }: ReviewGridCardProps) {
  return (
    <Link href={`/reviews/${slug}`} className="group bg-white block h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
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
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-3 font-sans">{title}</h3>
        <p className="text-gray-600 text-xs leading-relaxed font-light line-clamp-6">{description}</p>
      </div>
    </Link>
  );
}
