"use client"
import { useState } from "react"
import Link from "next/link"
import { Zap, Plus, Phone, Mail, MessageSquare, MoreHorizontal, TrendingUp, ChevronRight } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { StatCard } from "@/components/ui"
import { formatCurrency, cn } from "@/lib/utils"
import toast from "react-hot-toast"

const STAGES = ["NEW","CONTACTED","QUALIFIED","VIEWING_SCHEDULED","NEGOTIATION","CLOSED_WON","CLOSED_LOST"]
const STAGE_LABELS: Record<string,string> = { NEW:"New",CONTACTED:"Contacted",QUALIFIED:"Qualified",VIEWING_SCHEDULED:"Viewing Set",NEGOTIATION:"Negotiation",CLOSED_WON:"Won",CLOSED_LOST:"Lost" }
const TEMP_COLORS: Record<string,string> = { HOT:"bg-rose-50 text-rose-600 border-rose-200", WARM:"bg-amber-50 text-amber-600 border-amber-200", COLD:"bg-blue-50 text-blue-600 border-blue-200" }

const MOCK_LEADS = [
  { id:"l1",name:"Vikram Desai",email:"vikram@ex.com",phone:"9876543210",source:"Website",status:"NEW",temperature:"HOT",score:85,budget:15000000,notes:"Looking for 3BHK, ready in 2 months",createdAt:new Date(Date.now()-86400000),avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face" },
  { id:"l2",name:"Sneha Patel",email:"sneha@ex.com",phone:"9765432109",source:"Referral",status:"QUALIFIED",temperature:"HOT",score:92,budget:25000000,notes:"Pre-approved for home loan",createdAt:new Date(Date.now()-172800000),avatar:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face" },
  { id:"l3",name:"Rahul Gupta",email:"rahul@ex.com",phone:"9654321098",source:"Google Ads",status:"VIEWING_SCHEDULED",temperature:"WARM",score:70,budget:8000000,notes:"Viewing Saturday at Adajan",createdAt:new Date(Date.now()-259200000),avatar:"https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&crop=face" },
  { id:"l4",name:"Anita Shah",email:"anita@ex.com",phone:"9543210987",source:"PropTiger",status:"CONTACTED",temperature:"WARM",score:55,budget:12000000,notes:"Needs commercial space near BKC",createdAt:new Date(Date.now()-345600000),avatar:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face" },
  { id:"l5",name:"Rajesh Kumar",email:"rajesh@ex.com",phone:"9432109876",source:"Walk-in",status:"NEGOTIATION",temperature:"HOT",score:95,budget:45000000,notes:"Close to finalising SG Highway villa",createdAt:new Date(Date.now()-432000000),avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
  { id:"l6",name:"Pooja Mehta",email:"pooja@ex.com",phone:"9321098765",source:"99acres",status:"CLOSED_WON",temperature:"HOT",score:100,budget:9500000,notes:"Deal closed! 3BHK Adajan.",createdAt:new Date(Date.now()-518400000),avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" },
]

export default function AgentLeadsPage() {
  const [leads, setLeads] = useState(MOCK_LEADS)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")
  const [menu, setMenu] = useState<string|null>(null)

  const filtered = leads.filter(l =>
    (tab === "all" || l.status === tab) &&
    (!search || l.name.toLowerCase().includes(search.toLowerCase()))
  )

  const updateStage = (id: string, status: string) => {
    setLeads(prev => prev.map(l => l.id === id ? {...l, status} : l))
    toast.success("Lead updated"); setMenu(null)
  }
  const del = (id: string) => { setLeads(prev => prev.filter(l => l.id !== id)); toast.success("Lead deleted") }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="page-title flex items-center gap-2"><Zap className="w-7 h-7 text-amber-500"/>My Leads</h1><p className="page-subtitle">{leads.filter(l=>l.temperature==="HOT").length} hot · {leads.filter(l=>l.status==="CLOSED_WON").length} won</p></div>
          <button className="btn-gold"><Plus className="w-4 h-4"/>Add Lead</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {label:"Total",value:leads.length,color:"bg-amber-50",icon:<Zap className="w-5 h-5 text-amber-500"/>},
            {label:"Hot",value:leads.filter(l=>l.temperature==="HOT").length,color:"bg-rose-50",icon:<Zap className="w-5 h-5 text-rose-500"/>},
            {label:"Won",value:leads.filter(l=>l.status==="CLOSED_WON").length,color:"bg-emerald-50",icon:<TrendingUp className="w-5 h-5 text-emerald-500"/>},
            {label:"Won Value",value:formatCurrency(leads.filter(l=>l.status==="CLOSED_WON").reduce((s,l)=>s+l.budget,0)),color:"bg-blue-50",icon:<TrendingUp className="w-5 h-5 text-blue-500"/>},
          ].map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        <div className="card-flat p-4">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search leads..." className="input max-w-sm mb-3"/>
          <div className="flex gap-1 flex-wrap">
            {["all",...STAGES.slice(0,6)].map(s=>(
              <button key={s} onClick={()=>setTab(s)}
                className={cn("px-3 py-1.5 rounded-xl text-xs font-body font-medium transition-all",
                  tab===s?"bg-stone-900 text-white":"bg-stone-100 text-stone-600 hover:bg-stone-200")}>
                {s==="all"?"All":STAGE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map(lead => (
            <div key={lead.id} className="card p-4 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <img src={lead.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-body font-semibold text-stone-900">{lead.name}</p>
                        <span className={cn("text-[10px] font-body font-bold px-2 py-0.5 rounded-full border",TEMP_COLORS[lead.temperature])}>{lead.temperature}</span>
                        <span className="badge badge-blue text-[10px]">{STAGE_LABELS[lead.status]}</span>
                      </div>
                      <p className="text-xs text-stone-400 font-body">{lead.email} · {lead.phone} · {lead.source}</p>
                      {lead.notes && <p className="text-xs text-stone-500 font-body mt-1.5 bg-stone-50 rounded-lg px-3 py-1.5 line-clamp-1">{lead.notes}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-body font-semibold text-stone-900 text-sm">{formatCurrency(lead.budget)}</p>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        <div className="w-14 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{width:`${lead.score}%`}}/>
                        </div>
                        <span className="text-[10px] font-body text-stone-500">{lead.score}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <a href={`tel:${lead.phone}`} className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-emerald-600 transition-colors"><Phone className="w-4 h-4"/></a>
                  <a href={`mailto:${lead.email}`} className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-blue-600 transition-colors"><Mail className="w-4 h-4"/></a>
                  <div className="relative">
                    <button onClick={()=>setMenu(menu===lead.id?null:lead.id)} className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 transition-colors"><MoreHorizontal className="w-4 h-4"/></button>
                    {menu===lead.id&&(<>
                      <div className="fixed inset-0 z-10" onClick={()=>setMenu(null)}/>
                      <div className="absolute right-0 top-10 w-48 bg-white border border-stone-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        <p className="px-4 py-2 text-[10px] font-body font-bold text-stone-400 uppercase tracking-wider border-b">Move Stage</p>
                        {STAGES.map(s=>(
                          <button key={s} onClick={()=>updateStage(lead.id,s)}
                            className={cn("w-full flex items-center justify-between px-4 py-2 text-sm font-body hover:bg-stone-50",lead.status===s?"font-semibold text-stone-900":"text-stone-600")}>
                            {STAGE_LABELS[s]}{lead.status===s&&<ChevronRight className="w-3 h-3 text-emerald-500"/>}
                          </button>
                        ))}
                        <button onClick={()=>del(lead.id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-rose-600 hover:bg-rose-50 border-t border-stone-100">Delete</button>
                      </div>
                    </>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
