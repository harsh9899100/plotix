// lib/data/mock.ts
import type { Property, User, BlogPost, Testimonial, Lead, Inquiry, Viewing, Commission } from "@/types"

// ── Users ──────────────────────────────────────────────────────────────────────
export const MOCK_USERS = {
  buyer: {
    id: "u_buyer1", firstName: "Arjun", lastName: "Mehta",
    email: "arjun@demo.com", role: "BUYER", status: "ACTIVE",
    phone: "9876543210", profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    createdAt: new Date("2024-01-15"),
  },
  agent: {
    id: "u_agent1", firstName: "Priya", lastName: "Sharma",
    email: "priya@demo.com", role: "AGENT", status: "ACTIVE",
    phone: "9765432109", profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    createdAt: new Date("2023-06-10"),
  },
  builder: {
    id: "u_builder1", firstName: "Vikram", lastName: "Patel",
    email: "vikram@demo.com", role: "BUILDER", status: "ACTIVE",
    phone: "9654321098", profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    createdAt: new Date("2023-03-22"),
  },
}

// ── Properties ────────────────────────────────────────────────────────────────
export const MOCK_PROPERTIES: any[] = [
  {
    id: "p1", slug: "luxurious-4bhk-penthouse-vesu-surat",
    title: "Luxurious 4BHK Penthouse in Vesu",
    description: "Experience unparalleled luxury in this stunning penthouse with panoramic city views, private terrace, and premium finishes throughout.",
    type: "RESIDENTIAL", listingFor: "SALE", status: "ACTIVE",
    price: 18500000, pricePerSqFt: 6000, area: 3083,
    bedrooms: 4, bathrooms: 4, kitchens: 1, parking: 2,
    floor: 28, totalFloors: 30, yearBuilt: 2022,
    city: "Surat", state: "Gujarat", locality: "Vesu",
    address: "Sky High Tower, Vesu, Surat - 395007",
    latitude: 21.1567, longitude: 72.7850,
    amenities: ["Swimming Pool","Gym","Terrace","Security","Power Backup","Clubhouse"],
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"],
    featured: true, views: 1842, inquiryCount: 47,
    furnishing: "FURNISHED",
    agentName: "Priya Sharma", agentPhone: "+91 97654 32109",
    agentAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    agentVerified: true, agentAgency: "Sharma Properties",
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "p2", slug: "modern-3bhk-apartment-adajan-surat",
    title: "Modern 3BHK Apartment in Adajan",
    description: "Beautifully designed 3BHK apartment in the heart of Adajan with premium amenities and excellent connectivity.",
    type: "RESIDENTIAL", listingFor: "SALE", status: "ACTIVE",
    price: 9200000, pricePerSqFt: 4100, area: 2244,
    bedrooms: 3, bathrooms: 3, kitchens: 1, parking: 1,
    floor: 12, totalFloors: 20, yearBuilt: 2023,
    city: "Surat", state: "Gujarat", locality: "Adajan",
    address: "Platinum Residency, Adajan, Surat - 395009",
    latitude: 21.2051, longitude: 72.8073,
    amenities: ["Swimming Pool","Gym","Security","Power Backup","Parking","Garden"],
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"],
    featured: true, views: 1203, inquiryCount: 28,
    furnishing: "SEMI_FURNISHED",
    agentName: "Rohan Mehta", agentPhone: "+91 98765 43210",
    agentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    agentVerified: true, agentAgency: "Mehta Realty Group",
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "p3", slug: "premium-office-space-athwa-surat",
    title: "Premium Office Space in Athwa",
    description: "State-of-the-art commercial office in Surat's prime business district with smart building infrastructure.",
    type: "COMMERCIAL", listingFor: "SALE", status: "ACTIVE",
    price: 25000000, pricePerSqFt: 7200, area: 3472,
    bedrooms: 0, bathrooms: 6, kitchens: 1, parking: 10,
    floor: 8, totalFloors: 15, yearBuilt: 2021,
    city: "Surat", state: "Gujarat", locality: "Athwa",
    address: "Business Hub, Athwa, Surat - 395001",
    latitude: 21.1839, longitude: 72.8328,
    amenities: ["Lift","Parking","Security","Power Backup","Conference Room","Cafeteria"],
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"],
    featured: false, views: 634, inquiryCount: 15,
    furnishing: "FURNISHED",
    agentName: "Arjun Patel", agentPhone: "+91 76543 21098",
    agentAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    agentVerified: true, agentAgency: "Patel Ventures",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "p4", slug: "cozy-2bhk-rent-piplod-surat",
    title: "Cozy 2BHK Flat for Rent in Piplod",
    description: "Well-maintained 2BHK flat in the serene Piplod area, perfect for families.",
    type: "RESIDENTIAL", listingFor: "RENT", status: "ACTIVE",
    price: 25000, pricePerSqFt: 25, area: 1000,
    bedrooms: 2, bathrooms: 2, kitchens: 1, parking: 1,
    floor: 4, totalFloors: 8, yearBuilt: 2018,
    city: "Surat", state: "Gujarat", locality: "Piplod",
    address: "Green Valley Apts, Piplod, Surat - 395007",
    latitude: 21.1620, longitude: 72.7782,
    amenities: ["Security","Power Backup","Parking","Garden"],
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"],
    featured: false, views: 389, inquiryCount: 12,
    furnishing: "SEMI_FURNISHED",
    agentName: "Nisha Kapoor", agentPhone: "+91 65432 10987",
    agentAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    agentVerified: false, agentAgency: "Kapoor Estates",
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "p5", slug: "spectacular-villa-sg-highway-ahmedabad",
    title: "Spectacular Villa in SG Highway",
    description: "A breathtaking 5BHK villa with private pool, lush garden, home theater, and double-height living room.",
    type: "RESIDENTIAL", listingFor: "SALE", status: "ACTIVE",
    price: 45000000, pricePerSqFt: 5000, area: 9000,
    bedrooms: 5, bathrooms: 6, kitchens: 2, parking: 4,
    yearBuilt: 2023,
    city: "Ahmedabad", state: "Gujarat", locality: "SG Highway",
    address: "Prestige Villas, SG Highway, Ahmedabad - 380054",
    latitude: 23.0385, longitude: 72.5060,
    amenities: ["Private Pool","Garden","Home Theater","Gym","Security","Smart Home"],
    images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=800&h=600&fit=crop"],
    featured: true, views: 3211, inquiryCount: 89,
    furnishing: "FURNISHED",
    agentName: "Priya Sharma", agentPhone: "+91 97654 32109",
    agentAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    agentVerified: true, agentAgency: "Sharma Properties",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "p6", slug: "sea-view-4bhk-worli-mumbai",
    title: "Sea-View 4BHK in Worli",
    description: "Rare sea-facing 4BHK on the 32nd floor of an iconic tower in Worli. Unobstructed Arabian Sea views.",
    type: "RESIDENTIAL", listingFor: "SALE", status: "ACTIVE",
    price: 120000000, pricePerSqFt: 50000, area: 2400,
    bedrooms: 4, bathrooms: 5, kitchens: 1, parking: 2,
    floor: 32, totalFloors: 40, yearBuilt: 2022,
    city: "Mumbai", state: "Maharashtra", locality: "Worli",
    address: "Sea View Tower, Worli, Mumbai - 400018",
    latitude: 19.0036, longitude: 72.8182,
    amenities: ["Sea View","Private Pool","Gym","Concierge","Spa","Home Theater"],
    images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop"],
    featured: true, views: 5621, inquiryCount: 134,
    furnishing: "FURNISHED",
    agentName: "Rohan Mehta", agentPhone: "+91 98765 43210",
    agentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    agentVerified: true, agentAgency: "Mehta Realty Group",
    createdAt: new Date("2024-01-20"),
  },
]

