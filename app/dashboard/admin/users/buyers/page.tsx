"use client"
import { useState } from "react"
import Link from "next/link"
import { Users, Eye, Ban, CheckCircle, ArrowLeft } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Avatar, Badge, SearchInput, StatCard, Tabs, ConfirmDialog } from "@/components/ui"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

const MOCK_BUYERS = [
  { id:"b1", name:"Arjun Mehta", email:"arjun@demo.com", phone:"+91 98765 43210", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", city:"Surat", status:"ACTIVE", inquiries:12, viewings:4, joined:new Date(Date.now()-90*86400000) },
  { id:"b2", name:"Meera Patel", email:"meera.patel@email.com", phone:"+91 87654 32198", avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face", city:"Ahmedabad", status:"ACTIVE", inquiries:5, viewings:2, joined:new Date(Date.now()-60*86400000) },
  { id:"b3", name:"Kiran Kapoor", email:"kiran@mail.com", phone:"+91 96325 87410", avatar:"", city:"Vadodara", status:"INACTIVE", inquiries:0, viewings:0, joined:new Date(Date.now()-30*86400000) },
]

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState(MOCK_BUYERS)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")
  const [actionTarget, setActionTarget] = useState<{id:string;action:string}|null>(null)

  const filtered = buyers.filter(b => {
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.email.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === "all" || b.status === tab
    return matchSearch && matchTab
  })

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/users" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div><h1 className="page-title flex items-center gap-2"><Users className="w-7 h-7 text-blue-500"/>Buyers</h1><p className="page-subtitle">Manage all registered buyers on the platform.</p></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Buyers" value={buyers.length} icon={<Users className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
          <StatCard label="Active" value={buyers.filter(b=>b.status==="ACTIVE").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Inactive" value={buyers.filter(b=>b.status==="INACTIVE").length} icon={<Ban className="w-5 h-5 text-stone-400"/>} color="bg-stone-100"/>
          <StatCard label="Avg Inquiries" value={(buyers.reduce((a,b)=>a+b.inquiries,0)/buyers.length).toFixed(1)} icon={<Eye className="w-5 h-5 text-violet-500"/>} color="bg-violet-50"/>
        </div>

        <div className="flex gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search buyers..." className="flex-1 max-w-sm"/>
          <Tabs tabs={[{value:"all",label:"All"},{value:"ACTIVE",label:"Active"},{value:"INACTIVE",label:"Inactive"},{value:"SUSPENDED",label:"Suspended"}]} active={tab} onChange={setTab}/>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Buyer</th><th>City</th><th>Inquiries</th><th>Viewings</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td><div className="flex items-center gap-3"><Avatar src={b.avatar} name={b.name} size="sm"/><div><p className="font-medium text-stone-900">{b.name}</p><p className="text-xs text-stone-400">{b.email}</p></div></div></td>
                  <td className="text-sm text-stone-600">{b.city}</td>
                  <td className="text-sm">{b.inquiries}</td>
                  <td className="text-sm">{b.viewings}</td>
                  <td><Badge variant={b.status==="ACTIVE"?"green":b.status==="SUSPENDED"?"rose":"stone"}>{b.status}</Badge></td>
                  <td className="text-xs text-stone-400">{formatDate(b.joined)}</td>
                  <td>
                    <div className="flex gap-1">
                      <Link href={`/dashboard/admin/users/buyers/${b.id}`} className="btn-icon text-stone-400 hover:text-stone-700"><Eye className="w-4 h-4"/></Link>
                      {b.status==="ACTIVE"?<button onClick={()=>setActionTarget({id:b.id,action:"suspend"})} className="btn-icon text-stone-400 hover:text-rose-600"><Ban className="w-4 h-4"/></button>:<button onClick={()=>{setBuyers(p=>p.map(x=>x.id===b.id?{...x,status:"ACTIVE"}:x));toast.success("Activated")}} className="btn-icon text-stone-400 hover:text-emerald-600"><CheckCircle className="w-4 h-4"/></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog open={!!actionTarget} onClose={()=>setActionTarget(null)}
        onConfirm={()=>{setBuyers(p=>p.map(b=>b.id===actionTarget?.id?{...b,status:"SUSPENDED"}:b));toast.error("Buyer suspended");setActionTarget(null)}}
        title="Suspend Buyer?" description="This will prevent the buyer from accessing the platform." confirmLabel="Suspend" danger/>
    </DashboardLayout>
  )
}
