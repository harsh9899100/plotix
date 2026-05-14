"use client"
import { useState } from "react"
import { BarChart2, TrendingUp, Eye, MessageSquare, DollarSign, Download, Calendar } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { StatCard, Tabs } from "@/components/ui"
import { AGENT_STATS, MONTHLY_REVENUE, LEAD_PIPELINE } from "@/lib/data/mock"
import { formatCurrency, cn } from "@/lib/utils"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

const PROP_PERFORMANCE = [
  { property:"4BHK Penthouse Vesu",     views:1842, inquiries:47, viewings:8, status:"ACTIVE" },
  { property:"3BHK Apartment Adajan",   views:1203, inquiries:28, viewings:5, status:"ACTIVE" },
  { property:"Villa SG Highway",        views:3211, inquiries:89, viewings:15,status:"ACTIVE" },
  { property:"2BHK Piplod",            views:389,  inquiries:12, viewings:3, status:"ACTIVE" },
  { property:"Office Space Athwa",      views:634,  inquiries:15, viewings:2, status:"SOLD" },
]

const CONVERSION_DATA = [
  { stage:"Views",       count:8279, pct:100 },
  { stage:"Inquiries",   count:191,  pct:2.3 },
  { stage:"Viewings",    count:33,   pct:0.4 },
  { stage:"Negotiations",count:8,    pct:0.1 },
  { stage:"Closed",      count:3,    pct:0.04 },
]

export default function AgentAnalyticsPage() {
  const [period, setPeriod] = useState("12m")
  const [chartTab, setChartTab] = useState("revenue")

  const periodData = period==="12m" ? MONTHLY_REVENUE : MONTHLY_REVENUE.slice(-6)

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="page-title flex items-center gap-2"><BarChart2 className="w-7 h-7 text-blue-500"/>My Analytics</h1><p className="page-subtitle">Track your performance, conversions, and revenue.</p></div>
          <div className="flex gap-2">
            <select value={period} onChange={e=>setPeriod(e.target.value)} className="select text-sm py-2 w-36">
              <option value="12m">Last 12 months</option>
              <option value="6m">Last 6 months</option>
            </select>
            <button className="btn-secondary text-sm"><Download className="w-4 h-4"/>Export</button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label:"Active Listings",  value:AGENT_STATS.activeListings,                       icon:<Eye className="w-5 h-5 text-blue-500"/>,    color:"bg-blue-50" },
            { label:"Total Views",      value:PROP_PERFORMANCE.reduce((s,p)=>s+p.views,0).toLocaleString("en-IN"), icon:<Eye className="w-5 h-5 text-violet-500"/>,   color:"bg-violet-50" },
            { label:"Total Inquiries",  value:AGENT_STATS.totalInquiries,                       icon:<MessageSquare className="w-5 h-5 text-emerald-500"/>              },
            { label:"Viewings Done",    value:"33",                                              icon:<Calendar className="w-5 h-5 text-amber-500"/>,  color:"bg-amber-50" },
            { label:"Deals Closed",     value:AGENT_STATS.soldListings||6,                        icon:<TrendingUp className="w-5 h-5 text-rose-500"/>, color:"bg-rose-50" },
            { label:"Commission",       value:formatCurrency(AGENT_STATS.commissionEarned),     icon:<DollarSign className="w-5 h-5 text-emerald-600"/>               },
          ].map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        {/* Revenue Chart */}
        <div className="card-flat p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-medium">Performance Trends</h2>
            <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
              {[["revenue","Revenue"],["inquiries","Inquiries"]].map(([v,l])=>(
                <button key={v} onClick={()=>setChartTab(v)} className={cn("px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all",chartTab===v?"bg-white text-stone-900 shadow-sm":"text-stone-500 hover:text-stone-700")}>{l}</button>
              ))}
            </div>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              {chartTab==="revenue" ? (
                <AreaChart data={periodData} margin={{top:4,right:4,bottom:0,left:0}}>
                  <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A07A" stopOpacity={0.25}/><stop offset="95%" stopColor="#C9A07A" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" vertical={false}/>
                  <XAxis dataKey="month" tick={{fontSize:11,fontFamily:"var(--font-dm-sans)",fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fontFamily:"var(--font-dm-sans)",fill:"#9ca3af"}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/100000).toFixed(0)}L`}/>
                  <Tooltip contentStyle={{fontFamily:"var(--font-dm-sans)",fontSize:12,borderRadius:12,border:"1px solid #e7e5e4"}} formatter={(v:any)=>[`₹${(v/100000).toFixed(1)}L`,"Revenue"]}/>
                  <Area dataKey="revenue" stroke="#C9A07A" strokeWidth={2.5} fill="url(#ag)"/>
                </AreaChart>
              ) : (
                <BarChart data={periodData} margin={{top:4,right:4,bottom:0,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ece6" vertical={false}/>
                  <XAxis dataKey="month" tick={{fontSize:11,fontFamily:"var(--font-dm-sans)",fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fontFamily:"var(--font-dm-sans)",fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{fontFamily:"var(--font-dm-sans)",fontSize:12,borderRadius:12,border:"1px solid #e7e5e4"}}/>
                  <Bar dataKey="inquiries" fill="#6366f1" radius={[6,6,0,0]} name="Inquiries"/>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <div className="card-flat p-5">
            <h2 className="font-display text-lg font-medium mb-5">Conversion Funnel</h2>
            <div className="space-y-3">
              {CONVERSION_DATA.map((c,i)=>(
                <div key={c.stage}>
                  <div className="flex items-center justify-between text-sm font-body mb-1.5">
                    <span className="text-stone-700">{c.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-stone-900">{c.count.toLocaleString("en-IN")}</span>
                      <span className="text-stone-400 text-xs w-10 text-right">{c.pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-7 overflow-hidden">
                    <div className="h-full rounded-full flex items-center px-3 transition-all duration-500"
                      style={{width:`${Math.max(c.pct/1*10,4)}%`,background:["#6366f1","#C9A07A","#10b981","#f59e0b","#22c55e"][i]}}>
                      {c.pct > 1 && <span className="text-white text-xs font-body font-semibold">{c.count}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property Performance */}
          <div className="card-flat p-5">
            <h2 className="font-display text-lg font-medium mb-5">Property Performance</h2>
            <div className="space-y-3">
              {PROP_PERFORMANCE.map(p=>(
                <div key={p.property} className="p-3 bg-stone-50 rounded-xl">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-body font-medium text-stone-800 text-xs truncate flex-1">{p.property}</p>
                    <span className={cn("text-[10px] font-body font-semibold px-1.5 py-0.5 rounded-full",p.status==="SOLD"?"bg-blue-50 text-blue-700":"bg-emerald-50 text-emerald-700")}>{p.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[["Views",p.views.toLocaleString()],["Inquiries",p.inquiries],["Viewings",p.viewings]].map(([l,v])=>(
                      <div key={String(l)} className="bg-white rounded-lg p-2">
                        <p className="font-body font-semibold text-stone-900 text-sm">{v}</p>
                        <p className="text-[10px] text-stone-400 font-body">{l}</p>
                      </div>
                    ))}
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
