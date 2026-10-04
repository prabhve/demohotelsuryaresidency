export interface Room {
  id: string;
  name: string;
  category: 'deluxe' | 'super-deluxe' | 'suite' | 'family';
  tagline: string;
  pricePerNight: number;
  originalPrice: number;
  capacity: {
    adults: number;
    children: number;
  };
  bedType: string;
  size: string;
  image: string;
  gallery: string[];
  description: string;
  amenities: string[];
  highlights: string[];
  featured?: boolean;
}

export interface BookingAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  perPerson?: boolean;
  perDay?: boolean;
}

export interface Booking {
  id: string;
  bookingRef: string;
  createdAt: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  roomsCount: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  idProofType?: string;
  idProofNumber?: string;
  companyName?: string;
  gstNumber?: string;
  specialRequests?: string;
  estimatedArrivalTime?: string;
  selectedAddons: string[];
  mealPlan: 'ep' | 'cp' | 'map'; // EP: Room Only, CP: Bed & Breakfast, MAP: Breakfast + Dinner
  basePrice: number;
  addonsTotal: number;
  discountAmount: number;
  discountCode?: string;
  gstAmount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  paymentStatus: 'pending_at_desk' | 'advance_paid' | 'fully_paid';
  assignedRoomNumber?: string;
  staffNotes?: string;
  source: 'whatsapp_web' | 'direct_call' | 'walk_in' | 'portal';
}

export interface Inquiry {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  inquiryType: 'banquet' | 'corporate_stay' | 'group_booking' | 'restaurant_catering' | 'general';
  eventDate?: string;
  guestsCount?: number;
  message: string;
  status: 'new' | 'contacted' | 'quoted' | 'converted' | 'closed';
  notes?: string;
}

export interface Review {
  id: string;
  guestName: string;
  guestLocation: string;
  rating: number;
  date: string;
  stayType: 'Business' | 'Family' | 'Solo' | 'Couple' | 'Banquet Event';
  comment: string;
  verified: boolean;
  reply?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'starters' | 'main_course' | 'breads_rice' | 'thali' | 'chinese' | 'beverages_desserts';
  isVeg: boolean;
  price: number;
  description: string;
  spicyLevel?: 'mild' | 'medium' | 'spicy';
  isChefSpecial?: boolean;
}

export interface GalleryItem {
  id: string;
  category: 'rooms' | 'dining' | 'banquet' | 'exterior';
  mediaType: 'image' | 'video';
  title: string;
  subtitle: string;
  image: string;
  videoUrl?: string;
}

export interface BanquetHall {
  id: string;
  title: string;
  capacityText: string;
  badge: string;
  badgeColor: string;
  image: string;
  description: string;
  features: string[];
}

export interface AmenityItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  iconName: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  description: string;
  bannerImage: string;
}

export interface LandmarkLocation {
  id: string;
  name: string;
  category: 'transit' | 'industrial' | 'tourism' | 'local';
  distanceKm: number;
  durationText: string;
  destinationQuery: string;
  description: string;
  categoryLabel: string;
  badgeColor?: string;
}

export interface HotelSettings {
  hotelName: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phonePrimary: string;
  phoneSecondary: string;
  landline: string;
  whatsappNumber: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  upiId: string;
  upiPhoneNumber: string;
  gstRate: number; // e.g. 12%
  activeDiscountCode: string;
  activeDiscountPercentage: number;
}

export interface WebsiteCMSData {
  hero: HeroContent;
  rooms: Room[];
  menuItems: MenuItem[];
  gallery: GalleryItem[];
  banquets: BanquetHall[];
  amenities: AmenityItem[];
  destinations: LandmarkLocation[];
  reviews: Review[];
  settings: HotelSettings;
}
