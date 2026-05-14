"use client"
import { useState } from "react"
import { CreditCard, Receipt, Download, Clock, CheckCircle, AlertCircle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Badge, StatCard, Tabs } from "@/components/ui"
import { formatDateTime, formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"

const PAYMENTS = [
  { id:"p1", ref:"PAY-2024-00183", description:"Featured Listing Boost — 3BHK in Adajan", amount:4999, tax:900, total:5899, method:"UPI", status:"SUCCESS", date:new Date(Date.now()-7*86400000) },
  { id:"p2", ref:"PAY-2024-00142", description:"Premium Subscription — 3 Months", amount:2999, tax:540, total:3539, method:"CARD", status:"SUCCESS", date:new Date(Date.now()-30*86400000) },
  { id:"p3", ref:"PAY-2024-00201", description:"Property Verification Report", amount:499, tax:90, total:589, method:"UPI", status:"PENDING", date:new Date(Date.now()-2*86400000) },
]

const STATUS_CFG: Record<string, { variant: any; icon: any }> = {
  SUCCESS: { variant:"green",  icon:CheckCircle },
  PENDING: { variant:"amber",  icon:Clock },
  FAILED:  { variant:"rose",   icon:AlertCircle },
}

export default function BuyerPaymentsPage() {
  const [tab, setTab] = useState("all")
  const filtered = tab === "all" ? PAYMENTS : PAYMENTS.filter(p => p.status === tab)
  const totalSpent = PAYMENTS.filter(p => p.status === "SUCCESS").reduce((a, p) => a + p.total, 0)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><CreditCard className="w-7 h-7 text-violet-500" />Payment History</h1>
          <p className="page-subtitle">View all your transactions and download receipts.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Spent" value={formatCurrency(totalSpent)} icon={<CreditCard className="w-5 h-5 text-violet-500" />} color="bg-violet-50" />
          <StatCard label="Successful" value={PAYMENTS.filter(p => p.status === "SUCCESS").length} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} color="bg-emerald-50" />
          <StatCard label="Pending" value={PAYMENTS.filter(p => p.status === "PENDING").length} icon={<Clock className="w-5 h-5 text-amber-500" />} color="bg-amber-50" />
          <StatCard label="Total Transactions" value={PAYMENTS.length} icon={<Receipt className="w-5 h-5 text-stone-400" />} color="bg-stone-100" />
        </div>

        <Tabs
          tabs={[{ value:"all", label:"All" }, { value:"SUCCESS", label:"Successful" }, { value:"PENDING", label:"Pending" }]}
          active={tab} onChange={setTab}
        />

        <div className="space-y-3">
          {filtered.map(p => {
            const cfg = STATUS_CFG[p.status]
            return (
              <div key={p.id} className="card p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.status === "SUCCESS" ? "bg-emerald-50" : p.status === "PENDING" ? "bg-amber-50" : "bg-rose-50"}`}>
                  <cfg.icon className={`w-5 h-5 ${p.status === "SUCCESS" ? "text-emerald-500" : p.status === "PENDING" ? "text-amber-500" : "text-rose-500"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-stone-900 mb-0.5">{p.description}</p>
                  <div className="flex items-center gap-3 text-xs text-stone-400">
                    <span className="font-mono">{p.ref}</span>
                    <span>•</span>
                    <span>{p.method}</span>
                    <span>•</span>
                    <span>{formatDateTime(p.date)}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display text-lg text-stone-900">{formatCurrency(p.total)}</p>
                  <p className="text-xs text-stone-400">incl. ₹{p.tax} GST</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={cfg.variant}>{p.status}</Badge>
                  {p.status === "SUCCESS" && (
                    <button onClick={() => toast.success(`Downloading receipt for ${p.ref}`)} className="btn-icon text-stone-400 hover:text-stone-700">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
