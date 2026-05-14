"use client"
import { useState } from "react"
import Link from "next/link"
import { Layers, Plus, X, BedDouble, Bath, Maximize, Car, MapPin, CheckCircle, XCircle, Star, TrendingUp } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { EmptyState, Badge } from "@/components/ui"
import { MOCK_PROPERTIES } from "@/lib/data/mock"
import { formatPrice, formatCurrency, cn } from "@/lib/utils"
import toast from "react-hot-toast"

export default function ComparisonsPage() {
  const [compared, setCompared] = useState(MOCK_PROPERTIES.slice(0,3))

  const remove = (id: string) => { setCompared(p=>p.filter(x=>x.id!==id)); toast.success("Removed from comparison") }
  const addMore = () => toast("Browse properties and click 'Compare' to add more", {icon:"ℹ️"})

  const specs = [
    { label:"Price",         getValue:(p:any)=>formatPrice(p.price, p.listingFor),     isNumeric:true,  lowerBetter:true },
    { label:"Price/sq.ft",   getValue:(p:any)=>p.pricePerSqFt ? `₹${p.pricePerSqFt.toLocaleString("en-IN")}` : "N/A", isNumeric:true, lowerBetter:true },
    { label:"Area (sq.ft)",  getValue:(p:any)=>p.area.toLocaleString("en-IN"),         isNumeric:true,  lowerBetter:false },
    { label:"Bedrooms",      getValue:(p:any)=>p.bedrooms > 0 ? String(p.bedrooms) : "N/A",  isNumeric:true, lowerBetter:false },
    { label:"Bathrooms",     getValue:(p:any)=>p.bathrooms > 0 ? String(p.bathrooms) : "N/A",isNumeric:true, lowerBetter:false },
    { label:"Parking",       getValue:(p:any)=>p.parking > 0 ? String(p.parking) : "None",   isNumeric:true, lowerBetter:false },
    { label:"Furnishing",    getValue:(p:any)=>p.furnishing ? p.furnishing.replace("_"," ") : "N/A", isNumeric:false },
    { label:"City",          getValue:(p:any)=>p.city,         isNumeric:false },
    { label:"Property Type", getValue:(p:any)=>p.type,         isNumeric:false },
  ]

  const amenitySet = Array.from(new Set(compared.flatMap(p=>p.amenities||[]))).slice(0,12)

  if (compared.length === 0) return (
    <DashboardLayout>
      <div className="dashboard-main py-6">
        <EmptyState icon={<Layers className="w-8 h-8 text-stone-300"/>} title="No properties to compare" description="Browse properties and add them to comparison from the listing page."
          action={<Link href="/properties" className="btn-primary">Browse Properties</Link>}/>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="page-title flex items-center gap-2"><Layers className="w-7 h-7 text-stone-500"/>Property Comparison</h1><p className="page-subtitle">Comparing {compared.length} of up to 10 properties</p></div>
          <div className="flex gap-2">
            <button onClick={addMore} className="btn-secondary text-sm"><Plus className="w-4 h-4"/>Add Property</button>
            <button onClick={()=>{window.print()}} className="btn-secondary text-sm">Export PDF</button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-stone-200 shadow-card">
          <table className="w-full min-w-[600px]">
            {/* Property Images Header */}
            <thead>
              <tr className="border-b border-stone-200">
                <th className="bg-stone-50 px-5 py-4 text-left w-40 text-xs font-body font-bold uppercase tracking-wider text-stone-500">Feature</th>
                {compared.map(p=>(
                  <th key={p.id} className="bg-white px-4 py-4 border-l border-stone-100 min-w-[220px]">
                    <div className="relative">
                      <button onClick={()=>remove(p.id)} className="absolute -top-1 -right-1 w-6 h-6 bg-stone-100 hover:bg-rose-100 hover:text-rose-500 text-stone-400 rounded-full flex items-center justify-center transition-colors z-10">
                        <X className="w-3.5 h-3.5"/>
                      </button>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 mb-3">
                        {p.images?.[0]&&<img src={p.images[0]} alt="" className="w-full h-full object-cover"/>}
                        <span className={cn("absolute top-2 left-2 badge text-[10px]", p.listingFor==="RENT"?"badge-rent":"badge-sale")}>
                          {p.listingFor==="RENT"?"Rent":"Sale"}
                        </span>
                      </div>
                      <Link href={`/properties/${p.slug}`} className="font-body font-semibold text-stone-900 text-sm hover:text-amber-700 transition-colors line-clamp-2 text-left block">{p.title}</Link>
                      <div className="flex items-center gap-1 text-stone-400 text-xs font-body mt-1"><MapPin className="w-3 h-3"/>{p.locality}, {p.city}</div>
                    </div>
                  </th>
                ))}
                {compared.length < 4 && (
                  <th className="bg-stone-50/50 px-4 py-4 border-l border-stone-100 min-w-[160px]">
                    <button onClick={addMore} className="w-full h-32 border-2 border-dashed border-stone-300 rounded-xl hover:border-stone-500 transition-colors flex flex-col items-center justify-center gap-2">
                      <Plus className="w-6 h-6 text-stone-400"/>
                      <span className="text-xs font-body text-stone-400">Add Property</span>
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {/* Price row highlighted */}
              <tr className="bg-amber-50/30 border-b border-stone-100">
                <td className="px-5 py-3 text-xs font-body font-bold text-stone-600 bg-stone-50">Price</td>
                {compared.map(p=>(
                  <td key={p.id} className="px-4 py-3 border-l border-stone-100 text-center">
                    <span className="font-display text-lg font-semibold text-stone-900">{formatPrice(p.price, p.listingFor)}</span>
                  </td>
                ))}
              </tr>

              {/* Spec rows */}
              {specs.slice(1).map((spec,i)=>(
                <tr key={spec.label} className={cn("border-b border-stone-100 hover:bg-stone-50/50 transition-colors", i%2===0?"":"bg-stone-50/20")}>
                  <td className="px-5 py-3 text-xs font-body text-stone-500 bg-stone-50 font-medium">{spec.label}</td>
                  {compared.map(p=>(
                    <td key={p.id} className="px-4 py-3 border-l border-stone-100 text-center text-sm font-body text-stone-700">
                      {spec.getValue(p)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Amenities */}
              {amenitySet.map(amenity=>(
                <tr key={amenity} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                  <td className="px-5 py-3 text-xs font-body text-stone-500 bg-stone-50">{amenity}</td>
                  {compared.map(p=>(
                    <td key={p.id} className="px-4 py-3 border-l border-stone-100 text-center">
                      {p.amenities?.includes(amenity)
                        ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto"/>
                        : <XCircle className="w-4 h-4 text-stone-200 mx-auto"/>}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Views row */}
              <tr className="border-b border-stone-100">
                <td className="px-5 py-3 text-xs font-body text-stone-500 bg-stone-50">Views</td>
                {compared.map(p=>(
                  <td key={p.id} className="px-4 py-3 border-l border-stone-100 text-center">
                    <div className="flex items-center gap-1 justify-center text-xs font-body text-stone-600">
                      <TrendingUp className="w-3 h-3 text-amber-500"/>{p.views.toLocaleString("en-IN")}
                    </div>
                  </td>
                ))}
              </tr>

              {/* CTA row */}
              <tr>
                <td className="px-5 py-4 text-xs font-body font-bold text-stone-600 bg-stone-50">Action</td>
                {compared.map(p=>(
                  <td key={p.id} className="px-4 py-4 border-l border-stone-100 text-center">
                    <div className="flex flex-col gap-2 items-center">
                      <Link href={`/properties/${p.slug}`} className="btn-gold text-xs py-2 px-4 w-full justify-center">View Details</Link>
                      <button className="btn-secondary text-xs py-1.5 px-3 w-full">Enquire Now</button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-stone-50 rounded-2xl border border-stone-100 p-5">
          <p className="text-xs font-body text-stone-500 text-center">💡 <strong className="text-stone-700">Tip:</strong> Browse properties and click the compare button to add up to 10 properties for a detailed side-by-side analysis.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