// ── Blog Posts ─────────────────────────────────────────────────────────────────
export const MOCK_BLOG_POSTS: any[] = [
  {
    id: "b1", slug: "top-10-things-check-before-buying-property-india",
    title: "Top 10 Things to Check Before Buying a Property in India",
    excerpt: "Buying a property is one of the most significant financial decisions you'll ever make. Here's your comprehensive checklist to ensure a smooth transaction.",
    content: `<h2>1. Verify Property Title</h2><p>Always verify the property title through a registered lawyer. Check for any encumbrances, liens, or legal disputes.</p><h2>2. RERA Registration</h2><p>Ensure the project is registered under RERA (Real Estate Regulatory Authority) for your state.</p><h2>3. Check Approved Building Plan</h2><p>Verify that the construction matches the approved building plan from municipal authorities.</p><h2>4. Location & Connectivity</h2><p>Check proximity to schools, hospitals, metro stations, and highways. Visit at different times of day.</p><h2>5. Builder's Track Record</h2><p>Research the developer's past projects, delivery timelines, and quality standards.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop",
    category: "Buying Guide", tags: ["buying","tips","india","real-estate"],
    readTime: 8, viewCount: 12453,
    author: { name: "Rohan Mehta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    publishedAt: new Date("2024-03-10"),
  },
  {
    id: "b2", slug: "surat-real-estate-market-trends-forecast-2024",
    title: "Surat Real Estate Market: Trends & Forecast 2024",
    excerpt: "Surat's real estate market is booming with unprecedented growth. Explore the key drivers, hotspot localities, and investment opportunities.",
    content: `<h2>Market Overview</h2><p>Surat has emerged as one of India's fastest-growing real estate markets, driven by its thriving textile and diamond industries.</p><h2>Top Localities to Invest</h2><p>Areas like Vesu, Adajan, Pal, and Dumas Road are witnessing significant appreciation in property values.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop",
    category: "Market Trends", tags: ["surat","market","2024","investment"],
    readTime: 6, viewCount: 8921,
    author: { name: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" },
    publishedAt: new Date("2024-03-05"),
  },
  {
    id: "b3", slug: "home-loan-guide-best-rate-2024",
    title: "Home Loan Guide: Getting the Best Rate in 2024",
    excerpt: "Navigate the home loan landscape with confidence. Learn how to compare offers, negotiate rates, and choose the best financing option.",
    content: `<h2>Understanding Home Loan Interest Rates</h2><p>Home loan rates vary significantly between banks and NBFCs. Currently, rates range from 8.5% to 11% per annum.</p><h2>Fixed vs Floating Rate</h2><p>Fixed rates offer stability but are typically 0.5-1% higher than floating rates. Floating rates are linked to repo rate.</p>`,
    featuredImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    category: "Finance", tags: ["home-loan","finance","interest-rate","guide"],
    readTime: 10, viewCount: 15672,
    author: { name: "Arjun Patel", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    publishedAt: new Date("2024-02-28"),
  },
]

// ── Testimonials ───────────────────────────────────────────────────────────────
export const MOCK_TESTIMONIALS: any[] = [
  {
    id: "t1", rating: 5,
    message: "PLOTIX made finding our dream home incredibly easy. The map view helped us compare locations in real-time. Highly recommended!",
    displayName: "Vikram Desai", role: "Software Engineer", company: "Infosys",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    status: "APPROVED",
  },
  {
    id: "t2", rating: 5,
    message: "The property comparison tool saved us weeks of research. We compared 8 properties side-by-side and made our decision confidently.",
    displayName: "Kavya Nair", role: "Business Owner",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    status: "APPROVED",
  },
  {
    id: "t3", rating: 5,
    message: "Sold my property in just 3 weeks! The analytics dashboard showed me exactly how many people viewed my listing.",
    displayName: "Rahul Gupta", role: "Chartered Accountant",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face",
    status: "APPROVED",
  },
]

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export const BUYER_STATS = {
  favorites: 12, savedSearches: 5, inquiries: 8, viewings: 3,
  propertyRequests: 2, comparisons: 1, notifications: 7,
}

export const AGENT_STATS = {
  totalListings: 28, activeListings: 22, soldListings: 6,
  totalInquiries: 143, newInquiries: 12, totalLeads: 67,
  hotLeads: 8, viewingsScheduled: 9, totalRevenue: 8500000,
  commissionEarned: 425000, conversionRate: 18.5,
}

export const BUILDER_STATS = {
  totalProjects: 5, activeProjects: 3, totalUnits: 450,
  unitsSold: 312, unitsAvailable: 138, totalRevenue: 187500000,
  totalInquiries: 892, totalLeads: 234, totalBrokers: 45,
}

export const ADMIN_STATS = {
  totalUsers: 3420, totalBuyers: 2800, totalAgents: 480, totalBuilders: 65,
  totalProperties: 8920, activeProperties: 7240, pendingApproval: 145,
  totalInquiries: 15680, platformRevenue: 24500000,
  newUsersThisMonth: 342, newPropertiesThisMonth: 218,
}

// ── Analytics Chart Data ───────────────────────────────────────────────────────
export const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 18500000, inquiries: 320 },
  { month: "Feb", revenue: 22000000, inquiries: 410 },
  { month: "Mar", revenue: 19800000, inquiries: 380 },
  { month: "Apr", revenue: 25600000, inquiries: 520 },
  { month: "May", revenue: 28900000, inquiries: 580 },
  { month: "Jun", revenue: 31200000, inquiries: 640 },
  { month: "Jul", revenue: 27400000, inquiries: 510 },
  { month: "Aug", revenue: 33100000, inquiries: 690 },
  { month: "Sep", revenue: 29800000, inquiries: 620 },
  { month: "Oct", revenue: 36500000, inquiries: 750 },
  { month: "Nov", revenue: 34200000, inquiries: 700 },
  { month: "Dec", revenue: 38900000, inquiries: 810 },
]

