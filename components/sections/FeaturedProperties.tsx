import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PropertyCard from '@/components/properties/PropertyCard'
import { mockProperties } from '@/lib/mockData'

export default function FeaturedProperties() {
  const featured = mockProperties.filter((p) => p.featured).slice(0, 6)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <span className="section-tag">Handpicked for You</span>
            <h2 className="section-title">
              Featured <em className="not-italic text-gradient-gold">Listings</em>
            </h2>
            <div className="gold-bar" />
            <p className="font-body text-stone-500 text-base max-w-md mt-2">
              Discover our curated selection of premium properties — from luxury apartments to sprawling villas across India.
            </p>
          </div>
          <Link
            href="/properties?featured=true"
            className="btn-secondary self-start lg:self-auto flex-shrink-0 group"
          >
            View All Properties
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((property, i) => (
            <div
              key={property.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
            >
              <PropertyCard property={property} viewMode="grid" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link href="/properties" className="btn-gold">
            Explore All {mockProperties.length}+ Properties
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
