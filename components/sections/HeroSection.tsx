'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, ChevronDown } from 'lucide-react'
import { CITIES } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const LISTING_OPTIONS = [
  { value: 'sale', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
]

const HERO_STATS = [
  { label: 'Listed Properties', value: '12,400+' },
  { label: 'Verified Agents', value: '3,200+' },
  { label: 'Happy Families', value: '28,000+' },
  { label: 'Cities Covered', value: '85+' },
]

export default function HeroSection() {
  const router = useRouter()
  const [listingFor, setListingFor] = useState<'sale' | 'rent'>('sale')
  const [city, setCity] = useState('')
  const [searchQ, setSearchQ] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (listingFor) params.set('listingFor', listingFor)
    if (city) params.set('city', city)
    if (searchQ) params.set('search', searchQ)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&h=1200&fit=crop&q=80"
          alt="Hero property"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-900/50 to-stone-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/40 via-transparent to-transparent" />
      </div>

      {/* Decorative grain texture */}
      <div className="absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-white/80 text-xs font-body font-medium tracking-wider uppercase">
            India's Premium Property Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-white font-light leading-none mb-6 animate-fade-up">
          <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-2">
            Find Your
          </span>
          <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
            Dream{' '}
            <em className="not-italic text-gradient-gold">Property</em>
          </span>
        </h1>

        <p className="font-body text-white/60 text-lg sm:text-xl max-w-xl mx-auto mb-12 animate-fade-up animation-delay-200">
          Discover curated homes, apartments, and commercial spaces across India's finest cities.
        </p>

        {/* Search Card */}
        <div className="max-w-3xl mx-auto animate-fade-up animation-delay-300">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-stone-100">
              {LISTING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setListingFor(opt.value as 'sale' | 'rent')}
                  className={cn(
                    'flex-1 py-4 text-sm font-body font-semibold transition-all',
                    listingFor === opt.value
                      ? 'text-stone-900 border-b-2 border-stone-900'
                      : 'text-stone-400 hover:text-stone-600'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Search Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 p-4 sm:p-3">
              {/* City Selector */}
              <div className="relative flex-shrink-0 sm:w-44">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-12 pl-9 pr-8 text-sm font-body bg-stone-50 sm:bg-white border border-stone-200 sm:border-0 rounded-xl sm:rounded-none text-stone-700 appearance-none focus:outline-none focus:ring-0 cursor-pointer"
                >
                  <option value="">All Cities</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-stone-200 mx-1 flex-shrink-0" />

              {/* Search Input */}
              <div className="flex-1 relative mt-2 sm:mt-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by locality, landmark, project…"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full h-12 pl-9 pr-4 text-sm font-body text-stone-900 placeholder:text-stone-400 focus:outline-none bg-stone-50 sm:bg-white border border-stone-200 sm:border-0 rounded-xl sm:rounded-none"
                />
              </div>

              {/* CTA Button */}
              <button
                onClick={handleSearch}
                className="mt-2 sm:mt-0 sm:ml-2 h-12 px-8 rounded-xl text-white text-sm font-body font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95 flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #1a2b4a 0%, #2d4a7a 100%)',
                }}
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-white/40 text-xs font-body">Popular:</span>
            {['3BHK in Surat', 'Offices in Mumbai', 'Villas in Ahmedabad', 'Flats for Rent'].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setSearchQ(q)
                  router.push(`/properties?search=${encodeURIComponent(q)}`)
                }}
                className="text-white/60 hover:text-white text-xs font-body border border-white/20 hover:border-white/40 rounded-full px-3 py-1 transition-all hover:bg-white/10"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto mt-16 animate-fade-up animation-delay-500">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-light text-white mb-1">
                {stat.value}
              </div>
              <div className="text-white/40 text-xs font-body uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-9 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/60 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
