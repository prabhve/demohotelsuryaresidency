import React from 'react';
import {
  Zap,
  Wifi,
  UtensilsCrossed,
  Building,
  Shield,
  Clock,
  Car,
  HeartPulse,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Tv,
  Coffee,
  Waves
} from 'lucide-react';

interface AmenitiesSectionProps {
  currentLang: 'en' | 'hi';
}

export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ currentLang }) => {
  const t = {
    en: {
      subtitle: 'WORLD-CLASS HOSPITALITY',
      title: 'Designed for Business & Leisure Travelers',
      desc: 'Whether you are visiting Singrauli for NTPC/NCL corporate projects or a family wedding, enjoy dependable comfort with state-of-the-art facilities.',
      highlightsHeading: 'Why Hotel Surya Residency is Singrauli’s #1 Choice:',
      callout: 'Need custom arrangement for corporate teams or group wedding delegates?',
      calloutBtn: 'Speak to General Manager',
    },
    hi: {
      subtitle: 'विश्वस्तरीय आतिथ्य और सुविधाएं',
      title: 'व्यापारिक और पारिवारिक अतिथियों के लिए सर्वश्रेष्ठ',
      desc: 'चाहे आप एनटीपीसी/एनसीएल औद्योगिक कार्य से आए हों या पारिवारिक विवाह समारोह के लिए, हमारी सुविधाएं आपकी यात्रा को सुखद बनाती हैं।',
      highlightsHeading: 'होटल सूर्य रेजीडेंसी ही क्यों चुनें:',
      callout: 'क्या आपको कॉर्पोरेट टीम या शादी के मेहमानों के लिए विशेष पैकेज चाहिए?',
      calloutBtn: 'मैनेजर से बात करें',
    },
  }[currentLang];

  const amenities = [
    {
      icon: Zap,
      title: '100% 24/7 Power Backup',
      description: 'Heavy-duty commercial silent generator backup ensures zero power cut disruption to your AC, Wi-Fi, and lights.',
      badge: 'Essential in Singrauli',
      color: 'from-amber-500 to-yellow-500',
    },
    {
      icon: Wifi,
      title: 'High-Speed Fibre Wi-Fi',
      description: 'Dedicated high-bandwidth wireless internet across all rooms, suites, lobby, and conference halls for seamless Zoom calls.',
      badge: 'Free for all Guests',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: UtensilsCrossed,
      title: 'Surya Rasoi Restaurant',
      description: 'In-house multi-cuisine restaurant serving authentic North Indian, Tandoori, Chinese, South Indian delicacies and breakfast buffet.',
      badge: 'Fine Dining & Room Service',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: Building,
      title: 'AC Banquet & Conference Hall',
      description: 'Spacious air-conditioned ballroom with 250+ capacity for weddings and corporate meetings with modern AV projectors.',
      badge: 'Up to 250+ Capacity',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Clock,
      title: '24-Hour Front Desk & Concierge',
      description: 'Round-the-clock reception assistance, wake-up calls, baggage storage, express check-in, and instant WhatsApp support.',
      badge: 'Always Available',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Car,
      title: 'Free Valet & Secure Parking',
      description: 'Ample on-premises secure parking space with 24-hour CCTV surveillance and driver rest facilities.',
      badge: 'CCTV Monitored',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: HeartPulse,
      title: 'Doctor on Call & Travel Desk',
      description: 'Immediate medical assistance if required, along with customized car rentals for Singrauli, Renukoot, and Varanasi station pickups.',
      badge: 'Guest Safety First',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: Coffee,
      title: 'In-Room Dining & Beverage Bar',
      description: 'Hot tea, coffee, snacks, and full meals delivered directly to your room from morning 6:30 AM to late night 11:00 PM.',
      badge: 'Quick Room Service',
      color: 'from-amber-600 to-amber-800',
    },
  ];

  return (
    <section id="amenities" className="py-20 bg-stone-950 relative overflow-hidden">
      {/* Subtle Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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
        </div>

        {/* Grid of Amenities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-black hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center text-amber-400 group-hover:text-amber-300 group-hover:border-amber-500/50 transition-colors shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-950 text-amber-300 border border-stone-800">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-serif-luxury font-bold text-lg text-stone-100 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-stone-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center gap-1.5 text-xs text-amber-400/90 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Standard in all stays</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Manager Assistance Callout Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-stone-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-100 text-sm sm:text-base">
                {t.callout}
              </h4>
              <p className="text-xs text-stone-400">
                Special corporate credit billing for NTPC, NCL, BHEL, and major industrial partners.
              </p>
            </div>
          </div>
          <a
            href="tel:+919926741071"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 whitespace-nowrap transition-colors"
          >
            {t.calloutBtn}: +91 99267 41071
          </a>
        </div>
      </div>
    </section>
  );
};
