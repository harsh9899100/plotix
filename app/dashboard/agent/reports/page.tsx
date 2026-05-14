"use client"
import { useState } from "react"
import { TrendingUp, Download, Calendar, FileText, BarChart2, DollarSign } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Select } from "@/components/ui"
import { formatCurrency } from "@/lib/utils"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import toast from "react-hot-toast"

const MONTHLY = [
  { month:"Jun", inquiries:18, deals:1, commission:85000 },
  { month:"Jul", inquiries:24, deals:2, commission:142000 },
  { month:"Aug", inquiries:21, deals:1, commission:95000 },
  { month:"Sep", inquiries:32, deals:2, commission:180000 },
  { month:"Oct", inquiries:28, deals:2, commission:160000 },
  { month:"Nov", inquiries:41, deals:3, commission:248000 },
]

const REPORT_TYPES = [
  { title:"Performance Summary", desc:"Inquiries, deals closed, and conversion rate for the selected period.", icon:BarChart2, color:"bg-blue-50 text-blue-600" },
  { title:"Commission Statement", desc:"All commissions earned with TDS and net payout details.", icon:DollarSign, color:"bg-amber-50 text-amber-600" },
  { title:"Listings Report", desc:"Properties listed, views, and engagement analytics.", icon:FileText, color:"bg-emerald-50 text-emerald-600" },
  { title:"Lead Pipeline Report", desc:"Lead temperature, conversion funnel, and activity log.", icon:TrendingUp, color:"bg-violet-50 text-violet-600" },
]

export default function AgentReportsPage() {
  const [period, setPeriod] = useState("6months")
  const totalCommission = MONTHLY.reduce((a, m) => a + m.commission, 0)
  const totalDeals = MONTHLY.reduce((a, m) => a + m.deals, 0)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><TrendingUp className="w-7 h-7 text-stone-500" />Reports</h1>
            <p className="page-subtitle">Business performance reports and commission statements.</p>
          </div>
          <Select value={period} onChange={e => setPeriod(e.target.value)}
            options={[{ value:"3months", label:"3 Months" }, { value:"6months", label:"6 Months" }, { value:"1year", label:"1 Year" }]} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Total Commission", value:formatCurrency(totalCommission), color:"bg-amber-50" },
            { label:"Deals Closed",     value:totalDeals,                      color:"bg-emerald-50" },
            { label:"Avg/Deal",         value:formatCurrency(totalCommission / totalDeals), color:"bg-blue-50" },
            { label:"Total Inquiries",  value:MONTHLY.reduce((a,m) => a+m.inquiries, 0), color:"bg-violet-50" },
          ].map(s => (
            <div key={s.label} className={`card-flat p-4 ${s.color}`}>
              <p className="text-xs text-stone-400 uppercase font-body">{s.label}</p>
              <p className="font-display text-2xl font-light text-stone-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-5">Commission Earned ({period})</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY}>
              <defs><linearGradient id="commGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A07A" stopOpacity={0.3}/><stop offset="95%" stopColor="#C9A07A" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="month" tick={{ fontSize:12, fill:"#78716c" }} />
              <YAxis tick={{ fontSize:11, fill:"#78716c" }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v:any) => formatCurrency(v)} contentStyle={{ borderRadius:"12px", border:"1px solid #e7e3dc" }} />
              <Area type="monotone" dataKey="commission" stroke="#C9A07A" strokeWidth={2} fill="url(#commGrad)" name="Commission" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="font-display text-lg font-medium mb-4">Download Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REPORT_TYPES.map(r => (
              <div key={r.title} className="card p-5 flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${r.color}`}><r.icon className="w-5 h-5" /></div>
                <div className="flex-1">
                  <h3 className="font-body font-semibold text-stone-900 mb-0.5">{r.title}</h3>
                  <p className="text-xs text-stone-400 font-body mb-3">{r.desc}</p>
                  <button onClick={() => toast.success(`Generating "${r.title}"...`)} className="btn-secondary text-xs flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
