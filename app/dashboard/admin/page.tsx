// app/dashboard/admin/page.tsx
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Users, Home, MessageSquare, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, ArrowRight, Plus } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { StatCard, Badge } from "@/components/ui"
import { ADMIN_STATS, MONTHLY_REVENUE, USER_GROWTH, PROPERTY_TYPE_DIST } from "@/lib/data/mock"
import { formatCurrency, formatTimeAgo } from "@/lib/utils"
import AdminOverviewCharts from "@/components/dashboard/AdminCharts"

export const metadata = { title: "Admin Dashboard | PLOTIX Reality" }

const RECENT_ACTIONS = [
  { text: "New property pending approval: 4BHK in Banjara Hills",      type: "warning", time: "5m ago",  href: "/dashboard/admin/properties/pending" },
  { text: "User complaint filed against Agent Vikram",                  type: "error",   time: "22m ago", href: "/dashboard/admin/support" },
  { text: "Builder Rohan Mehta registered a new project",              type: "info",    time: "1h ago",  href: "/dashboard/admin/users/builders" },
  { text: "145 properties pending moderation",                          type: "warning", time: "2h ago",  href: "/dashboard/admin/properties/pending" },
  { text: "Commission payout of ₹2.4L processed successfully",         type: "success", time: "4h ago",  href: "/dashboard/admin/payments" },
  { text: "New testimonial awaiting approval",                          type: "info",    time: "6h ago",  href: "/dashboard/admin/content/testimonials" },
]

const TYPE_COLORS: Record<string, string> = {
  warning: "bg-amber-50 text-amber-600",
  error:   "bg-rose-50 text-rose-600",
  info:    "bg-blue-50 text-blue-600",
  success: "bg-emerald-50 text-emerald-600",
}

const TOP_AGENTS = [
  { name: "Priya Sharma",  sales: 28, revenue: 3200000, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" },
  { name: "Rohan Mehta",   sales: 22, revenue: 2800000, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
  { name: "Arjun Patel",   sales: 19, revenue: 2400000, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
  { name: "Nisha Kapoor",  sales: 14, revenue: 1900000, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" },
]

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (!["ADMIN", "SUPERADMIN"].includes(session.user.role)) redirect("/unauthorized")
  const user = session.user

  return (
    <DashboardLayout user={{ id: user.id!, firstName: user.firstName!, lastName: user.lastName!, role: user.role!, email: user.email!, profileImage: user.profileImage }}>
      <div className="dashboard-main py-6 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title">Platform Overview</h1>
            <p className="page-subtitle">Welcome back, {user.firstName}. Monitor and manage all platform activities.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href="/dashboard/admin/properties/pending" className="btn-secondary text-sm">
              <AlertCircle className="w-4 h-4 text-amber-500" /> {ADMIN_STATS.pendingApproval} Pending
            </Link>
            <Link href="/dashboard/admin/content/blog/new" className="btn-gold text-sm">
              <Plus className="w-4 h-4" /> New Post
            </Link>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users",        value: ADMIN_STATS.totalUsers.toLocaleString("en-IN"),       change: `+${ADMIN_STATS.newUsersThisMonth} this month`,   changeType: "up"      as const, icon: <Users className="w-5 h-5 text-blue-500" />,     color: "bg-blue-50" },
            { label: "Active Properties",  value: ADMIN_STATS.activeProperties.toLocaleString("en-IN"), change: `+${ADMIN_STATS.newPropertiesThisMonth} new`,       changeType: "up"      as const, icon: <Home className="w-5 h-5 text-violet-500" />,    color: "bg-violet-50" },
            { label: "Total Inquiries",    value: ADMIN_STATS.totalInquiries.toLocaleString("en-IN"),   change: "All time",                                         changeType: "neutral" as const, icon: <MessageSquare className="w-5 h-5 text-emerald-500" />, color: "bg-emerald-50" },
            { label: "Platform Revenue",   value: formatCurrency(ADMIN_STATS.platformRevenue),           change: "+18% vs last month",                               changeType: "up"      as const, icon: <DollarSign className="w-5 h-5 text-amber-500" />, color: "bg-amber-50" },
          ].map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Charts row */}
        <AdminOverviewCharts revenueData={MONTHLY_REVENUE} userGrowth={USER_GROWTH} typeDist={PROPERTY_TYPE_DIST} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Alerts */}
          <div className="lg:col-span-2 card-flat p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-medium">Recent Alerts & Activity</h2>
              <Link href="/dashboard/admin/audit-logs" className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-body">
                Audit logs <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {RECENT_ACTIONS.map((a, i) => (
                <Link key={i} href={a.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[a.type]}`}>
                    {a.type === "warning" && <AlertCircle className="w-4 h-4" />}
                    {a.type === "error"   && <AlertCircle className="w-4 h-4" />}
                    {a.type === "info"    && <Clock className="w-4 h-4" />}
                    {a.type === "success" && <CheckCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body text-stone-700 truncate">{a.text}</p>
                    <p className="text-xs text-stone-400 font-body">{a.time}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Top Agents */}
          <div className="card-flat p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-medium">Top Agents</h2>
              <Link href="/dashboard/admin/users/agents" className="text-xs text-stone-500 hover:text-stone-800 font-body flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {TOP_AGENTS.map((agent, i) => (
                <div key={agent.name} className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-body font-bold text-stone-400">#{i + 1}</span>
                  <img src={agent.avatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-semibold text-stone-800 truncate">{agent.name}</p>
                    <p className="text-xs text-stone-400 font-body">{agent.sales} sales</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-body font-semibold text-stone-700">{formatCurrency(agent.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* User Role Breakdown */}
            <div className="mt-5 pt-5 border-t border-stone-100 space-y-2.5">
              <p className="text-xs font-body font-semibold text-stone-500 uppercase tracking-wider">User Breakdown</p>
              {[
                { role: "Buyers",   count: ADMIN_STATS.totalBuyers,  color: "bg-blue-400",   pct: Math.round(ADMIN_STATS.totalBuyers / ADMIN_STATS.totalUsers * 100) },
                { role: "Agents",   count: ADMIN_STATS.totalAgents,  color: "bg-violet-400", pct: Math.round(ADMIN_STATS.totalAgents / ADMIN_STATS.totalUsers * 100) },
                { role: "Builders", count: ADMIN_STATS.totalBuilders,color: "bg-amber-400",  pct: Math.round(ADMIN_STATS.totalBuilders / ADMIN_STATS.totalUsers * 100) },
              ].map((r) => (
                <div key={r.role} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.color}`} />
                  <span className="text-xs font-body text-stone-600 flex-1">{r.role}</span>
                  <span className="text-xs font-body font-semibold text-stone-700">{r.count.toLocaleString("en-IN")}</span>
                  <span className="text-[10px] text-stone-400 font-body w-8 text-right">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
