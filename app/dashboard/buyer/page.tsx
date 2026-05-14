// app/dashboard/buyer/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Heart, Search, FileText, Calendar, MessageSquare,
  Bell, Star, TrendingUp, ArrowRight, Layers, Eye
} from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { StatCard } from "@/components/ui"
import { BUYER_STATS, MOCK_PROPERTIES } from "@/lib/data/mock"
import { formatPrice, formatTimeAgo, cn } from "@/lib/utils"
import PropertyCard from "@/components/properties/PropertyCard"

export const metadata = { title: "Buyer Dashboard | PLOTIX Reality" }

const QUICK_LINKS = [
  { label: "Browse Properties", href: "/properties",                     icon: Search,      color: "bg-blue-50 text-blue-600" },
  { label: "My Favorites",      href: "/dashboard/buyer/favorites",      icon: Heart,       color: "bg-rose-50 text-rose-600" },
  { label: "Property Requests", href: "/dashboard/buyer/property-requests", icon: FileText, color: "bg-amber-50 text-amber-600" },
  { label: "Scheduled Viewings",href: "/dashboard/buyer/viewings",       icon: Calendar,    color: "bg-emerald-50 text-emerald-600" },
  { label: "My Inquiries",      href: "/dashboard/buyer/inquiries",      icon: MessageSquare,color: "bg-violet-50 text-violet-600" },
  { label: "Comparisons",       href: "/dashboard/buyer/comparisons",    icon: Layers,      color: "bg-stone-100 text-stone-600" },
]

const RECENT_ACTIVITY = [
  { type: "inquiry",  text: 'Inquiry sent for "Luxurious 4BHK Penthouse in Vesu"',  time: "2 hours ago",  icon: MessageSquare, color: "text-blue-500" },
  { type: "favorite", text: 'Saved "Modern 3BHK Apartment in Adajan" to favorites',  time: "5 hours ago",  icon: Heart,         color: "text-rose-500" },
  { type: "viewing",  text: 'Viewing scheduled for "Villa in SG Highway"',           time: "1 day ago",    icon: Calendar,      color: "text-emerald-500" },
  { type: "match",    text: 'New property matches your request: "3BHK in Surat"',    time: "2 days ago",   icon: Bell,          color: "text-amber-500" },
  { type: "review",   text: 'Your review for "Cozy 2BHK in Piplod" was approved',   time: "3 days ago",   icon: Star,          color: "text-violet-500" },
]

export default async function BuyerDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "BUYER") redirect("/login")

  const user = session.user
  const recommended = MOCK_PROPERTIES.filter((p) => p.featured).slice(0, 3)

  return (
    <DashboardLayout user={{ id: user.id!, firstName: user.firstName!, lastName: user.lastName!, role: user.role!, email: user.email!, profileImage: user.profileImage }}>
      <div className="dashboard-main py-6 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Welcome back, {user.firstName}! 👋</h1>
            <p className="page-subtitle">Here's what's happening with your property search.</p>
          </div>
          <Link href="/properties" className="btn-gold self-start">
            <Search className="w-4 h-4" /> Browse Properties
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Favorites",        value: BUYER_STATS.favorites,       href: "/dashboard/buyer/favorites",         color: "bg-rose-50",    icon: <Heart className="w-5 h-5 text-rose-500" /> },
            { label: "Saved Searches",   value: BUYER_STATS.savedSearches,   href: "/dashboard/buyer/saved-searches",    color: "bg-blue-50",    icon: <Search className="w-5 h-5 text-blue-500" /> },
            { label: "Inquiries",        value: BUYER_STATS.inquiries,       href: "/dashboard/buyer/inquiries",         color: "bg-violet-50",  icon: <MessageSquare className="w-5 h-5 text-violet-500" /> },
            { label: "Viewings",         value: BUYER_STATS.viewings,        href: "/dashboard/buyer/viewings",          color: "bg-emerald-50", icon: <Calendar className="w-5 h-5 text-emerald-500" /> },
            { label: "Requests",         value: BUYER_STATS.propertyRequests,href: "/dashboard/buyer/property-requests", color: "bg-amber-50",   icon: <FileText className="w-5 h-5 text-amber-500" /> },
            { label: "Notifications",    value: BUYER_STATS.notifications,   href: "/dashboard/buyer/notifications",     color: "bg-stone-100",  icon: <Bell className="w-5 h-5 text-stone-500" /> },
          ].map((s) => (
            <Link key={s.label} href={s.href}>
              <StatCard label={s.label} value={s.value} icon={s.icon} color={s.color} className="hover:shadow-md transition-all" />
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Quick Links */}
          <div className="card-flat p-5">
            <h2 className="font-display text-lg font-medium text-stone-900 mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_LINKS.map((q) => (
                <Link key={q.href} href={q.href}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors text-center group">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", q.color)}>
                    <q.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-body font-medium text-stone-700 leading-tight">{q.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-flat p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-medium text-stone-900">Recent Activity</h2>
              <Link href="/dashboard/buyer/notifications" className="text-xs font-body text-stone-500 hover:text-stone-800 transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-0">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className={cn("flex items-start gap-3 py-3.5", i < RECENT_ACTIVITY.length - 1 && "border-b border-stone-100")}>
                  <div className={cn("w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center flex-shrink-0 mt-0.5", a.color)}>
                    <a.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body text-stone-700 leading-snug">{a.text}</p>
                    <p className="text-xs text-stone-400 font-body mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Properties */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-2xl font-light text-stone-900">Recommended for You</h2>
              <p className="text-sm font-body text-stone-500 mt-0.5">Based on your preferences and search history</p>
            </div>
            <Link href="/properties" className="btn-secondary text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommended.map((p) => (
              <PropertyCard key={p.id} property={p} viewMode="grid" />
            ))}
          </div>
        </div>

        {/* Price Alert Banner */}
        <div className="rounded-2xl p-6 bg-gradient-navy text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-display text-xl font-medium">Set Price Alerts</h3>
              <p className="text-white/60 text-sm font-body mt-0.5">Get notified instantly when properties drop in price in your saved areas.</p>
            </div>
          </div>
          <Link href="/dashboard/buyer/saved-searches" className="btn-gold flex-shrink-0 whitespace-nowrap">
            Set Up Alerts
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
