import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, MapPin, ShieldCheck, Menu, X, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { HotelSettings } from '../types/hotel';

interface NavbarProps {
  settings: HotelSettings;
  onOpenBookingModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenBookingModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Refined Information Bar - Perfectly Responsive */}
      <div className="bg-stone-950/98 border-b border-stone-800/80 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 text-stone-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Location & Landmark */}
          <div className="flex items-center gap-1.5 sm:gap-3 truncate">
            <span className="flex items-center gap-1 text-amber-400 font-medium whitespace-nowrap text-[11px] sm:text-xs">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Behind Shivaji Complex, Navjeevan Vihar, Vindhya Nagar</span>
              <span className="sm:hidden">Vindhya Nagar, Singrauli</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-stone-400 border-l border-stone-800 pl-3 whitespace-nowrap text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>24/7 Power Backup</span>
            </span>
          </div>

          {/* Quick Direct Desk Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={`tel:${settings.phonePrimary}`}
              className="flex items-center gap-1 text-stone-200 hover:text-amber-400 transition-colors font-semibold text-[11px] sm:text-xs whitespace-nowrap"
            >
              <Phone className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="hidden xs:inline">{settings.phonePrimary}</span>
              <span className="xs:hidden">Call</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(
                /[^0-9]/g,
                ''
              )}?text=Hello%20Hotel%20Surya%20Residency,%20I%20have%20an%20inquiry%20regarding%20room%20booking`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-700/50 transition-colors text-[10px] sm:text-[11px] whitespace-nowrap"
            >
              <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-stone-950/95 backdrop-blur-md shadow-2xl border-b border-amber-500/20 py-2 sm:py-2.5'
            : 'bg-stone-950/90 backdrop-blur-sm py-2.5 sm:py-3.5 border-b border-stone-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                <span className="font-serif-luxury text-base sm:text-xl font-bold bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  S
                </span>
              </div>
            </div>
            <div className="truncate">
              <div className="font-serif-luxury text-xs sm:text-base lg:text-lg font-bold tracking-wider text-stone-100 group-hover:text-amber-300 transition-colors leading-tight truncate">
                HOTEL SURYA RESIDENCY
              </div>
              <div className="text-[8px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.18em] text-amber-400 font-semibold uppercase leading-tight mt-0.5 truncate">
                Vindhya Nagar • Singrauli
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links (Large Screens) */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-[13px] font-medium text-stone-300 shrink-0">
            <a
              href="#rooms"
              className="hover:text-amber-400 transition-colors py-1 whitespace-nowrap relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              Rooms & Suites
            </a>
            <a
              href="#amenities"
              className="hover:text-amber-400 transition-colors py-1 whitespace-nowrap relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              Amenities
            </a>
            <a
              href="#restaurant"
              className="hover:text-amber-400 transition-colors py-1 whitespace-nowrap relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              Surya Rasoi
            </a>
            <a
              href="#banquet"
              className="hover:text-amber-400 transition-colors py-1 whitespace-nowrap relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              Banquets & Events
            </a>
            <a
              href="#gallery"
              className="hover:text-amber-400 transition-colors py-1 whitespace-nowrap relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              Gallery
            </a>
            <a
              href="#location"
              className="hover:text-amber-400 transition-colors py-1 whitespace-nowrap relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              Location & Map
            </a>
            <a
              href="#reviews"
              className="hover:text-amber-400 transition-colors py-1 whitespace-nowrap relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              Reviews
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Direct Booking CTA */}
            <button
              onClick={onOpenBookingModal}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-[11px] sm:text-xs tracking-wide shadow-md shadow-amber-500/20 active:scale-95 transition-all whitespace-nowrap flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 fill-stone-950 shrink-0" />
              <span className="hidden sm:inline">Book Direct (10% Off)</span>
              <span className="sm:hidden">Book Now</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 lg:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-stone-950/98 border-b border-stone-800 px-4 pt-3 pb-6 mt-2 space-y-3 shadow-2xl animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-stone-300">
              <a
                href="#rooms"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-800/80"
              >
                🏨 Rooms & Suites
              </a>
              <a
                href="#amenities"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-800/80"
              >
                ⚡ Amenities
              </a>
              <a
                href="#restaurant"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-800/80"
              >
                🍽️ Surya Rasoi
              </a>
              <a
                href="#banquet"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-800/80"
              >
                🎉 Banquets & Events
              </a>
              <a
                href="#gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-800/80"
              >
                📸 Photo Gallery
              </a>
              <a
                href="#location"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-800/80"
              >
                📍 Location & Routes
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-800/80 col-span-2 text-center"
              >
                ⭐ Verified Guest Reviews (4.2/5)
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBookingModal();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs text-center shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Book Direct with 10% Discount (Code: SURYA10)
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${settings.phonePrimary}`}
                  className="py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Reception</span>
                </a>
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(
                    /[^0-9]/g,
                    ''
                  )}?text=Hello%20Hotel%20Surya%20Residency,%20I%20need%20room%20details`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
