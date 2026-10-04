import React, { useState } from 'react';
import { HotelSettings } from '../types/hotel';
import { allHotelDestinations, LandmarkLocation } from '../data/hotelData';
import {
  MapPin,
  Navigation,
  Phone,
  Car,
  Compass,
  ExternalLink,
  MessageSquare,
  Search,
  Train,
  Building2,
  Sparkles,
  Mountain,
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';

interface LocationSectionProps {
  settings: HotelSettings;
  currentLang?: 'en' | 'hi';
}

export const LocationSection: React.FC<LocationSectionProps> = ({ settings }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDestination, setSelectedDestination] = useState<LandmarkLocation>(allHotelDestinations[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const hotelLocationName = 'Hotel Surya Residency, Navjeevan Vihar, Vindhya Nagar, Singrauli, Madhya Pradesh 486885';
  const hotelCoords = '24.0809712,82.66027';

  // Create Google Maps Turn-by-Turn Driving Directions URL
  const getGoogleMapsDirectionsUrl = (destinationQuery: string) => {
    return `https://www.google.com/maps/dir/?api=1&origin=${hotelCoords}&destination=${encodeURIComponent(
      destinationQuery
    )}&travelmode=driving`;
  };

  const filteredDestinations = allHotelDestinations.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' ? true : item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const transitHubs = allHotelDestinations.filter(
    (d) => d.category === 'transit' || d.category === 'local'
  );
  const attractions = allHotelDestinations.filter(
    (d) => d.category === 'tourism' || d.category === 'industrial'
  );

  return (
    <section id="location" className="py-20 bg-stone-950 border-t border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Navigation className="w-3.5 h-3.5" />
            <span>REAL-TIME GOOGLE MAPS NAVIGATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-100 tracking-tight">
            Proximity & Direct Routes from Hotel
          </h2>
          <p className="mt-3 text-stone-400 text-sm sm:text-base leading-relaxed">
            Click on any transit hub, corporate plant, or tourist landmark below to open live driving directions and turn-by-turn navigation directly from Hotel Surya Residency on Google Maps.
          </p>
        </div>

        {/* Top Map & Primary Address Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Interactive Google Map Embed */}
          <div className="lg:col-span-8 rounded-3xl bg-stone-900 border border-stone-800 overflow-hidden relative shadow-2xl min-h-[400px] flex flex-col">
            <iframe
              title="Hotel Surya Residency Live Map Navigation"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                selectedDestination.destinationQuery
              )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              className="w-full flex-1 border-0 filter invert-[0.9] hue-rotate-[180deg] contrast-[1.2] min-h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Active Selected Destination Overlaid Bar */}
            <div className="p-4 bg-stone-950/95 border-t border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-100">
                      Route to: {selectedDestination.name}
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800 font-mono">
                      {selectedDestination.durationText} ({selectedDestination.distanceKm} km)
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    Origin: Hotel Surya Residency (HIG-23, Behind Shivaji Complex)
                  </span>
                </div>
              </div>

              <a
                href={getGoogleMapsDirectionsUrl(selectedDestination.destinationQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all whitespace-nowrap"
              >
                <Navigation className="w-3.5 h-3.5 fill-stone-950" />
                <span>Open in Google Maps App</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Hotel Location & Station Cab Assistant Card */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  HOTEL LOCATION & GPS
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-stone-100 mt-1">
                  {settings.hotelName}
                </h3>
                <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
                  {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-medium">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>Landmark: Behind Shivaji Commercial Complex</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 space-y-2 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Front Desk: <strong>{settings.phonePrimary}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Landline: <strong>{settings.landline}</strong></span>
                </div>
              </div>
            </div>

            {/* Cab Pickup Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-900 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Car className="w-4 h-4" />
                <span>Station Pickup & Cab Transfers</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Need chauffeured AC pickup from Singrauli, Renukoot or Waidhan bus depot? Book direct cab with front desk.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${settings.phonePrimary}`}
                  className="py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold text-center border border-stone-700 transition-colors"
                >
                  Call Reception
                </a>
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(
                    /[^0-9]/g,
                    ''
                  )}?text=Hello%20Hotel%20Surya%20Residency,%20I%20would%20like%20to%20request%20station%20cab%20pickup`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold text-center transition-colors"
                >
                  WhatsApp Cab
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Places' },
              { id: 'transit', label: 'Transit (Rail & Bus)' },
              { id: 'industrial', label: 'NTPC & NCL Plants' },
              { id: 'tourism', label: 'Temples & Sightseeing' },
              { id: 'local', label: 'Local Markets' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'bg-stone-900 text-stone-400 border border-stone-800 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search station, plant, temple..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-200 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Destinations Cards Grid with Turn-by-Turn Route Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDestinations.map((item) => {
            const isSelected = selectedDestination.id === item.id;
            const directionsUrl = getGoogleMapsDirectionsUrl(item.destinationQuery);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedDestination(item)}
                className={`group p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900/90 border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.01]'
                    : 'bg-stone-950 border-stone-800/90 hover:border-amber-500/40 hover:bg-stone-900/40'
                }`}
              >
                <div>
                  {/* Category Pill & Real-time ETA */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-stone-800">
                      {item.categoryLabel}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      🚗 {item.distanceKm} km ({item.durationText})
                    </span>
                  </div>

                  {/* Destination Name */}
                  <h4 className="font-serif-luxury font-bold text-base text-stone-100 group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Navigation & WhatsApp Actions */}
                <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDestination(item);
                    }}
                    className="text-[11px] font-bold text-stone-400 hover:text-amber-300 transition-colors"
                  >
                    {isSelected ? '● Selected on Map' : 'View on Map'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Direct WhatsApp Cab Request */}
                    <a
                      href={`https://wa.me/${settings.whatsappNumber.replace(
                        /[^0-9]/g,
                        ''
                      )}?text=Hello%20Hotel%20Surya%20Residency,%20I%20need%20cab%20assistance%20for%20${encodeURIComponent(
                        item.name
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-emerald-500 text-stone-400 hover:text-emerald-400 transition-colors"
                      title="Request Cab on WhatsApp"
                    >
                      <Car className="w-3.5 h-3.5" />
                    </a>

                    {/* Google Maps Route Button */}
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-stone-950 font-bold text-xs flex items-center gap-1 transition-all"
                      title={`Open live Google Maps navigation to ${item.name}`}
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
