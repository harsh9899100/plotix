"use client"
import { useState } from "react"
import { Shield, FileText, Download, Filter, Eye, Clock, CheckCircle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, Tabs, StatCard } from "@/components/ui"
import { formatDate, formatTimeAgo } from "@/lib/utils"
import toast from "react-hot-toast"


const AUDIT_LOGS = [
  { id:"al1", actor:"admin@plotix.in", role:"ADMIN", action:"APPROVE_PROPERTY", target:"Penthouse in Vesu (prop-123)", ip:"192.168.1.5", timestamp:new Date(Date.now()-30*60000), severity:"INFO" },
  { id:"al2", actor:"superadmin@plotix.in", role:"SUPERADMIN", action:"SUSPEND_USER", target:"vijay@homes.com (user-456)", ip:"192.168.1.1", timestamp:new Date(Date.now()-2*3600000), severity:"WARN" },
  { id:"al3", actor:"superadmin@plotix.in", role:"SUPERADMIN", action:"CHANGE_COMMISSION_RATE", target:"Default Rate: 2% → 2.5%", ip:"192.168.1.1", timestamp:new Date(Date.now()-3*3600000), severity:"CRITICAL" },
  { id:"al4", actor:"admin@plotix.in", role:"ADMIN", action:"DELETE_BLOG_POST", target:"Blog: 'Top 10 Areas in Surat' (post-78)", ip:"192.168.1.5", timestamp:new Date(Date.now()-5*3600000), severity:"WARN" },
  { id:"al5", actor:"superadmin@plotix.in", role:"SUPERADMIN", action:"CREATE_ADMIN", target:"newadmin@plotix.in", ip:"192.168.1.1", timestamp:new Date(Date.now()-8*3600000), severity:"CRITICAL" },
  { id:"al6", actor:"admin@plotix.in", role:"ADMIN", action:"REJECT_PROPERTY", target:"2BHK in Adajan (prop-999)", ip:"192.168.1.5", timestamp:new Date(Date.now()-10*3600000), severity:"INFO" },
  { id:"al7", actor:"admin@plotix.in", role:"ADMIN", action:"VERIFY_AGENT", target:"priya@agency.com — RERA verified", ip:"192.168.1.5", timestamp:new Date(Date.now()-24*3600000), severity:"INFO" },
]

const SEVERITY_CFG: Record<string,any> = { INFO:"stone", WARN:"amber", CRITICAL:"rose" }

export default function AuditLogsPage() {
  const [tab, setTab] = useState("all")
  const filtered = tab === "all" ? AUDIT_LOGS : AUDIT_LOGS.filter(l => l.severity === tab)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><Shield className="w-7 h-7 text-stone-700"/>Audit Logs</h1>
            <p className="page-subtitle">Complete trail of all administrative actions on the platform.</p>
          </div>
          <button className="btn-secondary text-sm" onClick={() => toast.success("Report exported")}><Download className="w-4 h-4"/>Export CSV</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Actions (7d)" value={AUDIT_LOGS.length} icon={<FileText className="w-5 h-5 text-stone-500"/>} color="bg-stone-100"/>
          <StatCard label="Critical Changes" value={AUDIT_LOGS.filter(l=>l.severity==="CRITICAL").length} icon={<Shield className="w-5 h-5 text-rose-500"/>} color="bg-rose-50"/>
          <StatCard label="Admins Active" value={2} icon={<Eye className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
        </div>

        <Tabs tabs={[{value:"all",label:"All"},{value:"CRITICAL",label:"Critical",count:AUDIT_LOGS.filter(l=>l.severity==="CRITICAL").length},{value:"WARN",label:"Warnings"},{value:"INFO",label:"Info"}]}
          active={tab} onChange={setTab}/>

        <div className="space-y-2">
          {filtered.map(log => (
            <div key={log.id} className={`flex items-start gap-4 p-4 rounded-2xl border ${
              log.severity === "CRITICAL" ? "border-rose-200 bg-rose-50/30" : log.severity === "WARN" ? "border-amber-200 bg-amber-50/20" : "border-stone-200 bg-white"}`}>
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${log.severity === "CRITICAL" ? "bg-rose-500" : log.severity === "WARN" ? "bg-amber-400" : "bg-stone-300"}`}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant={SEVERITY_CFG[log.severity]}>{log.severity}</Badge>
                  <span className="font-mono text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded">{log.action}</span>
                  <span className="text-xs text-stone-400">{formatTimeAgo(log.timestamp)}</span>
                </div>
                <p className="text-sm font-body text-stone-900 mb-0.5">
                  <span className="font-semibold">{log.actor}</span>
                  <span className="text-stone-400"> ({log.role}) → </span>
                  <span className="text-stone-700">{log.target}</span>
                </p>
                <p className="text-xs text-stone-400 font-body">IP: {log.ip} · {formatDate(log.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
