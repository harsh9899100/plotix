"use client"
import { useState } from "react"
import Link from "next/link"
import { Building2, Eye, Ban, CheckCircle, TrendingUp, Award, ArrowLeft } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Avatar, Badge, SearchInput, StatCard, Tabs } from "@/components/ui"
import { formatDate, formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"

const MOCK_BUILDERS = [
  { id:"bld1", name:"Karan Developers Pvt Ltd", contactPerson:"Karan Patel", email:"karan@builders.com", phone:"+91 99876 54321", avatar:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=60&h=60&fit=crop", city:"Surat", rera:"RERA-GUJ-DEV-2023-0045", status:"ACTIVE", projects:3, units:360, joined:new Date(Date.now()-365*86400000) },
  { id:"bld2", name:"Nexus Realty Corp", contactPerson:"Aryan Shah", email:"nexus@builders.net", phone:"+91 87654 09876", avatar:"", city:"Ahmedabad", rera:"RERA-GUJ-DEV-2024-0099", status:"PENDING_VERIFICATION", projects:1, units:80, joined:new Date(Date.now()-30*86400000) },
]

export default function AdminBuildersPage() {
  const [builders, setBuilders] = useState(MOCK_BUILDERS)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")
  const filtered = builders.filter(b => {
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.email.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === "all" || b.status === tab
    return matchSearch && matchTab
  })

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/users" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
          <div><h1 className="page-title flex items-center gap-2"><Building2 className="w-7 h-7 text-amber-500"/>Builders</h1><p className="page-subtitle">Manage builder companies and their projects.</p></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Builders" value={builders.length} icon={<Building2 className="w-5 h-5 text-amber-500"/>} color="bg-amber-50"/>
          <StatCard label="Active" value={builders.filter(b=>b.status==="ACTIVE").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Pending KYC" value={builders.filter(b=>b.status==="PENDING_VERIFICATION").length} icon={<Award className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
          <StatCard label="Total Units" value={builders.reduce((a,b)=>a+b.units,0)} icon={<TrendingUp className="w-5 h-5 text-violet-500"/>} color="bg-violet-50"/>
        </div>
        <div className="flex gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search builders..." className="flex-1 max-w-sm"/>
          <Tabs tabs={[{value:"all",label:"All"},{value:"ACTIVE",label:"Active"},{value:"PENDING_VERIFICATION",label:"Pending KYC"}]} active={tab} onChange={setTab}/>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Company</th><th>Contact</th><th>RERA</th><th>City</th><th>Projects</th><th>Units</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(b=>(
                <tr key={b.id}>
                  <td><div className="flex items-center gap-3"><Avatar src={b.avatar} name={b.name} size="sm"/><div><p className="font-medium text-stone-900">{b.name}</p><p className="text-xs text-stone-400">{b.email}</p></div></div></td>
                  <td className="text-sm text-stone-600">{b.contactPerson}</td>
                  <td><span className="text-xs font-mono text-stone-500">{b.rera}</span></td>
                  <td className="text-sm text-stone-600">{b.city}</td>
                  <td>{b.projects}</td>
                  <td>{b.units}</td>
                  <td><Badge variant={b.status==="ACTIVE"?"green":b.status==="PENDING_VERIFICATION"?"amber":"rose"}>{b.status.replace("_"," ")}</Badge></td>
                  <td>
                    <div className="flex gap-1">
                      <Link href={`/dashboard/admin/users/builders/${b.id}`} className="btn-icon text-stone-400 hover:text-stone-700"><Eye className="w-4 h-4"/></Link>
                      {b.status==="PENDING_VERIFICATION"&&<button onClick={()=>{setBuilders(p=>p.map(x=>x.id===b.id?{...x,status:"ACTIVE"}:x));toast.success("Builder verified!")}} className="btn-icon text-stone-400 hover:text-emerald-600"><CheckCircle className="w-4 h-4"/></button>}
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
