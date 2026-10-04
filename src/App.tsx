import React, { useState, useEffect } from 'react';
import { initialWebsiteCMSData } from './data/hotelData';
import { WebsiteCMSData, Room, Booking } from './types/hotel';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RoomsSection } from './components/RoomsSection';
import { BookingModal } from './components/BookingModal';
import { AmenitiesSection } from './components/AmenitiesSection';
import { RestaurantSection } from './components/RestaurantSection';
import { BanquetSection } from './components/BanquetSection';
import { GallerySection } from './components/GallerySection';
import { LocationSection } from './components/LocationSection';
import { ReviewsSection } from './components/ReviewsSection';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [cmsData, setCmsData] = useState<WebsiteCMSData>(initialWebsiteCMSData);
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedInitialRoomId, setSelectedInitialRoomId] = useState<string | undefined>(undefined);
  const [searchParams, setSearchParams] = useState<{
    checkIn: string;
    checkOut: string;
    roomId: string;
    adults: number;
    children: number;
  } | undefined>(undefined);

  // Admin View State
  const [isAdminView, setIsAdminView] = useState(false);

  // Fetch live CMS data from backend on load
  const fetchCMSData = async () => {
    try {
      const res = await fetch('/api/cms');
      const data = await res.json();
      if (data.success && data.data) {
        setCmsData(data.data);
      }
    } catch (err) {
      console.log('Using default local CMS data', err);
    }
  };

  useEffect(() => {
    fetchCMSData();
  }, []);

  // Update specific CMS section
  const handleUpdateCMSSection = async (section: keyof WebsiteCMSData, updatedSectionData: any) => {
    setCmsData((prev) => ({
      ...prev,
      [section]: updatedSectionData,
    }));

    try {
      await fetch('/api/cms/update-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data: updatedSectionData }),
      });
    } catch (err) {
      console.error('Error persisting CMS update:', err);
    }
  };

  // Reset CMS defaults
  const handleResetCMSDefaults = async () => {
    try {
      const res = await fetch('/api/cms/reset-defaults', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.data) {
        setCmsData(data.data);
      }
    } catch (err) {
      console.error('Error resetting CMS:', err);
    }
  };

  const handleOpenBookingModal = (roomId?: string) => {
    setSelectedInitialRoomId(roomId);
    setIsBookingModalOpen(true);
  };

  const handleSearchRooms = (params: {
    checkIn: string;
    checkOut: string;
    roomId: string;
    adults: number;
    children: number;
  }) => {
    setSearchParams(params);
    setSelectedInitialRoomId(params.roomId);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    console.log('New booking recorded:', newBooking.bookingRef);
  };

  if (isAdminView) {
    return (
      <AdminDashboard
        cmsData={cmsData}
        onUpdateCMSSection={handleUpdateCMSSection}
        onResetCMSDefaults={handleResetCMSDefaults}
        onBackToGuestView={() => setIsAdminView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950 font-sans-modern">
      {/* Navigation */}
      <Navbar
        settings={cmsData.settings}
        onOpenBookingModal={() => handleOpenBookingModal()}
      />

      {/* Hero with Search Widget */}
      <Hero
        settings={cmsData.settings}
        rooms={cmsData.rooms}
        heroContent={cmsData.hero}
        onSearchRooms={handleSearchRooms}
        onOpenBookingModal={handleOpenBookingModal}
        currentLang={currentLang}
      />

      {/* Rooms & Suites Showcase */}
      <RoomsSection
        rooms={cmsData.rooms}
        settings={cmsData.settings}
        onBookRoom={(room) => handleOpenBookingModal(room.id)}
        currentLang={currentLang}
      />

      {/* Key Amenities & 24/7 Power Backup */}
      <AmenitiesSection currentLang={currentLang} />

      {/* Surya Rasoi Restaurant & In-Room Food Ordering */}
      <RestaurantSection settings={cmsData.settings} currentLang={currentLang} />

      {/* Grand AC Banquets & Corporate Event Spaces */}
      <BanquetSection
        settings={cmsData.settings}
        banquets={cmsData.banquets}
        currentLang={currentLang}
      />

      {/* Photo Gallery & Visual Tour */}
      <GallerySection items={cmsData.gallery} currentLang={currentLang} />

      {/* Strategic Location & Google Maps */}
      <LocationSection settings={cmsData.settings} currentLang={currentLang} />

      {/* Google Reviews & Verified Feedback */}
      <ReviewsSection currentLang={currentLang} />

      {/* Footer */}
      <Footer
        settings={cmsData.settings}
        onOpenBookingModal={() => handleOpenBookingModal()}
        onOpenAdminPortal={() => setIsAdminView(true)}
        currentLang={currentLang}
      />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        rooms={cmsData.rooms}
        settings={cmsData.settings}
        initialRoomId={selectedInitialRoomId}
        initialSearch={searchParams}
        onBookingSuccess={handleBookingSuccess}
        currentLang={currentLang}
      />

      {/* Floating Direct WhatsApp Button */}
      <a
        href={`https://wa.me/${cmsData.settings.whatsappNumber.replace(
          /[^0-9]/g,
          ''
        )}?text=Hello%20Hotel%20Surya%20Residency,%20I%20would%20like%20to%20book%20a%20room`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer shadow-emerald-500/30"
        aria-label="Direct WhatsApp Message"
        title="Direct WhatsApp Front Desk"
      >
        <MessageSquare className="w-7 h-7 fill-stone-950" />
      </a>
    </div>
  );
}
