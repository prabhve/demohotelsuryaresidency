import React, { useState, useEffect } from 'react';
import {
  Booking,
  Inquiry,
  HotelSettings,
  Room,
  MenuItem,
  GalleryItem,
  BanquetHall,
  AmenityItem,
  HeroContent,
  LandmarkLocation,
  Review,
  WebsiteCMSData
} from '../types/hotel';
import { generateStaffReplyWhatsAppUrl } from '../utils/whatsapp';
import {
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Search,
  Plus,
  MessageSquare,
  Phone,
  FileSpreadsheet,
  Printer,
  Settings,
  ShieldCheck,
  BedDouble,
  Building,
  RefreshCw,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronDown,
  X,
  Sparkles,
  ArrowRight,
  Utensils,
  Image as ImageIcon,
  Video,
  Layers,
  Star,
  MapPin,
  Save,
  Check,
  AlertCircle,
  LayoutDashboard,
  Sliders,
  RotateCcw,
  Menu
} from 'lucide-react';

interface AdminDashboardProps {
  cmsData: WebsiteCMSData;
  onUpdateCMSSection: (section: keyof WebsiteCMSData, data: any) => Promise<void>;
  onResetCMSDefaults: () => Promise<void>;
  onBackToGuestView: () => void;
}

type SidebarTab =
  | 'overview'
  | 'bookings'
  | 'walkin'
  | 'inquiries'
  | 'rooms_cms'
  | 'menu_cms'
  | 'media_cms'
  | 'banquets_cms'
  | 'hero_cms'
  | 'amenities_cms'
  | 'reviews_cms'
  | 'locations_cms'
  | 'settings_cms';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  cmsData,
  onUpdateCMSSection,
  onResetCMSDefaults,
  onBackToGuestView,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('overview');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Search & Filters for Bookings
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Walk-in Form State
  const [walkinGuestName, setWalkinGuestName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinEmail, setWalkinEmail] = useState('');
  const [walkinRoomId, setWalkinRoomId] = useState(cmsData.rooms[0]?.id || 'deluxe-room');
  const [walkinCheckIn, setWalkinCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [walkinCheckOut, setWalkinCheckOut] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [walkinAdults, setWalkinAdults] = useState(1);
  const [walkinAssignedRoom, setWalkinAssignedRoom] = useState('Room 101');
  const [walkinPrice, setWalkinPrice] = useState(1850);
  const [walkinPaymentStatus, setWalkinPaymentStatus] = useState<
    'pending_at_desk' | 'advance_paid' | 'fully_paid'
  >('fully_paid');

  // Local Editable States for CMS
  const [localHero, setLocalHero] = useState<HeroContent>(cmsData.hero);
  const [localRooms, setLocalRooms] = useState<Room[]>(cmsData.rooms);
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>(cmsData.menuItems);
  const [localGallery, setLocalGallery] = useState<GalleryItem[]>(cmsData.gallery);
  const [localBanquets, setLocalBanquets] = useState<BanquetHall[]>(cmsData.banquets);
  const [localAmenities, setLocalAmenities] = useState<AmenityItem[]>(cmsData.amenities);
  const [localDestinations, setLocalDestinations] = useState<LandmarkLocation[]>(cmsData.destinations);
  const [localReviews, setLocalReviews] = useState<Review[]>(cmsData.reviews);
  const [localSettings, setLocalSettings] = useState<HotelSettings>(cmsData.settings);

  // Modals for CMS adding/editing
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingMedia, setEditingMedia] = useState<GalleryItem | null>(null);
  const [editingBanquet, setEditingBanquet] = useState<BanquetHall | null>(null);

  // Sync when prop updates
  useEffect(() => {
    setLocalHero(cmsData.hero);
    setLocalRooms(cmsData.rooms);
    setLocalMenuItems(cmsData.menuItems);
    setLocalGallery(cmsData.gallery);
    setLocalBanquets(cmsData.banquets);
    setLocalAmenities(cmsData.amenities);
    setLocalDestinations(cmsData.destinations);
    setLocalReviews(cmsData.reviews);
    setLocalSettings(cmsData.settings);
  }, [cmsData]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch bookings and inquiries
  const fetchBookingsAndInquiries = async () => {
    setLoading(true);
    try {
      const [bookingsRes, inquiriesRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/inquiries'),
      ]);
      const bookingsData = await bookingsRes.json();
      const inquiriesData = await inquiriesRes.json();

      if (bookingsData.success) setBookings(bookingsData.data || []);
      if (inquiriesData.success) setInquiries(inquiriesData.data || []);
      showNotification('Latest booking & inquiry data refreshed!');
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsAndInquiries();
  }, []);

  const handleSelectTab = (tab: SidebarTab) => {
    setActiveTab(tab);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update booking status
  const handleUpdateBookingStatus = async (
    bookingId: string,
    updates: Partial<Booking>
  ) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, ...updates } : b))
        );
        showNotification('Booking updated successfully');
      }
    } catch (err) {
      console.error('Error updating booking:', err);
    }
  };

  // Delete booking
  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to remove this booking record?')) return;
    try {
      await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      showNotification('Booking record deleted');
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  // Create Walkin Booking
  const handleCreateWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    const room = localRooms.find((r) => r.id === walkinRoomId) || localRooms[0];

    const newBookingPayload: Partial<Booking> = {
      bookingRef: `SR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      roomId: room.id,
      roomName: room.name,
      checkIn: walkinCheckIn,
      checkOut: walkinCheckOut,
      nights: 1,
      adults: walkinAdults,
      children: 0,
      roomsCount: 1,
      guestName: walkinGuestName,
      guestPhone: walkinPhone,
      guestEmail: walkinEmail,
      assignedRoomNumber: walkinAssignedRoom,
      mealPlan: 'cp',
      selectedAddons: [],
      basePrice: walkinPrice,
      addonsTotal: 0,
      discountAmount: 0,
      gstAmount: Math.round(walkinPrice * 0.12),
      totalAmount: Math.round(walkinPrice * 1.12),
      status: 'checked_in',
      paymentStatus: walkinPaymentStatus,
      source: 'walk_in',
      staffNotes: 'Front Desk Walk-In entry',
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookingPayload),
      });
      const data = await res.json();
      if (data.success) {
        setBookings([data.data, ...bookings]);
        showNotification('Walk-in booking created and guest checked in!');
        handleSelectTab('bookings');
        setWalkinGuestName('');
        setWalkinPhone('');
      }
    } catch (err) {
      console.error('Error creating walk-in:', err);
    }
  };

  // Update inquiry status
  const handleUpdateInquiryStatus = async (
    inquiryId: string,
    status: Inquiry['status']
  ) => {
    try {
      await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setInquiries((prev) =>
        prev.map((i) => (i.id === inquiryId ? { ...i, status } : i))
      );
      showNotification('Inquiry status updated');
    } catch (err) {
      console.error('Error updating inquiry:', err);
    }
  };

  // CMS Save Handlers
  const handleSaveHeroCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateCMSSection('hero', localHero);
    showNotification('Hero & Welcome section updated live on website!');
  };

  const handleSaveSettingsCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateCMSSection('settings', localSettings);
    showNotification('Hotel settings & WhatsApp number updated live!');
  };

  const handleSaveRoomModal = async (roomData: Room) => {
    const exists = localRooms.some((r) => r.id === roomData.id);
    const updatedRooms = exists
      ? localRooms.map((r) => (r.id === roomData.id ? roomData : r))
      : [roomData, ...localRooms];

    setLocalRooms(updatedRooms);
    await onUpdateCMSSection('rooms', updatedRooms);
    setEditingRoom(null);
    showNotification('Room details & tariff saved live!');
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room type?')) return;
    const updatedRooms = localRooms.filter((r) => r.id !== roomId);
    setLocalRooms(updatedRooms);
    await onUpdateCMSSection('rooms', updatedRooms);
    showNotification('Room category removed');
  };

  const handleSaveMenuItemModal = async (menuData: MenuItem) => {
    const exists = localMenuItems.some((m) => m.id === menuData.id);
    const updated = exists
      ? localMenuItems.map((m) => (m.id === menuData.id ? menuData : m))
      : [menuData, ...localMenuItems];

    setLocalMenuItems(updated);
    await onUpdateCMSSection('menuItems', updated);
    setEditingMenuItem(null);
    showNotification('Surya Rasoi dish updated live on menu!');
  };

  const handleDeleteMenuItem = async (menuId: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    const updated = localMenuItems.filter((m) => m.id !== menuId);
    setLocalMenuItems(updated);
    await onUpdateCMSSection('menuItems', updated);
    showNotification('Dish removed from menu');
  };

  const handleSaveMediaModal = async (mediaData: GalleryItem) => {
    const exists = localGallery.some((g) => g.id === mediaData.id);
    const updated = exists
      ? localGallery.map((g) => (g.id === mediaData.id ? mediaData : g))
      : [mediaData, ...localGallery];

    setLocalGallery(updated);
    await onUpdateCMSSection('gallery', updated);
    setEditingMedia(null);
    showNotification('Photo/Video media saved live to gallery!');
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this photo/video?')) return;
    const updated = localGallery.filter((g) => g.id !== mediaId);
    setLocalGallery(updated);
    await onUpdateCMSSection('gallery', updated);
    showNotification('Photo/Video removed from gallery');
  };

  const handleSaveBanquetModal = async (banquetData: BanquetHall) => {
    const exists = localBanquets.some((b) => b.id === banquetData.id);
    const updated = exists
      ? localBanquets.map((b) => (b.id === banquetData.id ? banquetData : b))
      : [banquetData, ...localBanquets];

    setLocalBanquets(updated);
    await onUpdateCMSSection('banquets', updated);
    setEditingBanquet(null);
    showNotification('Banquet hall & boardroom specs updated live!');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Ref ID',
      'Guest Name',
      'Phone',
      'Room',
      'Assigned Room',
      'Check In',
      'Check Out',
      'Guests',
      'Total (₹)',
      'Status',
      'Payment Status',
      'Source',
    ];
    const rows = bookings.map((b) => [
      b.bookingRef,
      `"${b.guestName}"`,
      `"${b.guestPhone}"`,
      `"${b.roomName}"`,
      `"${b.assignedRoomNumber || 'N/A'}"`,
      b.checkIn,
      b.checkOut,
      b.adults,
      b.totalAmount,
      b.status,
      b.paymentStatus,
      b.source,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Hotel_Surya_Residency_Bookings_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.guestPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.assignedRoomNumber && b.assignedRoomNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && b.status === statusFilter;
  });

  // Analytics Stats
  const totalRevenue = bookings.reduce((sum, b) => (b.status !== 'cancelled' ? sum + b.totalAmount : sum), 0);
  const checkedInCount = bookings.filter((b) => b.status === 'checked_in').length;
  const inquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  const sidebarMenuItems: {
    id: SidebarTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    group: 'management' | 'cms';
  }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, group: 'management' },
    { id: 'bookings', label: 'Reservations & WA', icon: Calendar, badge: bookings.length, group: 'management' },
    { id: 'walkin', label: 'Add Walk-In Desk Stay', icon: Plus, group: 'management' },
    { id: 'inquiries', label: 'Banquet & Event Leads', icon: Building, badge: inquiriesCount, group: 'management' },
    { id: 'rooms_cms', label: 'Rooms & Tariffs CMS', icon: BedDouble, badge: localRooms.length, group: 'cms' },
    { id: 'menu_cms', label: 'Surya Rasoi Menu CMS', icon: Utensils, badge: localMenuItems.length, group: 'cms' },
    { id: 'media_cms', label: 'Photos & Videos CMS', icon: ImageIcon, badge: localGallery.length, group: 'cms' },
    { id: 'banquets_cms', label: 'Banquets & Halls CMS', icon: Layers, group: 'cms' },
    { id: 'hero_cms', label: 'Hero & Welcome CMS', icon: Sliders, group: 'cms' },
    { id: 'amenities_cms', label: 'Amenities CMS', icon: ShieldCheck, group: 'cms' },
    { id: 'reviews_cms', label: 'Guest Reviews CMS', icon: Star, group: 'cms' },
    { id: 'locations_cms', label: 'Locations & Routes CMS', icon: MapPin, group: 'cms' },
    { id: 'settings_cms', label: 'Hotel & WhatsApp Config', icon: Settings, group: 'cms' },
  ];

  const currentActiveItem = sidebarMenuItems.find((m) => m.id === activeTab);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-amber-500 text-stone-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 text-stone-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MOBILE TOP BAR (Visible only on mobile/tablet screens) */}
      <header className="md:hidden sticky top-0 z-40 bg-stone-900 border-b border-stone-800 p-3 flex items-center justify-between shadow-lg">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950 border border-amber-500/40 text-amber-300 font-bold text-xs"
        >
          <Menu className="w-4 h-4 text-amber-400" />
          <span>{currentActiveItem?.label || 'Menu'}</span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        </button>

        <button
          onClick={onBackToGuestView}
          className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold flex items-center gap-1 shadow-md"
        >
          <span>Exit Admin</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* DESKTOP PERSISTENT LEFT SIDEBAR + MOBILE SLIDE-OUT DRAWER */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:static w-72 bg-stone-900/98 md:bg-stone-900/95 border-r border-stone-800 flex flex-col justify-between shrink-0 p-4 transition-transform duration-300 ease-in-out ${
          mobileDrawerOpen
            ? 'translate-x-0 shadow-2xl'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header in Sidebar */}
          <div className="flex items-center justify-between pb-4 mb-3 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-stone-950 rounded-[9px] flex items-center justify-center font-serif-luxury font-bold text-base text-amber-400">
                  S
                </div>
              </div>
              <div>
                <h2 className="font-serif-luxury text-sm font-bold text-stone-100 tracking-wider">
                  SURYA CONTROL
                </h2>
                <span className="text-[9px] text-amber-400 font-semibold block uppercase">
                  A-to-Z Hotel CMS & PMS
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Return to Website button */}
          <button
            onClick={onBackToGuestView}
            className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-between mb-4 cursor-pointer"
          >
            <span>Back to Guest Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Sidebar Menu Groups */}
          <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-210px)] pr-1">
            {/* Group 1: Front Desk Operations */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block px-2.5 mb-1.5">
                Front Desk Operations
              </span>
              <div className="space-y-1">
                {sidebarMenuItems
                  .filter((item) => item.group === 'management')
                  .map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                            : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isActive ? 'bg-stone-950 text-amber-400' : 'bg-stone-800 text-stone-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Group 2: Website CMS & Media */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block px-2.5 mb-1.5">
                Website CMS & Content
              </span>
              <div className="space-y-1">
                {sidebarMenuItems
                  .filter((item) => item.group === 'cms')
                  .map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                            : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isActive ? 'bg-stone-950 text-amber-400' : 'bg-stone-800 text-stone-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-3 border-t border-stone-800/80 space-y-2">
          <button
            onClick={fetchBookingsAndInquiries}
            disabled={loading}
            className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Data</span>
          </button>

          <button
            onClick={async () => {
              if (confirm('Reset entire website CMS back to default hotel setup?')) {
                await onResetCMSDefaults();
                showNotification('Website CMS restored to defaults!');
              }
            }}
            className="w-full py-1 px-3 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-rose-950/20 text-[10px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset CMS Defaults</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        ></div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        {/* Top Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-stone-800">
          <div>
            <h1 className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-100 flex items-center gap-2">
              <span>{currentActiveItem?.label}</span>
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Live Real-Time Management for Hotel Surya Residency (Vindhyanagar, Singrauli)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live CMS Active</span>
            </span>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-lg">
                <span className="text-xs text-stone-400 block">Total Active Bookings</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-serif-luxury font-bold text-stone-100">
                    {bookings.length}
                  </span>
                  <span className="text-xs text-amber-400 font-bold">Web & WhatsApp</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-lg">
                <span className="text-xs text-stone-400 block">Estimated Revenue</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-serif-luxury font-bold text-amber-400">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">Active Stays</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-lg">
                <span className="text-xs text-stone-400 block">Checked In Guests</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-serif-luxury font-bold text-emerald-400">
                    {checkedInCount}
                  </span>
                  <span className="text-xs text-stone-400">In Rooms</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-lg">
                <span className="text-xs text-stone-400 block">New Event Inquiries</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-serif-luxury font-bold text-purple-400">
                    {inquiriesCount}
                  </span>
                  <span className="text-xs text-stone-400">Needs Response</span>
                </div>
              </div>
            </div>

            {/* Quick CMS Jump Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => handleSelectTab('rooms_cms')}
                className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 transition-all cursor-pointer space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <BedDouble className="w-5 h-5" />
                </div>
                <h3 className="font-serif-luxury font-bold text-base text-stone-100">
                  Rooms & Tariffs CMS
                </h3>
                <p className="text-xs text-stone-400">
                  {localRooms.length} room types configured with live pricing & photos.
                </p>
              </div>

              <div
                onClick={() => handleSelectTab('menu_cms')}
                className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 transition-all cursor-pointer space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="font-serif-luxury font-bold text-base text-stone-100">
                  Surya Rasoi Menu CMS
                </h3>
                <p className="text-xs text-stone-400">
                  {localMenuItems.length} dishes in North Indian, Biryanis, Thalis & Starters.
                </p>
              </div>

              <div
                onClick={() => handleSelectTab('media_cms')}
                className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/50 transition-all cursor-pointer space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h3 className="font-serif-luxury font-bold text-base text-stone-100">
                  Photos & Media CMS
                </h3>
                <p className="text-xs text-stone-400">
                  {localGallery.length} gallery photos & promotional video links.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. LIVE BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Filter and Export Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-stone-900 border border-stone-800">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search guest, phone, ref, room..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-100 outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-300 outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked_in">Checked In</option>
                  <option value="checked_out">Checked Out</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="rounded-2xl bg-stone-900 border border-stone-800 overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs text-stone-300 min-w-[650px]">
                <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-800">
                  <tr>
                    <th className="p-4">Ref & Guest</th>
                    <th className="p-4">Room & Dates</th>
                    <th className="p-4">Assigned Room</th>
                    <th className="p-4">Amount & Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-500">
                        No reservations found matching current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-amber-300 font-mono">
                            #{booking.bookingRef}
                          </div>
                          <div className="font-bold text-stone-100 text-sm mt-0.5">
                            {booking.guestName}
                          </div>
                          <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{booking.guestPhone}</span>
                          </div>
                          {booking.companyName && (
                            <span className="text-[10px] text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded mt-1 inline-block">
                              {booking.companyName}
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-stone-200">{booking.roomName}</div>
                          <div className="text-[11px] text-stone-400 mt-0.5">
                            {booking.checkIn} → {booking.checkOut} ({booking.nights} night
                            {booking.nights > 1 ? 's' : ''})
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5">
                            {booking.adults} Adults • {booking.mealPlan.toUpperCase()}
                          </div>
                        </td>

                        <td className="p-4">
                          <input
                            type="text"
                            placeholder="e.g. Room 204"
                            defaultValue={booking.assignedRoomNumber || ''}
                            onBlur={(e) =>
                              handleUpdateBookingStatus(booking.id, {
                                assignedRoomNumber: e.target.value,
                              })
                            }
                            className="w-28 bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold outline-none focus:border-amber-500"
                          />
                        </td>

                        <td className="p-4">
                          <div className="font-serif-luxury font-bold text-sm text-stone-100">
                            ₹{booking.totalAmount.toLocaleString('en-IN')}
                          </div>
                          <select
                            value={booking.paymentStatus}
                            onChange={(e) =>
                              handleUpdateBookingStatus(booking.id, {
                                paymentStatus: e.target.value as any,
                              })
                            }
                            className={`mt-1 text-[10px] font-bold rounded px-1.5 py-0.5 border outline-none ${
                              booking.paymentStatus === 'fully_paid'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                : booking.paymentStatus === 'advance_paid'
                                ? 'bg-blue-950 text-blue-300 border-blue-700'
                                : 'bg-amber-950 text-amber-300 border-amber-700'
                            }`}
                          >
                            <option value="pending_at_desk">Pending at Desk</option>
                            <option value="advance_paid">Advance Paid</option>
                            <option value="fully_paid">Fully Paid</option>
                          </select>
                        </td>

                        <td className="p-4">
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              handleUpdateBookingStatus(booking.id, {
                                status: e.target.value as any,
                              })
                            }
                            className={`text-xs font-bold rounded-lg px-2 py-1 border outline-none ${
                              booking.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : booking.status === 'checked_in'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : booking.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : booking.status === 'checked_out'
                                ? 'bg-stone-800 text-stone-300 border-stone-700'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="confirmed">✅ Confirmed</option>
                            <option value="checked_in">🏨 Checked In</option>
                            <option value="checked_out">👋 Checked Out</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={generateStaffReplyWhatsAppUrl(
                                booking.guestPhone,
                                'confirm',
                                booking,
                                localSettings
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 hover:bg-emerald-900 transition-colors"
                              title="Send WhatsApp Confirmation"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>

                            <a
                              href={generateStaffReplyWhatsAppUrl(
                                booking.guestPhone,
                                'checkin_guide',
                                booking,
                                localSettings
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-blue-950 border border-blue-700 text-blue-300 hover:bg-blue-900 transition-colors"
                              title="Send Map Pin & Route Guide"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <a
                              href={`tel:${booking.guestPhone}`}
                              className="p-1.5 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 hover:text-amber-400 transition-colors"
                              title="Call Guest"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ADD WALKIN TAB */}
        {activeTab === 'walkin' && (
          <div className="max-w-2xl rounded-2xl bg-stone-900 border border-stone-800 p-5 sm:p-8 shadow-xl">
            <h3 className="font-serif-luxury text-xl font-bold text-stone-100 mb-2">
              Add New Walk-In / Phone Reservation
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Create an instant direct entry into the reservation system for counter check-in guests.
            </p>

            <form onSubmit={handleCreateWalkin} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Guest Name"
                    value={walkinGuestName}
                    onChange={(e) => setWalkinGuestName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXXXXXXX"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Room Category
                  </label>
                  <select
                    value={walkinRoomId}
                    onChange={(e) => setWalkinRoomId(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 outline-none"
                  >
                    {localRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} (₹{r.pricePerNight})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Assigned Room Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 102"
                    value={walkinAssignedRoom}
                    onChange={(e) => setWalkinAssignedRoom(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={walkinCheckIn}
                    onChange={(e) => setWalkinCheckIn(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={walkinCheckOut}
                    onChange={(e) => setWalkinCheckOut(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Negotiated Tariff (₹)
                  </label>
                  <input
                    type="number"
                    value={walkinPrice}
                    onChange={(e) => setWalkinPrice(parseInt(e.target.value, 10))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Payment Status
                  </label>
                  <select
                    value={walkinPaymentStatus}
                    onChange={(e) => setWalkinPaymentStatus(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 outline-none"
                  >
                    <option value="fully_paid">Fully Paid (Cash / UPI)</option>
                    <option value="advance_paid">Advance Paid</option>
                    <option value="pending_at_desk">Pay on Checkout</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg cursor-pointer"
                >
                  Save & Check In Guest
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. BANQUET & CORPORATE LEADS */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-stone-900 border border-stone-800 overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs text-stone-300 min-w-[650px]">
                <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-800">
                  <tr>
                    <th className="p-4">Client Name & Phone</th>
                    <th className="p-4">Inquiry Type</th>
                    <th className="p-4">Event Date & Guests</th>
                    <th className="p-4">Message / Requirement</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">WhatsApp Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-500">
                        No banquet inquiries received yet.
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-stone-800/40">
                        <td className="p-4">
                          <strong className="text-stone-100 text-sm block">{inq.name}</strong>
                          <span className="text-stone-400">{inq.phone}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase">
                            {inq.inquiryType}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            Date: <strong>{inq.eventDate || 'Flexible'}</strong>
                          </div>
                          <div className="text-stone-400 mt-0.5">Guests: {inq.guestsCount || 'N/A'}</div>
                        </td>
                        <td className="p-4 max-w-xs">
                          <p className="line-clamp-2 text-stone-300">{inq.message}</p>
                        </td>
                        <td className="p-4">
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              handleUpdateInquiryStatus(inq.id, e.target.value as any)
                            }
                            className="bg-stone-950 border border-stone-700 rounded-lg px-2 py-1 text-xs text-stone-300 outline-none"
                          >
                            <option value="new">🆕 New Lead</option>
                            <option value="contacted">📞 Contacted</option>
                            <option value="quoted">📝 Quoted</option>
                            <option value="converted">🎉 Converted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={`https://wa.me/${inq.phone.replace(
                              /[^0-9]/g,
                              ''
                            )}?text=Hello%20${encodeURIComponent(
                              inq.name
                            )},%20greetings%20from%20Hotel%20Surya%20Residency!%20Regarding%20your%20banquet%20event%20inquiry...`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Reply on WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. ROOMS & TARIFFS CMS */}
        {activeTab === 'rooms_cms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-stone-100">
                  Rooms & Suites Management
                </h3>
                <p className="text-xs text-stone-400">
                  Edit prices per night, room titles, photos, bed specs, and descriptions.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingRoom({
                    id: `room-${Date.now()}`,
                    name: 'New Luxury Room',
                    category: 'deluxe',
                    tagline: 'Spacious room with modern amenities',
                    pricePerNight: 2000,
                    originalPrice: 2600,
                    capacity: { adults: 2, children: 1 },
                    bedType: '1 King Bed',
                    size: '300 sq. ft.',
                    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
                    gallery: [
                      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
                    ],
                    description: 'Fully furnished air-conditioned room with high-speed Wi-Fi and power backup.',
                    amenities: ['Air Conditioning', 'Free Wi-Fi', 'Smart TV', 'Hot Shower'],
                    highlights: ['24/7 Power Backup', 'City View'],
                    featured: false,
                  })
                }
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Room Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localRooms.map((room) => (
                <div
                  key={room.id}
                  className="p-4 sm:p-5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full sm:w-24 h-40 sm:h-24 rounded-xl object-cover shrink-0 border border-stone-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif-luxury font-bold text-base text-stone-100 truncate">
                          {room.name}
                        </h4>
                        {room.featured && (
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-stone-950 text-[10px] font-bold uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-amber-400 mt-0.5">{room.tagline}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-base font-serif-luxury font-bold text-amber-400">
                          ₹{room.pricePerNight}
                        </span>
                        <span className="text-xs text-stone-500 line-through">
                          ₹{room.originalPrice}
                        </span>
                        <span className="text-[11px] text-stone-400">/ night</span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">{room.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-medium truncate max-w-[150px]">
                      {room.bedType}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingRoom(room)}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-400 text-xs cursor-pointer"
                        title="Delete Room"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. SURYA RASOI MENU CMS */}
        {activeTab === 'menu_cms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-stone-100">
                  Surya Rasoi Restaurant Menu CMS
                </h3>
                <p className="text-xs text-stone-400">
                  Add, edit, or delete dishes, prices, descriptions (what's in it), and Most Popular tags.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingMenuItem({
                    id: `m-${Date.now()}`,
                    name: 'New Chef Special Dish',
                    category: 'main_course',
                    isVeg: true,
                    price: 250,
                    description: 'Prepared fresh with rich Indian spices and authentic ingredients.',
                    isChefSpecial: true,
                  })
                }
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border ${
                            item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          ></span>
                        </span>
                        <span className="text-[10px] uppercase font-bold text-stone-400">
                          {item.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </div>

                      {item.isChefSpecial && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          ★ Most Popular
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif-luxury font-bold text-base text-stone-100">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                    <span className="text-base font-serif-luxury font-bold text-amber-400">
                      ₹{item.price}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingMenuItem(item)}
                        className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="p-1 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. PHOTOS & MEDIA CMS */}
        {activeTab === 'media_cms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-stone-100">
                  Photos & Media Gallery CMS
                </h3>
                <p className="text-xs text-stone-400">
                  Upload and manage photo URLs and promotional video links for rooms, dining, banquets, and hotel facade.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingMedia({
                    id: `g-${Date.now()}`,
                    category: 'rooms',
                    mediaType: 'image',
                    title: 'New Gallery Photo / Video',
                    subtitle: 'Hotel Surya Residency Vindhyanagar',
                    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
                  })
                }
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo / Video</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {localGallery.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden flex flex-col justify-between shadow-lg"
                >
                  <div className="relative h-40">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-stone-950/80 text-amber-300 text-[10px] font-bold uppercase">
                      {item.category}
                    </span>
                    {item.mediaType === 'video' && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1">
                        <Video className="w-3 h-3" /> Video
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif-luxury font-bold text-sm text-stone-100 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 truncate mt-0.5">{item.subtitle}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between">
                      <button
                        onClick={() => setEditingMedia(item)}
                        className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteMedia(item.id)}
                        className="p-1 rounded bg-rose-950/50 hover:bg-rose-900 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. BANQUETS CMS */}
        {activeTab === 'banquets_cms' && (
          <div className="space-y-6">
            <h3 className="font-serif-luxury text-lg font-bold text-stone-100">
              Banquets, Ballrooms & Meeting Halls CMS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localBanquets.map((hall) => (
                <div
                  key={hall.id}
                  className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden flex flex-col justify-between"
                >
                  <div className="h-48 relative">
                    <img src={hall.image} alt={hall.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-bold">
                      {hall.badge}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif-luxury font-bold text-lg text-stone-100">
                        {hall.title}
                      </h4>
                      <span className="text-xs text-amber-400 font-bold bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
                        {hall.capacityText}
                      </span>
                    </div>

                    <p className="text-xs text-stone-400 leading-relaxed">{hall.description}</p>

                    <div className="pt-3 border-t border-stone-800 flex justify-end">
                      <button
                        onClick={() => setEditingBanquet(hall)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Hall Specs</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. HERO & PAGE CONTENT CMS */}
        {activeTab === 'hero_cms' && (
          <div className="max-w-3xl rounded-2xl bg-stone-900 border border-stone-800 p-5 sm:p-8 space-y-5">
            <h3 className="font-serif-luxury text-xl font-bold text-stone-100 mb-2">
              Hero Header & Welcome Section Content
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Update the main headline, background banner image, and intro paragraph seen by visitors.
            </p>

            <form onSubmit={handleSaveHeroCMS} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Top Golden Badge Text
                </label>
                <input
                  type="text"
                  value={localHero.badge}
                  onChange={(e) => setLocalHero({ ...localHero, badge: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Main Title Prefix
                  </label>
                  <input
                    type="text"
                    value={localHero.title}
                    onChange={(e) => setLocalHero({ ...localHero, title: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Highlighted Title (Gold Text)
                  </label>
                  <input
                    type="text"
                    value={localHero.highlightText}
                    onChange={(e) => setLocalHero({ ...localHero, highlightText: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-amber-400 font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Subtitle Tagline
                </label>
                <input
                  type="text"
                  value={localHero.subtitle}
                  onChange={(e) => setLocalHero({ ...localHero, subtitle: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-200 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Introductory Paragraph
                </label>
                <textarea
                  rows={3}
                  value={localHero.description}
                  onChange={(e) => setLocalHero({ ...localHero, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-200 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Hero Background Image URL
                </label>
                <input
                  type="url"
                  value={localHero.bannerImage}
                  onChange={(e) => setLocalHero({ ...localHero, bannerImage: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-200 font-mono outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Hero Content Live</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 10. AMENITIES CMS */}
        {activeTab === 'amenities_cms' && (
          <div className="space-y-6">
            <h3 className="font-serif-luxury text-lg font-bold text-stone-100">
              Hotel Facilities & Amenities CMS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {localAmenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2"
                >
                  <span className="px-2 py-0.5 rounded bg-stone-950 text-amber-400 text-[10px] font-bold">
                    {amenity.badge}
                  </span>
                  <h4 className="font-serif-luxury font-bold text-sm text-stone-100">
                    {amenity.title}
                  </h4>
                  <p className="text-xs text-stone-400">{amenity.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. REVIEWS CMS */}
        {activeTab === 'reviews_cms' && (
          <div className="space-y-6">
            <h3 className="font-serif-luxury text-lg font-bold text-stone-100">
              Guest Reviews & Feedback Management
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {localReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-100 text-sm">{rev.guestName}</span>
                    <span className="text-amber-400 font-bold text-xs">⭐ {rev.rating} / 5</span>
                  </div>
                  <p className="text-xs text-stone-400 italic">"{rev.comment}"</p>
                  <span className="text-[11px] text-stone-500 block">
                    {rev.guestLocation} • {rev.stayType} Stay
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. LOCATIONS & ROUTES CMS */}
        {activeTab === 'locations_cms' && (
          <div className="space-y-6">
            <h3 className="font-serif-luxury text-lg font-bold text-stone-100">
              Landmarks & Navigation Routes CMS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {localDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-100 text-sm">{dest.name}</span>
                    <span className="text-amber-400 text-xs font-bold font-mono">
                      {dest.distanceKm} km
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">{dest.description}</p>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Query: {dest.destinationQuery}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 13. SETTINGS & WHATSAPP CONFIG */}
        {activeTab === 'settings_cms' && (
          <div className="max-w-3xl rounded-2xl bg-stone-900 border border-stone-800 p-5 sm:p-8 space-y-5 shadow-xl">
            <h3 className="font-serif-luxury text-xl font-bold text-stone-100 mb-2">
              Hotel Details & WhatsApp Dispatch Configuration
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Update the WhatsApp phone number receiving booking messages, contact details, UPI address, and active discount codes.
            </p>

            <form onSubmit={handleSaveSettingsCMS} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    WhatsApp Booking Number (With Country Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={localSettings.whatsappNumber}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })
                    }
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-emerald-300 font-bold outline-none"
                  />
                  <span className="text-[10px] text-stone-500">e.g. 919926741071</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Primary Reception Mobile *
                  </label>
                  <input
                    type="text"
                    required
                    value={localSettings.phonePrimary}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, phonePrimary: e.target.value })
                    }
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Reception Landline
                  </label>
                  <input
                    type="text"
                    value={localSettings.landline}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, landline: e.target.value })
                    }
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Reception UPI ID (For Advance Payments)
                  </label>
                  <input
                    type="text"
                    value={localSettings.upiId}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, upiId: e.target.value })
                    }
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Active Direct Discount Code
                  </label>
                  <input
                    type="text"
                    value={localSettings.activeDiscountCode}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, activeDiscountCode: e.target.value })
                    }
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 font-bold uppercase outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={localSettings.activeDiscountPercentage}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        activeDiscountPercentage: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 font-bold outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* MODAL: EDIT ROOM */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif-luxury font-bold text-lg text-stone-100">
                Edit Room Specs & Pricing
              </h3>
              <button
                onClick={() => setEditingRoom(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveRoomModal(editingRoom);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Room Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRoom.name}
                    onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Category Tag
                  </label>
                  <select
                    value={editingRoom.category}
                    onChange={(e) =>
                      setEditingRoom({ ...editingRoom, category: e.target.value as any })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  >
                    <option value="deluxe">Executive Deluxe</option>
                    <option value="super-deluxe">Super Deluxe</option>
                    <option value="suite">Royal Suite</option>
                    <option value="family">Family Quad</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Price Per Night (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingRoom.pricePerNight}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        pricePerNight: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editingRoom.originalPrice}
                    onChange={(e) =>
                      setEditingRoom({
                        ...editingRoom,
                        originalPrice: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-300 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Bed Type *
                  </label>
                  <input
                    type="text"
                    value={editingRoom.bedType}
                    onChange={(e) => setEditingRoom({ ...editingRoom, bedType: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Room Size (e.g. 340 sq. ft.)
                  </label>
                  <input
                    type="text"
                    value={editingRoom.size}
                    onChange={(e) => setEditingRoom({ ...editingRoom, size: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Tagline / Highlights Subtitle
                </label>
                <input
                  type="text"
                  value={editingRoom.tagline}
                  onChange={(e) => setEditingRoom({ ...editingRoom, tagline: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingRoom.description}
                  onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Cover Photo Image URL
                </label>
                <input
                  type="url"
                  value={editingRoom.image}
                  onChange={(e) => setEditingRoom({ ...editingRoom, image: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={editingRoom.featured || false}
                  onChange={(e) => setEditingRoom({ ...editingRoom, featured: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <label htmlFor="featured-checkbox" className="text-xs text-stone-200">
                  Mark as "Top Choice / Featured" room on homepage
                </label>
              </div>

              <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT MENU ITEM */}
      {editingMenuItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif-luxury font-bold text-lg text-stone-100">
                Edit Surya Rasoi Dish
              </h3>
              <button
                onClick={() => setEditingMenuItem(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveMenuItemModal(editingMenuItem);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Dish Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingMenuItem.name}
                  onChange={(e) =>
                    setEditingMenuItem({ ...editingMenuItem, name: e.target.value })
                  }
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingMenuItem.price}
                    onChange={(e) =>
                      setEditingMenuItem({
                        ...editingMenuItem,
                        price: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={editingMenuItem.category}
                    onChange={(e) =>
                      setEditingMenuItem({
                        ...editingMenuItem,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  >
                    <option value="starters">Tandoor & Starters</option>
                    <option value="main_course">Main Curries</option>
                    <option value="breads_rice">Breads & Biryani</option>
                    <option value="thali">Royal Thalis</option>
                    <option value="chinese">Chinese</option>
                    <option value="beverages_desserts">Desserts & Drinks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  What is in this dish? (Description / Ingredients) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingMenuItem.description}
                  onChange={(e) =>
                    setEditingMenuItem({ ...editingMenuItem, description: e.target.value })
                  }
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs text-stone-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.isVeg}
                    onChange={(e) =>
                      setEditingMenuItem({ ...editingMenuItem, isVeg: e.target.checked })
                    }
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span>Pure Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-stone-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.isChefSpecial || false}
                    onChange={(e) =>
                      setEditingMenuItem({
                        ...editingMenuItem,
                        isChefSpecial: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>★ Most Popular Tag</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMenuItem(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT MEDIA */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif-luxury font-bold text-lg text-stone-100">
                Edit Photo / Video Media
              </h3>
              <button
                onClick={() => setEditingMedia(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveMediaModal(editingMedia);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingMedia.title}
                  onChange={(e) => setEditingMedia({ ...editingMedia, title: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editingMedia.subtitle}
                  onChange={(e) => setEditingMedia({ ...editingMedia, subtitle: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={editingMedia.category}
                    onChange={(e) =>
                      setEditingMedia({ ...editingMedia, category: e.target.value as any })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  >
                    <option value="rooms">Rooms & Suites</option>
                    <option value="dining">Surya Rasoi Dining</option>
                    <option value="banquet">Banquets & Meetings</option>
                    <option value="exterior">Lobby & Facade</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Media Type
                  </label>
                  <select
                    value={editingMedia.mediaType}
                    onChange={(e) =>
                      setEditingMedia({ ...editingMedia, mediaType: e.target.value as any })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  >
                    <option value="image">Photo Image</option>
                    <option value="video">Video URL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Photo URL / Thumbnail *
                </label>
                <input
                  type="url"
                  required
                  value={editingMedia.image}
                  onChange={(e) => setEditingMedia({ ...editingMedia, image: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono outline-none"
                />
              </div>

              {editingMedia.mediaType === 'video' && (
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Video Stream / YouTube URL
                  </label>
                  <input
                    type="url"
                    value={editingMedia.videoUrl || ''}
                    onChange={(e) =>
                      setEditingMedia({ ...editingMedia, videoUrl: e.target.value })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono outline-none"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                >
                  Save Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT BANQUET */}
      {editingBanquet && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif-luxury font-bold text-lg text-stone-100">
                Edit Banquet Venue Specs
              </h3>
              <button
                onClick={() => setEditingBanquet(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveBanquetModal(editingBanquet);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Hall Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingBanquet.title}
                  onChange={(e) =>
                    setEditingBanquet({ ...editingBanquet, title: e.target.value })
                  }
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Capacity Text
                  </label>
                  <input
                    type="text"
                    value={editingBanquet.capacityText}
                    onChange={(e) =>
                      setEditingBanquet({ ...editingBanquet, capacityText: e.target.value })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={editingBanquet.badge}
                    onChange={(e) =>
                      setEditingBanquet({ ...editingBanquet, badge: e.target.value })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingBanquet.description}
                  onChange={(e) =>
                    setEditingBanquet({ ...editingBanquet, description: e.target.value })
                  }
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Cover Photo URL
                </label>
                <input
                  type="url"
                  value={editingBanquet.image}
                  onChange={(e) =>
                    setEditingBanquet({ ...editingBanquet, image: e.target.value })
                  }
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono outline-none"
                />
              </div>

              <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBanquet(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                >
                  Save Banquet Specs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
