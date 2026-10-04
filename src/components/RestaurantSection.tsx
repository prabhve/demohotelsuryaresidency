import React, { useState } from 'react';
import { initialMenuItems } from '../data/hotelData';
import { MenuItem, HotelSettings } from '../types/hotel';
import { Utensils, MessageSquare, Plus, ShoppingBag, Star, Sparkles } from 'lucide-react';

interface RestaurantSectionProps {
  settings: HotelSettings;
  currentLang?: 'en' | 'hi';
}

export const RestaurantSection: React.FC<RestaurantSectionProps> = ({ settings }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [roomNumber, setRoomNumber] = useState('');
  const [guestName, setGuestName] = useState('');

  const filteredItems = initialMenuItems.filter((item) => {
    if (vegOnly && !item.isVeg) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'special') return item.isChefSpecial;
    return item.category === activeTab;
  });

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotalPrice = Object.entries(cart).reduce((sum, [itemId, qty]) => {
    const item = initialMenuItems.find((i) => i.id === itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleAddToCart = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[itemId] > 1) {
        next[itemId] -= 1;
      } else {
        delete next[itemId];
      }
      return next;
    });
  };

  const handleSendFoodOrderToWhatsApp = () => {
    if (cartItemCount === 0) return;

    const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const itemsList = Object.entries(cart)
      .map(([id, qty]) => {
        const item = initialMenuItems.find((i) => i.id === id);
        return item ? `• ${item.name} x ${qty} (₹${item.price * qty})` : '';
      })
      .filter(Boolean)
      .join('\n');

    const text = `*🍽️ FOOD & ROOM SERVICE ORDER - SURYA RASOI*
----------------------------------------
*Guest Name:* ${guestName || 'In-House Guest / Dine-in'}
${roomNumber ? `*Room Number:* ${roomNumber}\n` : ''}*Order Items:*
${itemsList}
----------------------------------------
*Total Food Bill:* ₹${cartTotalPrice.toLocaleString('en-IN')}
*Special Instruction:* Please prepare fresh and deliver promptly.
----------------------------------------
_Hotel Surya Residency, Vindhya Nagar, Singrauli_`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="restaurant" className="py-20 bg-stone-900/60 border-t border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Utensils className="w-3.5 h-3.5" />
            <span>CULINARY EXCELLENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-100 tracking-tight">
            Surya Rasoi — Fine Dining & Room Service
          </h2>
          <p className="mt-3 text-stone-400 text-sm sm:text-base leading-relaxed">
            Freshly prepared gourmet dishes crafted by master chefs. Serving North Indian curries, tandoori specialties, authentic Awadhi biryanis, and royal executive thalis.
          </p>

          {/* Filters & Toggles */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Dishes' },
              { id: 'special', label: '★ Most Popular' },
              { id: 'starters', label: 'Tandoor & Starters' },
              { id: 'main_course', label: 'Main Curries' },
              { id: 'breads_rice', label: 'Breads & Biryani' },
              { id: 'thali', label: 'Royal Thalis' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-stone-950 text-stone-400 border border-stone-800 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Veg toggle */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                vegOnly
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-300'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Pure Veg Only</span>
            </button>
          </div>
        </div>

        {/* Uniform Text-Based Menu Cards Grid (No Images) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <div
                key={item.id}
                className="group rounded-2xl bg-stone-950 border border-stone-800/90 hover:border-amber-500/50 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/50 relative"
              >
                <div>
                  {/* Top Bar: Veg/Non-Veg icon and Most Popular badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {/* Veg / Non-Veg Icon */}
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-4 h-4 rounded-sm flex items-center justify-center border ${
                          item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                        }`}
                        title={item.isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        ></span>
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                        {item.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </div>

                    {/* Most Popular Tag */}
                    {item.isChefSpecial ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>Most Popular</span>
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-medium text-stone-500 tracking-wider">
                        {item.category.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  {/* Dish Title */}
                  <h3 className="font-serif-luxury font-bold text-base sm:text-lg text-stone-100 group-hover:text-amber-300 transition-colors uppercase tracking-wide leading-snug">
                    {item.name}
                  </h3>

                  {/* What is in it / Description */}
                  <p className="text-xs text-stone-400 mt-2.5 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Bar: Price & +Add button */}
                <div className="mt-5 pt-3.5 border-t border-stone-800/80 flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-serif-luxury font-bold text-amber-400">
                      ₹{item.price}
                    </span>
                    <span className="text-[10px] text-stone-400">/ portion</span>
                  </div>

                  {qty === 0 ? (
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-500 hover:bg-amber-500/10 text-stone-200 hover:text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/50 rounded-xl px-2.5 py-1">
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="w-5 h-5 rounded-lg bg-stone-950 text-amber-300 font-bold flex items-center justify-center text-xs hover:bg-stone-900"
                        title="Decrease"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-amber-300 px-1">{qty}</span>
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        className="w-5 h-5 rounded-lg bg-stone-950 text-amber-300 font-bold flex items-center justify-center text-xs hover:bg-stone-900"
                        title="Increase"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Quick Food Order Drawer (if items in cart) */}
        {cartItemCount > 0 && (
          <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-stone-950 border border-amber-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-100 text-sm sm:text-base">
                  {cartItemCount} Dish{cartItemCount > 1 ? 'es' : ''} Selected • Total: ₹
                  {cartTotalPrice.toLocaleString('en-IN')}
                </h4>
                <p className="text-xs text-stone-400">
                  Ready to send to Surya Rasoi kitchen on WhatsApp for instant room delivery or dine-in
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Room No. (Optional)"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 outline-none w-32 focus:border-amber-500"
              />
              <button
                onClick={handleSendFoodOrderToWhatsApp}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
