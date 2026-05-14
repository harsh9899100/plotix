"use client"
import { useState } from "react"
import { TrendingUp, Download, BarChart2, DollarSign, FileText, Users } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Select } from "@/components/ui"
import { formatCurrency } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import toast from "react-hot-toast"


const MONTHLY = [
  { month:"Jun", unitsSold:4, revenue:28000000, inquiries:28 },
  { month:"Jul", unitsSold:6, revenue:42000000, inquiries:35 },
  { month:"Aug", unitsSold:5, revenue:34000000, inquiries:30 },
  { month:"Sep", unitsSold:8, revenue:56000000, inquiries:48 },
  { month:"Oct", unitsSold:7, revenue:49000000, inquiries:55 },
  { month:"Nov", unitsSold:9, revenue:63000000, inquiries:62 },
]

const REPORT_TYPES = [
  { title:"Project Sales Report", desc:"Units sold, revenue, and payment schedules per project.", icon:BarChart2, color:"bg-blue-50 text-blue-600" },
  { title:"Commission Statement", desc:"All broker/agent commission payouts with TDS details.", icon:DollarSign, color:"bg-amber-50 text-amber-600" },
  { title:"Buyer Analytics Report", desc:"Buyer demographics, source tracking, and lead pipeline.", icon:Users, color:"bg-violet-50 text-violet-600" },
  { title:"RERA Progress Report", desc:"Project completion, milestones, and RERA submission data.", icon:FileText, color:"bg-emerald-50 text-emerald-600" },
]

export default function BuilderReportsPage() {
  const [period, setPeriod] = useState("6months")
  const totalRevenue = MONTHLY.reduce((a, m) => a + m.revenue, 0)
  const totalUnits = MONTHLY.reduce((a, m) => a + m.unitsSold, 0)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><TrendingUp className="w-7 h-7 text-stone-500" />Reports</h1>
            <p className="page-subtitle">Business performance reports and downloadable statements.</p>
          </div>
          <Select value={period} onChange={e => setPeriod(e.target.value)}
            options={[{ value:"3months", label:"3 Months" }, { value:"6months", label:"6 Months" }, { value:"1year", label:"1 Year" }]} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Total Revenue", value:formatCurrency(totalRevenue), color:"bg-amber-50" },
            { label:"Units Sold", value:totalUnits, color:"bg-emerald-50" },
            { label:"Avg Unit Value", value:formatCurrency(totalRevenue / totalUnits), color:"bg-blue-50" },
            { label:"Total Inquiries", value:MONTHLY.reduce((a,m) => a+m.inquiries, 0), color:"bg-violet-50" },
          ].map(s => (
            <div key={s.label} className={`card-flat p-4 ${s.color}`}>
              <p className="text-xs text-stone-400 uppercase font-body">{s.label}</p>
              <p className="font-display text-2xl font-light text-stone-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-5">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MONTHLY}>
              <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A07A" stopOpacity={0.3}/><stop offset="95%" stopColor="#C9A07A" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="month" tick={{ fontSize:12, fill:"#78716c" }} />
              <YAxis tick={{ fontSize:11, fill:"#78716c" }} tickFormatter={v => `₹${(v/10000000).toFixed(1)}Cr`} />
              <Tooltip formatter={(v:any) => formatCurrency(v)} contentStyle={{ borderRadius:"12px", border:"1px solid #e7e3dc" }} />
              <Area type="monotone" dataKey="revenue" stroke="#C9A07A" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="font-display text-lg font-medium mb-4">Download Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REPORT_TYPES.map(r => (
              <div key={r.title} className="card p-5 flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${r.color}`}>
                  <r.icon className="w-5 h-5" />
                </div>
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
