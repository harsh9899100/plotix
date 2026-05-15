// ── Property Types ────────────────────────────────────────────────────────────

export type PropertyType = 'residential' | 'commercial' | 'mixed' | 'industrial' | 'agricultural'
export type PropertyStatus = 'active' | 'sold' | 'pending' | 'draft'
export type ListingFor = 'sale' | 'rent'

export interface Agent {
  id: string
  name: string
  phone: string
  email: string
  avatar: string
  agency: string
  verified: boolean
}

export interface Property {
  id: string
  title: string
  slug: string
  description: string
  price: number
  pricePerSqFt: number
  type: PropertyType
  listingFor: ListingFor
  status: PropertyStatus
  bedrooms: number
  bathrooms: number
  kitchens: number
  parking: number
  area: number
  floor?: number
  totalFloors?: number
  city: string
  state: string
  locality: string
  address: string
  latitude: number
  longitude: number
  images: string[]
  amenities: string[]
  featured: boolean
  views: number
  inquiryCount: number
  agent: Agent
  yearBuilt?: number
  furnishing?: 'furnished' | 'semi-furnished' | 'unfurnished'
  createdAt: string
  updatedAt: string
}

// ── Filter Types ───────────────────────────────────────────────────────────────

export interface PropertyFilters {
  search: string
  city: string
  type: PropertyType | ''
  listingFor: ListingFor | ''
  minPrice: number
  maxPrice: number
  minArea: number
  maxArea: number
  bedrooms: number | ''
  bathrooms: number | ''
  furnishing: string
  amenities: string[]
  status: PropertyStatus | ''
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'area-asc' | 'area-desc'
}

export type ViewMode = 'grid' | 'list'

// ── Blog Types ─────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  author: string
  authorAvatar: string
  readTime: number
  viewCount: number
  publishedAt: string
}

// ── Testimonial Types ─────────────────────────────────────────────────────────

export interface Testimonial {
  id: string
  name: string
  role: string
  company?: string
  avatar: string
  rating: number
  message: string
  propertyTitle?: string
}

// ── API Response Types ────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ── User Types ─────────────────────────────────────────────────────────────────

export type UserRole = 'buyer' | 'seller' | 'agent' | 'builder' | 'owner' | 'admin' | 'superadmin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  profileImage?: string
  role: UserRole
  isEmailVerified: boolean
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
}
