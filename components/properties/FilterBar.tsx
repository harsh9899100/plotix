"use client"
import { useState, useCallback } from "react"
import { SlidersHorizontal, X, RotateCcw, ChevronDown, ChevronUp, Search } from "lucide-react"
import { CITIES, AMENITIES_LIST } from "@/lib/data/mock"
import { cn } from "@/lib/utils"

const PROPERTY_TYPES = [["","All Types"],["RESIDENTIAL","Residential"],["COMMERCIAL","Commercial"],["INDUSTRIAL","Industrial"],["AGRICULTURAL","Agricultural"],["MIXED","Mixed Use"]]
const BED_OPTIONS = ["",1,2,3,4,5]; const BATH_OPTIONS = ["",1,2,3,4]
const FURNISHINGS = [["","Any"],["FURNISHED","Furnished"],["SEMI_FURNISHED","Semi-Furnished"],["UNFURNISHED","Unfurnished"]]
const SORT_OPTIONS = [["newest","Newest First"],["price-asc","Price: Low→High"],["price-desc","Price: High→Low"],["popular","Most Popular"],["area-asc","Area: Small→Large"],["area-desc","Area: Large→Small"]]

interface FilterBarProps { filters:any; onChange:(f:any)=>void; resultCount:number; isMobileOpen:boolean; onMobileClose:()=>void }

const DEFAULT: any = { search:"",city:"",type:"",listingFor:"",minPrice:0,maxPrice:0,minArea:0,maxArea:0,bedrooms:"",bathrooms:"",furnishing:"",amenities:[],status:"",featured:"",sortBy:"newest" }

