import React from 'react';
import { HotelSettings } from '../types/hotel';
import { MapPin, Phone, MessageSquare, Mail, Shield, Sparkles, Navigation, Heart } from 'lucide-react';

interface FooterProps {
  settings: HotelSettings;
  onOpenBookingModal: () => void;
  onOpenAdminPortal: () => void;
  currentLang: 'en' | 'hi';
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenBookingModal,
  onOpenAdminPortal,
  currentLang,
}) => {
  const t = {
    en: {
      tagline: 'Singrauli’s premier hospitality destination for business executives, NTPC/NCL delegates, and family celebrations.',
      quickLinks: 'Quick Links',
      rooms: 'Executive Rooms & Suites',
      amenities: 'Facilities & Power Backup',
      restaurant: 'Surya Rasoi Restaurant',
      banquet: 'AC Banquets & Weddings',
      location: 'Google Maps Directions',
      reviews: 'Guest Reviews',
      contactUs: 'Contact Front Desk',
      address: 'HIG-23, Behind Shivaji Complex, Navjeevan Vihar, Vindhya Nagar, Singrauli (M.P.) - 486885',
      managerPortal: 'Hotel Management & Reception Portal',
      copyright: '© 2026 Hotel Surya Residency. All rights reserved.',
      singrauliGuide: 'Vindhya Nagar • Singrauli • Waidhan • Renukoot Hospitality',
    },
    hi: {
      tagline: 'व्यापारिक अधिकारियों, एनटीपीसी/एनसीएल डेलिगेट्स और पारिवारिक समारोहों के लिए सिंगरौली का सर्वोत्तम होटल।',
      quickLinks: 'त्वरित लिंक',
      rooms: 'कमरे व सुइट्स',
      amenities: 'सुविधाएं व 24/7 पावर बैकअप',
      restaurant: 'सूर्य रसोई रेस्टोरेंट',
      banquet: 'एसी बैंक्वेट व शादी हॉल',
      location: 'गूगल मैप्स लोकेशन',
      reviews: 'अतिथि समीक्षाएं',
      contactUs: 'रिसेप्शन से संपर्क करें',
      address: 'HIG-23, शिवाजी कॉम्प्लेक्स के पीछे, नवजीवन विहार, विंध्य नगर, सिंगरौली (म.प्र.) - 486885',
      managerPortal: 'होटल मैनेजर व रिसेप्शन पोर्टल',
      copyright: '© 2026 होटल सूर्य रेजीडेंसी। सर्वाधिकार सुरक्षित।',
      singrauliGuide: 'विंध्य नगर • सिंगरौली • बैढ़न • रेणुकूट आतिथ्य',
    },
  }[currentLang];

  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 font-serif-luxury font-bold text-lg shadow-lg">
                S
              </div>
              <div>
                <span className="font-serif-luxury text-lg font-bold text-stone-100 tracking-wider block">
                  HOTEL SURYA RESIDENCY
                </span>
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">
                  Vindhya Nagar • Singrauli
                </span>
              </div>
            </div>

            <p className="text-stone-400 leading-relaxed text-xs">
              {t.tagline}
            </p>

            <div className="flex items-center gap-2 text-stone-400 pt-1">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% 24/7 Power Backup Assured</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury font-bold text-sm text-stone-100 tracking-wider uppercase">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <a href="#rooms" className="hover:text-amber-400 transition-colors">
                  {t.rooms}
                </a>
              </li>
              <li>
                <a href="#amenities" className="hover:text-amber-400 transition-colors">
                  {t.amenities}
                </a>
              </li>
              <li>
                <a href="#restaurant" className="hover:text-amber-400 transition-colors">
                  {t.restaurant}
                </a>
              </li>
              <li>
                <a href="#banquet" className="hover:text-amber-400 transition-colors">
                  {t.banquet}
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-amber-400 transition-colors">
                  {t.location}
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-amber-400 transition-colors">
                  {t.reviews}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury font-bold text-sm text-stone-100 tracking-wider uppercase">
              {t.contactUs}
            </h4>
            <div className="space-y-2.5 text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{t.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <a href={`tel:${settings.phonePrimary}`} className="hover:text-amber-400 font-semibold text-stone-200">
                    {settings.phonePrimary}
                  </a>
                  <span className="text-stone-500 mx-1">/</span>
                  <a href={`tel:${settings.landline}`} className="hover:text-amber-400">
                    {settings.landline}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  WhatsApp: +{settings.whatsappNumber}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* Direct CTA Box */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Direct Booking Benefit</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Book directly through our website or WhatsApp to get guaranteed lowest rates and complimentary early check-in.
              </p>
              <button
                onClick={onOpenBookingModal}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs tracking-wide transition-all shadow-md"
              >
                Book Your Room Now
              </button>
            </div>

            <button
              onClick={onOpenAdminPortal}
              className="w-full py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-300 text-[11px] font-medium border border-stone-800 transition-colors"
            >
              🔒 {t.managerPortal}
            </button>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-12 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>{t.copyright}</div>
          <div>{t.singrauliGuide}</div>
        </div>
      </div>
    </footer>
  );
};
