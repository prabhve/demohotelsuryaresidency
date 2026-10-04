import React, { useState } from 'react';
import { HotelSettings, Inquiry, BanquetHall } from '../types/hotel';
import { initialBanquets } from '../data/hotelData';
import { generateWhatsAppInquiryUrl } from '../utils/whatsapp';
import { Building, Users, Calendar, Sparkles, MessageSquare, Check, Projector } from 'lucide-react';

interface BanquetSectionProps {
  settings: HotelSettings;
  banquets?: BanquetHall[];
  currentLang?: 'en' | 'hi';
}

export const BanquetSection: React.FC<BanquetSectionProps> = ({
  settings,
  banquets = initialBanquets,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState<
    'banquet' | 'corporate_stay' | 'group_booking' | 'restaurant_catering'
  >('banquet');
  const [eventDate, setEventDate] = useState('');
  const [guestsCount, setGuestsCount] = useState<number>(150);
  const [message, setMessage] = useState('');

  const hallsList = banquets && banquets.length > 0 ? banquets : initialBanquets;

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please provide your name and WhatsApp number.');
      return;
    }

    const payload: Partial<Inquiry> = {
      name,
      phone,
      email,
      inquiryType,
      eventDate,
      guestsCount,
      message,
    };

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('Inquiry error:', err);
    }

    const whatsappUrl = generateWhatsAppInquiryUrl(payload, settings);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="banquet" className="py-20 bg-stone-950 border-t border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Building className="w-3.5 h-3.5" />
            <span>CELEBRATIONS & CONFERENCES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-100 tracking-tight">
            Grand AC Banquets & Corporate Event Spaces
          </h2>
          <p className="mt-3 text-stone-400 text-sm sm:text-base leading-relaxed">
            Host memorable wedding receptions, ring ceremonies, birthdays, and high-level NTPC/NCL corporate board meetings with state-of-the-art audiovisual setups and custom catering.
          </p>
        </div>

        {/* Dynamic Venue Cards Grid from CMS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {hallsList.map((hall) => (
            <div
              key={hall.id}
              className="rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 overflow-hidden flex flex-col shadow-xl transition-all"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={hall.image}
                  alt={hall.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30"></div>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider">
                  {hall.badge}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-200">
                  <span className="px-3 py-1 rounded-lg bg-stone-950/80 backdrop-blur-md border border-stone-700 font-semibold text-amber-300">
                    Capacity: {hall.capacityText}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif-luxury font-bold text-stone-100">
                    {hall.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-stone-400 leading-relaxed">
                    {hall.description}
                  </p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
                    {hall.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Event Inquiry Form */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-500/30 p-6 sm:p-10 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-100">
              Request a Custom Banquet / Event Quote
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-2">
              Share your event details below to get direct custom pricing, per-plate menus, and date availability on WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSubmitInquiry} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Agrawal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-100 text-sm outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  WhatsApp Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-100 text-sm outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Occasion / Event Type
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-100 text-sm outline-none focus:border-amber-500"
                >
                  <option value="banquet">Wedding / Reception (विवाह समारोह)</option>
                  <option value="banquet">Ring Ceremony / Engagement (सगाई)</option>
                  <option value="corporate_stay">NTPC / NCL Corporate Conference</option>
                  <option value="group_booking">Birthday / Anniversary Party</option>
                  <option value="restaurant_catering">Outdoor Catering / Bulk Food Order</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Tentative Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-100 text-sm outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Expected Number of Guests: <span className="text-amber-400 font-bold">{guestsCount} Guests</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="350"
                  step="10"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>20 pax (Boardroom)</span>
                  <span>150 pax</span>
                  <span>300+ pax (Grand Hall)</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Special Requirements / Catering Preferences
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Vegetarian buffet dinner, stage decoration required, need 10 guest rooms alongside hall..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-100 text-sm outline-none focus:border-amber-500"
                ></textarea>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-amber-600/30 cursor-pointer transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-stone-950" />
                <span>Submit & Open WhatsApp Quotation</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
