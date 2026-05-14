import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Home, MessageSquare, Calendar, BarChart2, TrendingUp, Eye, ArrowRight, Plus, Bell } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { StatCard, Badge } from "@/components/ui"
import { formatTimeAgo } from "@/lib/utils"

const STATS = [
  { label:"My Properties", value:3, icon:<Home className="w-5 h-5 text-blue-500"/>, color:"bg-blue-50", href:"/dashboard/owner/properties" },
  { label:"New Inquiries", value:7, icon:<MessageSquare className="w-5 h-5 text-violet-500"/>, color:"bg-violet-50", href:"/dashboard/owner/inquiries" },
  { label:"Upcoming Viewings", value:2, icon:<Calendar className="w-5 h-5 text-emerald-500"/>, color:"bg-emerald-50", href:"/dashboard/owner/viewings" },
  { label:"Total Views (30d)", value:342, icon:<Eye className="w-5 h-5 text-amber-500"/>, color:"bg-amber-50", href:"/dashboard/owner/analytics" },
]

const INQUIRIES = [
  { id:"iq1", buyer:"Arjun Mehta", property:"3BHK Apartment, Adajan", time:new Date(Date.now()-2*3600000), status:"NEW" },
  { id:"iq2", buyer:"Meera Patel", property:"2BHK Flat, Piplod", time:new Date(Date.now()-5*3600000), status:"RESPONDED" },
  { id:"iq3", buyer:"Rohan Shah", property:"3BHK Apartment, Adajan", time:new Date(Date.now()-86400000), status:"NEW" },
]

const ACTIVITY = [
  { text:"New inquiry from Arjun Mehta for your Adajan property", time:new Date(Date.now()-2*3600000), icon:MessageSquare, color:"text-violet-500" },
  { text:"Viewing scheduled for Friday at 3pm — Meera Patel", time:new Date(Date.now()-5*3600000), icon:Calendar, color:"text-emerald-500" },
  { text:"Your Adajan listing got 45 views today", time:new Date(Date.now()-8*3600000), icon:Eye, color:"text-blue-500" },
  { text:"Price alert: Similar properties dropped 5% in Adajan", time:new Date(Date.now()-86400000), icon:TrendingUp, color:"text-amber-500" },
]

export default async function OwnerDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "OWNER") redirect("/unauthorized")
  const user = session.user

  return (
    <DashboardLayout user={{ id: user.id!, firstName: user.firstName!, lastName: user.lastName!, role: user.role!, email: user.email!, profileImage: user.profileImage }}>
      <div className="dashboard-main py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Welcome back, {user.firstName}! 👋</h1>
            <p className="page-subtitle">Here's an overview of your property listings and activity.</p>
          </div>
          <Link href="/dashboard/owner/properties/new" className="btn-gold self-start"><Plus className="w-4 h-4"/>List a Property</Link>
        </div>


        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(s => (
            <Link key={s.label} href={s.href}>
              <StatCard label={s.label} value={s.value} icon={s.icon} color={s.color} className="hover:shadow-md transition-all"/>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Inquiries */}
          <div className="lg:col-span-2 card-flat p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-medium">Recent Inquiries</h2>
              <Link href="/dashboard/owner/inquiries" className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1">View all <ArrowRight className="w-3 h-3"/></Link>
            </div>
            <div className="space-y-0">
              {INQUIRIES.map((inq, i) => (
                <div key={inq.id} className={`flex items-center gap-4 py-3.5 ${i < INQUIRIES.length-1 ? "border-b border-stone-100" : ""}`}>
                  <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-violet-600"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-stone-900">{inq.buyer}</p>
                    <p className="text-xs text-stone-400 truncate">{inq.property}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge variant={inq.status === "NEW" ? "amber" : "green"} className="mb-1">{inq.status}</Badge>
                    <p className="text-xs text-stone-400">{formatTimeAgo(inq.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="card-flat p-5">
            <h2 className="font-display text-lg font-medium mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center flex-shrink-0 ${a.color}`}>
                    <a.icon className="w-4 h-4"/>
                  </div>
                  <div>
                    <p className="text-xs font-body text-stone-700 leading-snug">{a.text}</p>
                    <p className="text-[10px] text-stone-400 mt-1">{formatTimeAgo(a.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-2xl p-6 bg-gradient-navy text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-amber-300"/>
            </div>
            <div>
              <h3 className="font-display text-xl font-medium">Boost Your Listings</h3>
              <p className="text-white/60 text-sm mt-0.5">Get featured placement and reach 10x more buyers.</p>
            </div>
          </div>
          <button className="btn-gold flex-shrink-0">Upgrade Listing</button>
        </div>
      </div>
    </DashboardLayout>
  )
}
