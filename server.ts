import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialWebsiteCMSData } from './src/data/hotelData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// In-Memory Database Store for CMS, Bookings, Inquiries
let websiteCMS = JSON.parse(JSON.stringify(initialWebsiteCMSData));

interface StoredBooking {
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
  companyName?: string;
  specialRequests?: string;
  estimatedArrivalTime?: string;
  selectedAddons: string[];
  mealPlan: 'ep' | 'cp' | 'map';
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

interface StoredInquiry {
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

let bookings: StoredBooking[] = [
  {
    id: 'b-101',
    bookingRef: 'SR-2026-9812',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    roomId: 'super-deluxe-room',
    roomName: 'Super Deluxe Premium Room',
    checkIn: '2026-10-10',
    checkOut: '2026-10-13',
    nights: 3,
    adults: 2,
    children: 0,
    roomsCount: 1,
    guestName: 'Arvind Kumar Mishra',
    guestPhone: '+91 98391 22019',
    guestEmail: 'arvind.mishra@powergrid.in',
    companyName: 'NTPC Vindhyachal Vendor Team',
    specialRequests: 'Need quiet room on 2nd floor and invoice with company GSTIN.',
    estimatedArrivalTime: '2:00 PM',
    selectedAddons: ['breakfast-buffet'],
    mealPlan: 'cp',
    basePrice: 7350,
    addonsTotal: 1494,
    discountAmount: 735,
    discountCode: 'SURYA10',
    gstAmount: 973,
    totalAmount: 9474,
    status: 'confirmed',
    paymentStatus: 'advance_paid',
    assignedRoomNumber: 'Room 204',
    staffNotes: 'Advance token received via GPay. Reserved 204.',
    source: 'whatsapp_web',
  },
  {
    id: 'b-102',
    bookingRef: 'SR-2026-9813',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    roomId: 'royal-executive-suite',
    roomName: 'Royal Executive Suite',
    checkIn: '2026-10-15',
    checkOut: '2026-10-18',
    nights: 3,
    adults: 2,
    children: 1,
    roomsCount: 1,
    guestName: 'Dr. Saurabh Pandey',
    guestPhone: '+91 94152 44331',
    guestEmail: 'saurabh.pandey@gmail.com',
    specialRequests: 'Arrangement for Renukoot station pickup at 4 PM.',
    estimatedArrivalTime: '4:30 PM',
    selectedAddons: ['station-pickup-renukoot', 'breakfast-buffet'],
    mealPlan: 'map',
    basePrice: 10950,
    addonsTotal: 2694,
    discountAmount: 1095,
    discountCode: 'SURYA10',
    gstAmount: 1505,
    totalAmount: 16064,
    status: 'pending',
    paymentStatus: 'pending_at_desk',
    assignedRoomNumber: 'Room 301',
    staffNotes: 'Guest will pay cash on check-in.',
    source: 'whatsapp_web',
  },
  {
    id: 'b-103',
    bookingRef: 'SR-2026-9814',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    roomId: 'deluxe-room',
    roomName: 'Executive Deluxe Room',
    checkIn: '2026-10-04',
    checkOut: '2026-10-05',
    nights: 1,
    adults: 1,
    children: 0,
    roomsCount: 1,
    guestName: 'Manish Tiwari',
    guestPhone: '+91 91299 87654',
    guestEmail: 'm.tiwari@bhel.co.in',
    companyName: 'BHEL Technical Delegation',
    selectedAddons: [],
    mealPlan: 'ep',
    basePrice: 1850,
    addonsTotal: 0,
    discountAmount: 185,
    discountCode: 'SURYA10',
    gstAmount: 200,
    totalAmount: 1865,
    status: 'checked_in',
    paymentStatus: 'fully_paid',
    assignedRoomNumber: 'Room 105',
    staffNotes: 'Counter check-in done.',
    source: 'walk_in',
  },
];

let inquiries: StoredInquiry[] = [
  {
    id: 'inq-201',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    name: 'Suresh Agrawal & Family',
    phone: '+91 94252 88711',
    email: 'suresh.agrawal@gmail.com',
    inquiryType: 'banquet',
    eventDate: '2026-11-20',
    guestsCount: 220,
    message: 'Wedding Reception function requirement with stage floral decor, vegetarian buffet, and 8 guest rooms for family.',
    status: 'new',
    notes: 'Called client, discussed per-plate catering package of ₹550/pax.',
  },
  {
    id: 'inq-202',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    name: 'Alok Gupta (NTPC Project Manager)',
    phone: '+91 99360 11223',
    email: 'alok.gupta@ntpc.co.in',
    inquiryType: 'corporate_stay',
    eventDate: '2026-10-25',
    guestsCount: 12,
    message: 'Need 6 Executive Deluxe rooms for 5 nights for our technical inspection engineers at NTPC Vindhyanagar.',
    status: 'quoted',
    notes: 'Offered special corporate tariff with breakfast included.',
  },
];

// --- API ROUTES ---

// 1. Full Website CMS Data
app.get('/api/cms', (_req: Request, res: Response) => {
  res.json({ success: true, data: websiteCMS });
});

// Update specific CMS Section (e.g. rooms, menuItems, gallery, banquets, hero, amenities, destinations, reviews, settings)
app.post('/api/cms/update-section', (req: Request, res: Response) => {
  const { section, data } = req.body;
  if (!section || data === undefined) {
    res.status(400).json({ success: false, message: 'Section name and data are required' });
    return;
  }
  websiteCMS[section] = data;
  res.json({
    success: true,
    data: websiteCMS[section],
    message: `Section "${section}" updated successfully in CMS`,
  });
});

// Reset CMS to Default Seed Data
app.post('/api/cms/reset-defaults', (_req: Request, res: Response) => {
  websiteCMS = JSON.parse(JSON.stringify(initialWebsiteCMSData));
  res.json({ success: true, data: websiteCMS, message: 'Website CMS reset to default successfully' });
});

// Get/Set Hotel Settings (legacy backwards compatibility)
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json({ success: true, data: websiteCMS.settings });
});

