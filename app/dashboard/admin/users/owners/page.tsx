"use client"
import { useState } from "react"
import Link from "next/link"
import { Users, Eye, Ban, CheckCircle, Home, ArrowLeft } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Avatar, Badge, SearchInput, StatCard, Tabs } from "@/components/ui"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

const MOCK_OWNERS = [
  { id:"o1", name:"Suresh Patel", email:"suresh@gmail.com", phone:"+91 93456 12345", avatar:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face", city:"Surat", status:"ACTIVE", properties:3, joined:new Date(Date.now()-120*86400000) },
  { id:"o2", name:"Asha Desai", email:"asha.desai@yahoo.com", phone:"+91 98123 45678", avatar:"", city:"Ahmedabad", status:"ACTIVE", properties:1, joined:new Date(Date.now()-60*86400000) },
  { id:"o3", name:"Ramesh Singh", email:"ramesh.singh@hotmail.com", phone:"+91 91234 56789", avatar:"", city:"Vadodara", status:"SUSPENDED", properties:0, joined:new Date(Date.now()-200*86400000) },
]

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState(MOCK_OWNERS)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")
  const filtered = owners.filter(o => {
    const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === "all" || o.status === tab
    return matchSearch && matchTab
  })

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/users" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div><h1 className="page-title flex items-center gap-2"><Home className="w-7 h-7 text-emerald-500"/>Owners</h1><p className="page-subtitle">Manage property owners on the platform.</p></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Owners" value={owners.length} icon={<Users className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Active" value={owners.filter(o=>o.status==="ACTIVE").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Suspended" value={owners.filter(o=>o.status==="SUSPENDED").length} icon={<Ban className="w-5 h-5 text-rose-500"/>} color="bg-rose-50"/>
          <StatCard label="Total Listings" value={owners.reduce((a,o)=>a+o.properties,0)} icon={<Home className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
        </div>
        <div className="flex gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search owners..." className="flex-1 max-w-sm"/>
          <Tabs tabs={[{value:"all",label:"All"},{value:"ACTIVE",label:"Active"},{value:"SUSPENDED",label:"Suspended"}]} active={tab} onChange={setTab}/>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Owner</th><th>City</th><th>Properties</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(o=>(
                <tr key={o.id}>
                  <td><div className="flex items-center gap-3"><Avatar src={o.avatar} name={o.name} size="sm"/><div><p className="font-medium text-stone-900">{o.name}</p><p className="text-xs text-stone-400">{o.email}</p></div></div></td>
                  <td className="text-sm text-stone-600">{o.city}</td>
                  <td>{o.properties}</td>
                  <td><Badge variant={o.status==="ACTIVE"?"green":"rose"}>{o.status}</Badge></td>
                  <td className="text-xs text-stone-400">{formatDate(o.joined)}</td>
                  <td>
                    <div className="flex gap-1">
                      <Link href={`/dashboard/admin/users/owners/${o.id}`} className="btn-icon text-stone-400 hover:text-stone-700"><Eye className="w-4 h-4"/></Link>
                      {o.status==="ACTIVE"
                        ?<button onClick={()=>{setOwners(p=>p.map(x=>x.id===o.id?{...x,status:"SUSPENDED"}:x));toast.error("Owner suspended")}} className="btn-icon text-stone-400 hover:text-rose-600"><Ban className="w-4 h-4"/></button>
                        :<button onClick={()=>{setOwners(p=>p.map(x=>x.id===o.id?{...x,status:"ACTIVE"}:x));toast.success("Owner activated")}} className="btn-icon text-stone-400 hover:text-emerald-600"><CheckCircle className="w-4 h-4"/></button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