export default function FilterBar({ filters, onChange, resultCount, isMobileOpen, onMobileClose }: FilterBarProps) {
  const [open, setOpen] = useState(new Set(["search","listing","price","rooms"]))
  const toggle = (s:string) => setOpen(prev=>{ const n=new Set(prev); n.has(s)?n.delete(s):n.add(s); return n })
  const u = useCallback((p:any)=>onChange({...filters,...p}),[filters,onChange])
  const toggleAmenity = (a:string) => u({amenities:filters.amenities.includes(a)?filters.amenities.filter((x:string)=>x!==a):[...filters.amenities,a]})
  const activeCount = [filters.search,filters.city,filters.type,filters.listingFor,filters.minPrice,filters.maxPrice,filters.bedrooms,filters.bathrooms,filters.furnishing,...filters.amenities].filter(Boolean).length

  const Sec = ({id,label}:{id:string;label:string}) => (
    <button onClick={()=>toggle(id)} className="w-full flex items-center justify-between py-2 text-left">
      <span className="text-[10px] font-body font-bold uppercase tracking-widest text-stone-500">{label}</span>
      {open.has(id)?<ChevronUp className="w-3.5 h-3.5 text-stone-400"/>:<ChevronDown className="w-3.5 h-3.5 text-stone-400"/>}
    </button>
  )

  const content = (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-stone-600"/>
          <span className="font-body font-semibold text-stone-900 text-sm">Filters</span>
          {activeCount>0&&<span className="w-5 h-5 bg-stone-900 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">{activeCount}</span>}
        </div>
        <div className="flex items-center gap-2">
          {activeCount>0&&<button onClick={()=>onChange(DEFAULT)} className="flex items-center gap-1 text-xs font-body text-stone-500 hover:text-stone-900"><RotateCcw className="w-3 h-3"/>Reset</button>}
          <button onClick={onMobileClose} className="lg:hidden p-1.5 rounded-lg hover:bg-stone-100"><X className="w-4 h-4"/></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto filter-scroll px-4 pb-6 space-y-1">
        {/* Search */}
        <div className="pt-4"><Sec id="search" label="Search"/>
          {open.has("search")&&(
            <div className="mt-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"/>
              <input type="text" placeholder="Title, locality…" value={filters.search} onChange={e=>u({search:e.target.value})} className="input pl-9 text-xs"/>
              {filters.search&&<button onClick={()=>u({search:""})} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5 text-stone-400"/></button>}
            </div>
          )}
        </div>
        {/* Listing Type */}
        <div className="border-t border-stone-100 pt-4"><Sec id="listing" label="Listing Type"/>
          {open.has("listing")&&(
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[["","All"],["SALE","Buy"],["RENT","Rent"]].map(([v,l])=>(
                <button key={v} onClick={()=>u({listingFor:v})} className={cn("py-2 rounded-xl text-xs font-body font-medium border transition-all",filters.listingFor===v?"bg-stone-900 text-white border-stone-900":"bg-white text-stone-600 border-stone-200 hover:border-stone-400")}>{l}</button>
              ))}
            </div>
          )}
        </div>
        {/* City */}
        <div className="border-t border-stone-100 pt-4"><Sec id="city" label="City"/>
          {open.has("city")&&(
            <div className="mt-2 space-y-0.5">
              {[["","All Cities"],...CITIES.map(c=>[c,c])].map(([v,l])=>(
                <button key={v} onClick={()=>u({city:v})} className={cn("w-full text-left px-3 py-2 rounded-xl text-xs font-body transition-all",filters.city===v?"bg-stone-900 text-white":"hover:bg-stone-50 text-stone-600")}>{l}</button>
              ))}
            </div>
          )}
        </div>
        {/* Type */}
        <div className="border-t border-stone-100 pt-4"><Sec id="type" label="Property Type"/>
          {open.has("type")&&(
            <div className="mt-2 space-y-0.5">
              {PROPERTY_TYPES.map(([v,l])=>(
                <button key={v} onClick={()=>u({type:v})} className={cn("w-full text-left px-3 py-2 rounded-xl text-xs font-body transition-all",filters.type===v?"bg-stone-900 text-white":"hover:bg-stone-50 text-stone-600")}>{l}</button>
              ))}
            </div>
          )}
        </div>
        {/* Price */}
        <div className="border-t border-stone-100 pt-4"><Sec id="price" label="Price Range (₹)"/>
          {open.has("price")&&(
            <div className="mt-2 space-y-2">
              <input type="number" placeholder="Min Price" value={filters.minPrice||""} onChange={e=>u({minPrice:Number(e.target.value)})} className="input text-xs"/>
              <input type="number" placeholder="Max Price" value={filters.maxPrice||""} onChange={e=>u({maxPrice:Number(e.target.value)})} className="input text-xs"/>
            </div>
          )}
        </div>
        {/* Rooms */}
        <div className="border-t border-stone-100 pt-4"><Sec id="rooms" label="Bedrooms"/>
          {open.has("rooms")&&(
            <div className="mt-2">
              <div className="flex gap-1.5 flex-wrap mb-3">
                {BED_OPTIONS.map(o=>(
                  <button key={String(o)} onClick={()=>u({bedrooms:o})} className={cn("px-3 py-1.5 rounded-xl text-xs font-body font-medium border transition-all",filters.bedrooms===o?"bg-stone-900 text-white border-stone-900":"bg-white text-stone-600 border-stone-200 hover:border-stone-400")}>{o===""?"Any":`${o}+`}</button>
                ))}
              </div>
              <span className="text-[10px] font-body font-bold uppercase tracking-widest text-stone-400 block mb-2">Bathrooms</span>
              <div className="flex gap-1.5 flex-wrap">
                {BATH_OPTIONS.map(o=>(
                  <button key={String(o)} onClick={()=>u({bathrooms:o})} className={cn("px-3 py-1.5 rounded-xl text-xs font-body font-medium border transition-all",filters.bathrooms===o?"bg-stone-900 text-white border-stone-900":"bg-white text-stone-600 border-stone-200 hover:border-stone-400")}>{o===""?"Any":`${o}+`}</button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Furnishing */}
        <div className="border-t border-stone-100 pt-4"><Sec id="furnish" label="Furnishing"/>
          {open.has("furnish")&&(
            <div className="mt-2 space-y-0.5">
              {FURNISHINGS.map(([v,l])=>(
                <button key={v} onClick={()=>u({furnishing:v})} className={cn("w-full text-left px-3 py-2 rounded-xl text-xs font-body transition-all",filters.furnishing===v?"bg-stone-900 text-white":"hover:bg-stone-50 text-stone-600")}>{l}</button>
              ))}
            </div>
          )}
        </div>
        {/* Amenities */}
        <div className="border-t border-stone-100 pt-4"><Sec id="amenities" label="Amenities"/>
          {open.has("amenities")&&(
            <div className="mt-2 flex flex-wrap gap-1.5">
              {AMENITIES_LIST.map(a=>(
                <button key={a} onClick={()=>toggleAmenity(a)} className={cn("px-2.5 py-1 rounded-full text-[11px] font-body border transition-all",filters.amenities.includes(a)?"bg-stone-900 text-white border-stone-900":"bg-white text-stone-500 border-stone-200 hover:border-stone-400")}>{a}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-4 border-t border-stone-100 bg-white">
        <button onClick={onMobileClose} className="btn-primary w-full justify-center text-sm">Show {resultCount} Results</button>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden lg:flex flex-col h-full bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-card">{content}</div>
      <div className={cn("fixed inset-0 z-50 lg:hidden transition-all duration-300",isMobileOpen?"visible":"invisible")}>
        <div className={cn("absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity",isMobileOpen?"opacity-100":"opacity-0")} onClick={onMobileClose}/>
        <div className={cn("absolute top-0 left-0 bottom-0 w-80 bg-white shadow-2xl transition-transform duration-300",isMobileOpen?"translate-x-0":"-translate-x-full")}>{content}</div>
      </div>
    </>
  )
}
