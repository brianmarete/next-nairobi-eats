import Link from 'next/link';
import { Search, Twitter, Instagram } from 'lucide-react';

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 md:px-12 py-6 text-white">
      <Link href="/" className="text-sm font-bold tracking-widest hover:opacity-80 transition-opacity">
        #NairobiEats
      </Link>
      
      <nav className="hidden md:flex items-center space-x-8 text-xs font-medium tracking-widest uppercase">
        <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
        <Link href="/reviews" className="hover:text-gray-300 transition-colors">Reviews</Link>
        <Link href="/travel-eats" className="hover:text-gray-300 transition-colors">#TravelEats</Link>
      </nav>
      
      <div className="flex items-center space-x-5">
        <Link href="/search" className="hover:text-gray-300 transition-colors" aria-label="Search reviews">
          <Search className="w-4 h-4" />
        </Link>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
          <Twitter className="w-4 h-4" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
          <Instagram className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
