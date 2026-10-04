import React, { useState } from 'react';
import { Room, HotelSettings } from '../types/hotel';
import { Users, Maximize2, Bed, Check, Sparkles, MessageSquare, ArrowRight, Eye, Tag, X } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface RoomsSectionProps {
  rooms: Room[];
  settings: HotelSettings;
  onBookRoom: (room: Room) => void;
  currentLang?: 'en' | 'hi';
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({
  rooms,
  settings,
  onBookRoom,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedRoomForPreview, setSelectedRoomForPreview] = useState<Room | null>(null);
  const [previewActiveImg, setPreviewActiveImg] = useState<string>('');

  const filteredRooms =
    activeCategory === 'all'
      ? rooms
      : rooms.filter((r) => r.category === activeCategory);

  const handleOpenPreview = (room: Room) => {
    setSelectedRoomForPreview(room);
    setPreviewActiveImg(room.image);
  };

  return (
    <section id="rooms" className="py-20 bg-stone-950 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>REFINED COMFORT & LUXURY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-100 tracking-tight">
              Our Executive Rooms & Suites
            </h2>
            <p className="mt-3 text-stone-400 text-sm sm:text-base leading-relaxed">
              Each room at Hotel Surya Residency is engineered with modern aesthetics, premium sleep mattresses, high-speed Wi-Fi, and 24/7 dedicated generator power backup for uninterrupted comfort in Singrauli.
            </p>

            {/* Category Filter Tabs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'deluxe', label: 'Executive Deluxe' },
                { id: 'super-deluxe', label: 'Super Deluxe' },
                { id: 'suite', label: 'Royal Suite' },
                { id: 'family', label: 'Family Quad' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/25 font-bold'
                      : 'bg-stone-950 text-stone-400 border border-stone-800 hover:border-stone-700 hover:text-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredRooms.map((room, idx) => (
            <ScrollReveal key={room.id} delay={idx * 100} direction="up">
              <div className="group rounded-3xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col shadow-xl hover:shadow-2xl hover:shadow-black">
                {/* Image Container with Badges */}
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30"></div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {room.featured && (
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-xs shadow-md uppercase tracking-wider">
                        ★ Top Choice
                      </span>
                    )}
                    {room.highlights && room.highlights[0] && (
                      <span className="px-3 py-1 rounded-full bg-stone-900/85 backdrop-blur-md border border-stone-700 text-amber-300 text-xs font-medium">
                        {room.highlights[0]}
                      </span>
                    )}
                  </div>

                  {/* Price Pill */}
                  <div className="absolute bottom-4 right-4 text-right">
                    <div className="px-3.5 py-1.5 rounded-xl bg-stone-950/90 backdrop-blur-md border border-amber-500/30">
                      <span className="text-xs text-stone-400 line-through mr-2">
                        ₹{room.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-lg sm:text-xl font-serif-luxury font-bold text-amber-400">
                        ₹{room.pricePerNight.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-stone-400 block font-normal">
                        / night + GST
                      </span>
                    </div>
                  </div>

                  {/* Quick View Button */}
                  <button
                    onClick={() => handleOpenPreview(room)}
                    className="absolute bottom-4 left-4 p-2 rounded-xl bg-stone-900/80 backdrop-blur-md border border-stone-700 text-stone-300 hover:text-amber-400 hover:bg-stone-900 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Photos & Specs</span>
                  </button>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                      {room.name}
                    </h3>
                    <p className="mt-1 text-xs text-amber-400/90 font-medium">
                      {room.tagline}
                    </p>
                    <p className="mt-2.5 text-stone-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {room.description}
                    </p>

                    {/* Specs Pill List */}
                    <div className="mt-4 grid grid-cols-3 gap-2 py-3 border-y border-stone-800 text-xs text-stone-300">
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{room.size}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{room.bedType}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{room.capacity.adults} Adults</span>
                      </div>
                    </div>

                    {/* Amenities Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {room.amenities.slice(0, 4).map((amenity, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-950 border border-stone-800 text-[11px] text-stone-300"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{amenity}</span>
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="text-[11px] text-stone-500 py-1 px-1">
                          +{room.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-stone-800/80 flex items-center gap-3">
                    <button
                      onClick={() => onBookRoom(room)}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 fill-stone-950" />
                      <span>Book Direct (Save 10%)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={`https://wa.me/${settings.whatsappNumber.replace(
                        /[^0-9]/g,
                        ''
                      )}?text=Hello%20Hotel%20Surya%20Residency,%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(
                        room.name
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-600/40 text-emerald-300 transition-colors"
                      title="Inquire on WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Room Photo Gallery & Specs Modal */}
      {selectedRoomForPreview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative my-8 animate-in zoom-in-95">
            <button
              onClick={() => setSelectedRoomForPreview(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-900 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Preview Photo */}
            <div className="h-64 sm:h-80 rounded-2xl overflow-hidden relative">
              <img
                src={previewActiveImg}
                alt={selectedRoomForPreview.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail selector if multiple photos */}
            {selectedRoomForPreview.gallery && selectedRoomForPreview.gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {selectedRoomForPreview.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPreviewActiveImg(img)}
                    className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      previewActiveImg === img
                        ? 'border-amber-500 scale-105'
                        : 'border-stone-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-stone-100">
                    {selectedRoomForPreview.name}
                  </h3>
                  <p className="text-xs text-amber-400 mt-0.5">
                    {selectedRoomForPreview.tagline}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-serif-luxury font-bold text-amber-400">
                    ₹{selectedRoomForPreview.pricePerNight.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-400 block">/ night + GST</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 mt-3 leading-relaxed">
                {selectedRoomForPreview.description}
              </p>

              {/* Full Amenities list */}
              <div className="mt-4 pt-4 border-t border-stone-800">
                <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  All Room Amenities Included
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-stone-300">
                  {selectedRoomForPreview.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setSelectedRoomForPreview(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const room = selectedRoomForPreview;
                  setSelectedRoomForPreview(null);
                  onBookRoom(room);
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-lg"
              >
                Proceed to Book Room
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
