import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Briefcase, Home, TrendingUp, DollarSign, Users, MessageSquare, Plus, ArrowRight, BarChart2, CheckCircle } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { StatCard } from "@/components/ui"
import { BUILDER_STATS, MONTHLY_REVENUE } from "@/lib/data/mock"
import { formatCurrency } from "@/lib/utils"
import BuilderCharts from "@/components/dashboard/BuilderCharts"

export const metadata = { title:"Builder Dashboard | PLOTIX Reality" }

const RECENT_PROJECTS = [
  { name:"Emerald Heights",city:"Surat",units:120,sold:89,status:"LAUNCHED",revenue:890000000 },
  { name:"Royal Residences",city:"Ahmedabad",units:80,sold:80,status:"SOLD_OUT",revenue:640000000 },
  { name:"Sapphire Park",city:"Surat",units:200,sold:143,status:"LAUNCHED",revenue:1430000000 },
]
const STATUS_COLORS: Record<string,string> = { LAUNCHED:"bg-emerald-50 text-emerald-700", SOLD_OUT:"bg-blue-50 text-blue-700", PRE_LAUNCH:"bg-amber-50 text-amber-700", COMPLETED:"bg-stone-100 text-stone-600" }

export default async function BuilderDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "BUILDER") redirect("/unauthorized")
  const user = session.user

  return (
    <DashboardLayout user={{ id: user.id!, firstName: user.firstName!, lastName: user.lastName!, role: user.role!, email: user.email!, profileImage: user.profileImage }}>
      <div className="dashboard-main py-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="page-title">Builder Dashboard</h1><p className="page-subtitle">Welcome back, {user.firstName}. Here's your portfolio overview.</p></div>
          <div className="flex gap-2">
            <Link href="/dashboard/builder/projects/new" className="btn-gold"><Plus className="w-4 h-4"/>New Project</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {label:"Projects",         value:BUILDER_STATS.totalProjects,    icon:<Briefcase className="w-5 h-5 text-violet-500"/>,  color:"bg-violet-50"},
            {label:"Total Units",      value:BUILDER_STATS.totalUnits,       icon:<Home className="w-5 h-5 text-blue-500"/>,         color:"bg-blue-50"},
            {label:"Units Sold",       value:BUILDER_STATS.unitsSold,        icon:<CheckCircle className="w-5 h-5 text-emerald-500"/>},
            {label:"Available",        value:BUILDER_STATS.unitsAvailable,   icon:<Home className="w-5 h-5 text-amber-500"/>,        color:"bg-amber-50"},
            {label:"Total Brokers",    value:BUILDER_STATS.totalBrokers,     icon:<Users className="w-5 h-5 text-rose-500"/>,        color:"bg-rose-50"},
            {label:"Revenue",          value:formatCurrency(BUILDER_STATS.totalRevenue), icon:<DollarSign className="w-5 h-5 text-emerald-600"/>},
          ].map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BuilderCharts data={MONTHLY_REVENUE}/>
          </div>
          <div className="space-y-5">
            <div className="card-flat p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-medium">Active Projects</h2>
                <Link href="/dashboard/builder/projects" className="text-xs text-stone-500 hover:text-stone-800 font-body flex items-center gap-1">View all<ArrowRight className="w-3 h-3"/></Link>
              </div>
              <div className="space-y-3">
                {RECENT_PROJECTS.map(p=>(
                  <div key={p.name} className="p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div><p className="font-body font-semibold text-stone-900 text-sm">{p.name}</p><p className="text-xs text-stone-400 font-body">{p.city}</p></div>
                      <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status]}`}>{p.status.replace("_"," ")}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-body mb-1.5">
                      <span className="text-stone-500">{p.sold}/{p.units} units sold</span>
                      <span className="font-semibold text-stone-700">{Math.round(p.sold/p.units*100)}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5">
                      <div className="h-1.5 bg-gradient-gold rounded-full" style={{width:`${Math.round(p.sold/p.units*100)}%`}}/>
                    </div>
                    <p className="text-xs font-body text-stone-500 mt-2">{formatCurrency(p.revenue)} revenue</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-flat p-5">
              <h2 className="font-display text-lg font-medium mb-4">Quick Stats</h2>
              <div className="space-y-3">
                {[
                  {label:"Inquiries this month",value:892,bar:82},
                  {label:"Active leads",value:234,bar:65},
                  {label:"Broker conversions",value:"18%",bar:18},
                  {label:"Avg. sale cycle",value:"42 days",bar:45},
                ].map(s=>(
                  <div key={s.label}>
                    <div className="flex justify-between text-xs font-body mb-1.5">
                      <span className="text-stone-600">{s.label}</span>
                      <span className="font-semibold text-stone-900">{s.value}</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-gradient-gold" style={{width:`${s.bar}%`}}/>
                    </div>
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
