import React, { useState } from 'react';
import { Room, HotelSettings } from '../types/hotel';
import { Users, Maximize2, Bed, Check, Sparkles, MessageSquare, ArrowRight, Eye, Tag, X } from 'lucide-react';

interface RoomsSectionProps {
  rooms: Room[];
  settings: HotelSettings;
  onBookRoom: (room: Room) => void;
  currentLang: 'en' | 'hi';
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({
  rooms,
  settings,
  onBookRoom,
  currentLang,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedRoomForPreview, setSelectedRoomForPreview] = useState<Room | null>(null);
  const [previewActiveImg, setPreviewActiveImg] = useState<string>('');

  const filteredRooms = activeCategory === 'all'
    ? rooms
    : rooms.filter((r) => r.category === activeCategory);

  const t = {
    en: {
      subtitle: 'REFINED COMFORT & LUXURY',
      title: 'Our Executive Rooms & Suites',
      desc: 'Each room at Hotel Surya Residency is engineered with modern aesthetics, premium sleep mattresses, high-speed Wi-Fi, and 24/7 dedicated generator power backup for uninterrupted comfort in Singrauli.',
      all: 'All Categories',
      deluxe: 'Executive Deluxe',
      superDeluxe: 'Super Deluxe',
      suite: 'Royal Suite',
      family: 'Family Quad',
      perNight: '/ night + GST',
      saveBadge: 'Direct Booking Special',
      viewGallery: 'View Gallery & Specs',
      bookWhatsApp: 'Book with WhatsApp',
      amenitiesTitle: 'Key Amenities Included',
      roomSize: 'Room Size',
      bedType: 'Bedding',
      maxGuests: 'Max Capacity',
      closeModal: 'Close',
      instantDiscountNotice: 'Apply coupon code SURYA10 during checkout for extra 10% discount',
    },
    hi: {
      subtitle: 'आधुनिक आराम और शाही सुविधाएं',
      title: 'हमारे प्रीमियम कमरे और सुइट्स',
      desc: 'होटल सूर्य रेजीडेंसी का प्रत्येक कमरा आधुनिक साज-सज्जा, आरामदायक गद्दों, हाई-स्पीड वाई-फाई और 24 घंटे जनरेटर पावर बैकअप से सुसज्जित है।',
      all: 'सभी श्रेणियां',
      deluxe: 'एग्जीक्यूटिव डीलक्स',
      superDeluxe: 'सुपर डीलक्स',
      suite: 'रॉयल सुइट',
      family: 'फैमिली सुइट',
      perNight: '/ रात + GST',
      saveBadge: 'सीधी बुकिंग विशेष',
      viewGallery: 'फोटो व विवरण देखें',
      bookWhatsApp: 'व्हाट्सएप से बुक करें',
      amenitiesTitle: 'कमरे की मुख्य सुविधाएं',
      roomSize: 'कमरे का आकार',
      bedType: 'बिस्तर का प्रकार',
      maxGuests: 'अधिकतम क्षमता',
      closeModal: 'बंद करें',
      instantDiscountNotice: 'चेकआउट पर 10% अतिरिक्त छूट के लिए कोड SURYA10 का उपयोग करें',
    },
  }[currentLang];

  const handleOpenPreview = (room: Room) => {
    setSelectedRoomForPreview(room);
    setPreviewActiveImg(room.image);
  };

  return (
    <section id="rooms" className="py-20 bg-stone-900/50 relative border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {t.subtitle}
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-100 tracking-tight">
            {t.title}
          </h2>
          <p className="mt-3 text-stone-400 text-sm sm:text-base leading-relaxed">
            {t.desc}
          </p>

          {/* Category Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: t.all },
              { id: 'deluxe', label: t.deluxe },
              { id: 'super-deluxe', label: t.superDeluxe },
              { id: 'suite', label: t.suite },
              { id: 'family', label: t.family },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/25'
                    : 'bg-stone-950 text-stone-400 border border-stone-800 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="group rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col shadow-xl hover:shadow-2xl hover:shadow-black"
            >
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
                  <span className="px-3 py-1 rounded-full bg-stone-900/85 backdrop-blur-md border border-stone-700 text-amber-300 text-xs font-medium">
                    {room.highlights[0]}
                  </span>
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
                      {t.perNight}
                    </span>
                  </div>
                </div>

                {/* Quick View Button */}
                <button
                  onClick={() => handleOpenPreview(room)}
                  className="absolute bottom-4 left-4 p-2 rounded-lg bg-stone-900/80 backdrop-blur-md border border-stone-700 text-stone-300 hover:text-amber-400 hover:bg-stone-900 transition-colors flex items-center gap-1.5 text-xs font-medium"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Photos & Specs</span>
                </button>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                    {room.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-amber-400/90 font-medium">
                    {room.tagline}
                  </p>
                  <p className="mt-3 text-stone-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {room.description}
                  </p>

                  {/* Specs Pill List */}
                  <div className="mt-4 grid grid-cols-3 gap-2 py-3 border-y border-stone-800 text-xs text-stone-300">
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{room.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-amber-400" />
                      <span className="truncate">{room.bedType}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{room.capacity.adults} Adults</span>
                    </div>
                  </div>

                  {/* Amenities Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {room.amenities.slice(0, 4).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-[11px] text-stone-300"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        {amenity}
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
                <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center gap-3">
                  <button
                    onClick={() => onBookRoom(room)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t.bookWhatsApp}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenPreview(room)}
                    className="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-amber-400 transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Detail & Photo Gallery Modal */}
      {selectedRoomForPreview && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-amber-500/30 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-100">
                  {selectedRoomForPreview.name}
                </h3>
                <p className="text-xs text-amber-400 font-medium">{selectedRoomForPreview.tagline}</p>
              </div>
              <button
                onClick={() => setSelectedRoomForPreview(null)}
                className="p-2 rounded-lg bg-stone-900 text-stone-400 hover:text-stone-100 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Big Gallery Image */}
              <div className="relative rounded-xl overflow-hidden h-64 sm:h-80 border border-stone-800">
                <img
                  src={previewActiveImg || selectedRoomForPreview.image}
                  alt={selectedRoomForPreview.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2">
                {selectedRoomForPreview.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPreviewActiveImg(img)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      previewActiveImg === img ? 'border-amber-500 scale-105' : 'border-stone-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-stone-200 uppercase tracking-wider mb-1">
                  About this Room
                </h4>
                <p className="text-sm text-stone-300 leading-relaxed">
                  {selectedRoomForPreview.description}
                </p>
              </div>

              {/* All Amenities List */}
              <div>
                <h4 className="text-sm font-bold text-stone-200 uppercase tracking-wider mb-2">
                  All Room Amenities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedRoomForPreview.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300"
                    >
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tariff & Discount Callout */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-stone-400 block">Direct Booking Special Tariff</span>
                  <span className="text-2xl font-serif-luxury font-bold text-amber-400">
                    ₹{selectedRoomForPreview.pricePerNight.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-400 ml-1">/ night + 12% GST</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Use code SURYA10 for 10% off</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-900 border-t border-stone-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedRoomForPreview(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold hover:bg-stone-700"
              >
                {t.closeModal}
              </button>
              <button
                onClick={() => {
                  const r = selectedRoomForPreview;
                  setSelectedRoomForPreview(null);
                  onBookRoom(r);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.bookWhatsApp}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
