"use client"
import { useState } from "react"
import Link from "next/link"
import { Users, Search, Filter, Eye, Ban, CheckCircle, MoreHorizontal, TrendingUp, ArrowLeft } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Avatar, Badge, EmptyState, SearchInput, Tabs, StatCard, ConfirmDialog } from "@/components/ui"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

const MOCK_AGENTS = [
  { id:"a1", name:"Priya Sharma", email:"priya@agency.com", phone:"+91 97654 32109", avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face", city:"Surat", agency:"Sharma Realty", rera:"RERA-GUJ-AGT-2024-1234", status:"ACTIVE", properties:12, joined:new Date(Date.now()-180*86400000) },
  { id:"a2", name:"Rohan Mehta", email:"rohan@realty.in", phone:"+91 98765 43210", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", city:"Ahmedabad", agency:"Mehta Properties", rera:"RERA-GUJ-AGT-2023-0891", status:"ACTIVE", properties:8, joined:new Date(Date.now()-365*86400000) },
  { id:"a3", name:"Kavita Joshi", email:"kavita.j@estates.com", phone:"+91 96547 32108", avatar:"", city:"Vadodara", agency:"Joshi Estates", rera:"RERA-GUJ-AGT-2024-2210", status:"PENDING_VERIFICATION", properties:0, joined:new Date(Date.now()-7*86400000) },
  { id:"a4", name:"Vijay Kumar", email:"vijay@homes.com", phone:"+91 98321 54670", avatar:"", city:"Surat", agency:"Self-employed", rera:"RERA-GUJ-AGT-2022-0234", status:"SUSPENDED", properties:3, joined:new Date(Date.now()-730*86400000) },
]

const STATUS_VARS: Record<string,any> = { ACTIVE:"green", SUSPENDED:"rose", PENDING_VERIFICATION:"amber", INACTIVE:"stone" }

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState(MOCK_AGENTS)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")
  const [actionTarget, setActionTarget] = useState<{id:string;action:string}|null>(null)

  const filtered = agents.filter(a => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === "all" || a.status === tab
    return matchSearch && matchTab
  })

  const executeAction = () => {
    if (!actionTarget) return
    const { id, action } = actionTarget
    setAgents(prev => prev.map(a => a.id === id
      ? { ...a, status: action === "suspend" ? "SUSPENDED" : action === "activate" ? "ACTIVE" : action === "verify" ? "ACTIVE" : a.status }
      : a
    ))
    toast.success(`Agent ${action}d successfully`)
    setActionTarget(null)
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/admin/users" className="btn-icon"><ArrowLeft className="w-4 h-4"/></Link>
            <div>
              <h1 className="page-title flex items-center gap-2"><Users className="w-7 h-7 text-violet-500"/>Agents</h1>
              <p className="page-subtitle">Manage all registered real estate agents on the platform.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Agents" value={agents.length} icon={<Users className="w-5 h-5 text-violet-500"/>} color="bg-violet-50"/>
          <StatCard label="Active" value={agents.filter(a=>a.status==="ACTIVE").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Pending KYC" value={agents.filter(a=>a.status==="PENDING_VERIFICATION").length} icon={<Filter className="w-5 h-5 text-amber-500"/>} color="bg-amber-50"/>
          <StatCard label="Suspended" value={agents.filter(a=>a.status==="SUSPENDED").length} icon={<Ban className="w-5 h-5 text-rose-500"/>} color="bg-rose-50"/>
        </div>

        <div className="flex gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search agents..." className="flex-1 max-w-sm"/>
          <Tabs tabs={[{value:"all",label:"All"},{value:"ACTIVE",label:"Active"},{value:"PENDING_VERIFICATION",label:"Pending KYC"},{value:"SUSPENDED",label:"Suspended"}]}
            active={tab} onChange={setTab}/>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Users className="w-8 h-8 text-stone-300"/>} title="No agents found"/>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Agent</th><th>Agency</th><th>RERA</th><th>City</th><th>Properties</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar src={a.avatar} name={a.name} size="sm"/>
                        <div>
                          <p className="font-medium text-stone-900">{a.name}</p>
                          <p className="text-xs text-stone-400">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-stone-600">{a.agency}</td>
                    <td><span className="text-xs font-mono text-stone-500">{a.rera}</span></td>
                    <td className="text-sm text-stone-600">{a.city}</td>
                    <td className="text-sm text-stone-700 font-medium">{a.properties}</td>
                    <td><Badge variant={STATUS_VARS[a.status]}>{a.status.replace("_"," ")}</Badge></td>
                    <td className="text-xs text-stone-400">{formatDate(a.joined)}</td>
                    <td>
                      <div className="flex gap-1">
                        <Link href={`/dashboard/admin/users/agents/${a.id}`} className="btn-icon text-stone-400 hover:text-stone-700"><Eye className="w-4 h-4"/></Link>
                        {a.status === "ACTIVE" && (
                          <button onClick={() => setActionTarget({id:a.id,action:"suspend"})} className="btn-icon text-stone-400 hover:text-rose-600"><Ban className="w-4 h-4"/></button>
                        )}
                        {(a.status === "SUSPENDED" || a.status === "PENDING_VERIFICATION") && (
                          <button onClick={() => setActionTarget({id:a.id,action:"activate"})} className="btn-icon text-stone-400 hover:text-emerald-600"><CheckCircle className="w-4 h-4"/></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog open={!!actionTarget} onClose={() => setActionTarget(null)} onConfirm={executeAction}
        title={`${actionTarget?.action === "suspend" ? "Suspend" : "Activate"} Agent?`}
        description={`This will ${actionTarget?.action === "suspend" ? "prevent the agent from accessing the platform" : "restore the agent's access"}.`}
        confirmLabel={actionTarget?.action === "suspend" ? "Suspend" : "Activate"}
        danger={actionTarget?.action === "suspend"}/>
    </DashboardLayout>
  )
}
