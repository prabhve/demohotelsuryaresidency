import React, { useState } from 'react';
import { Calendar, Users, BedDouble, ArrowRight, ShieldCheck, Zap, Sparkles, MapPin, Star, MessageSquare } from 'lucide-react';
import { HotelSettings, Room } from '../types/hotel';

interface HeroProps {
  settings: HotelSettings;
  rooms: Room[];
  heroContent?: HeroContent;
  onSearchRooms: (searchParams: {
    checkIn: string;
    checkOut: string;
    roomId: string;
    adults: number;
    children: number;
  }) => void;
  onOpenBookingModal: (initialRoomId?: string) => void;
  currentLang: 'en' | 'hi';
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  rooms,
  heroContent,
  onSearchRooms,
  onOpenBookingModal,
  currentLang,
}) => {
  // Tomorrow's date helper
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrowStr);
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || 'deluxe-room');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchRooms({
      checkIn,
      checkOut,
      roomId: selectedRoomId,
      adults,
      children,
    });
  };

  const t = {
    en: {
      badge: '✨ The Preferred Luxury Hotel in Vindhya Nagar, Singrauli',
      headlinePrefix: 'Experience Unmatched Comfort &',
      headlineAccent: 'Royal Warmth',
      headlineSuffix: 'in the Energy Capital',
      subheadline:
        'Located right behind Shivaji Complex in Navjeevan Vihar. Premium AC rooms, 24/7 generator power backup, grand banquet hall, and gourmet dining at Surya Rasoi.',
      checkInLabel: 'Check-In',
      checkOutLabel: 'Check-Out',
      roomTypeLabel: 'Room Category',
      guestsLabel: 'Guests (Adults/Kids)',
      checkRatesBtn: 'Check Rates & Book via WhatsApp',
      instantBookingNote: 'Instant Booking Confirmation • Best Direct Rate Guaranteed • No Booking Fees',
      ntpcTag: '3 mins from NTPC Vindhyachal',
      nclTag: 'Near NCL Headquarter',
      backupTag: '100% 24x7 Power Backup',
      googleReview: '4.2/5 on Google Reviews (450+ Verified Ratings)',
    },
    hi: {
      badge: '✨ विंध्य नगर, सिंगरौली का सबसे पसंदीदा लग्जरी होटल',
      headlinePrefix: 'ऊर्जा राजधानी में अनुभव करें बेमिसाल',
      headlineAccent: 'शाही आतिथ्य',
      headlineSuffix: 'और आधुनिक आराम',
      subheadline:
        'नवजीवन विहार में शिवाजी कॉम्प्लेक्स के ठीक पीछे स्थित। प्रीमियम एसी कमरे, 24 घंटे जनरेटर पावर बैकअप, भव्य बैंक्वेट हॉल और सूर्य रसोई का लजीज खाना।',
      checkInLabel: 'आगमन तिथि (Check-In)',
      checkOutLabel: 'प्रस्थान तिथि (Check-Out)',
      roomTypeLabel: 'कमरे की श्रेणी',
      guestsLabel: 'अतिथि संख्या',
      checkRatesBtn: 'रेट देखें और व्हाट्सएप पर बुक करें',
      instantBookingNote: 'तुरंत व्हाट्सएप कन्फर्मेशन • 10% सीधी बुकिंग छूट • कोई छिपा शुल्क नहीं',
      ntpcTag: 'एनटीपीसी विंध्याचल से 3 मिनट',
      nclTag: 'एनसीएल मुख्यालय के समीप',
      backupTag: '100% 24 घंटे पावर बैकअप',
      googleReview: 'Google पर 4.2/5 रेटिंग (450+ संतुष्ट अतिथि)',
    },
  }[currentLang];

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden bg-stone-950">
      {/* Background with layered luxury overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroContent?.bannerImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85"}
          alt="Hotel Surya Residency Ambiance"
          className="w-full h-full object-cover object-center scale-105 filter brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.15)_0,transparent_70%)]"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 flex-1 flex flex-col justify-center">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.badge}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/80 border border-stone-700 text-stone-300 text-xs">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>
            <span className="font-semibold text-amber-200">4.2</span>
            <span className="text-stone-400">Google Reviews</span>
          </div>
        </div>

        {/* Big Editorial Title */}
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold tracking-tight text-stone-100 leading-[1.15]">
            {t.headlinePrefix}{' '}
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              {t.headlineAccent}
            </span>{' '}
            {t.headlineSuffix}
          </h1>

          <p className="mt-4 sm:mt-6 text-stone-300 text-base sm:text-lg max-w-3xl leading-relaxed font-light">
            {t.subheadline}
          </p>

          {/* Quick Key Highlights Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-300">
            <div className="flex items-center gap-2 bg-stone-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-stone-800">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.backupTag}</span>
            </div>
            <div className="flex items-center gap-2 bg-stone-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-stone-800">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.ntpcTag}</span>
            </div>
            <div className="flex items-center gap-2 bg-stone-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-stone-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.nclTag}</span>
            </div>
          </div>
        </div>

        {/* Quick Booking Search Box */}
        <div className="mt-10 max-w-6xl w-full">
          <form
            onSubmit={handleSearchSubmit}
            className="p-4 sm:p-6 rounded-2xl bg-stone-900/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl shadow-black/80"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Check In Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {t.checkInLabel}
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={todayStr}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-stone-200 text-sm font-medium outline-none transition-colors"
                  required
                />
              </div>

              {/* Check Out Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {t.checkOutLabel}
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || todayStr}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-stone-200 text-sm font-medium outline-none transition-colors"
                  required
                />
              </div>

              {/* Room Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-400 flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5 text-amber-400" />
                  {t.roomTypeLabel}
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-stone-200 text-sm font-medium outline-none transition-colors"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} (₹{room.pricePerNight})
                    </option>
                  ))}
                </select>
              </div>

              {/* Guests Count */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  {t.guestsLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value, 10))}
                    className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 rounded-xl px-2 py-2.5 text-stone-200 text-sm font-medium outline-none"
                  >
                    {[1, 2, 3, 4, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Adult' : 'Adults'}
                      </option>
                    ))}
                  </select>
                  <select
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value, 10))}
                    className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 rounded-xl px-2 py-2.5 text-stone-200 text-sm font-medium outline-none"
                  >
                    {[0, 1, 2, 3].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Child' : 'Kids'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search / WhatsApp Submit CTA */}
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className="w-full h-[46px] rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all cursor-pointer group"
                >
                  <MessageSquare className="w-4 h-4 text-stone-950 fill-stone-950/20" />
                  <span>Book on WhatsApp</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Micro Guarantee Note */}
            <div className="mt-3.5 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-stone-300 font-medium">{t.instantBookingNote}</span>
              </div>
              <div className="text-amber-400/90 font-medium">
                Use code <span className="font-bold underline">SURYA10</span> for extra 10% OFF
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
