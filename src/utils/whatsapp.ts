import { Booking, HotelSettings, Inquiry } from '../types/hotel';

/**
 * Creates a formatted WhatsApp message for Room Bookings
 */
export function generateWhatsAppBookingUrl(booking: Booking, settings: HotelSettings): string {
  const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const text = `*🏨 NEW ROOM BOOKING REQUEST - HOTEL SURYA RESIDENCY*
----------------------------------------
*Booking Ref:* #${booking.bookingRef}
*Guest Name:* ${booking.guestName}
*Contact Phone:* ${booking.guestPhone}
${booking.guestEmail ? `*Email:* ${booking.guestEmail}\n` : ''}${booking.companyName ? `*Company/Org:* ${booking.companyName}\n` : ''}
*Room Category:* ${booking.roomName}
*No. of Rooms:* ${booking.roomsCount}
*Check-in Date:* ${booking.checkIn} (${settings.checkInTime})
*Check-out Date:* ${booking.checkOut} (${settings.checkOutTime})
*Duration:* ${booking.nights} Night(s)
*Guests:* ${booking.adults} Adult(s)${booking.children > 0 ? `, ${booking.children} Child(ren)` : ''}
*Meal Plan:* ${booking.mealPlan === 'ep' ? 'Room Only (EP)' : booking.mealPlan === 'cp' ? 'Bed & Breakfast (CP)' : 'Breakfast + Dinner (MAP)'}
${booking.selectedAddons.length > 0 ? `*Add-ons Selected:* ${booking.selectedAddons.join(', ')}\n` : ''}${booking.estimatedArrivalTime ? `*Est. Arrival Time:* ${booking.estimatedArrivalTime}\n` : ''}${booking.specialRequests ? `*Special Request:* ${booking.specialRequests}\n` : ''}
----------------------------------------
*Tariff Breakdown:*
• Base Room Tariff: ₹${booking.basePrice.toLocaleString('en-IN')}
${booking.addonsTotal > 0 ? `• Add-ons Total: ₹${booking.addonsTotal.toLocaleString('en-IN')}\n` : ''}${booking.discountAmount > 0 ? `• Discount (${booking.discountCode}): -₹${booking.discountAmount.toLocaleString('en-IN')}\n` : ''}• GST (12%): ₹${booking.gstAmount.toLocaleString('en-IN')}
*TOTAL ESTIMATED AMOUNT: ₹${booking.totalAmount.toLocaleString('en-IN')}*
----------------------------------------
_Please confirm room availability and share advance payment details / reservation voucher._
_Location: HIG-23, Behind Shivaji Complex, Navjeevan Vihar, Vindhya Nagar, Singrauli (M.P.)_`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Creates WhatsApp message for Banquet & Corporate Inquiries
 */
export function generateWhatsAppInquiryUrl(inquiry: Partial<Inquiry>, settings: HotelSettings): string {
  const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const typeLabel = {
    banquet: 'AC Banquet Hall / Wedding Function',
    corporate_stay: 'NTPC/NCL Corporate Bulk Stay',
    group_booking: 'Group / Family Tour Booking',
    restaurant_catering: 'Restaurant Dining / Bulk Catering',
    general: 'General Inquiries',
  }[inquiry.inquiryType || 'general'];

  const text = `*✨ NEW EVENT / CORPORATE INQUIRY - HOTEL SURYA RESIDENCY*
----------------------------------------
*Inquiry Type:* ${typeLabel}
*Client Name:* ${inquiry.name}
*Phone Number:* ${inquiry.phone}
${inquiry.email ? `*Email:* ${inquiry.email}\n` : ''}${inquiry.eventDate ? `*Tentative Date:* ${inquiry.eventDate}\n` : ''}${inquiry.guestsCount ? `*Expected Guests:* ${inquiry.guestsCount} Persons\n` : ''}
*Requirements / Message:*
${inquiry.message || 'Please share brochure, hall capacity, and package pricing.'}
----------------------------------------
_Hotel Surya Residency, Vindhya Nagar, Singrauli (M.P.)_`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Reception quick template generator to send to guest WhatsApp
 */
export function generateStaffReplyWhatsAppUrl(
  guestPhone: string,
  type: 'confirm' | 'checkin_guide' | 'feedback' | 'custom',
  booking: Booking,
  settings: HotelSettings
): string {
  const cleanPhone = guestPhone.replace(/[^0-9]/g, '');
  let text = '';

  if (type === 'confirm') {
    text = `*🏨 RESERVATION CONFIRMED - HOTEL SURYA RESIDENCY*
Dear *${booking.guestName}*,

Greetings from Hotel Surya Residency, Vindhyanagar!

We are pleased to confirm your reservation:
• *Booking Ref:* #${booking.bookingRef}
• *Room:* ${booking.roomName} (${booking.assignedRoomNumber || 'Assigned on arrival'})
• *Check-in:* ${booking.checkIn} (12:00 PM)
• *Check-out:* ${booking.checkOut} (11:00 AM)
• *Total Payable:* ₹${booking.totalAmount.toLocaleString('en-IN')}

📍 *Hotel Address:* HIG-23, Behind Shivaji Complex, Navjeevan Vihar, Vindhya Nagar, Singrauli (M.P.)
🗺️ *Google Maps:* https://maps.app.goo.gl/hotel-surya-residency-singrauli

For any assistance or cab pickup from Singrauli/Renukoot station, call reception at ${settings.phonePrimary}. We look forward to welcoming you!`;
  } else if (type === 'checkin_guide') {
    text = `*🚗 DIRECTIONS & CHECK-IN GUIDE - HOTEL SURYA RESIDENCY*
Dear *${booking.guestName}*,

We look forward to welcoming you today at Hotel Surya Residency!

📍 *How to reach us:*
• From Singrauli Railway Station (8 km): Head towards Navjeevan Vihar via Vindhyanagar main road. Turn behind Shivaji Complex.
• Landmark: Right behind Shivaji Commercial Complex.
• Location Pin: https://maps.google.com/?q=24.0809712,82.66027

Front Desk Reception: ${settings.phonePrimary} / ${settings.landline}
Have a safe journey!`;
  } else if (type === 'feedback') {
    text = `*🌟 THANK YOU FOR STAYING WITH US!*
Dear *${booking.guestName}*,

It was our pleasure hosting you at Hotel Surya Residency, Singrauli. We hope you had a comfortable and pleasant stay.

If you enjoyed our hospitality, please take 30 seconds to share your kind review on Google Maps:
⭐ https://www.google.com/maps/place/Hotel+Surya+Residency/@24.0811013,82.6596934,187m

Warm regards,
Team Hotel Surya Residency`;
  }

  return `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(text)}`;
}
