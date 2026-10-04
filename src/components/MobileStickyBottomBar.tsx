import React from 'react';
import { Phone, Sparkles, MessageSquare, Calendar } from 'lucide-react';
import { HotelSettings } from '../types/hotel';

interface MobileStickyBottomBarProps {
  settings: HotelSettings;
  onOpenBookingModal: () => void;
}

export const MobileStickyBottomBar: React.FC<MobileStickyBottomBarProps> = ({
  settings,
  onOpenBookingModal,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-xl border-t border-amber-500/30 p-2.5 px-3 flex items-center justify-between gap-2 shadow-2xl safe-area-pb">
      <a
        href={`tel:${settings.phonePrimary}`}
        className="flex-1 py-2.5 px-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
      >
        <Phone className="w-3.5 h-3.5 text-amber-400" />
        <span>Call Desk</span>
      </a>

      <a
        href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Hotel%20Surya%20Residency,%20I%20want%20to%20inquire%20about%20room%20booking`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2.5 px-2 rounded-xl bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
      >
        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
        <span>WhatsApp</span>
      </a>

      <button
        onClick={onOpenBookingModal}
        className="flex-[1.5] py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
      >
        <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
        <span>Book (10% Off)</span>
      </button>
    </div>
  );
};
