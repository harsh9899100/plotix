"use client"
import { useState } from "react"
import { Mail, Plus, Send, BarChart2, Eye, Trash2, Edit, Users } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, StatCard, ConfirmDialog } from "@/components/ui"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"


const CAMPAIGNS = [
  { id:"c1", name:"New Listings November 2024", subject:"🏠 5 New Properties Just Listed in Surat!", audience:"My Buyers List", recipients:87, openRate:42, clickRate:18, status:"SENT", sentAt:new Date(Date.now()-7*86400000) },
  { id:"c2", name:"Price Drop Alert — Adajan", subject:"📉 Price Drop Alert: 3BHK in Adajan now at ₹65L", audience:"Interested Buyers", recipients:34, openRate:61, clickRate:29, status:"SENT", sentAt:new Date(Date.now()-3*86400000) },
  { id:"c3", name:"Seasonal Greetings + Market Update", subject:"Happy Diwali 🪔 | Surat Real Estate Trends", audience:"All Contacts", recipients:142, openRate:0, clickRate:0, status:"DRAFT", sentAt:null },
]

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS)
  const [deleting, setDeleting] = useState<string | null>(null)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Mail className="w-7 h-7 text-emerald-500" />Email Campaigns</h1>
            <p className="page-subtitle">Send targeted email campaigns to your buyer database.</p>
          </div>
          <button onClick={() => toast.success("Campaign builder launching...")} className="btn-gold">
            <Plus className="w-4 h-4" />New Campaign
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Sent" value={campaigns.filter(c=>c.status==="SENT").length} icon={<Send className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Drafts" value={campaigns.filter(c=>c.status==="DRAFT").length} icon={<Edit className="w-5 h-5 text-stone-400"/>} color="bg-stone-100"/>
          <StatCard label="Avg Open Rate" value={`${Math.round(campaigns.filter(c=>c.openRate>0).reduce((a,c)=>a+c.openRate,0)/campaigns.filter(c=>c.openRate>0).length)}%`} icon={<Eye className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
          <StatCard label="Total Reach" value={campaigns.reduce((a,c)=>a+c.recipients,0)} icon={<Users className="w-5 h-5 text-violet-500"/>} color="bg-violet-50"/>
        </div>

        <div className="space-y-4">
          {campaigns.map(c => (
            <div key={c.id} className={`card p-5 ${c.status === "DRAFT" ? "border-dashed border-stone-200" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-body font-semibold text-stone-900">{c.name}</p>
                    <Badge variant={c.status === "SENT" ? "green" : "stone"}>{c.status}</Badge>
                  </div>
                  <p className="text-sm text-stone-500 font-mono mb-1 truncate">{c.subject}</p>
                  <p className="text-xs text-stone-400">{c.audience} · {c.recipients} recipients {c.sentAt ? `· Sent ${formatDate(c.sentAt)}` : ""}</p>

                  {c.status === "SENT" && (
                    <div className="flex gap-6 mt-3">
                      <div>
                        <p className="text-xs text-stone-400">Open Rate</p>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 rounded-full" style={{ width:`${c.openRate}%` }}/></div>
                          <span className="text-sm font-semibold text-stone-700">{c.openRate}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400">Click Rate</p>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-blue-400 rounded-full" style={{ width:`${c.clickRate * 2}%` }}/></div>
                          <span className="text-sm font-semibold text-stone-700">{c.clickRate}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {c.status === "DRAFT" && (
                    <button onClick={() => toast.success(`Launching "${c.name}"...`)} className="btn-success text-xs"><Send className="w-3.5 h-3.5" />Send</button>
                  )}
                  <button onClick={() => toast.success(`Editing "${c.name}"`)} className="btn-icon text-stone-400 hover:text-stone-700"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => toast.success(`Viewing analytics for "${c.name}"`)} className="btn-icon text-stone-400 hover:text-stone-700"><BarChart2 className="w-4 h-4" /></button>
                  <button onClick={() => setDeleting(c.id)} className="btn-icon text-stone-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => { setCampaigns(p => p.filter(c => c.id !== deleting)); setDeleting(null); toast.success("Campaign deleted") }}
        title="Delete Campaign?" confirmLabel="Delete" danger />
    </DashboardLayout>
  )
}
