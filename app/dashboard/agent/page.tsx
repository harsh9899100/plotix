// app/dashboard/agent/page.tsx
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { BarChart2, TrendingUp, ArrowRight, Eye, MessageSquare, Calendar, DollarSign, Plus, Zap, Users } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { StatCard } from "@/components/ui"
import { AGENT_STATS, MOCK_PROPERTIES, MONTHLY_REVENUE, LEAD_PIPELINE } from "@/lib/data/mock"
import { formatCurrency, formatTimeAgo } from "@/lib/utils"
import AgentAnalyticsCharts from "@/components/dashboard/AgentCharts"

export const metadata = { title: "Agent Dashboard | PLOTIX Reality" }

const RECENT_INQUIRIES = MOCK_PROPERTIES.slice(0, 4).map((p, i) => ({
  id: `inq_${i}`, propertyTitle: p.title, buyerName: ["Vikram Desai", "Sneha Patel", "Rahul Gupta", "Anita Shah"][i],
  buyerAvatar: [`https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face`,`https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face`,`https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&crop=face`,`https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face`][i],
  status: ["NEW", "VIEWED", "RESPONDED", "NEW"][i], time: ["2m ago", "15m ago", "1h ago", "3h ago"][i],
}))

export default async function AgentDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "AGENT") redirect("/unauthorized")
  const user = session.user

  return (
    <DashboardLayout>
      <div className="dashboard-main py-6 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title">Agent Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user.firstName}. Here's your performance overview.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/agent/properties/new" className="btn-gold"><Plus className="w-4 h-4" /> New Listing</Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Active Listings",  value: AGENT_STATS.activeListings,  change: "+3 this month", changeType: "up" as const, icon: <Eye className="w-5 h-5 text-blue-500" />,    color: "bg-blue-50" },
            { label: "New Inquiries",    value: AGENT_STATS.newInquiries,     change: "This week",     changeType: "up" as const, icon: <MessageSquare className="w-5 h-5 text-violet-500" />, color: "bg-violet-50" },
            { label: "Viewings Today",   value: 3,                            change: "Scheduled",     changeType: "neutral" as const, icon: <Calendar className="w-5 h-5 text-emerald-500" />, color: "bg-emerald-50" },
            { label: "Hot Leads",        value: AGENT_STATS.hotLeads,         change: "Need action",   changeType: "up" as const, icon: <Zap className="w-5 h-5 text-amber-500" />,   color: "bg-amber-50" },
            { label: "Commission",       value: `₹${(AGENT_STATS.commissionEarned/100000).toFixed(1)}L`, change: "This quarter", changeType: "up" as const, icon: <DollarSign className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-50" },
            { label: "Conversion %",     value: `${AGENT_STATS.conversionRate}%`, change: "+2.1% MoM", changeType: "up" as const, icon: <TrendingUp className="w-5 h-5 text-rose-500" />, color: "bg-rose-50" },
          ].map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Charts */}
          <div className="lg:col-span-2 space-y-5">
            <AgentAnalyticsCharts data={MONTHLY_REVENUE} pipeline={LEAD_PIPELINE} />
          </div>

          {/* Right panel */}
          <div className="space-y-5">

            {/* Recent Inquiries */}
            <div className="card-flat p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-medium">Recent Inquiries</h2>
                <Link href="/dashboard/agent/inquiries" className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-body">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {RECENT_INQUIRIES.map((inq) => (
                  <div key={inq.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer group">
                    <img src={inq.buyerAvatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-medium text-stone-800 truncate">{inq.buyerName}</p>
                      <p className="text-xs text-stone-400 font-body truncate">{inq.propertyTitle}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${inq.status === "NEW" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}>
                        {inq.status}
                      </span>
                      <span className="text-[10px] text-stone-400 font-body">{inq.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card-flat p-5">
              <h2 className="font-display text-lg font-medium mb-4">This Month</h2>
              <div className="space-y-3">
                {[
                  { label: "Properties Viewed",  value: "1,842", bar: 78 },
                  { label: "Inquiries Received", value: "143",   bar: 60 },
                  { label: "Viewings Done",       value: "32",    bar: 45 },
                  { label: "Deals Closed",        value: "6",     bar: 25 },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs font-body mb-1.5">
                      <span className="text-stone-600">{s.label}</span>
                      <span className="font-semibold text-stone-900">{s.value}</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-gradient-gold transition-all" style={{ width: `${s.bar}%` }} />
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
