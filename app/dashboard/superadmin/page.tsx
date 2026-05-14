import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { TrendingUp, Users, Shield, Server, Globe, DollarSign, AlertTriangle, Activity, Flag, CheckCircle, ArrowRight, Zap } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { StatCard } from "@/components/ui"
import { ADMIN_STATS, MONTHLY_REVENUE } from "@/lib/data/mock"
import { formatCurrency } from "@/lib/utils"
import type { Metadata } from "next"
export const metadata: Metadata = { title:"Superadmin Dashboard | PLOTIX Reality" }

const SYSTEM_HEALTH = [
  { label:"API Response",     value:"148ms",  status:"good"    },
  { label:"DB Queries",       value:"12ms",   status:"good"    },
  { label:"Error Rate",       value:"0.02%",  status:"good"    },
  { label:"Uptime",           value:"99.98%", status:"good"    },
  { label:"Active Sessions",  value:"2,847",  status:"neutral" },
  { label:"Queue Depth",      value:"0",      status:"good"    },
]
const STATUS_COLORS: Record<string,string> = { good:"text-emerald-600 bg-emerald-50", warn:"text-amber-600 bg-amber-50", bad:"text-rose-600 bg-rose-50", neutral:"text-stone-600 bg-stone-100" }

const INTEGRATIONS = [
  { name:"Razorpay",   status:"active", icon:"💳" },
  { name:"Resend",     status:"active", icon:"📧" },
  { name:"Google Maps",status:"active", icon:"🗺️" },
  { name:"Cloudinary", status:"active", icon:"☁️" },
  { name:"Sentry",     status:"active", icon:"🔍" },
  { name:"Twilio SMS", status:"inactive",icon:"📱" },
]

