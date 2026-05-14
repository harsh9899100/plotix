"use client"
import { useState } from "react"
import { DollarSign, TrendingUp, TrendingDown, Download, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Select } from "@/components/ui"
import { formatCurrency } from "@/lib/utils"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts"

const MONTHLY_REVENUE = [
  { month:"Jun", revenue:1850000, commissions:370000, subscriptions:280000 },
  { month:"Jul", revenue:2100000, commissions:420000, subscriptions:310000 },
  { month:"Aug", revenue:1950000, commissions:390000, subscriptions:295000 },
  { month:"Sep", revenue:2400000, commissions:480000, subscriptions:340000 },
  { month:"Oct", revenue:2800000, commissions:560000, subscriptions:390000 },
  { month:"Nov", revenue:3200000, commissions:640000, subscriptions:440000 },
]

const REVENUE_BREAKDOWN = [
  { name:"Commissions", value:640000, color:"#C9A07A" },
  { name:"Subscriptions", value:440000, color:"#1a2b4a" },
  { name:"Featured Listings", value:280000, color:"#4ade80" },
  { name:"Premium Tools", value:180000, color:"#818cf8" },
]

const TOP_AGENTS = [
  { name:"Priya Sharma", city:"Surat", commission:85000, deals:3 },
  { name:"Rohan Mehta", city:"Ahmedabad", commission:65000, deals:2 },
  { name:"Kavita Joshi", city:"Vadodara", commission:52000, deals:2 },
]

export default function SuperAdminFinancialPage() {
  const [period, setPeriod] = useState("6months")

  const totalRevenue = MONTHLY_REVENUE.reduce((a, m) => a + m.revenue, 0)
  const lastMonth = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1]
  const prevMonth = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 2]
  const growth = ((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(1)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><DollarSign className="w-7 h-7 text-amber-500"/>Financial Overview</h1>
            <p className="page-subtitle">Platform-wide revenue, commissions, and financial health.</p>
          </div>
          <div className="flex gap-2">
            <Select value={period} onChange={e => setPeriod(e.target.value)} options={[{value:"3months",label:"Last 3 months"},{value:"6months",label:"Last 6 months"},{value:"1year",label:"Last 1 year"}]}/>
            <button className="btn-secondary text-sm"><Download className="w-4 h-4"/>Export</button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Total Revenue (6M)", value:formatCurrency(totalRevenue), change:`+${growth}% MoM`, up:true, color:"bg-amber-50", icon:DollarSign },
            { label:"This Month", value:formatCurrency(lastMonth.revenue), change:"+14.3% vs prev", up:true, color:"bg-emerald-50", icon:TrendingUp },
            { label:"Commissions Paid", value:formatCurrency(lastMonth.commissions), change:"+8.5% MoM", up:true, color:"bg-blue-50", icon:DollarSign },
            { label:"Avg Transaction", value:"₹52.4L", change:"+3.2% MoM", up:true, color:"bg-violet-50", icon:ArrowUpRight },
          ].map(s => (
            <div key={s.label} className={`card-flat p-5 ${s.color}`}>
              <p className="text-xs text-stone-400 uppercase font-body mb-2">{s.label}</p>
              <p className="font-display text-2xl font-light text-stone-900">{s.value}</p>
              <p className={`text-xs font-body mt-2 flex items-center gap-1 ${s.up ? "text-emerald-600" : "text-rose-500"}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}{s.change}
              </p>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium text-stone-900 mb-5">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={MONTHLY_REVENUE}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A07A" stopOpacity={0.3}/><stop offset="95%" stopColor="#C9A07A" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8"/>
              <XAxis dataKey="month" tick={{fontSize:12, fill:"#78716c"}}/>
              <YAxis tick={{fontSize:11, fill:"#78716c"}} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`}/>
              <Tooltip formatter={(v:any) => formatCurrency(v)} contentStyle={{borderRadius:"12px",border:"1px solid #e7e3dc"}}/>
              <Area type="monotone" dataKey="revenue" stroke="#C9A07A" strokeWidth={2.5} fill="url(#rev)" name="Total Revenue"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Breakdown */}
          <div className="card-flat p-5">
            <h2 className="font-display text-lg font-medium text-stone-900 mb-5">Revenue Breakdown</h2>
            <div className="flex items-center gap-5">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={REVENUE_BREAKDOWN} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                    {REVENUE_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.color}/>)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {REVENUE_BREAKDOWN.map(r => (
                  <div key={r.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor:r.color}}/>
                      <span className="text-sm font-body text-stone-700">{r.name}</span>
                    </div>
                    <span className="text-sm font-body font-semibold text-stone-900">{formatCurrency(r.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top earners */}
          <div className="card-flat p-5">
            <h2 className="font-display text-lg font-medium text-stone-900 mb-4">Top Commission Earners</h2>
            <div className="space-y-3">
              {TOP_AGENTS.map((a, i) => (
                <div key={a.name} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl">
                  <span className="font-display text-lg text-stone-400 w-6 text-center">#{i+1}</span>
                  <div className="flex-1">
                    <p className="font-body font-semibold text-stone-900 text-sm">{a.name}</p>
                    <p className="text-xs text-stone-400">{a.city} · {a.deals} deals</p>
                  </div>
                  <span className="font-display text-lg text-amber-700">{formatCurrency(a.commission)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
