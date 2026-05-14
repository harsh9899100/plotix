"use client"
import { useState } from "react"
import Link from "next/link"
import { Home, CheckCircle, XCircle, Clock, Eye, ArrowLeft } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, StatCard } from "@/components/ui"
import { formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"

const PENDING = [
  { id:"p1", title:"Luxurious 4BHK Penthouse in Vesu", type:"Apartment", price:38500000, area:3200, city:"Surat", submittedBy:"Priya Sharma (Agent)", image:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=130&fit=crop", submittedAt:new Date(Date.now()-2*3600000) },
  { id:"p2", title:"Modern 3BHK in Adajan with Modular Kitchen", type:"Apartment", price:6200000, area:1450, city:"Surat", submittedBy:"Suresh Patel (Owner)", image:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&h=130&fit=crop", submittedAt:new Date(Date.now()-5*3600000) },
  { id:"p3", title:"Commercial Space Near C.G. Road", type:"Commercial", price:25000000, area:4500, city:"Ahmedabad", submittedBy:"Karan Developers (Builder)", image:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=130&fit=crop", submittedAt:new Date(Date.now()-24*3600000) },
]

export default function AdminPendingPropertiesPage() {
  const [properties, setProperties] = useState(PENDING)
  const approve = (id: string) => { setProperties(p => p.filter(x => x.id !== id)); toast.success("Property approved!") }
  const reject = (id: string) => { setProperties(p => p.filter(x => x.id !== id)); toast.error("Property rejected") }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/properties" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div><h1 className="page-title flex items-center gap-2"><Clock className="w-7 h-7 text-amber-500"/>Pending Approval</h1><p className="page-subtitle">{properties.length} properties awaiting review.</p></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Pending" value={properties.length} icon={<Clock className="w-5 h-5 text-amber-500"/>} color="bg-amber-50"/>
          <StatCard label="Approved Today" value={3} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Rejected Today" value={1} icon={<XCircle className="w-5 h-5 text-rose-500"/>} color="bg-rose-50"/>
        </div>
        {properties.length === 0 ? (
          <div className="text-center py-16"><CheckCircle className="w-16 h-16 text-emerald-300 mx-auto mb-4"/><h3 className="font-display text-2xl font-light text-stone-800 mb-2">All Caught Up!</h3><p className="text-stone-400 font-body">No pending properties to review.</p></div>
        ) : (
          <div className="space-y-4">
            {properties.map(prop => (
              <div key={prop.id} className="card p-5 border-amber-200 bg-amber-50/10">
                <div className="flex gap-4">
                  <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0"><img src={prop.image} alt="" className="w-full h-full object-cover"/></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-body font-semibold text-stone-900 mb-0.5">{prop.title}</h3>
                        <p className="text-xs text-stone-400">{prop.type} · {prop.area.toLocaleString()} sq.ft · {prop.city}</p>
                        <p className="text-xs text-stone-500 mt-1">By: <b>{prop.submittedBy}</b></p>
                      </div>
                      <div className="text-right"><p className="font-display text-xl text-amber-700">{formatCurrency(prop.price)}</p><Badge variant="amber"><Clock className="w-3 h-3"/>Pending</Badge></div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => approve(prop.id)} className="btn-success text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4"/>Approve</button>
                      <button onClick={() => reject(prop.id)} className="btn-danger text-sm flex items-center gap-1"><XCircle className="w-4 h-4"/>Reject</button>
                      <Link href={`/dashboard/admin/properties/${prop.id}`} className="btn-ghost text-sm flex items-center gap-1"><Eye className="w-4 h-4"/>Preview</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
