import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  MapPin, BedDouble, Bath, Maximize, Car, Calendar, Building,
  Eye, MessageSquare, Share2, Heart, CheckCircle2, ArrowLeft,
  Phone, Mail, Shield, Star
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockProperties, formatPrice } from '@/lib/mockData'
import { formatDate, cn } from '@/lib/utils'
import PropertyCard from '@/components/properties/PropertyCard'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  return mockProperties.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const property = mockProperties.find((p) => p.slug === params.slug)
  if (!property) return { title: 'Property Not Found' }
  return {
    title: `${property.title} | PLOTIX Reality`,
    description: property.description.slice(0, 160),
  }
}

export default function PropertyDetailPage({ params }: PageProps) {
  const property = mockProperties.find((p) => p.slug === params.slug)
  if (!property) notFound()

  const similar = mockProperties
    .filter((p) => p.id !== property.id && (p.city === property.city || p.type === property.type))
    .slice(0, 3)

  const specs = [
    { icon: BedDouble, label: 'Bedrooms', value: property.bedrooms > 0 ? String(property.bedrooms) : 'N/A' },
    { icon: Bath, label: 'Bathrooms', value: property.bathrooms > 0 ? String(property.bathrooms) : 'N/A' },
    { icon: Maximize, label: 'Total Area', value: `${property.area.toLocaleString('en-IN')} sq.ft` },
    { icon: Car, label: 'Parking', value: property.parking > 0 ? String(property.parking) : 'None' },
    { icon: Building, label: 'Floor', value: property.floor ? `${property.floor} / ${property.totalFloors}` : 'N/A' },
    { icon: Calendar, label: 'Year Built', value: property.yearBuilt ? String(property.yearBuilt) : 'N/A' },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">

        {/* Breadcrumb */}
        <div className="border-b border-stone-100 bg-white">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm font-body text-stone-400">
              <Link href="/" className="hover:text-stone-700 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/properties" className="hover:text-stone-700 transition-colors">Properties</Link>
              <span>/</span>
              <span className="text-stone-600 truncate">{property.title}</span>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── LEFT COLUMN ──────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Image Gallery */}
              <div className="space-y-2">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  {/* Status badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={cn('badge', property.listingFor === 'rent' ? 'badge-rent' : 'badge-sale')}>
                      For {property.listingFor === 'rent' ? 'Rent' : 'Sale'}
                    </span>
                    {property.featured && (
                      <span className="badge badge-featured">⭐ Featured</span>
                    )}
                  </div>
                  {/* Action buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow">
                      <Share2 className="w-4 h-4 text-stone-600" />
                    </button>
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow">
                      <Heart className="w-4 h-4 text-stone-600" />
                    </button>
                  </div>
                </div>
                {property.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {property.images.slice(1).map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-stone-100">
                        <Image src={img} alt={`View ${i + 2}`} fill className="object-cover" sizes="25vw" />
                      </div>
                    ))}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-900 cursor-pointer group">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-sm font-body font-semibold">+{property.images.length} Photos</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="font-display text-3xl font-light text-stone-900 leading-tight">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-2 text-stone-500 text-sm font-body">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      {property.address}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="font-display text-3xl font-semibold text-stone-900">
                      {formatPrice(property.price, property.listingFor)}
                    </div>
                    {property.listingFor === 'sale' && (
                      <div className="text-sm text-stone-400 font-body mt-1">
                        ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
                      </div>
                    )}
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-stone-100">
                  <span className="flex items-center gap-1.5 text-sm font-body text-stone-500">
                    <Eye className="w-4 h-4" /> {property.views.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-body text-stone-500">
                    <MessageSquare className="w-4 h-4" /> {property.inquiryCount} inquiries
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-body text-stone-500">
                    <Calendar className="w-4 h-4" /> Listed {formatDate(property.createdAt)}
                  </span>
                </div>
              </div>

              {/* Key Specs */}
              <div>
                <h2 className="font-display text-xl font-medium text-stone-900 mb-4">Property Specifications</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100">
                      <Icon className="w-5 h-5 text-amber-700 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-body text-stone-400 uppercase tracking-wide">{label}</div>
                        <div className="text-sm font-body font-semibold text-stone-800">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-display text-xl font-medium text-stone-900 mb-3">About This Property</h2>
                <p className="font-body text-stone-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="font-display text-xl font-medium text-stone-900 mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span key={a} className="flex items-center gap-1.5 px-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm font-body text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div>
                <h2 className="font-display text-xl font-medium text-stone-900 mb-4">Location</h2>
                <div className="aspect-video rounded-2xl overflow-hidden border border-stone-200">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDnIoG0enyntSAu8pL_FolU8_zSbyLPzC4&q=${property.latitude},${property.longitude}&zoom=15`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${property.title}`}
                  />
                </div>
                <p className="text-sm font-body text-stone-500 mt-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  {property.address}
                </p>
              </div>
            </div>

            {/* ── RIGHT COLUMN (Sticky) ─────────────────────────────────── */}
            <div className="space-y-5">
              <div className="sticky top-[88px] space-y-5">

                {/* Agent Card */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-card">
                  <h3 className="font-display text-lg font-medium text-stone-900 mb-5">Listed By</h3>
                  <div className="flex items-center gap-4 mb-5 pb-5 border-b border-stone-100">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                      <Image src={property.agent.avatar} alt={property.agent.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div>
                      <div className="font-body font-semibold text-stone-900">{property.agent.name}</div>
                      <div className="text-sm font-body text-stone-500">{property.agent.agency}</div>
                      {property.agent.verified && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-body">
                          <Shield className="w-3 h-3" /> Verified Agent
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <a href={`tel:${property.agent.phone}`} className="btn-primary w-full justify-center gap-2 text-sm py-3 rounded-xl">
                      <Phone className="w-4 h-4" /> {property.agent.phone}
                    </a>
                    <a href={`mailto:${property.agent.email}`} className="btn-secondary w-full justify-center gap-2 text-sm py-3 rounded-xl">
                      <Mail className="w-4 h-4" /> Send Email
                    </a>
                  </div>
                </div>

                {/* Inquiry Form */}
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-card">
                  <h3 className="font-display text-lg font-medium text-stone-900 mb-1">Send Enquiry</h3>
                  <p className="text-sm font-body text-stone-400 mb-5">Get more info or schedule a viewing</p>

                  <div className="space-y-3">
                    <input type="text" placeholder="Your Name" className="input text-sm" />
                    <input type="email" placeholder="Email Address" className="input text-sm" />
                    <input type="tel" placeholder="Phone Number" className="input text-sm" />
                    <textarea
                      placeholder={`I'm interested in ${property.title}. Please share more details.`}
                      rows={3}
                      className="input text-sm resize-none"
                    />
                    <button className="btn-gold w-full justify-center text-sm py-3 rounded-xl">
                      Send Enquiry
                    </button>
                    <p className="text-center text-xs font-body text-stone-400">
                      By submitting, you agree to our{' '}
                      <Link href="/terms" className="underline hover:text-stone-600">Terms</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl font-light text-stone-900">Similar Properties</h2>
                <Link href={`/properties?city=${property.city}`} className="btn-secondary text-sm py-2">
                  View More
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map((p) => (
                  <PropertyCard key={p.id} property={p} viewMode="grid" />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
