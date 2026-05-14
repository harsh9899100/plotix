"use client"
import { useState } from "react"
import { LifeBuoy, MessageSquare, Clock, CheckCircle, AlertCircle, Phone, ArrowUpRight } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, StatCard, Tabs, SearchInput, Avatar } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"
import toast from "react-hot-toast"

const TICKETS = [
  { id:"s1", ticketNo:"TKT-2024-1849", user:"Arjun Mehta", userRole:"BUYER", email:"arjun@demo.com", subject:"Unable to schedule a viewing — button not working", priority:"HIGH", status:"OPEN", category:"BUG", time:new Date(Date.now()-1*3600000) },
  { id:"s2", ticketNo:"TKT-2024-1848", user:"Priya Sharma", userRole:"AGENT", email:"priya@agency.com", subject:"Commission payment not reflecting in my dashboard", priority:"HIGH", status:"IN_PROGRESS", category:"PAYMENTS", time:new Date(Date.now()-3*3600000) },
  { id:"s3", ticketNo:"TKT-2024-1847", user:"Karan Developers", userRole:"BUILDER", email:"karan@builders.com", subject:"How to add more units to an existing project?", priority:"LOW", status:"RESOLVED", category:"HOW_TO", time:new Date(Date.now()-24*3600000) },
  { id:"s4", ticketNo:"TKT-2024-1845", user:"Meera Patel", userRole:"BUYER", email:"meera@mail.com", subject:"Images not uploading for property verification", priority:"MEDIUM", status:"OPEN", category:"BUG", time:new Date(Date.now()-48*3600000) },
]

const PRIORITY_CFG: Record<string, any> = { HIGH:"rose", MEDIUM:"amber", LOW:"stone" }
const STATUS_CFG: Record<string, { variant:any; icon:any }> = {
  OPEN:        { variant:"amber",   icon:Clock },
  IN_PROGRESS: { variant:"blue",    icon:AlertCircle },
  RESOLVED:    { variant:"green",   icon:CheckCircle },
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState(TICKETS)
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = tickets.filter(t => {
    const matchSearch = !search || t.user.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()) || t.ticketNo.includes(search)
    const matchTab = tab === "all" || t.status === tab
    return matchSearch && matchTab
  })

  const updateStatus = (id: string, status: string) => {
    setTickets(p => p.map(t => t.id === id ? { ...t, status } : t))
    toast.success(`Ticket status updated to ${status}`)
  }

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><LifeBuoy className="w-7 h-7 text-blue-500" />Support Tickets</h1>
          <p className="page-subtitle">Manage user support requests and platform issues.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Open" value={tickets.filter(t => t.status === "OPEN").length} icon={<Clock className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
          <StatCard label="In Progress" value={tickets.filter(t => t.status === "IN_PROGRESS").length} icon={<AlertCircle className="w-5 h-5 text-blue-500" />} color="bg-blue-50" />
          <StatCard label="Resolved" value={tickets.filter(t => t.status === "RESOLVED").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50" />
          <StatCard label="Total" value={tickets.length} icon={<MessageSquare className="w-5 h-5 text-stone-400" />} color="bg-stone-100" />
        </div>

        <div className="flex gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by user, ticket # or subject..." className="flex-1 max-w-sm" />
          <Tabs tabs={[
            { value:"all", label:"All" },
            { value:"OPEN", label:"Open", count:tickets.filter(t => t.status === "OPEN").length },
            { value:"IN_PROGRESS", label:"In Progress" },
            { value:"RESOLVED", label:"Resolved" },
          ]} active={tab} onChange={setTab} />
        </div>

        <div className="space-y-3">
          {filtered.map(t => {
            const cfg = STATUS_CFG[t.status]
            return (
              <div key={t.id} className={`card p-5 ${t.status === "OPEN" && t.priority === "HIGH" ? "border-rose-200 bg-rose-50/10" : ""}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-xs text-stone-400">{t.ticketNo}</span>
                      <Badge variant={cfg.variant}><cfg.icon className="w-3 h-3" />{t.status.replace("_"," ")}</Badge>
                      <Badge variant={PRIORITY_CFG[t.priority]}>{t.priority}</Badge>
                      <Badge variant="stone">{t.category}</Badge>
                      <span className="text-xs text-stone-400 ml-auto">{formatTimeAgo(t.time)}</span>
                    </div>
                    <p className="font-body font-semibold text-stone-900 mb-1">{t.subject}</p>
                    <p className="text-sm text-stone-400 font-body">{t.user} <span className="text-stone-300">({t.userRole})</span> · {t.email}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {t.status === "OPEN" && (
                      <button onClick={() => updateStatus(t.id, "IN_PROGRESS")} className="btn-secondary text-xs">Take</button>
                    )}
                    {t.status === "IN_PROGRESS" && (
                      <button onClick={() => updateStatus(t.id, "RESOLVED")} className="btn-success text-xs">Resolve</button>
                    )}
                    <a href={`mailto:${t.email}?subject=Re: [${t.ticketNo}] ${t.subject}`} className="btn-ghost text-xs flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />Reply
                    </a>
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
