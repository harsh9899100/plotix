"use client"
import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Edit, Trash2, Bell, BellOff, ArrowRight, Filter } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, EmptyState, ConfirmDialog } from "@/components/ui"
import { formatDate, cn } from "@/lib/utils"
import toast from "react-hot-toast"

const MOCK_SEARCHES = [
  { id:"s1", name:"3BHK in Surat Under 1Cr", filters:{ city:"Surat", type:"RESIDENTIAL", listingFor:"SALE", bedrooms:3, maxPrice:10000000, amenities:["Parking","Security"] }, alertOn:true, matchCount:8, lastMatch:new Date(Date.now()-86400000), createdAt:new Date(Date.now()-7*86400000) },
  { id:"s2", name:"Office Space Ahmedabad Rent", filters:{ city:"Ahmedabad", type:"COMMERCIAL", listingFor:"RENT", minArea:1000, maxArea:5000 }, alertOn:false, matchCount:3, lastMatch:new Date(Date.now()-3*86400000), createdAt:new Date(Date.now()-14*86400000) },
  { id:"s3", name:"2BHK for Rent Surat Furnished", filters:{ city:"Surat", type:"RESIDENTIAL", listingFor:"RENT", bedrooms:2, furnishing:"FURNISHED", maxPrice:25000 }, alertOn:true, matchCount:12, lastMatch:new Date(Date.now()-3600000), createdAt:new Date(Date.now()-30*86400000) },
  { id:"s4", name:"Villas Above 3Cr Gujarat", filters:{ type:"RESIDENTIAL", listingFor:"SALE", minPrice:30000000, bedrooms:4 }, alertOn:true, matchCount:5, lastMatch:new Date(Date.now()-2*86400000), createdAt:new Date(Date.now()-45*86400000) },
]

function FilterBadge({ label }: { label: string }) {
  return <span className="inline-flex items-center px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full text-[10px] font-body">{label}</span>
}

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState(MOCK_SEARCHES)
  const [confirm, setConfirm] = useState<string|null>(null)

  const toggleAlert = (id: string) => {
    setSearches(p => p.map(s => s.id===id ? {...s, alertOn:!s.alertOn} : s))
    const s = searches.find(x=>x.id===id)
    toast.success(s?.alertOn ? "Alerts turned off" : "Alerts turned on!")
  }
  const del = (id: string) => { setSearches(p=>p.filter(s=>s.id!==id)); toast.success("Search deleted"); setConfirm(null) }

  const buildUrl = (filters: any) => {
    const p = new URLSearchParams()
    Object.entries(filters).forEach(([k,v]) => { if (v) p.set(k, String(v)) })
    return `/properties?${p.toString()}`
  }

  const formatFilters = (filters: any) => {
    const parts: string[] = []
    if (filters.city) parts.push(filters.city)
    if (filters.type) parts.push(filters.type)
    if (filters.listingFor) parts.push(`For ${filters.listingFor}`)
    if (filters.bedrooms) parts.push(`${filters.bedrooms}+ Beds`)
    if (filters.furnishing) parts.push(filters.furnishing.replace("_"," "))
    if (filters.minPrice) parts.push(`Min ₹${(filters.minPrice/100000).toFixed(0)}L`)
    if (filters.maxPrice) parts.push(`Max ₹${(filters.maxPrice/100000).toFixed(0)}L`)
    if (filters.minArea) parts.push(`${filters.minArea}+ sq.ft`)
    if (filters.amenities?.length) parts.push(...filters.amenities)
    return parts
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title flex items-center gap-2"><Search className="w-7 h-7 text-blue-500"/>Saved Searches</h1>
            <p className="page-subtitle">{searches.length} saved · {searches.filter(s=>s.alertOn).length} with alerts enabled</p>
          </div>
          <Link href="/properties" className="btn-gold self-start"><Plus className="w-4 h-4"/>Create New Search</Link>
        </div>

        {searches.length===0 ? (
          <EmptyState icon={<Search className="w-8 h-8 text-stone-300"/>} title="No saved searches" description="Search for properties and save your filter combination to get notified about new matches."
            action={<Link href="/properties" className="btn-primary">Start Searching</Link>}/>
        ) : (
          <div className="space-y-4">
            {searches.map(s => (
              <div key={s.id} className={cn("card p-5 hover:shadow-md transition-all", s.alertOn&&"border-blue-200")}>
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-body font-semibold text-stone-900">{s.name}</h3>
                      {s.alertOn && <Badge variant="blue" className="text-[10px]"><Bell className="w-3 h-3"/>Alerts On</Badge>}
                    </div>
                    <p className="text-xs text-stone-400 font-body">Created {formatDate(s.createdAt)} · Last match {formatDate(s.lastMatch)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => toggleAlert(s.id)} className={cn("p-2 rounded-xl transition-colors", s.alertOn ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "hover:bg-stone-100 text-stone-400")}>
                      {s.alertOn ? <Bell className="w-4 h-4"/> : <BellOff className="w-4 h-4"/>}
                    </button>
                    <button className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 transition-colors"><Edit className="w-4 h-4"/></button>
                    <button onClick={() => setConfirm(s.id)} className="p-2 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {formatFilters(s.filters).map((f,i) => <FilterBadge key={i} label={f}/>)}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center"><span className="font-body font-bold text-emerald-700 text-sm">{s.matchCount}</span></div>
                    <p className="text-xs font-body text-stone-500">{s.matchCount} matching properties found</p>
                  </div>
                  <Link href={buildUrl(s.filters)} className="flex items-center gap-1.5 text-sm font-body font-semibold text-stone-900 hover:text-amber-700 transition-colors">
                    View Results <ArrowRight className="w-4 h-4"/>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"/>
            <div>
              <p className="font-body font-semibold text-blue-900 text-sm mb-1">How alerts work</p>
              <p className="text-xs font-body text-blue-700">When a new property is listed that matches your saved search filters, you'll receive an email notification instantly. You can toggle alerts per search or manage all notification preferences in Settings.</p>
            </div>
          </div>
        </div>

        <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => confirm && del(confirm)}
          title="Delete Saved Search?" description="This search and its alert settings will be permanently removed." confirmLabel="Delete" danger/>
      </div>
    </DashboardLayout>
  )
}
