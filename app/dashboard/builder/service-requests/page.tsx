"use client"
import { useState } from "react"
import { Wrench, Plus, CheckCircle, Clock, AlertCircle, Eye, Trash2, Home } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, Tabs, StatCard, ConfirmDialog } from "@/components/ui"
import { formatDate, formatTimeAgo } from "@/lib/utils"
import toast from "react-hot-toast"


const REQUESTS = [
  { id:"sr1", unitRef:"Unit 1204", project:"Sky Residences", ownerName:"Arjun Mehta", category:"PLUMBING", description:"Kitchen sink tap is leaking continuously. Water is dripping even when closed fully.", priority:"HIGH", status:"OPEN", raisedAt:new Date(Date.now()-2*86400000) },
  { id:"sr2", unitRef:"Unit 805", project:"Sky Residences", ownerName:"Kiran Shah", category:"ELECTRICAL", description:"The main switch board in the living room trips frequently especially when AC is running.", priority:"MEDIUM", status:"IN_PROGRESS", raisedAt:new Date(Date.now()-5*86400000) },
  { id:"sr3", unitRef:"Villa B-05", project:"Harmony Villas", ownerName:"Meera Patel", category:"CIVIL", description:"Small crack visible in the corner of the master bedroom wall near the window.", priority:"LOW", status:"RESOLVED", raisedAt:new Date(Date.now()-15*86400000) },
]

const CAT_CFG: Record<string, any> = { PLUMBING:"blue", ELECTRICAL:"amber", CIVIL:"stone", CARPENTRY:"violet", PAINTING:"emerald" }
const STATUS_CFG: Record<string, { variant:any; icon:any }> = {
  OPEN:        { variant:"amber", icon:Clock },
  IN_PROGRESS: { variant:"blue",  icon:AlertCircle },
  RESOLVED:    { variant:"green", icon:CheckCircle },
}
const PRIORITY_CFG: Record<string, any> = { HIGH:"rose", MEDIUM:"amber", LOW:"stone" }

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState(REQUESTS)
  const [tab, setTab] = useState("all")
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = tab === "all" ? requests : requests.filter(r => r.status === tab)
  const update = (id: string, status: string) => { setRequests(p => p.map(r => r.id === id ? { ...r, status } : r)); toast.success(`Status updated`) }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Wrench className="w-7 h-7 text-stone-500" />Service Requests</h1>
          <p className="page-subtitle">Manage post-possession maintenance and service requests from unit owners.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Open" value={requests.filter(r => r.status === "OPEN").length} icon={<Clock className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
          <StatCard label="In Progress" value={requests.filter(r => r.status === "IN_PROGRESS").length} icon={<AlertCircle className="w-5 h-5 text-blue-500" />} color="bg-blue-50" />
          <StatCard label="Resolved" value={requests.filter(r => r.status === "RESOLVED").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50" />
          <StatCard label="Total" value={requests.length} icon={<Wrench className="w-5 h-5 text-stone-400" />} color="bg-stone-100" />
        </div>

        <Tabs tabs={[{ value:"all", label:"All" }, { value:"OPEN", label:"Open" }, { value:"IN_PROGRESS", label:"In Progress" }, { value:"RESOLVED", label:"Resolved" }]} active={tab} onChange={setTab} />

        <div className="space-y-4">
          {filtered.map(req => {
            const cfg = STATUS_CFG[req.status]
            return (
              <div key={req.id} className={`card p-5 ${req.status === "OPEN" && req.priority === "HIGH" ? "border-amber-200 bg-amber-50/10" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant={cfg.variant}><cfg.icon className="w-3 h-3" />{req.status.replace("_"," ")}</Badge>
                      <Badge variant={CAT_CFG[req.category]}>{req.category}</Badge>
                      <Badge variant={PRIORITY_CFG[req.priority]}>{req.priority} Priority</Badge>
                      <span className="text-xs text-stone-400 ml-auto">{formatDate(req.raisedAt)}</span>
                    </div>
                    <p className="font-body font-semibold text-stone-900 mb-0.5">{req.unitRef} — {req.project}</p>
                    <p className="text-xs text-stone-400 mb-3">Owner: {req.ownerName}</p>
                    <p className="text-sm font-body text-stone-600 bg-stone-50 p-3 rounded-xl">{req.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {req.status === "OPEN" && <button onClick={() => update(req.id, "IN_PROGRESS")} className="btn-secondary text-xs">Assign</button>}
                    {req.status === "IN_PROGRESS" && <button onClick={() => update(req.id, "RESOLVED")} className="btn-success text-xs">Resolve</button>}
                    <button onClick={() => setDeleting(req.id)} className="btn-icon text-stone-400 hover:text-rose-600 self-end"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => { setRequests(p => p.filter(r => r.id !== deleting)); setDeleting(null); toast.success("Request deleted") }}
        title="Delete Service Request?" confirmLabel="Delete" danger />
    </DashboardLayout>
  )
}
