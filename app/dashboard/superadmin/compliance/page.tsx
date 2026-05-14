"use client"
import Link from "next/link"
import { ArrowLeft, Shield, FileText, Database, AlertCircle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { StatCard, Badge } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"

const QUICK_NAV = [
  { title:"KYC / AML Verification", desc:"Verify agent and builder identity documents and RERA credentials.", icon:Shield, href:"/dashboard/superadmin/compliance/kyc-aml", badge:"3 Pending", badgeVariant:"amber" },
  { title:"Audit Logs", desc:"Complete trail of all administrative and system actions on the platform.", icon:FileText, href:"/dashboard/superadmin/compliance/audit-logs", badge:"View All", badgeVariant:"stone" },
  { title:"Data Requests (DPDP)", desc:"Process user data access, correction, and deletion requests under DPDP Act.", icon:Database, href:"/dashboard/superadmin/compliance/data-requests", badge:"1 Pending", badgeVariant:"amber" },
]

const RECENT_ALERTS = [
  { type:"warn", message:"3 agents pending KYC verification for more than 48 hours", time:new Date(Date.now()-2*3600000) },
  { type:"info", message:"Automated compliance report generated for November 2024", time:new Date(Date.now()-12*3600000) },
  { type:"warn", message:"Data deletion request received from user ID u-7823", time:new Date(Date.now()-24*3600000) },
]

export default function CompliancePage() {
  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Shield className="w-7 h-7 text-blue-500"/>Compliance Centre</h1>
          <p className="page-subtitle">RERA compliance, KYC verification, data privacy, and audit management.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Pending KYC" value={3} icon={<Shield className="w-5 h-5 text-amber-500"/>} color="bg-amber-50"/>
          <StatCard label="Verified This Month" value={12} icon={<Shield className="w-5 h-5 text-emerald-500"/>} color="bg-emerald-50"/>
          <StatCard label="Data Requests" value={1} icon={<Database className="w-5 h-5 text-blue-500"/>} color="bg-blue-50"/>
          <StatCard label="Audit Entries (7d)" value={47} icon={<FileText className="w-5 h-5 text-violet-500"/>} color="bg-violet-50"/>
        </div>

        {/* Alerts */}
        <div className="space-y-3">
          {RECENT_ALERTS.map((a, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-2xl border ${a.type==="warn"?"bg-amber-50/50 border-amber-200":"bg-blue-50/30 border-blue-100"}`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${a.type==="warn"?"text-amber-500":"text-blue-500"}`}/>
              <div className="flex-1">
                <p className="text-sm font-body text-stone-800">{a.message}</p>
                <p className="text-xs text-stone-400 mt-1">{formatTimeAgo(a.time)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {QUICK_NAV.map(n => (
            <Link key={n.title} href={n.href} className="card p-6 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <n.icon className="w-6 h-6 text-blue-600"/>
              </div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-display text-lg font-medium text-stone-900">{n.title}</h3>
                <Badge variant={n.badgeVariant as any}>{n.badge}</Badge>
              </div>
              <p className="text-sm font-body text-stone-500">{n.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