export const PROPERTY_TYPE_DIST = [
  { name: "Residential", value: 68, color: "#6366f1" },
  { name: "Commercial",  value: 18, color: "#f59e0b" },
  { name: "Mixed Use",   value: 8,  color: "#10b981" },
  { name: "Industrial",  value: 4,  color: "#3b82f6" },
  { name: "Agricultural",value: 2,  color: "#8b5cf6" },
]

export const USER_GROWTH = [
  { month: "Jul", buyers: 2100, agents: 420, builders: 48 },
  { month: "Aug", buyers: 2280, agents: 440, builders: 52 },
  { month: "Sep", buyers: 2450, agents: 455, builders: 56 },
  { month: "Oct", buyers: 2600, agents: 462, builders: 59 },
  { month: "Nov", buyers: 2720, agents: 470, builders: 62 },
  { month: "Dec", buyers: 2800, agents: 480, builders: 65 },
]

export const LEAD_PIPELINE = [
  { stage: "New Leads",         count: 234, color: "#6366f1" },
  { stage: "Contacted",         count: 189, color: "#3b82f6" },
  { stage: "Qualified",         count: 124, color: "#10b981" },
  { stage: "Viewing Scheduled", count: 67,  color: "#f59e0b" },
  { stage: "Negotiation",       count: 28,  color: "#f97316" },
  { stage: "Closed Won",        count: 14,  color: "#22c55e" },
]

// ── CITIES ────────────────────────────────────────────────────────────────────
export const CITIES = ["Surat","Ahmedabad","Mumbai","Bangalore","Pune","Gurgaon","Noida","Delhi","Hyderabad","Chennai","Kolkata","Jaipur","Rajkot","Vadodara","Bhopal"]

export const AMENITIES_LIST = [
  "Swimming Pool","Gym","Security","Power Backup","Parking","Garden",
  "Clubhouse","Smart Home","Lift","Terrace","Solar Power","EV Charging",
  "Conference Room","Cafeteria","Home Theater","Private Pool","Jogging Track",
  "Co-working Space","Children Play Area","Indoor Games","Spa","Business Center",
]
