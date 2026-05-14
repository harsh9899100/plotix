import Link from "next/link"
import { BarChart2, TrendingUp, Users, Home, DollarSign, MessageSquare, Download, ArrowRight } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { StatCard } from "@/components/ui"
import { ADMIN_STATS, MONTHLY_REVENUE, USER_GROWTH, PROPERTY_TYPE_DIST, LEAD_PIPELINE } from "@/lib/data/mock"
import { formatCurrency } from "@/lib/utils"
import AdminOverviewCharts from "@/components/dashboard/AdminCharts"
import type { Metadata } from "next"
export const metadata: Metadata = { title:"Analytics | Admin | PLOTIX Reality" }
const MOCK_ADMIN = { id:"admin1", firstName:"Admin", lastName:"User", role:"ADMIN", email:"admin@plotix.in" }

const TOP_CITIES = [
  { city:"Surat",      properties:3420, inquiries:8200, revenue:920000000 },
  { city:"Ahmedabad",  properties:2180, inquiries:5600, revenue:780000000 },
  { city:"Mumbai",     properties:1840, inquiries:4900, revenue:1240000000 },
  { city:"Bangalore",  properties:980,  inquiries:2400, revenue:450000000 },
  { city:"Pune",       properties:740,  inquiries:1800, revenue:320000000 },
]

export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout user={MOCK_ADMIN as any}>
      <div className="dashboard-main py-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="page-title flex items-center gap-2"><BarChart2 className="w-7 h-7 text-blue-500"/>Platform Analytics</h1><p className="page-subtitle">Comprehensive insights across all platform metrics.</p></div>
          <div className="flex gap-2">
            <select className="select text-sm py-2 w-36"><option>Last 12 months</option><option>Last 6 months</option><option>Last 30 days</option><option>This year</option></select>
            <button className="btn-secondary text-sm"><Download className="w-4 h-4"/>Export</button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:"Total Users",       value:ADMIN_STATS.totalUsers.toLocaleString("en-IN"),       change:"+342 this month",   changeType:"up"      as const, icon:<Users className="w-5 h-5 text-blue-500"/>,    color:"bg-blue-50" },
            { label:"Active Listings",   value:ADMIN_STATS.activeProperties.toLocaleString("en-IN"), change:"+218 new",          changeType:"up"      as const, icon:<Home className="w-5 h-5 text-violet-500"/>,   color:"bg-violet-50" },
            { label:"Total Inquiries",   value:ADMIN_STATS.totalInquiries.toLocaleString("en-IN"),   change:"+2,140 this month", changeType:"up"      as const, icon:<MessageSquare className="w-5 h-5 text-emerald-500"/>, color:"bg-emerald-50" },
            { label:"Platform Revenue",  value:formatCurrency(ADMIN_STATS.platformRevenue),           change:"+18.4% vs last mo", changeType:"up"      as const, icon:<DollarSign className="w-5 h-5 text-amber-500"/>, color:"bg-amber-50" },
          ].map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        {/* Main Charts */}
        <AdminOverviewCharts revenueData={MONTHLY_REVENUE} userGrowth={USER_GROWTH} typeDist={PROPERTY_TYPE_DIST}/>

        {/* User Breakdown + Top Cities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-flat p-5">
            <h2 className="font-display text-lg font-medium mb-5">User Role Distribution</h2>
            <div className="space-y-4">
              {[
                { role:"Buyers",   count:ADMIN_STATS.totalBuyers,   pct:Math.round(ADMIN_STATS.totalBuyers/ADMIN_STATS.totalUsers*100),   color:"bg-blue-400" },
                { role:"Agents",   count:ADMIN_STATS.totalAgents,   pct:Math.round(ADMIN_STATS.totalAgents/ADMIN_STATS.totalUsers*100),   color:"bg-violet-400" },
                { role:"Builders", count:ADMIN_STATS.totalBuilders, pct:Math.round(ADMIN_STATS.totalBuilders/ADMIN_STATS.totalUsers*100), color:"bg-amber-400" },
                { role:"Owners",   count:120,                        pct:4,   color:"bg-emerald-400" },
              ].map(r=>(
                <div key={r.role}>
                  <div className="flex items-center justify-between text-sm font-body mb-1.5">
                    <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${r.color}`}/><span className="text-stone-700">{r.role}</span></div>
                    <div className="flex items-center gap-3"><span className="font-semibold text-stone-900">{r.count.toLocaleString("en-IN")}</span><span className="text-stone-400 w-8 text-right">{r.pct}%</span></div>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2"><div className={`h-2 rounded-full ${r.color} transition-all`} style={{width:`${r.pct*2}%`}}/></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-flat p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-medium">Top Cities by Revenue</h2>
              <Link href="/dashboard/admin/analytics/reports" className="text-xs text-stone-500 hover:text-stone-800 font-body flex items-center gap-1">Full report<ArrowRight className="w-3 h-3"/></Link>
            </div>
            <div className="space-y-3">
              {TOP_CITIES.map((c,i)=>(
                <div key={c.city} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
                  <span className="w-6 text-xs font-body font-bold text-stone-400 text-center">#{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-stone-900 text-sm">{c.city}</p>
                    <p className="text-xs text-stone-400 font-body">{c.properties.toLocaleString()} listings · {c.inquiries.toLocaleString()} inquiries</p>
                  </div>
                  <span className="font-body font-semibold text-stone-800 text-sm flex-shrink-0">{formatCurrency(c.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Pipeline */}
        <div className="card-flat p-5">
          <h2 className="font-display text-lg font-medium mb-5">Platform Lead Pipeline</h2>
          <div className="space-y-3">
            {LEAD_PIPELINE.map(stage=>{
              const max = LEAD_PIPELINE[0].count
              const pct = Math.round((stage.count/max)*100)
              return (
                <div key={stage.stage} className="flex items-center gap-4">
                  <div className="w-40 text-xs font-body text-stone-600 text-right flex-shrink-0">{stage.stage}</div>
                  <div className="flex-1 bg-stone-100 rounded-full h-8 relative overflow-hidden">
                    <div className="h-full rounded-full flex items-center px-3 transition-all duration-500" style={{width:`${Math.max(pct,8)}%`,background:stage.color}}>
                      <span className="text-white text-xs font-body font-semibold">{stage.count.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="text-xs font-body text-stone-500 w-10 flex-shrink-0">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
