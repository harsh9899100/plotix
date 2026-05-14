import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { CITIES } from "@/lib/data/mock"

const CITY_IMAGES: Record<string,string> = {
  Surat:"https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop",
  Ahmedabad:"https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&h=400&fit=crop",
  Mumbai:"https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop",
  Bangalore:"https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&h=400&fit=crop",
  Pune:"https://images.unsplash.com/photo-1600078893784-09c2cb30d41b?w=600&h=400&fit=crop",
  Gurgaon:"https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop",
}
export default function CitiesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div><span className="section-tag">Explore by Location</span><h2 className="section-title">Top <em className="not-italic text-gradient-gold">Cities</em></h2></div>
          <Link href="/properties" className="btn-secondary self-start group">All Cities<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CITIES.slice(0,6).map(city=>(
            <Link key={city} href={`/properties?city=${city}`} className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-stone-200">
              <Image src={CITY_IMAGES[city]||CITY_IMAGES["Surat"]} alt={city} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,16vw"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>
              <div className="absolute bottom-0 left-0 right-0 p-3"><div className="font-display text-white text-lg font-medium leading-tight">{city}</div></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
