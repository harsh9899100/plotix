"use client"
import { useState } from "react"
import Link from "next/link"
import { Database, Search, Plus, Phone, Mail, Tag, Edit, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Avatar, Badge, EmptyState, SearchInput, StatCard, ConfirmDialog } from "@/components/ui"
import { formatDate, cn } from "@/lib/utils"
import toast from "react-hot-toast"

const MOCK_BUYERS = [
  { id:"b1", name:"Rajesh Kumar", email:"rajesh@gmail.com", phone:"+91 93456 78901", avatar:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face", interest:"3BHK Apartment", budget:"₹50L–₹80L", city:"Surat", status:"HOT", addedAt:new Date(Date.now()-7*86400000) },
  { id:"b2", name:"Meera Patel", email:"meera.patel@email.com", phone:"+91 87654 32198", avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face", interest:"Villa", budget:"₹1.2Cr–₹2Cr", city:"Ahmedabad", status:"WARM", addedAt:new Date(Date.now()-14*86400000) },
  { id:"b3", name:"Arjun Mehta", email:"arjun@demo.com", phone:"+91 98765 43210", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", interest:"Penthouse", budget:"₹3Cr+", city:"Surat", status:"HOT", addedAt:new Date(Date.now()-3*86400000) },
  { id:"b4", name:"Kavita Sharma", email:"kavita@corp.in", phone:"+91 96325 87410", avatar:"", interest:"2BHK for Rent", budget:"₹15K–₹25K/mo", city:"Vadodara", status:"COLD", addedAt:new Date(Date.now()-30*86400000) },
]

const STATUS_COLORS: Record<string,string> = { HOT:"rose", WARM:"amber", COLD:"blue", CONVERTED:"green" }

export default function BuyerDatabasePage() {
  const [buyers, setBuyers] = useState(MOCK_BUYERS)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string|null>(null)

  const filtered = buyers.filter(b =>
    !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.city.toLowerCase().includes(search.toLowerCase())
  )

  const doDelete = () => {
    setBuyers(p => p.filter(b => b.id !== deleting))
    setDeleting(null)
    toast.success("Contact removed")
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Database className="w-7 h-7 text-stone-500"/>Buyer Database</h1>
            <p className="page-subtitle">Manage your buyer contacts and their preferences.</p>
          </div>
          <Link href="/dashboard/agent/buyer-database/new" className="btn-gold"><Plus className="w-4 h-4"/>Add Buyer</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Total Contacts", value:buyers.length, color:"bg-stone-100" },
            { label:"Hot Leads", value:buyers.filter(b=>b.status==="HOT").length, color:"bg-rose-50" },
            { label:"Warm Leads", value:buyers.filter(b=>b.status==="WARM").length, color:"bg-amber-50" },
            { label:"Converted", value:buyers.filter(b=>b.status==="CONVERTED").length, color:"bg-emerald-50" },
          ].map(s => <div key={s.label} className={`card-flat p-4 ${s.color}`}>
            <p className="text-xs text-stone-400 uppercase tracking-wide font-body">{s.label}</p>
            <p className="font-display text-3xl font-light text-stone-900">{s.value}</p>
          </div>)}
        </div>

        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or city..." className="max-w-sm"/>

        {filtered.length === 0 ? (
          <EmptyState icon={<Database className="w-8 h-8 text-stone-300"/>} title="No buyers found"
            action={<Link href="/dashboard/agent/buyer-database/new" className="btn-primary">Add Buyer</Link>}/>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Buyer</th><th>Interest</th><th>Budget</th><th>City</th><th>Status</th><th>Added</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar src={b.avatar} name={b.name} size="sm"/>
                        <div>
                          <p className="font-medium text-stone-900">{b.name}</p>
                          <p className="text-xs text-stone-400">{b.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-stone-600">{b.interest}</td>
                    <td className="text-sm text-stone-600">{b.budget}</td>
                    <td className="text-sm text-stone-600">{b.city}</td>
                    <td><Badge variant={STATUS_COLORS[b.status] as any}>{b.status}</Badge></td>
                    <td className="text-xs text-stone-400">{formatDate(b.addedAt)}</td>
                    <td>
                      <div className="flex gap-1">
                        <Link href={`/dashboard/agent/buyer-database/${b.id}`} className="btn-icon text-stone-400 hover:text-stone-700"><Tag className="w-4 h-4"/></Link>
                        <Link href={`/dashboard/agent/buyer-database/${b.id}/edit`} className="btn-icon text-stone-400 hover:text-stone-700"><Edit className="w-4 h-4"/></Link>
                        <button onClick={() => setDeleting(b.id)} className="btn-icon text-stone-400 hover:text-rose-600"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={doDelete}
        title="Remove Contact?" description="This will remove the buyer from your database." confirmLabel="Remove" danger/>
    </DashboardLayout>
  )
}
