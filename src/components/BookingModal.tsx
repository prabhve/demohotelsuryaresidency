import React, { useState, useEffect } from 'react';
import { Room, BookingAddon, HotelSettings, Booking } from '../types/hotel';
import { bookingAddons } from '../data/hotelData';
import { generateWhatsAppBookingUrl } from '../utils/whatsapp';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Users,
  BedDouble,
  Check,
  Plus,
  Tag,
  MessageSquare,
  Printer,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Utensils,
  Car,
  FileText,
  AlertCircle
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  settings: HotelSettings;
  initialRoomId?: string;
  initialSearch?: {
    checkIn: string;
    checkOut: string;
    roomId: string;
    adults: number;
    children: number;
  };
  onBookingSuccess?: (newBooking: Booking) => void;
  currentLang: 'en' | 'hi';
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  rooms,
  settings,
  initialRoomId,
  initialSearch,
  onBookingSuccess,
  currentLang,
}) => {
  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [step, setStep] = useState<'details' | 'addons' | 'guest_info' | 'confirmed'>('details');

  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    initialSearch?.roomId || initialRoomId || rooms[0]?.id || 'deluxe-room'
  );
  const [checkIn, setCheckIn] = useState<string>(initialSearch?.checkIn || todayStr);
  const [checkOut, setCheckOut] = useState<string>(initialSearch?.checkOut || tomorrowStr);
  const [adults, setAdults] = useState<number>(initialSearch?.adults || 2);
  const [children, setChildren] = useState<number>(initialSearch?.children || 0);
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [mealPlan, setMealPlan] = useState<'ep' | 'cp' | 'map'>('cp'); // default Bed & Breakfast

  // Addons
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(['breakfast-buffet']);

  // Guest Information
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [idProofType, setIdProofType] = useState('Aadhaar Card / Driving License');
  const [specialRequests, setSpecialRequests] = useState('');
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState('2:00 PM');

  // Coupon Code
  const [couponCode, setCouponCode] = useState(settings.activeDiscountCode || 'SURYA10');
  const [couponApplied, setCouponApplied] = useState(true);
  const [couponMessage, setCouponMessage] = useState('10% Direct Booking Discount Applied!');

  // Confirmed booking state
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialRoomId) setSelectedRoomId(initialRoomId);
    if (initialSearch) {
      if (initialSearch.roomId) setSelectedRoomId(initialSearch.roomId);
      if (initialSearch.checkIn) setCheckIn(initialSearch.checkIn);
      if (initialSearch.checkOut) setCheckOut(initialSearch.checkOut);
      if (initialSearch.adults) setAdults(initialSearch.adults);
      if (initialSearch.children) setChildren(initialSearch.children);
    }
  }, [initialRoomId, initialSearch]);

  if (!isOpen) return null;

  const currentRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.max(1, checkOutDate.getTime() - checkInDate.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Calculate pricing
  const baseRoomTariff = (currentRoom?.pricePerNight || 1850) * nights * roomsCount;

  // Meal plan surcharge (if CP or MAP)
  let mealPlanSurcharge = 0;
  if (mealPlan === 'cp') mealPlanSurcharge = 249 * adults * nights * roomsCount;
  if (mealPlan === 'map') mealPlanSurcharge = 699 * adults * nights * roomsCount;

  // Addons total
  const addonsTotal = selectedAddonIds.reduce((sum, addonId) => {
    const addon = bookingAddons.find((a) => a.id === addonId);
    if (!addon) return sum;
    let cost = addon.price;
    if (addon.perPerson) cost *= adults;
    if (addon.perDay) cost *= nights;
    return sum + cost;
  }, 0);

  const subtotalBeforeDiscount = baseRoomTariff + addonsTotal + (mealPlan === 'ep' ? 0 : mealPlanSurcharge);
  const discountRate = couponApplied ? (settings.activeDiscountPercentage || 10) / 100 : 0;
  const discountAmount = Math.round(baseRoomTariff * discountRate);
  const taxableAmount = Math.max(0, subtotalBeforeDiscount - discountAmount);
  const gstAmount = Math.round((taxableAmount * (settings.gstRate || 12)) / 100);
  const totalAmount = taxableAmount + gstAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase().trim() === settings.activeDiscountCode.toUpperCase().trim() || couponCode.toUpperCase().trim() === 'SURYA10') {
      setCouponApplied(true);
      setCouponMessage('🎉 10% Discount Code Applied Successfully!');
    } else {
      setCouponApplied(false);
      setCouponMessage('❌ Invalid coupon code. Try SURYA10');
    }
  };

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone) {
      alert('Please fill your name and WhatsApp contact number.');
      return;
    }

    setIsSubmitting(true);

    const newBookingData: Partial<Booking> = {
      bookingRef: `SR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      roomId: currentRoom.id,
      roomName: currentRoom.name,
      checkIn,
      checkOut,
      nights,
      adults,
      children,
      roomsCount,
      guestName,
      guestPhone,
      guestEmail,
      companyName,
      idProofType,
      specialRequests,
      estimatedArrivalTime,
      selectedAddons: selectedAddonIds,
      mealPlan,
      basePrice: baseRoomTariff,
      addonsTotal,
      discountAmount,
      discountCode: couponApplied ? couponCode : undefined,
      gstAmount,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending_at_desk',
      source: 'whatsapp_web',
    };

    try {
      // Post to backend database
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookingData),
      });
      const data = await response.json();
      const savedBooking: Booking = data.data || { ...newBookingData, id: `b-${Date.now()}` };

      setCompletedBooking(savedBooking);
      setStep('confirmed');

      if (onBookingSuccess) {
        onBookingSuccess(savedBooking);
      }

      // Fire confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#10b981', '#ffffff'],
        });
      } catch (err) {
        // ignore confetti errors
      }

      // Generate WhatsApp Link and Open
      const whatsappUrl = generateWhatsAppBookingUrl(savedBooking, settings);
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Booking save error:', error);
      // Fallback
      const fallbackBooking = { ...newBookingData, id: `b-${Date.now()}` } as Booking;
      setCompletedBooking(fallbackBooking);
      setStep('confirmed');
      const whatsappUrl = generateWhatsAppBookingUrl(fallbackBooking, settings);
      window.open(whatsappUrl, '_blank');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-stone-950 border border-amber-500/30 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-stone-100 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-stone-950 font-serif-luxury font-bold">
              S
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-stone-100">
                Reserve Your Stay • Hotel Surya Residency
              </h3>
              <p className="text-xs text-amber-400">
                Vindhya Nagar, Singrauli • Instant WhatsApp Confirmation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step !== 'confirmed' && (
          <div className="px-6 py-3 bg-stone-900/60 border-b border-stone-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 'details'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                1
              </span>
              <span className={step === 'details' ? 'font-bold text-amber-300' : 'text-stone-400'}>
                Room & Dates
              </span>
            </div>
            <div className="h-0.5 flex-1 mx-4 bg-stone-800"></div>
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 'addons'
                    ? 'bg-amber-500 text-stone-950'
                    : step === 'guest_info'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-stone-800 text-stone-400'
                }`}
              >
                2
              </span>
              <span className={step === 'addons' ? 'font-bold text-amber-300' : 'text-stone-400'}>
                Meals & Add-ons
              </span>
            </div>
            <div className="h-0.5 flex-1 mx-4 bg-stone-800"></div>
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 'guest_info'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-800 text-stone-400'
                }`}
              >
                3
              </span>
              <span className={step === 'guest_info' ? 'font-bold text-amber-300' : 'text-stone-400'}>
                Guest Details
              </span>
            </div>
          </div>
        )}

        {/* Modal Content Scrollable Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: ROOM & DATES */}
          {step === 'details' && (
            <div className="space-y-6">
              {/* Select Room Category */}
              <div>
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-3">
                  Select Room Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex gap-3 ${
                        selectedRoomId === room.id
                          ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                          : 'border-stone-800 bg-stone-900/60 hover:border-stone-700'
                      }`}
                    >
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif-luxury font-bold text-sm text-stone-100 truncate">
                            {room.name}
                          </h4>
                          {selectedRoomId === room.id && (
                            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 truncate mt-0.5">{room.bedType}</p>
                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span className="text-amber-400 font-bold font-serif-luxury text-base">
                            ₹{room.pricePerNight.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-stone-400">/ night</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dates & Occupancy Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
                <div>
                  <label className="text-xs font-semibold text-stone-400 flex items-center gap-1 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={todayStr}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-400 flex items-center gap-1 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || todayStr}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-400 flex items-center gap-1 mb-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Adults
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value, 10))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-sm outline-none"
                  >
                    {[1, 2, 3, 4, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Adult' : 'Adults'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-400 flex items-center gap-1 mb-1.5">
                    <BedDouble className="w-3.5 h-3.5 text-amber-400" />
                    No. of Rooms
                  </label>
                  <select
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(parseInt(e.target.value, 10))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-sm outline-none"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Room' : 'Rooms'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Stay summary banner */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    Duration: <strong>{nights} Night(s)</strong> • Base Room Total: <strong>₹{baseRoomTariff.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
                <span className="font-semibold text-emerald-400">100% Power Backup Assured</span>
              </div>
            </div>
          )}

          {/* STEP 2: MEALS & ADD-ONS */}
          {step === 'addons' && (
            <div className="space-y-6">
              {/* Meal Plan Options */}
              <div>
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-3">
                  Choose Meal Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'ep',
                      title: 'Room Only (EP)',
                      desc: 'Accommodation only, food à la carte',
                      badge: 'Base Rate',
                      active: mealPlan === 'ep',
                    },
                    {
                      id: 'cp',
                      title: 'Bed & Breakfast (CP)',
                      desc: 'Includes hearty hot morning buffet at Surya Rasoi',
                      badge: 'Most Popular',
                      active: mealPlan === 'cp',
                    },
                    {
                      id: 'map',
                      title: 'Breakfast + Dinner (MAP)',
                      desc: 'Complete worry-free breakfast & chef’s multi-cuisine dinner',
                      badge: 'Best Value',
                      active: mealPlan === 'map',
                    },
                  ].map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setMealPlan(plan.id as any)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        plan.active
                          ? 'border-amber-500 bg-amber-500/10 shadow-lg'
                          : 'border-stone-800 bg-stone-900/60 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-stone-100">{plan.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-800 text-amber-400">
                          {plan.badge}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400">{plan.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Addons & Station Cab Transfers */}
              <div>
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-3">
                  Optional Services & Station Cab Pickups
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bookingAddons.map((addon) => {
                    const isChecked = selectedAddonIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleToggleAddon(addon.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'border-amber-500/70 bg-amber-500/10'
                            : 'border-stone-800 bg-stone-900/50 hover:border-stone-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-stone-950'
                              : 'border-stone-700 bg-stone-950'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-xs sm:text-sm text-stone-200">
                              {addon.name}
                            </h5>
                            <span className="text-xs font-bold text-amber-400">
                              +₹{addon.price}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400 mt-0.5">{addon.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GUEST INFORMATION & COUPON */}
          {step === 'guest_info' && (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-3">
                  Guest Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-stone-400 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra / Dr. Ananya"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-stone-100 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-400 block mb-1">
                      WhatsApp Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98XXXXXXXX"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-stone-100 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-400 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="guest@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-stone-100 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-400 block mb-1">
                      Company / Organization (For GST Bill)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NTPC / NCL / Reliance Vendor"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-stone-100 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-400 block mb-1">
                      Estimated Arrival Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2:00 PM / Evening 7 PM"
                      value={estimatedArrivalTime}
                      onChange={(e) => setEstimatedArrivalTime(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-stone-100 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-400 block mb-1">
                      Special Requests / Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. High floor room, extra towel"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-stone-100 text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400 shrink-0" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter Promo Code"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 text-xs font-bold uppercase tracking-wider outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 hover:bg-amber-500 hover:text-stone-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply Code
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`mt-2 text-xs font-medium ${
                      couponApplied ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
              </div>
            </form>
          )}

          {/* CONFIRMATION / PRINTABLE VOUCHER VIEW */}
          {step === 'confirmed' && completedBooking && (
            <div className="space-y-6">
              {/* Success Badge */}
              <div className="text-center p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-serif-luxury text-xl sm:text-2xl font-bold text-emerald-400">
                  Booking Request Dispatched to WhatsApp!
                </h4>
                <p className="mt-1 text-stone-300 text-xs sm:text-sm">
                  Booking Reference: <strong className="text-amber-400">#{completedBooking.bookingRef}</strong>
                </p>
                <p className="mt-1 text-stone-400 text-xs">
                  Our reception team has received your request and will confirm room allocation shortly on WhatsApp.
                </p>
              </div>

              {/* Printable Voucher Card */}
              <div
                id="booking-voucher-print"
                className="p-6 rounded-2xl bg-stone-900 border border-stone-700 space-y-4"
              >
                <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                  <div>
                    <h5 className="font-serif-luxury font-bold text-base text-stone-100">
                      HOTEL SURYA RESIDENCY
                    </h5>
                    <p className="text-[11px] text-stone-400">
                      HIG-23, Behind Shivaji Complex, Navjeevan Vihar, Singrauli (M.P.)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Status</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                      Pending Desk Confirmation
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block">Guest Name</span>
                    <span className="font-bold text-stone-200">{completedBooking.guestName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Contact</span>
                    <span className="font-bold text-stone-200">{completedBooking.guestPhone}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Check-In</span>
                    <span className="font-bold text-stone-200">{completedBooking.checkIn} (12 PM)</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Check-Out</span>
                    <span className="font-bold text-stone-200">{completedBooking.checkOut} (11 AM)</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Room Type</span>
                    <span className="font-bold text-amber-300">{completedBooking.roomName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Total Guests</span>
                    <span className="font-bold text-stone-200">{completedBooking.adults} Adults</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Meal Plan</span>
                    <span className="font-bold text-stone-200 uppercase">{completedBooking.mealPlan}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Total Estimated</span>
                    <span className="font-bold text-amber-400 font-serif-luxury text-sm">
                      ₹{completedBooking.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex flex-wrap items-center justify-between gap-2">
                  <span>Front Desk Support: {settings.phonePrimary} / {settings.landline}</span>
                  <span className="text-amber-400 font-semibold">UPI ID: {settings.upiId}</span>
                </div>

                {/* UPI Advance Option */}
                <div className="mt-3 p-3 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-stone-200 block">Optional Advance Token Payment:</span>
                    <span className="text-[11px] text-stone-400">
                      Send token advance (₹500 / ₹1,000) to <strong>{settings.upiId}</strong> ({settings.upiPhoneNumber}) via GPay/PhonePe and share screenshot on WhatsApp.
                    </span>
                  </div>
                  <a
                    href={`upi://pay?pa=${settings.upiId}&pn=Hotel%20Surya%20Residency&am=500&cu=INR&tn=Booking_${completedBooking.bookingRef}`}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold whitespace-nowrap hover:bg-amber-500 hover:text-stone-950 transition-colors"
                  >
                    Pay via UPI App
                  </a>
                </div>
              </div>

              {/* Action Buttons for Confirmed State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={generateWhatsAppBookingUrl(completedBooking, settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Re-open WhatsApp</span>
                </a>

                <button
                  onClick={handlePrintVoucher}
                  className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print Slip / Receipt</span>
                </button>

                <a
                  href={`tel:${settings.phonePrimary}`}
                  className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Reception</span>
                </a>
              </div>
            </div>
          )}

          {/* Pricing Calculation Summary (Visible on Steps 1, 2, 3) */}
          {step !== 'confirmed' && (
            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-300">
                <span>
                  {currentRoom?.name} ({nights} night{nights > 1 ? 's' : ''} x {roomsCount} room
                  {roomsCount > 1 ? 's' : ''}):
                </span>
                <span>₹{baseRoomTariff.toLocaleString('en-IN')}</span>
              </div>

              {mealPlan !== 'ep' && (
                <div className="flex items-center justify-between text-stone-300">
                  <span>Meal Plan ({mealPlan.toUpperCase()}):</span>
                  <span>+₹{mealPlanSurcharge.toLocaleString('en-IN')}</span>
                </div>
              )}

              {addonsTotal > 0 && (
                <div className="flex items-center justify-between text-stone-300">
                  <span>Add-on Services Total:</span>
                  <span>+₹{addonsTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-400 font-medium">
                  <span>Direct Promo Discount ({couponCode}):</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-stone-400">
                <span>GST (12%):</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-sm sm:text-base font-bold text-stone-100">
                <span>Total Estimated Payable:</span>
                <span className="font-serif-luxury text-amber-400 text-lg sm:text-xl">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step !== 'confirmed' && (
          <div className="p-4 sm:p-5 bg-stone-900 border-t border-stone-800 flex items-center justify-between">
            {step === 'details' ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(step === 'guest_info' ? 'addons' : 'details')}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold"
              >
                ← Back
              </button>
            )}

            {step === 'details' && (
              <button
                type="button"
                onClick={() => setStep('addons')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 cursor-pointer"
              >
                <span>Continue to Meals & Addons</span>
                <span>→</span>
              </button>
            )}

            {step === 'addons' && (
              <button
                type="button"
                onClick={() => setStep('guest_info')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 cursor-pointer"
              >
                <span>Continue to Guest Info</span>
                <span>→</span>
              </button>
            )}

            {step === 'guest_info' && (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-stone-950" />
                <span>{isSubmitting ? 'Recording Booking...' : 'Confirm & Open WhatsApp'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
