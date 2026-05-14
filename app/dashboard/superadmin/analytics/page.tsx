"use client"
import { useState } from "react"
import { BarChart2, TrendingUp, DollarSign, Users, Home, Globe, Download } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Select } from "@/components/ui"
import { formatCurrency } from "@/lib/utils"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

const MONTHLY = [
  { month:"Jun", revenue:820000, users:320, properties:140, deals:18 },
  { month:"Jul", revenue:1100000, users:380, properties:165, deals:24 },
  { month:"Aug", revenue:940000, users:410, properties:180, deals:21 },
  { month:"Sep", revenue:1350000, users:460, properties:198, deals:31 },
  { month:"Oct", revenue:1180000, users:510, properties:215, deals:28 },
  { month:"Nov", revenue:1680000, users:580, properties:242, deals:38 },
]

const GEO_DATA = [
  { city:"Surat", users:280, properties:98, color:"#C9A07A" },
  { city:"Ahmedabad", users:180, properties:74, color:"#1a2b4a" },
  { city:"Vadodara", users:75, properties:42, color:"#4ade80" },
  { city:"Rajkot", users:45, properties:28, color:"#818cf8" },
]

export default function SuperAdminAnalyticsPage() {
  const [period, setPeriod] = useState("6months")
  const totalRevenue = MONTHLY.reduce((a,m) => a + m.revenue, 0)
  const totalDeals = MONTHLY.reduce((a,m) => a + m.deals, 0)
  const totalUsers = MONTHLY[MONTHLY.length - 1].users
  const totalProperties = MONTHLY[MONTHLY.length - 1].properties

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2"><BarChart2 className="w-7 h-7 text-amber-500" />Platform Analytics</h1>
            <p className="page-subtitle">Top-level KPIs and platform health across all dimensions.</p>
          </div>
          <div className="flex gap-2">
            <Select value={period} onChange={e => setPeriod(e.target.value)}
              options={[{ value:"3months", label:"3 Months" }, { value:"6months", label:"6 Months" }, { value:"1year", label:"1 Year" }]} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Total Revenue", value:formatCurrency(totalRevenue), icon:DollarSign, color:"bg-amber-50" },
            { label:"Platform Users", value:totalUsers, icon:Users, color:"bg-blue-50" },
            { label:"Active Listings", value:totalProperties, icon:Home, color:"bg-emerald-50" },
            { label:"Total Deals", value:totalDeals, icon:TrendingUp, color:"bg-violet-50" },
          ].map(s => (
            <div key={s.label} className={`card-flat p-4 ${s.color}`}>
              <p className="text-xs text-stone-400 uppercase font-body">{s.label}</p>
              <p className="font-display text-2xl font-light text-stone-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-5">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={MONTHLY}>
              <defs><linearGradient id="saRevGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A07A" stopOpacity={0.3}/><stop offset="95%" stopColor="#C9A07A" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="month" tick={{ fontSize:12, fill:"#78716c" }} />
              <YAxis tick={{ fontSize:11, fill:"#78716c" }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip formatter={(v:any) => formatCurrency(v)} contentStyle={{ borderRadius:"12px", border:"1px solid #e7e3dc" }} />
              <Area type="monotone" dataKey="revenue" stroke="#C9A07A" strokeWidth={2} fill="url(#saRevGrad)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card-flat p-5">
            <h2 className="font-display text-lg font-medium mb-5">Deals Closed (Monthly)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
                <XAxis dataKey="month" tick={{ fontSize:12, fill:"#78716c" }} />
                <YAxis tick={{ fontSize:11, fill:"#78716c" }} />
                <Tooltip contentStyle={{ borderRadius:"12px", border:"1px solid #e7e3dc" }} />
                <Bar dataKey="deals" fill="#1a2b4a" radius={[6,6,0,0]} name="Deals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card-flat p-5">
            <h2 className="font-display text-lg font-medium mb-5">Top Cities by Users</h2>
            <div className="space-y-4">
              {GEO_DATA.map(g => (
                <div key={g.city}>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-body font-medium text-stone-700">{g.city}</p>
                    <p className="text-sm text-stone-500">{g.users} users</p>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width:`${(g.users/280*100).toFixed(0)}%`, backgroundColor:g.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
