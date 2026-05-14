"use client"
import Link from "next/link"
import { ArrowLeft, FileSearch, Calendar, MapPin, Bed, Home, CheckCircle, XCircle, MessageSquare, Phone } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

const REQUEST = {
  id:"req1", title:"Looking for 3BHK Family Home", status:"ACTIVE",
  type:"BUY", propertyType:"Apartment", beds:3, budgetMin:5000000, budgetMax:9000000,
  city:"Surat", localities:["Adajan","Vesu","Piplod"],
  area:{ min:1200, max:1800 }, amenities:["Parking","Elevator","Security","Garden"],
  possessionBy:"Within 6 months", notes:"Prefer west-facing, vastu-compliant. Ground floor not acceptable.",
  createdAt:new Date(Date.now()-7*86400000), expiresAt:new Date(Date.now()+23*86400000),
  matches:[
    { id:"p1", title:"Modern 3BHK in Adajan", price:6500000, area:1450, image:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&h=130&fit=crop" },
    { id:"p2", title:"Spacious 3BHK in Vesu", price:8200000, area:1650, image:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=130&fit=crop" },
    { id:"p3", title:"3BHK with Garden in Piplod", price:7100000, area:1550, image:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=200&h=130&fit=crop" },
  ]
}

export default function PropertyRequestDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/buyer/property-requests" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div>
            <h1 className="page-title">Property Request</h1>
            <p className="page-subtitle">View your active request and matched properties</p>
          </div>
        </div>

        {/* Request details */}
        <div className="card-flat p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-xl font-medium text-stone-900">{REQUEST.title}</h2>
                <Badge variant="green"><CheckCircle className="w-3 h-3"/>Active</Badge>
              </div>
              <p className="text-sm text-stone-400 font-body">Created {formatDate(REQUEST.createdAt)} · Expires {formatDate(REQUEST.expiresAt)}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/buyer/property-requests/${params.id}/edit`} className="btn-secondary text-sm">Edit</Link>
              <button onClick={() => toast.success("Request closed")} className="btn-ghost text-sm text-rose-500">Close</button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            {[
              { label:"Property Type", value:`${REQUEST.type} · ${REQUEST.propertyType}` },
              { label:"Bedrooms", value:`${REQUEST.beds}+ BHK` },
              { label:"Budget", value:`₹${(REQUEST.budgetMin/100000).toFixed(0)}L – ₹${(REQUEST.budgetMax/100000).toFixed(0)}L` },
              { label:"Area", value:`${REQUEST.area.min}–${REQUEST.area.max} sq.ft` },
            ].map(f => (
              <div key={f.label} className="p-3 bg-stone-50 rounded-xl">
                <p className="text-[10px] text-stone-400 uppercase font-body mb-1">{f.label}</p>
                <p className="text-sm font-body font-semibold text-stone-900">{f.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs text-stone-400 font-body">Preferred areas:</span>
              {REQUEST.localities.map(l => <span key={l} className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-body">{l}</span>)}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs text-stone-400 font-body">Amenities:</span>
              {REQUEST.amenities.map(a => <span key={a} className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-body">✓ {a}</span>)}
            </div>
            {REQUEST.notes && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs text-stone-400 mb-1">Additional Notes</p>
                <p className="text-sm font-body text-stone-700">{REQUEST.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Matches */}
        <div>
          <h2 className="font-display text-lg font-medium text-stone-900 mb-4 flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-amber-500"/>{REQUEST.matches.length} Matching Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {REQUEST.matches.map(m => (
              <div key={m.id} className="card overflow-hidden">
                <img src={m.image} alt="" className="w-full h-36 object-cover"/>
                <div className="p-4">
                  <h3 className="font-body font-semibold text-stone-900 text-sm mb-1">{m.title}</h3>
                  <p className="text-amber-700 font-display">₹{(m.price/100000).toFixed(0)}L</p>
                  <p className="text-xs text-stone-400">{m.area.toLocaleString()} sq.ft</p>
                  <div className="flex gap-2 mt-3">
                    <Link href={`/properties/${m.id}`} className="btn-primary text-xs flex-1 flex items-center justify-center">View</Link>
                    <button onClick={() => toast.success("Inquiry sent!")} className="btn-secondary text-xs flex-1 flex items-center justify-center gap-1"><MessageSquare className="w-3 h-3"/>Enquire</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
