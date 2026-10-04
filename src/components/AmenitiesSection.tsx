import React from 'react';
import {
  Zap,
  Wifi,
  UtensilsCrossed,
  Building,
  Clock,
  Car,
  HeartPulse,
  Sparkles,
  Coffee,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface AmenitiesSectionProps {
  currentLang?: 'en' | 'hi';
}

export const AmenitiesSection: React.FC<AmenitiesSectionProps> = () => {
  const amenities = [
    {
      icon: Zap,
      title: '100% 24/7 Power Backup',
      description: 'Heavy-duty commercial silent generator backup ensures zero power cut disruption to your AC, Wi-Fi, and lights.',
      badge: 'Essential in Singrauli',
    },
    {
      icon: Wifi,
      title: 'High-Speed Fibre Wi-Fi',
      description: 'Dedicated high-bandwidth wireless internet across all rooms, suites, lobby, and conference halls for seamless Zoom calls.',
      badge: 'Free for all Guests',
    },
    {
      icon: UtensilsCrossed,
      title: 'Surya Rasoi Restaurant',
      description: 'In-house multi-cuisine restaurant serving authentic North Indian, Tandoori, Chinese, South Indian delicacies and breakfast buffet.',
      badge: 'Fine Dining & Room Service',
    },
    {
      icon: Building,
      title: 'AC Banquet & Conference Hall',
      description: 'Spacious air-conditioned ballroom with 250+ capacity for weddings and corporate meetings with modern AV projectors.',
      badge: 'Up to 250+ Capacity',
    },
    {
      icon: Clock,
      title: '24-Hour Front Desk & Concierge',
      description: 'Round-the-clock reception assistance, wake-up calls, baggage storage, express check-in, and instant WhatsApp support.',
      badge: 'Always Available',
    },
    {
      icon: Car,
      title: 'Free Valet & Secure Parking',
      description: 'Ample on-premises secure parking space with 24-hour CCTV surveillance and driver rest facilities.',
      badge: 'CCTV Monitored',
    },
    {
      icon: HeartPulse,
      title: 'Doctor on Call & Travel Desk',
      description: 'Immediate medical assistance if required, along with customized car rentals for Singrauli, Renukoot, and Varanasi station pickups.',
      badge: 'Guest Safety First',
    },
    {
      icon: Coffee,
      title: 'In-Room Dining & Beverage Bar',
      description: 'Hot tea, coffee, snacks, and full meals delivered directly to your room from morning 6:30 AM to late night 11:00 PM.',
      badge: 'Quick Room Service',
    },
  ];

  return (
    <section id="amenities" className="py-20 bg-stone-900/60 border-t border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WORLD-CLASS HOSPITALITY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-100 tracking-tight">
              Designed for Business & Leisure Travelers
            </h2>
            <p className="mt-3 text-stone-400 text-sm sm:text-base leading-relaxed">
              Whether you are visiting Singrauli for NTPC/NCL corporate projects or a family wedding, enjoy dependable comfort with state-of-the-art facilities.
            </p>
          </div>
        </ScrollReveal>

        {/* Amenities Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {amenities.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <ScrollReveal key={idx} delay={idx * 75} direction="up">
                <div className="h-full rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/50 group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-stone-900 px-2.5 py-1 rounded-full border border-stone-800">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="font-serif-luxury font-bold text-base sm:text-lg text-stone-100 group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-stone-400 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Corporate VIP Support Banner */}
        <ScrollReveal delay={200} direction="up">
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-luxury font-bold text-lg text-stone-100">
                  Special Tariff for NTPC, NCL & Corporate Project Teams
                </h4>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Monthly billing accounts, GST invoice dispatch, and dedicated car transfers available.
                </p>
              </div>
            </div>

            <a
              href="tel:+919926741071"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 whitespace-nowrap shadow-lg cursor-pointer transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact General Manager</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
