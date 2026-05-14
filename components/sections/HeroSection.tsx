"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, ChevronDown } from "lucide-react"
import Image from "next/image"
import { CITIES } from "@/lib/data/mock"
import { cn } from "@/lib/utils"

const STATS = [{ value:"12,400+",label:"Properties" },{ value:"3,200+",label:"Verified Agents" },{ value:"28,000+",label:"Happy Families" },{ value:"85+",label:"Cities" }]
const POPULAR = ["3BHK in Surat","Villa in Ahmedabad","Offices in Mumbai","Rent in Bangalore"]

export default function HeroSection() {
  const router = useRouter()
  const [listingFor, setListingFor] = useState<"SALE"|"RENT">("SALE")
  const [city, setCity] = useState("")
  const [q, setQ] = useState("")

  const search = () => {
    const p = new URLSearchParams()
    if (listingFor) p.set("listingFor", listingFor)
    if (city) p.set("city", city)
    if (q) p.set("search", q)
    router.push(`/properties?${p}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&h=1200&fit=crop&q=80" alt="Hero" fill priority className="object-cover" sizes="100vw"/>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-900/50 to-stone-950/80"/>
      </div>
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"/>
          <span className="text-white/80 text-xs font-body font-medium tracking-wider uppercase">India's Premium Property Platform</span>
        </div>
        <h1 className="font-display text-white font-light leading-none mb-6 animate-fade-up">
          <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-2">Find Your</span>
          <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">Dream <em className="not-italic text-gradient-gold">Property</em></span>
        </h1>
        <p className="font-body text-white/60 text-lg sm:text-xl max-w-xl mx-auto mb-12 animate-fade-up animate-delay-200">Discover curated homes, apartments, and commercial spaces across India's finest cities.</p>
        <div className="max-w-3xl mx-auto animate-fade-up animate-delay-300">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex border-b border-stone-100">
              {[["SALE","Buy"],["RENT","Rent"]].map(([v,l])=>(
                <button key={v} onClick={()=>setListingFor(v as any)} className={cn("flex-1 py-4 text-sm font-body font-semibold transition-all",listingFor===v?"text-stone-900 border-b-2 border-stone-900":"text-stone-400 hover:text-stone-600")}>{l}</button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 p-3">
              <div className="relative flex-shrink-0 sm:w-44">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"/>
                <select value={city} onChange={e=>setCity(e.target.value)} className="w-full h-12 pl-9 pr-7 text-sm font-body bg-stone-50 sm:bg-white border border-stone-200 sm:border-0 rounded-xl sm:rounded-none text-stone-700 appearance-none focus:outline-none cursor-pointer">
                  <option value="">All Cities</option>
                  {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none"/>
              </div>
              <div className="hidden sm:block w-px h-8 bg-stone-200 mx-1"/>
              <div className="flex-1 relative mt-2 sm:mt-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"/>
                <input type="text" placeholder="Search by locality, landmark, project…" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} className="w-full h-12 pl-9 pr-4 text-sm font-body text-stone-900 placeholder:text-stone-400 focus:outline-none bg-stone-50 sm:bg-white border border-stone-200 sm:border-0 rounded-xl sm:rounded-none"/>
              </div>
              <button onClick={search} className="mt-2 sm:mt-0 sm:ml-2 h-12 px-7 rounded-xl text-white text-sm font-body font-semibold flex items-center justify-center gap-2 flex-shrink-0 transition-all hover:shadow-lg active:scale-95 bg-gradient-navy">
                <Search className="w-4 h-4"/>Search
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-white/40 text-xs font-body">Popular:</span>
            {POPULAR.map(t=>(
              <button key={t} onClick={()=>router.push(`/properties?search=${encodeURIComponent(t)}`)} className="text-white/60 hover:text-white text-xs font-body border border-white/20 hover:border-white/40 rounded-full px-3 py-1 transition-all hover:bg-white/10">{t}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto mt-16 animate-fade-up animate-delay-400">
          {STATS.map(s=>(
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-light text-white mb-1">{s.value}</div>
              <div className="text-white/40 text-xs font-body uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-9 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5"><div className="w-1 h-2 rounded-full bg-white/60 animate-pulse"/></div>
      </div>
    </section>
  )
}
