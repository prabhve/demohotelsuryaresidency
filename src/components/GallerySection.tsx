import React, { useState } from 'react';
import { Sparkles, Eye, X, ChevronLeft, ChevronRight, Video } from 'lucide-react';
import { GalleryItem } from '../types/hotel';
import { initialGalleryItems } from '../data/hotelData';

interface GallerySectionProps {
  items?: GalleryItem[];
  currentLang?: 'en' | 'hi';
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  items = initialGalleryItems,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const galleryList = items && items.length > 0 ? items : initialGalleryItems;

  const filteredItems =
    activeCategory === 'all'
      ? galleryList
      : galleryList.filter((i) => i.category === activeCategory);

  const handleNext = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex(
        (activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length
      );
    }
  };

  return (
    <section id="gallery" className="py-20 bg-stone-900/40 border-t border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>A VISUAL TOUR & MEDIA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-100 tracking-tight">
            Immerse in the Surya Experience
          </h2>
          <p className="mt-3 text-stone-400 text-sm sm:text-base leading-relaxed">
            Take a virtual tour through our guest rooms, fine-dining restaurant, and grand celebration halls in Singrauli.
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Media' },
              { id: 'rooms', label: 'Rooms & Suites' },
              { id: 'dining', label: 'Surya Rasoi' },
              { id: 'banquet', label: 'Banquets & Meetings' },
              { id: 'exterior', label: 'Lobby & Facade' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                    : 'bg-stone-950 text-stone-400 border border-stone-800 hover:border-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxIndex(index)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-stone-800 hover:border-amber-500/50 shadow-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>

              {item.mediaType === 'video' && (
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                  <Video className="w-3 h-3" />
                  <span>Video</span>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  {item.category}
                </span>
                <h4 className="font-serif-luxury font-bold text-sm text-stone-100 mt-0.5 line-clamp-1 group-hover:text-amber-300">
                  {item.title}
                </h4>
                <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{item.subtitle}</p>
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-950/80 backdrop-blur-md flex items-center justify-center text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4 text-amber-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-stone-900/80 text-stone-300 hover:text-white border border-stone-700 z-10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 rounded-full bg-stone-900/80 text-stone-300 hover:text-white border border-stone-700 z-10 hidden sm:block cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 p-3 rounded-full bg-stone-900/80 text-stone-300 hover:text-white border border-stone-700 z-10 hidden sm:block cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            {filteredItems[activeLightboxIndex].mediaType === 'video' &&
            filteredItems[activeLightboxIndex].videoUrl ? (
              <div className="w-full max-w-2xl aspect-video rounded-2xl overflow-hidden border border-stone-800 shadow-2xl">
                <iframe
                  src={filteredItems[activeLightboxIndex].videoUrl}
                  title={filteredItems[activeLightboxIndex].title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <img
                src={filteredItems[activeLightboxIndex].image}
                alt={filteredItems[activeLightboxIndex].title}
                className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain border border-stone-800 shadow-2xl"
              />
            )}
            <div className="text-center mt-4">
              <h4 className="font-serif-luxury font-bold text-lg text-stone-100">
                {filteredItems[activeLightboxIndex].title}
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                {filteredItems[activeLightboxIndex].subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
