"use client"
import { useState } from "react"
import { CreditCard, Download, CheckCircle, Clock, TrendingUp, DollarSign, Percent } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, StatCard, Tabs } from "@/components/ui"
import { formatDate, formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"


const PAYMENTS = [
  { id:"p1", ref:"PAY-2024-BLD-0842", description:"PLOTIX Premium Listing — Sky Residences Phase 2", amount:24999, tax:4500, total:29499, method:"Bank Transfer", status:"SUCCESS", date:new Date(Date.now()-30*86400000) },
  { id:"p2", ref:"PAY-2024-BLD-0871", description:"Featured Placement — Harmony Villas (Nov 2024)", amount:14999, tax:2700, total:17699, method:"UPI", status:"SUCCESS", date:new Date(Date.now()-7*86400000) },
  { id:"p3", ref:"PAY-2024-BLD-0890", description:"RERA Document Verification Service", amount:4999, tax:900, total:5899, method:"UPI", status:"PENDING", date:new Date(Date.now()-2*86400000) },
]

export default function BuilderPaymentsPage() {
  const [tab, setTab] = useState("all")
  const filtered = tab === "all" ? PAYMENTS : PAYMENTS.filter(p => p.status === tab)
  const total = PAYMENTS.filter(p => p.status === "SUCCESS").reduce((a, p) => a + p.total, 0)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><CreditCard className="w-7 h-7 text-violet-500" />Payments & Billing</h1>
          <p className="page-subtitle">Track all platform payments and subscription billing.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Spent" value={formatCurrency(total)} icon={<DollarSign className="w-5 h-5 text-violet-500" />} color="bg-violet-50" />
          <StatCard label="Successful" value={PAYMENTS.filter(p => p.status === "SUCCESS").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50" />
          <StatCard label="Pending" value={PAYMENTS.filter(p => p.status === "PENDING").length} icon={<Clock className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
          <StatCard label="Transactions" value={PAYMENTS.length} icon={<TrendingUp className="w-5 h-5 text-stone-400" />} color="bg-stone-100" />
        </div>

        <Tabs tabs={[{ value:"all", label:"All" }, { value:"SUCCESS", label:"Successful" }, { value:"PENDING", label:"Pending" }]} active={tab} onChange={setTab} />

        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.id} className="card p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.status === "SUCCESS" ? "bg-emerald-50" : "bg-amber-50"}`}>
                {p.status === "SUCCESS" ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Clock className="w-5 h-5 text-amber-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-stone-900 mb-0.5">{p.description}</p>
                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span className="font-mono">{p.ref}</span>
                  <span>·</span>
                  <span>{p.method}</span>
                  <span>·</span>
                  <span>{formatDate(p.date)}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-display text-lg text-stone-900">{formatCurrency(p.total)}</p>
                <p className="text-xs text-stone-400">incl. ₹{p.tax} GST</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={p.status === "SUCCESS" ? "green" : "amber"}>{p.status}</Badge>
                {p.status === "SUCCESS" && (
                  <button onClick={() => toast.success(`Downloading receipt ${p.ref}`)} className="btn-icon text-stone-400 hover:text-stone-700">
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
