"use client"
import { useState } from "react"
import { Calendar, Clock, CheckCircle, XCircle, Eye, Plus, MapPin, User } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, Tabs, StatCard, Avatar } from "@/components/ui"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"


const VIEWINGS = [
  { id:"v1", buyerName:"Arjun Mehta", buyerAvatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face", property:"Luxurious 4BHK Penthouse in Vesu", address:"Sky Towers, Vesu, Surat", date:new Date(Date.now()+24*3600000), time:"11:00 AM", status:"CONFIRMED" },
  { id:"v2", buyerName:"Meera Patel", buyerAvatar:"", property:"3BHK Apartment in Adajan", address:"Sky Heights, Adajan, Surat", date:new Date(Date.now()+2*86400000), time:"4:00 PM", status:"PENDING" },
  { id:"v3", buyerName:"Kiran Shah", buyerAvatar:"", property:"2BHK near VR Mall", address:"Green Park, Ring Road, Surat", date:new Date(Date.now()-1*86400000), time:"10:30 AM", status:"COMPLETED" },
  { id:"v4", buyerName:"Ravi Patel", buyerAvatar:"", property:"Office Space in Adajan", address:"Business Hub, Adajan, Surat", date:new Date(Date.now()-3*86400000), time:"3:00 PM", status:"CANCELLED" },
]

const STATUS_CFG: Record<string, { variant:any; icon:any }> = {
  CONFIRMED:  { variant:"green",  icon:CheckCircle },
  PENDING:    { variant:"amber",  icon:Clock },
  COMPLETED:  { variant:"blue",   icon:Eye },
  CANCELLED:  { variant:"rose",   icon:XCircle },
}

export default function AgentViewingsPage() {
  const [viewings, setViewings] = useState(VIEWINGS)
  const [tab, setTab] = useState("all")
  const filtered = tab === "all" ? viewings : viewings.filter(v => v.status === tab)
  const update = (id: string, status: string) => { setViewings(p => p.map(v => v.id === id ? { ...v, status } : v)); toast.success(`Viewing ${status.toLowerCase()}`) }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Calendar className="w-7 h-7 text-blue-500" />Viewings</h1>
            <p className="page-subtitle">Manage all your scheduled property viewings.</p>
          </div>
          <button onClick={() => toast.success("Schedule new viewing")} className="btn-gold"><Plus className="w-4 h-4" />Schedule</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Upcoming" value={viewings.filter(v => v.date > new Date() && v.status !== "CANCELLED").length} icon={<Clock className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
          <StatCard label="Confirmed" value={viewings.filter(v => v.status === "CONFIRMED").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50" />
          <StatCard label="Completed" value={viewings.filter(v => v.status === "COMPLETED").length} icon={<Eye className="w-5 h-5 text-blue-500" />} color="bg-blue-50" />
          <StatCard label="Total" value={viewings.length} icon={<Calendar className="w-5 h-5 text-stone-400" />} color="bg-stone-100" />
        </div>

        <div className="flex gap-3 flex-wrap">
          <Tabs tabs={[{ value:"all", label:"All" }, { value:"PENDING", label:"Pending" }, { value:"CONFIRMED", label:"Confirmed" }, { value:"COMPLETED", label:"Completed" }]} active={tab} onChange={setTab} />
        </div>

        <div className="space-y-4">
          {filtered.map(v => {
            const cfg = STATUS_CFG[v.status]
            return (
              <div key={v.id} className={`card p-5 ${v.status === "PENDING" ? "border-amber-200" : ""}`}>
                <div className="flex items-start gap-4">
                  <Avatar src={v.buyerAvatar} name={v.buyerName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-body font-semibold text-stone-900">{v.buyerName}</p>
                      <Badge variant={cfg.variant}><cfg.icon className="w-3 h-3" />{v.status}</Badge>
                    </div>
                    <p className="text-sm text-amber-700 font-medium mb-0.5">{v.property}</p>
                    <p className="text-xs text-stone-400 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{v.address}</p>
                    <div className="flex gap-4 text-sm text-stone-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(v.date)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{v.time}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {v.status === "PENDING" && <button onClick={() => update(v.id, "CONFIRMED")} className="btn-success text-xs">Confirm</button>}
                    {v.status === "CONFIRMED" && <button onClick={() => update(v.id, "COMPLETED")} className="btn-secondary text-xs">Complete</button>}
                    {(v.status === "PENDING" || v.status === "CONFIRMED") && <button onClick={() => update(v.id, "CANCELLED")} className="btn-danger text-xs">Cancel</button>}
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
