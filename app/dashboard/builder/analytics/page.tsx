"use client"
import { BarChart2 } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Select } from "@/components/ui"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const MONTHLY = [
  { month:"Jun", inquiries:28, units:8 }, { month:"Jul", inquiries:35, units:11 },
  { month:"Aug", inquiries:30, units:9 }, { month:"Sep", inquiries:48, units:14 },
  { month:"Oct", inquiries:55, units:17 }, { month:"Nov", inquiries:62, units:19 },
]
const PROJECTS = [
  { name:"Sky Residences", inquiries:38, units:52, revenue:250000000 },
  { name:"Harmony Villas", inquiries:24, units:21, revenue:178000000 },
]
const SOURCE_DATA = [
  { name:"Direct", value:38, color:"#C9A07A" },
  { name:"Agent Referral", value:28, color:"#1a2b4a" },
  { name:"Google Ads", value:21, color:"#4ade80" },
  { name:"Social Media", value:13, color:"#818cf8" },
]

export default function BuilderAnalyticsPage() {
  const [period, setPeriod] = useState("6months")
  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="page-title flex items-center gap-2"><BarChart2 className="w-7 h-7 text-amber-500"/>Analytics</h1><p className="page-subtitle">Performance metrics across all your projects.</p></div>
          <Select value={period} onChange={e=>setPeriod(e.target.value)} options={[{value:"3months",label:"3 Months"},{value:"6months",label:"6 Months"},{value:"1year",label:"1 Year"}]}/>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Total Inquiries", value:258, color:"bg-violet-50" },
            { label:"Viewings Done", value:125, color:"bg-blue-50" },
            { label:"Units Sold", value:78, color:"bg-emerald-50" },
            { label:"Total Revenue", value:formatCurrency(428000000), color:"bg-amber-50" },
          ].map(s=>(
            <div key={s.label} className={`card-flat p-4 ${s.color}`}>
              <p className="text-xs text-stone-400 uppercase font-body">{s.label}</p>
              <p className="font-display text-2xl font-light text-stone-900">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-5">Inquiries & Units Sold</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={MONTHLY}>
              <defs>
                <linearGradient id="bldInq2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                <linearGradient id="bldUnit2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A07A" stopOpacity={0.3}/><stop offset="95%" stopColor="#C9A07A" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8"/>
              <XAxis dataKey="month" tick={{fontSize:12,fill:"#78716c"}}/>
              <YAxis tick={{fontSize:11,fill:"#78716c"}}/>
              <Tooltip contentStyle={{borderRadius:"12px",border:"1px solid #e7e3dc"}}/>
              <Area type="monotone" dataKey="inquiries" stroke="#8b5cf6" strokeWidth={2} fill="url(#bldInq2)" name="Inquiries"/>
              <Area type="monotone" dataKey="units" stroke="#C9A07A" strokeWidth={2} fill="url(#bldUnit2)" name="Units Sold"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card-flat p-5">
            <h2 className="font-display text-lg font-medium mb-4">By Project</h2>
            <div className="space-y-4">
              {PROJECTS.map(p=>(
                <div key={p.name} className="p-4 bg-stone-50 rounded-xl">
                  <p className="font-body font-semibold text-stone-900 mb-2">{p.name}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div><p className="font-display text-xl">{p.inquiries}</p><p className="text-xs text-stone-400">Inquiries</p></div>
                    <div><p className="font-display text-xl">{p.units}</p><p className="text-xs text-stone-400">Sold</p></div>
                    <div><p className="font-display text-sm text-amber-700">{formatCurrency(p.revenue)}</p><p className="text-xs text-stone-400">Revenue</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-flat p-5">
            <h2 className="font-display text-lg font-medium mb-4">Lead Sources</h2>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart><Pie data={SOURCE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">{SOURCE_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie></PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {SOURCE_DATA.map(s=>(
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{backgroundColor:s.color}}/><span className="text-sm font-body text-stone-700">{s.name}</span></div>
                    <span className="font-body font-semibold">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
