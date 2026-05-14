"use client"
import { useState, useMemo, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal, LayoutGrid, List, Map, ArrowUpDown, ChevronDown, X, Sparkles } from "lucide-react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import FilterBar from "@/components/properties/FilterBar"
import PropertyCard from "@/components/properties/PropertyCard"
import MapView from "@/components/properties/MapView"
import { MOCK_PROPERTIES } from "@/lib/data/mock"
import { cn, formatPrice } from "@/lib/utils"

const DEFAULT_FILTERS = { search:"",city:"",type:"" as any,listingFor:"" as any,minPrice:0,maxPrice:0,minArea:0,maxArea:0,bedrooms:"" as any,bathrooms:"" as any,furnishing:"" as any,amenities:[] as string[],status:"" as any,featured:"" as any,sortBy:"newest" as any }
const SORT_LABELS: Record<string,string> = { newest:"Newest","price-asc":"Price ↑","price-desc":"Price ↓",popular:"Popular","area-asc":"Area ↑","area-desc":"Area ↓" }

function FilterTag({ label, onRemove }: { label:string; onRemove:()=>void }) {
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full text-xs font-body text-stone-700"><span>{label}</span><button onClick={onRemove}><X className="w-3 h-3 hover:text-rose-500"/></button></span>
}

function PropertiesContent() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, city:searchParams.get("city")||"", type:(searchParams.get("type")||"") as any, listingFor:(searchParams.get("listingFor")||"") as any, search:searchParams.get("search")||"" })
  const [viewMode, setViewMode] = useState<"grid"|"list">("grid")
  const [showMap, setShowMap] = useState(true)
  const [mobileFilter, setMobileFilter] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [highlightedId, setHighlightedId] = useState<string|null>(null)

  const filtered = useMemo(() => {
    let r = [...MOCK_PROPERTIES]
    if (filters.search) { const q=filters.search.toLowerCase(); r=r.filter(p=>p.title.toLowerCase().includes(q)||p.city.toLowerCase().includes(q)||(p.locality||"").toLowerCase().includes(q)) }
    if (filters.city) r=r.filter(p=>p.city===filters.city)
    if (filters.type) r=r.filter(p=>p.type===filters.type)
    if (filters.listingFor) r=r.filter(p=>p.listingFor===filters.listingFor)
    if (filters.minPrice>0) r=r.filter(p=>p.price>=filters.minPrice)
    if (filters.maxPrice>0) r=r.filter(p=>p.price<=filters.maxPrice)
    if (filters.minArea>0) r=r.filter(p=>p.area>=filters.minArea)
    if (filters.maxArea>0) r=r.filter(p=>p.area<=filters.maxArea)
    if (filters.bedrooms!=="") r=r.filter(p=>p.bedrooms>=Number(filters.bedrooms))
    if (filters.bathrooms!=="") r=r.filter(p=>p.bathrooms>=Number(filters.bathrooms))
    if (filters.furnishing) r=r.filter(p=>p.furnishing===filters.furnishing)
    if (filters.amenities.length>0) r=r.filter(p=>filters.amenities.every(a=>p.amenities.includes(a)))
    switch(filters.sortBy) {
      case "price-asc": r.sort((a,b)=>a.price-b.price); break
      case "price-desc": r.sort((a,b)=>b.price-a.price); break
      case "popular": r.sort((a,b)=>b.views-a.views); break
      case "area-asc": r.sort((a,b)=>a.area-b.area); break
      case "area-desc": r.sort((a,b)=>b.area-a.area); break
      default: r.sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())
    }
    return r
  }, [filters])

  const activeCount = [filters.search,filters.city,filters.type,filters.listingFor,filters.minPrice,filters.maxPrice,filters.minArea,filters.maxArea,filters.bedrooms,filters.bathrooms,filters.furnishing,...filters.amenities].filter(Boolean).length

  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      {/* Page Header */}
      <div className="pt-16 border-b border-stone-100 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-xl lg:text-2xl font-light text-stone-900">
                {filters.listingFor==="RENT"?"Properties for Rent":filters.listingFor==="SALE"?"Properties for Sale":"All Properties"}
                {filters.city && <span className="text-stone-400"> in {filters.city}</span>}
              </h1>
              <p className="font-body text-stone-500 text-sm mt-0.5">{filtered.length.toLocaleString()} {filtered.length===1?"property":"properties"} found</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={()=>setMobileFilter(true)} className={cn("lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-body font-medium transition-all",activeCount>0?"bg-stone-900 text-white border-stone-900":"bg-white text-stone-700 border-stone-200 hover:border-stone-400")}>
                <SlidersHorizontal className="w-4 h-4"/>Filters{activeCount>0&&` (${activeCount})`}
              </button>
              <div className="relative">
                <button onClick={()=>setSortOpen(!sortOpen)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 bg-white text-sm font-body font-medium text-stone-700 hover:border-stone-400 transition-all">
                  <ArrowUpDown className="w-4 h-4"/><span className="hidden sm:inline">{SORT_LABELS[filters.sortBy]}</span><span className="sm:hidden">Sort</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform",sortOpen&&"rotate-180")}/>
                </button>
                {sortOpen&&(<>
                  <div className="fixed inset-0 z-10" onClick={()=>setSortOpen(false)}/>
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-stone-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                    {Object.entries(SORT_LABELS).map(([v,l])=>(
                      <button key={v} onClick={()=>{setFilters(f=>({...f,sortBy:v as any}));setSortOpen(false)}}
                        className={cn("w-full text-left px-4 py-2.5 text-sm font-body transition-colors",filters.sortBy===v?"bg-stone-50 font-semibold text-stone-900":"text-stone-600 hover:bg-stone-50")}>
                        {l}
                      </button>
                    ))}
                  </div>
                </>)}
              </div>
              <div className="flex items-center bg-stone-100 rounded-xl p-1 gap-0.5">
                {([["grid",LayoutGrid],["list",List]] as const).map(([m,Icon])=>(
                  <button key={m} onClick={()=>setViewMode(m)} className={cn("p-2 rounded-lg transition-all",viewMode===m?"bg-white text-stone-900 shadow-sm":"text-stone-500 hover:text-stone-700")}><Icon className="w-4 h-4"/></button>
                ))}
              </div>
              <button onClick={()=>setShowMap(!showMap)} className={cn("hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-body font-medium transition-all",showMap?"bg-stone-900 text-white border-stone-900":"bg-white text-stone-700 border-stone-200 hover:border-stone-400")}>
                <Map className="w-4 h-4"/>{showMap?"Hide Map":"Show Map"}
              </button>
            </div>
          </div>
          {activeCount>0&&(
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-stone-100">
              <span className="text-xs font-body text-stone-400">Active:</span>
              {filters.search&&<FilterTag label={`"${filters.search}"`} onRemove={()=>setFilters(f=>({...f,search:""}))}/>}
              {filters.city&&<FilterTag label={filters.city} onRemove={()=>setFilters(f=>({...f,city:""}))}/>}
              {filters.type&&<FilterTag label={filters.type} onRemove={()=>setFilters(f=>({...f,type:""}))}/>}
              {filters.listingFor&&<FilterTag label={`For ${filters.listingFor}`} onRemove={()=>setFilters(f=>({...f,listingFor:""}))}/>}
              {filters.bedrooms!==""&&<FilterTag label={`${filters.bedrooms}+ Beds`} onRemove={()=>setFilters(f=>({...f,bedrooms:""}))}/>}
              {filters.amenities.map(a=><FilterTag key={a} label={a} onRemove={()=>setFilters(f=>({...f,amenities:f.amenities.filter(x=>x!==a)}))}/>)}
              <button onClick={()=>setFilters(DEFAULT_FILTERS)} className="text-xs font-body text-rose-500 hover:text-rose-600 flex items-center gap-1"><X className="w-3 h-3"/>Clear all</button>
            </div>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={cn("flex gap-6",showMap?"lg:grid lg:grid-cols-[280px_1fr_1fr]":"lg:grid lg:grid-cols-[280px_1fr]")}>
          {/* Filter Sidebar */}
          <div className="hidden lg:block h-[calc(100vh-160px)] sticky top-[100px]">
            <FilterBar filters={filters} onChange={setFilters} resultCount={filtered.length} isMobileOpen={mobileFilter} onMobileClose={()=>setMobileFilter(false)}/>
          </div>
          <div className="lg:hidden">
            <FilterBar filters={filters} onChange={setFilters} resultCount={filtered.length} isMobileOpen={mobileFilter} onMobileClose={()=>setMobileFilter(false)}/>
          </div>

          {/* Map */}
          {showMap&&(
            <div className="hidden lg:block h-[calc(100vh-160px)] sticky top-[100px]">
              <MapView properties={filtered} highlightedId={highlightedId}
                onMarkerClick={id=>{const el=document.getElementById(`prop-${id}`);el?.scrollIntoView({behavior:"smooth",block:"center"});setHighlightedId(id);setTimeout(()=>setHighlightedId(null),3000)}}/>
            </div>
          )}

          {/* Properties */}
          <div className="properties-scroll">
            {filtered.length===0?(
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-5"><Sparkles className="w-8 h-8 text-stone-300"/></div>
                <h3 className="font-display text-2xl font-light text-stone-800 mb-2">No properties found</h3>
                <p className="font-body text-stone-400 text-sm mb-6">Try adjusting or clearing your filters.</p>
                <button onClick={()=>setFilters(DEFAULT_FILTERS)} className="btn-primary">Clear All Filters</button>
              </div>
            ):(
              <>
                <div className={cn(viewMode==="grid"?`grid gap-5 grid-cols-1 sm:grid-cols-2`+(showMap?"":" xl:grid-cols-3"):"flex flex-col gap-4")}>
                  {filtered.map((p,i)=>(
                    <div key={p.id} id={`prop-${p.id}`} className="animate-fade-up" style={{animationDelay:`${Math.min(i,5)*60}ms`,animationFillMode:"both"}}>
                      <PropertyCard property={p} viewMode={viewMode} highlighted={highlightedId===p.id} onHover={setHighlightedId}/>
                    </div>
                  ))}
                </div>
                <div className="mt-10 flex justify-center pb-6">
                  <div className="flex items-center gap-1">
                    {[1,2,3].map(p=>(
                      <button key={p} className={cn("w-9 h-9 rounded-xl text-sm font-body font-medium transition-all",p===1?"bg-stone-900 text-white":"text-stone-600 border border-stone-200 hover:border-stone-400")}>{p}</button>
                    ))}
                    <span className="px-2 text-stone-400 text-sm">…</span>
                    <button className="w-9 h-9 rounded-xl text-sm font-body font-medium text-stone-600 border border-stone-200 hover:border-stone-400 transition-all">8</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default function PropertiesPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin"/></div>}><PropertiesContent/></Suspense>
}
