// types/index.ts

export type UserRole = "BUYER" | "AGENT" | "BUILDER" | "OWNER" | "ADMIN" | "SUPERADMIN"
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION"
export type PropertyType = "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURAL" | "MIXED"
export type ListingFor = "SALE" | "RENT"
export type PropertyStatus = "DRAFT" | "PENDING_APPROVAL" | "ACTIVE" | "INACTIVE" | "SOLD" | "ARCHIVED"
export type FurnishingStatus = "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED"
export type InquiryStatus = "NEW" | "VIEWED" | "RESPONDED" | "CLOSED"
export type ViewingStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
export type ViewingType = "IN_PERSON" | "VIRTUAL" | "VIDEO_CALL"
export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "VIEWING_SCHEDULED" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST"
export type LeadTemperature = "HOT" | "WARM" | "COLD"
export type RequestStatus = "OPEN" | "MATCHED" | "CLOSED"
export type ProjectStatus = "PRE_LAUNCH" | "LAUNCHED" | "SOLD_OUT" | "COMPLETED"
export type CommissionStatus = "PENDING" | "PAID" | "CANCELLED"
export type NotificationType = "INQUIRY" | "MESSAGE" | "VIEWING" | "PRICE_DROP" | "NEW_LISTING" | "PROPERTY_MATCH" | "PAYMENT" | "SYSTEM"
export type ViewMode = "grid" | "list"

// ── User ──────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  profileImage?: string
  bio?: string
  role: UserRole
  status: UserStatus
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
  agentProfile?: AgentProfile
  builderProfile?: BuilderProfile
}

export interface AgentProfile {
  id: string
  userId: string
  agencyName?: string
  licenseNumber?: string
  licenseExpiry?: Date
  specializations: string[]
  yearsExperience: number
  commissionRate: number
  verified: boolean
  rating: number
  totalSales: number
  totalListings: number
  website?: string
}

export interface BuilderProfile {
  id: string
  userId: string
  companyName: string
  registrationNumber?: string
  yearsInBusiness: number
  numberOfProjects: number
  logo?: string
  website?: string
  verified: boolean
  rating: number
}

// ── Property ──────────────────────────────────────────────────────────────────
export interface Property {
  id: string
  userId: string
  projectId?: string
  title: string
  slug: string
  description: string
  type: PropertyType
  listingFor: ListingFor
  status: PropertyStatus
  furnishing?: FurnishingStatus
  price: number
  pricePerSqFt?: number
  area: number
  bedrooms: number
  bathrooms: number
  kitchens: number
  parking: number
  floor?: number
  totalFloors?: number
  yearBuilt?: number
  city: string
  state: string
  locality?: string
  address: string
  latitude?: number
  longitude?: number
  amenities: string[]
  images: string[]
  virtualTourUrl?: string
  featured: boolean
  views: number
  inquiryCount: number
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
  // Joined fields
  agentName?: string
  agentPhone?: string
  agentAvatar?: string
  agentVerified?: boolean
  agentAgency?: string
}

// ── Project ───────────────────────────────────────────────────────────────────
export interface Project {
  id: string
  builderId: string
  title: string
  slug: string
  description: string
  type: PropertyType
  status: ProjectStatus
  city: string
  state: string
  address: string
  latitude?: number
  longitude?: number
  totalUnits: number
  unitsAvailable: number
  startDate?: Date
  completionDate?: Date
  masterPlanImage?: string
  amenities: string[]
  images: string[]
  brochureUrl?: string
  verified: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

// ── Inquiry ───────────────────────────────────────────────────────────────────
export interface Inquiry {
  id: string
  propertyId: string
  buyerId: string
  agentId?: string
  name: string
  email: string
  phone?: string
  message: string
  status: InquiryStatus
  response?: string
  respondedAt?: Date
  createdAt: Date
  property?: Property
  buyer?: User
}

// ── Viewing ───────────────────────────────────────────────────────────────────
export interface Viewing {
  id: string
  propertyId: string
  buyerId: string
  agentId?: string
  scheduledAt: Date
  duration: number
  type: ViewingType
  status: ViewingStatus
  location?: string
  notes?: string
  buyerFeedback?: string
  buyerRating?: number
  cancelledAt?: Date
  cancelReason?: string
  createdAt: Date
  property?: Property
  buyer?: User
  agent?: User
}

// ── Lead ──────────────────────────────────────────────────────────────────────
export interface Lead {
  id: string
  agentId: string
  name: string
  email?: string
  phone?: string
  source?: string
  status: LeadStatus
  temperature: LeadTemperature
  score: number
  budget?: number
  notes?: string
  propertyType?: PropertyType
  cities: string[]
  createdAt: Date
  updatedAt: Date
}

// ── Message ───────────────────────────────────────────────────────────────────
export interface Message {
  id: string
  senderId: string
  receiverId: string
  propertyId?: string
  content: string
  type: "TEXT" | "IMAGE" | "DOCUMENT" | "VOICE"
  attachments: string[]
  isRead: boolean
  readAt?: Date
  createdAt: Date
  sender?: User
  receiver?: User
}

export interface Conversation {
  userId: string
  user: User
  lastMessage: Message
  unreadCount: number
}

// ── Notification ──────────────────────────────────────────────────────────────
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  relatedId?: string
  isRead: boolean
  createdAt: Date
}

// ── Blog ──────────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: string
  authorId: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  category?: string
  tags: string[]
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  viewCount: number
  readTime: number
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  author?: { name: string; avatar?: string }
}

// ── Testimonial ───────────────────────────────────────────────────────────────
export interface Testimonial {
  id: string
  rating: number
  message: string
  displayName?: string
  role?: string
  company?: string
  avatar?: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: Date
}

// ── Commission ────────────────────────────────────────────────────────────────
export interface Commission {
  id: string
  agentId: string
  propertyId?: string
  amount: number
  rate: number
  status: CommissionStatus
  paidAt?: Date
  notes?: string
  createdAt: Date
}

// ── Filters ───────────────────────────────────────────────────────────────────
export interface PropertyFilters {
  search: string
  city: string
  type: PropertyType | ""
  listingFor: ListingFor | ""
  minPrice: number
  maxPrice: number
  minArea: number
  maxArea: number
  bedrooms: number | ""
  bathrooms: number | ""
  furnishing: FurnishingStatus | ""
  amenities: string[]
  status: PropertyStatus | ""
  featured: boolean | ""
  sortBy: "newest" | "price-asc" | "price-desc" | "popular" | "area-asc" | "area-desc"
}

// ── API Responses ─────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T = void> {
  success?: string
  error?: string
  data?: T
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export interface StatCard {
  label: string
  value: string | number
  change?: string
  changeType?: "up" | "down" | "neutral"
  icon?: React.ElementType
  color?: string
  href?: string
}

export interface ChartDataPoint {
  month: string
  [key: string]: number | string
}
