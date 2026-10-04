import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, MapPin, ShieldCheck, Menu, X, Sparkles, Clock } from 'lucide-react';
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
      {/* Top Refined Information Bar */}
      <div className="bg-stone-950/98 border-b border-stone-800/80 text-[11px] sm:text-xs py-2 px-4 text-stone-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left Side: Address & Assurance */}
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex items-center gap-1.5 text-amber-400/90 font-medium whitespace-nowrap truncate">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Behind Shivaji Complex, Navjeevan Vihar, Vindhya Nagar, Singrauli</span>
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-stone-400 border-l border-stone-800 pl-3 whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% 24/7 Power Backup</span>
            </span>
          </div>

          {/* Right Side: Timings & Direct Contact */}
          <div className="flex items-center gap-3.5 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 text-stone-400 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
              <span>In: 12 PM | Out: 11 AM</span>
            </span>

            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-stone-700"></span>

            <a
              href={`tel:${settings.phonePrimary}`}
              className="flex items-center gap-1.5 text-stone-200 hover:text-amber-400 transition-colors font-semibold whitespace-nowrap"
            >
              <Phone className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{settings.phonePrimary}</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Hotel%20Surya%20Residency,%20I%20have%20an%20inquiry%20regarding%20room%20booking`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-950/50 hover:bg-emerald-900/50 px-2.5 py-0.5 rounded-full border border-emerald-700/50 transition-colors whitespace-nowrap"
            >
              <MessageSquare className="w-3 h-3 shrink-0" />
              <span>WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-stone-950/95 backdrop-blur-md shadow-2xl border-b border-amber-500/20 py-2.5'
            : 'bg-stone-950/90 backdrop-blur-sm py-3.5 border-b border-stone-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                <span className="font-serif-luxury text-xl font-bold bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  S
                </span>
              </div>
            </div>
            <div className="whitespace-nowrap">
              <div className="font-serif-luxury text-base sm:text-lg font-bold tracking-wider text-stone-100 group-hover:text-amber-300 transition-colors leading-tight">
                HOTEL SURYA RESIDENCY
              </div>
              <div className="text-[10px] tracking-[0.18em] text-amber-400 font-semibold uppercase leading-tight mt-0.5">
                Vindhya Nagar • Singrauli (M.P.)
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
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

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center shrink-0">
            <button
              onClick={onOpenBookingModal}
              className="relative group overflow-hidden rounded-full p-px font-semibold text-xs tracking-wide cursor-pointer shadow-lg shadow-amber-500/15 whitespace-nowrap"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full group-hover:opacity-100 transition-opacity"></span>
              <span className="relative flex items-center gap-2 px-4 xl:px-5 py-2 rounded-full bg-stone-950 text-amber-300 group-hover:bg-transparent group-hover:text-stone-950 transition-all font-bold whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:text-stone-950 shrink-0" />
                <span>Book Direct (Save 10%)</span>
              </span>
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenBookingModal}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-bold sm:hidden shadow-md whitespace-nowrap"
            >
              Book Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-stone-950/98 border-b border-stone-800 px-4 pt-3 pb-6 mt-3 space-y-3 shadow-2xl">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium text-stone-300">
              <a
                href="#rooms"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/60 hover:bg-stone-900 text-stone-200"
              >
                Rooms & Suites
              </a>
              <a
                href="#amenities"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/60 hover:bg-stone-900 text-stone-200"
              >
                Amenities
              </a>
              <a
                href="#restaurant"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/60 hover:bg-stone-900 text-stone-200"
              >
                Surya Rasoi
              </a>
              <a
                href="#banquet"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/60 hover:bg-stone-900 text-stone-200"
              >
                Banquets & Events
              </a>
              <a
                href="#gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/60 hover:bg-stone-900 text-stone-200"
              >
                Gallery
              </a>
              <a
                href="#location"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/60 hover:bg-stone-900 text-stone-200"
              >
                Location & Map
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-900/60 hover:bg-stone-900 text-stone-200 col-span-2"
              >
                Guest Reviews
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBookingModal();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm text-center shadow-lg shadow-amber-500/20"
              >
                Book Direct (Save 10%)
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
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Hotel%20Surya%20Residency,%20I%20need%20room%20details`}
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
