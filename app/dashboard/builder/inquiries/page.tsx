"use client"
import { useState } from "react"
import Link from "next/link"
import { MessageSquare, Clock, CheckCircle, XCircle, Eye, ArrowLeft, Building2 } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, SearchInput, Tabs, StatCard, Avatar } from "@/components/ui"
import { formatTimeAgo, formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"


const INQUIRIES = [
  { id:"i1", buyerName:"Arjun Mehta", buyerEmail:"arjun@demo.com", buyerPhone:"+91 98765 43210", buyerAvatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", unit:"Unit 1204 — Sky Residences", project:"Sky Residences", unitPrice:8500000, message:"Hi, I'm very interested in Unit 1204. Could you share the floor plan and payment schedule?", status:"NEW", receivedAt:new Date(Date.now()-3*3600000) },
  { id:"i2", buyerName:"Meera Patel", buyerEmail:"meera@mail.com", buyerPhone:"+91 87654 23456", buyerAvatar:"", unit:"Villa B-05 — Harmony Villas", project:"Harmony Villas", unitPrice:12000000, message:"We are NRI buyers based in Dubai. Can we schedule a virtual tour? Also, is there any NRI-specific payment plan?", status:"REPLIED", receivedAt:new Date(Date.now()-24*3600000) },
  { id:"i3", buyerName:"Rajesh Kumar", buyerEmail:"rajesh@kumar.in", buyerPhone:"+91 93456 78901", buyerAvatar:"", unit:"Unit 805 — Sky Residences", project:"Sky Residences", unitPrice:6800000, message:"What is the RERA number? Also, when is the expected possession date?", status:"NEW", receivedAt:new Date(Date.now()-6*3600000) },
]

const STATUS_CFG: Record<string, { variant: any; icon: any; label: string }> = {
  NEW:     { variant:"amber", icon:Clock,        label:"New" },
  REPLIED: { variant:"green", icon:CheckCircle,  label:"Replied" },
  CLOSED:  { variant:"stone", icon:XCircle,      label:"Closed" },
}

export default function BuilderInquiriesPage() {
  const [inquiries, setInquiries] = useState(INQUIRIES)
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = inquiries.filter(i => {
    const matchSearch = !search || i.buyerName.toLowerCase().includes(search.toLowerCase()) || i.unit.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === "all" || i.status === tab
    return matchSearch && matchTab
  })

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><MessageSquare className="w-7 h-7 text-violet-500" />Project Inquiries</h1>
          <p className="page-subtitle">All buyer inquiries across your projects and units.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={inquiries.length} icon={<MessageSquare className="w-5 h-5 text-stone-400" />} color="bg-stone-100" />
          <StatCard label="New" value={inquiries.filter(i => i.status === "NEW").length} icon={<Clock className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
          <StatCard label="Replied" value={inquiries.filter(i => i.status === "REPLIED").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50" />
          <StatCard label="Projects" value={new Set(inquiries.map(i => i.project)).size} icon={<Building2 className="w-5 h-5 text-blue-500" />} color="bg-blue-50" />
        </div>

        <div className="flex gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search buyer or unit..." className="flex-1 max-w-sm" />
          <Tabs
            tabs={[
              { value:"all", label:"All", count:inquiries.length },
              { value:"NEW", label:"New", count:inquiries.filter(i => i.status === "NEW").length },
              { value:"REPLIED", label:"Replied" },
            ]}
            active={tab} onChange={setTab}
          />
        </div>

        <div className="space-y-4">
          {filtered.map(inq => {
            const cfg = STATUS_CFG[inq.status]
            return (
              <div key={inq.id} className={`card p-5 ${inq.status === "NEW" ? "border-amber-200 bg-amber-50/10" : ""}`}>
                <div className="flex items-start gap-4">
                  <Avatar src={inq.buyerAvatar} name={inq.buyerName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
                      <div className="flex items-center gap-2">
                        <p className="font-body font-semibold text-stone-900">{inq.buyerName}</p>
                        <Badge variant={cfg.variant}><cfg.icon className="w-3 h-3" />{cfg.label}</Badge>
                      </div>
                      <span className="text-xs text-stone-400">{formatTimeAgo(inq.receivedAt)}</span>
                    </div>
                    <p className="text-sm text-amber-700 font-body font-medium mb-0.5">{inq.unit}</p>
                    <p className="text-xs text-stone-400 mb-3">Unit Price: {formatCurrency(inq.unitPrice)}</p>
                    <p className="text-sm font-body text-stone-600 bg-stone-50 rounded-xl px-4 py-3 line-clamp-2">{inq.message}</p>
                    <div className="flex gap-3 mt-4">
                      <Link href={`/dashboard/builder/inquiries/${inq.id}`} className="btn-gold text-xs flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />View & Reply
                      </Link>
                      <a href={`tel:${inq.buyerPhone}`} className="btn-secondary text-xs">📞 Call</a>
                      <a href={`mailto:${inq.buyerEmail}`} className="btn-ghost text-xs">✉️ Email</a>
                      {inq.status === "NEW" && (
                        <button onClick={() => { setInquiries(p => p.map(i => i.id === inq.id ? { ...i, status:"REPLIED" } : i)); toast.success("Marked as replied") }}
                          className="btn-ghost text-xs text-emerald-600">
                          ✓ Mark Replied
                        </button>
                      )}
                    </div>
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
