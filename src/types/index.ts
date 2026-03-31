// =========================
// USER
// =========================
export type UserRole = "admin" | "organizer" | "attendee";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// =========================
// EVENT ENUMS
// =========================
export type EventCategory =
  | "music"
  | "business"
  | "wellness"
  | "food"
  | "arts"
  | "sports"
  | "education"
  | "social"
  | "other";

export type EventType = "free" | "paid";

export type EventStatus =
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled";

// =========================
// ORGANIZER
// =========================
export interface Organizer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  specialties?: EventCategory[];
  location?: string;
  rating?: number;
  reviewCount?: number;
  eventsHosted?: number;
  totalAttendees?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  portfolio?: string[];
  services?: string[];
  isVerified?: boolean;
  isFeatured?: boolean;
  socialLinks?: {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  availability?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// =========================
// EVENT (MERGED SAFE)
// =========================
export interface Event {
  _id?: string;
  id?: string;

  title: string;

  // ✅ BOTH SUPPORT
  description?: string;
  shortDescription?: string;

  image?: string;

  category?: EventCategory;
  type?: EventType;

  price: number;
  currency?: string;

  // ✅ SUPPORT BOTH BACKEND + UI
  date?: string;
  startDate?: Date;
  endDate?: Date;

  location: string;

  venueId?: string;

  // ✅ BOTH CASES SUPPORTED
  organizerId: string | Organizer;

  organizer?: {
    _id: string;
    name?: string;
  } | string;

  organizerName?: string;
  organizerAvatar?: string;

  capacity: number;
  registered: number;

  status: EventStatus;

  rating: number;
  reviewCount: number;

  tags: string[];

  isFeatured: boolean;

  gallery?: string[];

  createdAt: Date;
  updatedAt: Date;
}

// =========================
// VENUE
// =========================
export interface Venue {
  id: string;
  name: string;
  description: string;
  images: string[];
  location: string;
  address: string;
  capacity: {
    min: number;
    max: number;
  };
  amenities: string[];
  pricePerHour: number;
  currency: string;
  rating: number;
  reviewCount: number;
  category: string;
  isFeatured: boolean;
  contactInfo: {
    phone: string;
    email: string;
  };
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// =========================
// BOOKING
// =========================
export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  tickets: number;
  totalAmount: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled" | "refunded";
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod?: string;
  bookingDate: Date;
  eventDate: Date;
  qrCode?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// =========================
// ORGANIZER BOOKING
// =========================
export interface OrganizerBooking {
  id: string;
  organizerId: string;
  organizerName: string;
  userId: string;
  userName: string;
  userEmail: string;
  eventType: string;
  eventDate: Date;
  duration: number;
  location: string;
  budget: number;
  requirements: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "completed" | "failed";
  totalAmount: number;
  currency: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// =========================
// REVIEW
// =========================
export interface Review {
  id: string;
  targetId: string;
  targetType: "event" | "organizer" | "venue";
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// =========================
// TESTIMONIAL
// =========================
export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  content: string;
  rating: number;
  eventType: string;
}

// =========================
// STATS
// =========================
export interface PlatformStats {
  totalEvents: number;
  totalAttendees: number;
  totalOrganizers: number;
  satisfactionRate: number;
}

// =========================
// FILTERS
// =========================
export interface EventFilters {
  category?: EventCategory;
  type?: EventType;
  dateRange?: "today" | "this-week" | "this-month" | "upcoming";
  priceRange?: { min: number; max: number };
  location?: string;
  searchQuery?: string;
}

// =========================
// NOTIFICATION
// =========================
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  link?: string;
  createdAt: Date;
}