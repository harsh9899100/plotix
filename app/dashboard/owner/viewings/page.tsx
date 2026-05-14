"use client"
import { useState } from "react"
import { Calendar, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, Tabs, StatCard, Avatar } from "@/components/ui"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

const VIEWINGS = [
  { id:"v1", propertyTitle:"3BHK in Adajan", buyerName:"Arjun Mehta", buyerPhone:"+91 98765 43210", buyerAvatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", date:new Date(Date.now()+24*3600000), time:"11:00 AM", status:"CONFIRMED", agentName:"Priya Sharma" },
  { id:"v2", propertyTitle:"3BHK in Adajan", buyerName:"Meera Patel", buyerPhone:"+91 87654 23456", buyerAvatar:"", date:new Date(Date.now()+3*86400000), time:"3:30 PM", status:"PENDING", agentName:null },
  { id:"v3", propertyTitle:"2BHK in Piplod", buyerName:"Kiran Shah", buyerPhone:"+91 93456 78901", buyerAvatar:"", date:new Date(Date.now()-2*86400000), time:"10:00 AM", status:"COMPLETED", agentName:null },
]
const STATUS_CFG: Record<string, { variant:any; icon:any }> = {
  CONFIRMED:{ variant:"green", icon:CheckCircle },
  PENDING:{ variant:"amber", icon:Clock },
  COMPLETED:{ variant:"blue", icon:Eye },
  CANCELLED:{ variant:"rose", icon:XCircle },
}

export default function OwnerViewingsPage() {
  const [viewings, setViewings] = useState(VIEWINGS)
  const [tab, setTab] = useState("all")
  const filtered = tab === "all" ? viewings : viewings.filter(v => v.status === tab)
  const updateStatus = (id: string, status: string) => { setViewings(p => p.map(v => v.id === id ? { ...v, status } : v)); toast.success(`Viewing ${status.toLowerCase()}`) }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Calendar className="w-7 h-7 text-blue-500" />Viewings</h1>
          <p className="page-subtitle">Manage all scheduled property viewings.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={viewings.length} icon={<Calendar className="w-5 h-5 text-stone-400" />} color="bg-stone-100" />
          <StatCard label="Upcoming" value={viewings.filter(v => v.date > new Date() && v.status !== "CANCELLED").length} icon={<Clock className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
          <StatCard label="Confirmed" value={viewings.filter(v => v.status === "CONFIRMED").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50" />
          <StatCard label="Completed" value={viewings.filter(v => v.status === "COMPLETED").length} icon={<Eye className="w-5 h-5 text-blue-500" />} color="bg-blue-50" />
        </div>
        <Tabs tabs={[{ value:"all", label:"All" }, { value:"PENDING", label:"Pending" }, { value:"CONFIRMED", label:"Confirmed" }, { value:"COMPLETED", label:"Completed" }]} active={tab} onChange={setTab} />
        <div className="space-y-4">
          {filtered.map(v => {
            const cfg = STATUS_CFG[v.status]
            return (
              <div key={v.id} className={`card p-5 ${v.status === "PENDING" ? "border-amber-200 bg-amber-50/10" : ""}`}>
                <div className="flex items-start gap-4">
                  <Avatar src={v.buyerAvatar} name={v.buyerName} size="md" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-body font-semibold text-stone-900">{v.buyerName}</p>
                      <Badge variant={cfg.variant}><cfg.icon className="w-3 h-3" />{v.status}</Badge>
                    </div>
                    <p className="text-sm text-amber-700 font-medium">{v.propertyTitle}</p>
                    <div className="flex gap-4 text-sm text-stone-500 mt-1">
                      <span>📅 {formatDate(v.date)}</span>
                      <span>🕐 {v.time}</span>
                    </div>
                    {v.agentName && <p className="text-xs text-stone-400 mt-1">Via agent: {v.agentName}</p>}
                  </div>
                  <div className="flex gap-2">
                    {v.status === "PENDING" && (
                      <>
                        <button onClick={() => updateStatus(v.id, "CONFIRMED")} className="btn-success text-xs">Confirm</button>
                        <button onClick={() => updateStatus(v.id, "CANCELLED")} className="btn-danger text-xs">Cancel</button>
                      </>
                    )}
                    <a href={`tel:${v.buyerPhone}`} className="btn-secondary text-xs">📞 Call</a>
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