app.post('/api/settings', (req: Request, res: Response) => {
  websiteCMS.settings = { ...websiteCMS.settings, ...req.body };
  res.json({ success: true, data: websiteCMS.settings, message: 'Hotel settings updated successfully' });
});

// 2. Bookings CRUD
app.get('/api/bookings', (_req: Request, res: Response) => {
  res.json({ success: true, data: bookings });
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const newBooking: StoredBooking = {
    id: `b-${Date.now()}`,
    bookingRef: `SR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: req.body.status || 'pending',
    paymentStatus: req.body.paymentStatus || 'pending_at_desk',
    source: req.body.source || 'whatsapp_web',
    ...req.body,
  };

  bookings.unshift(newBooking);
  res.status(201).json({
    success: true,
    data: newBooking,
    message: 'Booking recorded successfully',
  });
});

app.patch('/api/bookings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = bookings.findIndex((b) => b.id === id || b.bookingRef === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Booking not found' });
    return;
  }

  bookings[index] = { ...bookings[index], ...req.body };
  res.json({
    success: true,
    data: bookings[index],
    message: 'Booking status updated successfully',
  });
});

app.delete('/api/bookings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  bookings = bookings.filter((b) => b.id !== id && b.bookingRef !== id);
  res.json({ success: true, message: 'Booking deleted successfully' });
});

// 3. Banquet & Corporate Inquiries CRUD
app.get('/api/inquiries', (_req: Request, res: Response) => {
  res.json({ success: true, data: inquiries });
});

app.post('/api/inquiries', (req: Request, res: Response) => {
  const newInquiry: StoredInquiry = {
    id: `inq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'new',
    name: req.body.name || 'Anonymous Guest',
    phone: req.body.phone || '',
    email: req.body.email || '',
    inquiryType: req.body.inquiryType || 'general',
    eventDate: req.body.eventDate,
    guestsCount: req.body.guestsCount,
    message: req.body.message || '',
    notes: req.body.notes || '',
  };

  inquiries.unshift(newInquiry);
  res.status(201).json({ success: true, data: newInquiry, message: 'Inquiry received' });
});

app.patch('/api/inquiries/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = inquiries.findIndex((i) => i.id === id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Inquiry not found' });
    return;
  }
  inquiries[index] = { ...inquiries[index], ...req.body };
  res.json({ success: true, data: inquiries[index], message: 'Inquiry updated' });
});

// Setup Vite middleware in dev mode or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏨 Hotel Surya Residency Server running on port ${PORT}`);
  });
}

startServer();