export default async function SuperadminDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "SUPERADMIN") redirect("/unauthorized")
  const user = session.user

  return (
    <DashboardLayout user={{ id: user.id!, firstName: user.firstName!, lastName: user.lastName!, role: user.role!, email: user.email!, profileImage: user.profileImage }}>
      <div className="dashboard-main py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="page-title">Superadmin Control Centre</h1>
              <span className="badge badge-navy text-[10px]">SUPERADMIN</span>
            </div>
            <p className="page-subtitle">Welcome back, {user.firstName}. Full platform control and strategic oversight.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/superadmin/system/monitoring" className="btn-secondary text-sm"><Activity className="w-4 h-4"/>System Status</Link>
            <Link href="/dashboard/superadmin/financial" className="btn-gold text-sm"><DollarSign className="w-4 h-4"/>Financial</Link>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label:"Total Revenue",  value:formatCurrency(ADMIN_STATS.platformRevenue*4.2), change:"YTD",           changeType:"up"  as const, icon:<DollarSign className="w-5 h-5 text-emerald-600"/>, color:"bg-emerald-50" },
            { label:"Total Users",    value:ADMIN_STATS.totalUsers.toLocaleString("en-IN"),  change:"+342 this month",changeType:"up"  as const, icon:<Users className="w-5 h-5 text-blue-500"/>,       color:"bg-blue-50"    },
            { label:"Properties",     value:ADMIN_STATS.totalProperties.toLocaleString("en-IN"),change:"Active",    changeType:"up"  as const, icon:<TrendingUp className="w-5 h-5 text-violet-500"/>,  color:"bg-violet-50"  },
            { label:"Platform Uptime",value:"99.98%",                                        change:"Last 90 days",  changeType:"up"  as const, icon:<Server className="w-5 h-5 text-emerald-500"/>                           },
            { label:"Admins",         value:"8",                                             change:"Active accounts",changeType:"neutral" as const,icon:<Shield className="w-5 h-5 text-amber-500"/>,  color:"bg-amber-50"   },
            { label:"Feature Flags",  value:"12",                                            change:"5 active",      changeType:"neutral" as const,icon:<Flag className="w-5 h-5 text-rose-500"/>,      color:"bg-rose-50"    },
          ].map(s=><StatCard key={s.label} {...s}/>)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health */}
          <div className="card-flat p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-medium">System Health</h2>
              <span className="flex items-center gap-1.5 text-xs font-body text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-semibold"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/>All Systems Go</span>
            </div>
            <div className="space-y-2.5">
              {SYSTEM_HEALTH.map(s=>(
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm font-body text-stone-600">{s.label}</span>
                  <span className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[s.status]}`}>{s.value}</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/superadmin/system/monitoring" className="mt-4 text-xs font-body text-stone-500 hover:text-stone-800 flex items-center gap-1">Full monitoring<ArrowRight className="w-3 h-3"/></Link>
          </div>

          {/* Quick Actions */}
          <div className="card-flat p-5">
            <h2 className="font-display text-lg font-medium mb-5">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label:"Manage Admins",      href:"/dashboard/superadmin/admins",        icon:Shield },
                { label:"Financial Dashboard",href:"/dashboard/superadmin/financial",     icon:DollarSign },
                { label:"System Settings",    href:"/dashboard/superadmin/settings",      icon:Server },
                { label:"Feature Flags",      href:"/dashboard/superadmin/features",      icon:Flag },
                { label:"Integrations",       href:"/dashboard/superadmin/integrations",  icon:Globe },
                { label:"Compliance Center",  href:"/dashboard/superadmin/compliance",    icon:CheckCircle },
                { label:"Advanced Analytics", href:"/dashboard/superadmin/analytics",     icon:TrendingUp },
                { label:"KYC / AML Review",   href:"/dashboard/superadmin/compliance/kyc-aml", icon:AlertTriangle },
              ].map(a=>(
                <Link key={a.label} href={a.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors group">
                  <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center group-hover:bg-stone-200 transition-colors flex-shrink-0">
                    <a.icon className="w-4 h-4 text-stone-600"/>
                  </div>
                  <span className="text-sm font-body text-stone-700 group-hover:text-stone-900 transition-colors">{a.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-300 ml-auto group-hover:text-stone-500 transition-colors"/>
                </Link>
              ))}
            </div>
          </div>

          {/* Integrations + Revenue Trend */}
          <div className="space-y-5">
            <div className="card-flat p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-medium">Integrations</h2>
                <Link href="/dashboard/superadmin/integrations" className="text-xs text-stone-500 hover:text-stone-800 font-body">Manage</Link>
              </div>
              <div className="space-y-2">
                {INTEGRATIONS.map(i=>(
                  <div key={i.name} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{i.icon}</span>
                      <span className="text-sm font-body text-stone-700">{i.name}</span>
                    </div>
                    <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${i.status==="active"?"bg-emerald-50 text-emerald-700":"bg-stone-100 text-stone-500"}`}>
                      {i.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-flat p-5">
              <h2 className="font-display text-lg font-medium mb-4">Revenue This Month</h2>
              <div className="text-center py-2">
                <p className="font-display text-4xl font-light text-stone-900">{formatCurrency(ADMIN_STATS.platformRevenue)}</p>
                <p className="text-sm font-body text-emerald-600 mt-1">↑ 18.4% vs last month</p>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { source:"Transaction Fees", value:formatCurrency(ADMIN_STATS.platformRevenue*0.45) },
                  { source:"Premium Listings", value:formatCurrency(ADMIN_STATS.platformRevenue*0.28) },
                  { source:"Lead Generation",  value:formatCurrency(ADMIN_STATS.platformRevenue*0.18) },
                  { source:"Subscriptions",    value:formatCurrency(ADMIN_STATS.platformRevenue*0.09) },
                ].map(r=>(
                  <div key={r.source} className="flex justify-between text-xs font-body">
                    <span className="text-stone-500">{r.source}</span>
                    <span className="font-semibold text-stone-800">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Admin Activity */}
        <div className="card-flat p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-medium">Recent Admin Activity</h2>
            <Link href="/dashboard/superadmin/compliance/audit-logs" className="text-xs text-stone-500 hover:text-stone-800 font-body flex items-center gap-1">Full audit log<ArrowRight className="w-3 h-3"/></Link>
          </div>
          <div className="space-y-2">
            {[
              { admin:"Admin Neha",  action:"Approved 8 pending properties",     time:"5m ago",   type:"approve" },
              { admin:"Admin Raj",   action:"Suspended user: spam_agent@test.com",time:"22m ago",  type:"suspend" },
              { admin:"Admin Neha",  action:"Published blog post: Market Report Q4",time:"1h ago", type:"publish" },
              { admin:"Admin Raj",   action:"Updated commission rates: Agent → 4%",time:"3h ago",  type:"settings" },
              { admin:"Admin Priya", action:"Processed payout: ₹2.4L to 12 agents",time:"5h ago", type:"payment" },
            ].map((a,i)=>(
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-body font-bold ${{ approve:"bg-emerald-100 text-emerald-700", suspend:"bg-rose-100 text-rose-700", publish:"bg-blue-100 text-blue-700", settings:"bg-amber-100 text-amber-700", payment:"bg-violet-100 text-violet-700" }[a.type]}`}>
                  {a.admin.split(" ")[1][0]}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-body font-semibold text-stone-700">{a.admin} </span>
                  <span className="text-xs font-body text-stone-500">{a.action}</span>
                </div>
                <span className="text-[10px] font-body text-stone-400 flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
