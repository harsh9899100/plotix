"use client"
import { useState } from "react"
import { Users, UserPlus, TrendingUp, MapPin, Phone, Star, MessageSquare } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Avatar, Badge, SearchInput, StatCard, Tabs } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"
import toast from "react-hot-toast"

const LEADS = [
  { id:"l1", name:"Arjun Mehta", phone:"+91 98765 43210", email:"arjun@demo.com", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", city:"Surat", interest:"Unit 1204 — Sky Residences", budget:"₹80L–₹1Cr", source:"Website", status:"HOT", score:92, receivedAt:new Date(Date.now()-3*3600000) },
  { id:"l2", name:"Meera Patel", phone:"+91 87654 23456", email:"meera@mail.com", avatar:"", city:"Ahmedabad", interest:"Villa B-05 — Harmony Villas", budget:"₹1Cr–₹1.5Cr", source:"Agent Referral", status:"WARM", score:74, receivedAt:new Date(Date.now()-24*3600000) },
  { id:"l3", name:"Kiran Shah", phone:"+91 93456 78901", email:"kiran@shah.in", avatar:"", city:"Surat", interest:"General Inquiry — Sky Residences", budget:"₹50L–₹70L", source:"Social Media", status:"COLD", score:38, receivedAt:new Date(Date.now()-3*86400000) },
]

const STATUS_CFG: Record<string, { variant:any; color:string }> = {
  HOT:  { variant:"rose", color:"text-rose-500" },
  WARM: { variant:"amber", color:"text-amber-500" },
  COLD: { variant:"blue", color:"text-blue-400" },
}

export default function BuilderLeadsPage() {
  const [leads, setLeads] = useState(LEADS)
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.interest.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === "all" || l.status === tab
    return matchSearch && matchTab
  })

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Users className="w-7 h-7 text-blue-500" />Leads</h1>
          <p className="page-subtitle">All potential buyers who have shown interest in your projects.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Leads" value={leads.length} icon={<Users className="w-5 h-5 text-blue-500" />} color="bg-blue-50" />
          <StatCard label="Hot Leads" value={leads.filter(l => l.status === "HOT").length} icon={<TrendingUp className="w-5 h-5 text-rose-500" />} color="bg-rose-50" />
          <StatCard label="Warm" value={leads.filter(l => l.status === "WARM").length} icon={<Star className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
          <StatCard label="Cold" value={leads.filter(l => l.status === "COLD").length} icon={<UserPlus className="w-5 h-5 text-stone-400" />} color="bg-stone-100" />
        </div>

        <div className="flex gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search leads..." className="flex-1 max-w-sm" />
          <Tabs tabs={[{ value:"all", label:"All" }, { value:"HOT", label:"🔥 Hot" }, { value:"WARM", label:"Warm" }, { value:"COLD", label:"Cold" }]} active={tab} onChange={setTab} />
        </div>

        <div className="space-y-4">
          {filtered.map(lead => {
            const cfg = STATUS_CFG[lead.status]
            return (
              <div key={lead.id} className="card p-5">
                <div className="flex items-start gap-4">
                  <Avatar src={lead.avatar} name={lead.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-body font-semibold text-stone-900">{lead.name}</p>
                      <Badge variant={cfg.variant}>{lead.status}</Badge>
                      <div className="ml-auto flex items-center gap-1">
                        <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width:`${lead.score}%`, backgroundColor:lead.status==="HOT"?"#f43f5e":lead.status==="WARM"?"#f59e0b":"#60a5fa" }}/></div>
                        <span className="text-xs text-stone-500">{lead.score}</span>
                      </div>
                    </div>
                    <p className="text-sm text-amber-700 font-medium mb-1">{lead.interest}</p>
                    <div className="flex gap-4 text-xs text-stone-400 mb-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lead.city}</span>
                      <span>Budget: {lead.budget}</span>
                      <span>Source: {lead.source}</span>
                      <span>{formatTimeAgo(lead.receivedAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <a href={`tel:${lead.phone}`} className="btn-gold text-xs">📞 Call</a>
                    <a href={`mailto:${lead.email}`} className="btn-secondary text-xs flex items-center gap-1"><MessageSquare className="w-3 h-3" />Email</a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
