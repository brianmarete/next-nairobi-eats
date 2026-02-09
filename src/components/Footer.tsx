import { Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white py-6 px-6 md:px-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 font-sans tracking-wide">
        <div className="flex items-center gap-4">
          <p>&copy; Nairobi Eats {new Date().getFullYear()}</p>
        </div>
        
        <div className="flex space-x-4 mt-4 md:mt-0">
           <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <Twitter className="w-3 h-3" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <Instagram className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
