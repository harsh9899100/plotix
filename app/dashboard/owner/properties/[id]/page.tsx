"use client"
import Link from "next/link"
import { ArrowLeft, Home, Edit, Eye, MapPin, Bed, Bath, Square, DollarSign, ToggleLeft, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, ConfirmDialog, StatCard } from "@/components/ui"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useState } from "react"
import toast from "react-hot-toast"

const PROPERTY = {
  id:"own-p1", title:"Modern 3BHK Apartment in Adajan", type:"Apartment", listingFor:"SALE",
  price:6500000, area:1450, beds:3, baths:2, parking:1, floor:5,
  address:"Sky Heights, Adajan, Surat, Gujarat 395009",
  status:"PUBLISHED", views:342, inquiries:7, viewings:3,
  listedAt:new Date(Date.now()-30*86400000),
  image:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&h=400&fit=crop",
  amenities:["Covered Parking","Elevator","Security","Power Backup","Garden"],
  description:"A beautifully maintained 3BHK apartment on the 5th floor with excellent natural light, modular kitchen, and city views. Society amenities include a gym, garden, and 24/7 security.",
}

export default function OwnerPropertyDetailPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState(PROPERTY.status)
  const [showDelete, setShowDelete] = useState(false)

  const toggleStatus = () => {
    const next = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
    setStatus(next)
    toast.success(next === "PUBLISHED" ? "Listing published!" : "Listing hidden (Draft)")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/owner/properties" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div><h1 className="page-title">Property Details</h1><p className="page-subtitle">Manage your listing</p></div>
        </div>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden h-64 relative">
          <img src={PROPERTY.image} alt="" className="w-full h-full object-cover"/>
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge variant={status === "PUBLISHED" ? "green" : "stone"}>{status}</Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Views" value={PROPERTY.views} icon={<Eye className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
          <StatCard label="Inquiries" value={PROPERTY.inquiries} icon={<Home className="w-5 h-5 text-violet-500"/>} color="bg-violet-50"/>
          <StatCard label="Viewings" value={PROPERTY.viewings} icon={<Eye className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
        </div>

        {/* Details */}
        <div className="card-flat p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-medium text-stone-900">{PROPERTY.title}</h2>
              <p className="text-stone-400 font-body mt-1 flex items-center gap-1"><MapPin className="w-4 h-4"/>{PROPERTY.address}</p>
            </div>
            <div className="text-right"><p className="font-display text-2xl text-amber-700">{formatCurrency(PROPERTY.price)}</p><p className="text-xs text-stone-400">{PROPERTY.listingFor === "SALE" ? "Sale Price" : "Per Month"}</p></div>
          </div>

          <div className="flex gap-6 text-sm text-stone-600 font-body py-3 border-y border-stone-100">
            <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-stone-400"/>{PROPERTY.beds} Beds</span>
            <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-stone-400"/>{PROPERTY.baths} Baths</span>
            <span className="flex items-center gap-1.5"><Square className="w-4 h-4 text-stone-400"/>{PROPERTY.area.toLocaleString()} sq.ft</span>
            <span>Floor {PROPERTY.floor}</span>
          </div>

          <p className="text-sm font-body text-stone-600 leading-relaxed">{PROPERTY.description}</p>

          <div className="flex flex-wrap gap-2">
            {PROPERTY.amenities.map(a => <span key={a} className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-body">✓ {a}</span>)}
          </div>
        </div>

        {/* Actions */}
        <div className="card-flat p-5 flex flex-wrap gap-3">
          <Link href={`/dashboard/owner/properties/${params.id}/edit`} className="btn-primary flex items-center gap-2"><Edit className="w-4 h-4"/>Edit Listing</Link>
          <button onClick={toggleStatus} className="btn-secondary flex items-center gap-2">
            <ToggleLeft className="w-4 h-4"/>{status === "PUBLISHED" ? "Unpublish" : "Publish"}
          </button>
          <Link href={`/properties/${params.id}`} target="_blank" className="btn-ghost flex items-center gap-2"><Eye className="w-4 h-4"/>View Live</Link>
          <button onClick={() => setShowDelete(true)} className="btn-ghost text-rose-500 hover:text-rose-700 hover:bg-rose-50 flex items-center gap-2 ml-auto"><Trash2 className="w-4 h-4"/>Delete</button>
        </div>

        <div className="text-xs text-stone-400 font-body">Listed on {formatDate(PROPERTY.listedAt)}</div>
      </div>
      <ConfirmDialog open={showDelete} onClose={()=>setShowDelete(false)} onConfirm={()=>{setShowDelete(false);toast.success("Property deleted")}}
        title="Delete Property?" description="This will permanently remove your listing from the platform." confirmLabel="Delete" danger/>
    </DashboardLayout>
  )
}
