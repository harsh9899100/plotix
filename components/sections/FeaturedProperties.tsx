import Link from "next/link"
import { ArrowRight } from "lucide-react"
import PropertyCard from "@/components/properties/PropertyCard"
import { MOCK_PROPERTIES } from "@/lib/data/mock"

export default function FeaturedProperties() {
  const featured = MOCK_PROPERTIES.filter(p=>p.featured).slice(0,6)
  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <span className="section-tag">Handpicked for You</span>
            <h2 className="section-title">Featured <em className="not-italic text-gradient-gold">Listings</em></h2>
            <div className="gold-bar"/>
            <p className="font-body text-stone-500 text-base max-w-md mt-2">Discover our curated selection of premium properties across India.</p>
          </div>
          <Link href="/properties?featured=true" className="btn-secondary self-start lg:self-auto flex-shrink-0 group">
            View All Properties<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p,i)=>(
            <div key={p.id} className="animate-fade-up" style={{animationDelay:`${i*80}ms`,animationFillMode:"both"}}>
              <PropertyCard property={p} viewMode="grid"/>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/properties" className="btn-gold">Explore All {MOCK_PROPERTIES.length}+ Properties<ArrowRight className="w-4 h-4"/></Link>
        </div>
      </div>
    </section>
  )
}
