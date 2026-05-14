"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2, LayoutDashboard, Heart, Search, MessageSquare,
  Bell, Settings, User, LogOut, Menu, X,
  Home, FileText, BarChart2, Users, DollarSign, Star,
  Calendar, Shield, Zap, Briefcase, Wrench,
  ClipboardList, TrendingUp, Database, AlertCircle, Mail,
  BookOpen, HelpCircle, Megaphone, CreditCard, Activity,
  Eye, Lock, Globe, Server, Flag, Layers
} from "lucide-react"
import { cn, getDashboardPath, getInitials } from "@/lib/utils"
import { Avatar, Badge } from "@/components/ui"
import { useDashboardUser } from "@/context/SessionContext"

// ── Sidebar configs per role ───────────────────────────────────────────────────
const BUYER_NAV = [
  { section: "Main",
    items: [
      { label: "Favorites",          href: "/dashboard/buyer/favorites",           icon: Heart,       badge: "12" },
      { label: "Saved Searches",     href: "/dashboard/buyer/saved-searches",      icon: Search },
      { label: "Property Requests",  href: "/dashboard/buyer/property-requests",   icon: FileText },
      { label: "Comparisons",        href: "/dashboard/buyer/comparisons",         icon: Layers },
    ]
  },
  { section: "Activity",
    items: [
      { label: "My Inquiries",       href: "/dashboard/buyer/inquiries",           icon: MessageSquare, badge: "3" },
      { label: "Viewings",           href: "/dashboard/buyer/viewings",            icon: Calendar },
      { label: "Messages",           href: "/dashboard/buyer/messages",            icon: Mail,          badge: "5" },
      { label: "Notifications",      href: "/dashboard/buyer/notifications",       icon: Bell,          badge: "7" },
      { label: "Reviews",            href: "/dashboard/buyer/reviews",             icon: Star },
      { label: "Payments",           href: "/dashboard/buyer/payments",            icon: CreditCard },
    ]
  },
  { section: "Account",
    items: [
      { label: "Profile",            href: "/dashboard/buyer/profile",             icon: User },
      { label: "Preferences",        href: "/dashboard/buyer/preferences",         icon: Settings },
      { label: "Change Password",    href: "/dashboard/buyer/settings",            icon: Lock },
    ]
  },
]

const AGENT_NAV = [
  { section: "Overview",
    items: [
      { label: "Analytics",          href: "/dashboard/agent/analytics",           icon: BarChart2 },
    ]
  },
  { section: "Listings",
    items: [
      { label: "My Properties",      href: "/dashboard/agent/properties",          icon: Home },
      { label: "Inquiries",          href: "/dashboard/agent/inquiries",           icon: MessageSquare, badge: "12" },
      { label: "Viewings",           href: "/dashboard/agent/viewings",            icon: Calendar },
      { label: "Leads",              href: "/dashboard/agent/leads",               icon: Zap,           badge: "8" },
      { label: "Buyer Database",     href: "/dashboard/agent/buyer-database",      icon: Database },
    ]
  },
  { section: "Business",
    items: [
      { label: "Messages",           href: "/dashboard/agent/messages",            icon: Mail,          badge: "4" },
      { label: "Commissions",        href: "/dashboard/agent/commissions",         icon: DollarSign },
      { label: "Marketing Tools",    href: "/dashboard/agent/marketing",           icon: Megaphone },
      { label: "Reports",            href: "/dashboard/agent/reports",             icon: TrendingUp },
    ]
  },
  { section: "Account",
    items: [
      { label: "Profile",            href: "/dashboard/agent/profile",             icon: User },
      { label: "Settings",           href: "/dashboard/agent/settings",            icon: Settings },
    ]
  },
]

const BUILDER_NAV = [
  { section: "Overview",
    items: [
      { label: "Analytics",          href: "/dashboard/builder/analytics",         icon: BarChart2 },
    ]
  },
  { section: "Projects",
    items: [
      { label: "All Projects",       href: "/dashboard/builder/projects",          icon: Briefcase },
      { label: "All Properties",     href: "/dashboard/builder/properties",        icon: Home },
      { label: "Inquiries",          href: "/dashboard/builder/inquiries",         icon: MessageSquare, badge: "24" },
      { label: "Leads",              href: "/dashboard/builder/leads",             icon: Zap,           badge: "15" },
      { label: "Broker Network",     href: "/dashboard/builder/broker-network",    icon: Users },
    ]
  },
  { section: "Operations",
    items: [
      { label: "Messages",           href: "/dashboard/builder/messages",          icon: Mail },
      { label: "Commissions",        href: "/dashboard/builder/commissions",       icon: DollarSign },
      { label: "Payments",           href: "/dashboard/builder/payments",          icon: CreditCard },
      { label: "Service Requests",   href: "/dashboard/builder/service-requests",  icon: Wrench },
      { label: "Warranties",         href: "/dashboard/builder/warranties",        icon: Shield },
      { label: "Documents",          href: "/dashboard/builder/documents",         icon: FileText },
      { label: "Marketing",          href: "/dashboard/builder/marketing",         icon: Megaphone },
      { label: "Reports",            href: "/dashboard/builder/reports",           icon: TrendingUp },
    ]
  },
  { section: "Account",
    items: [
      { label: "Profile",            href: "/dashboard/builder/profile",           icon: User },
      { label: "Settings",           href: "/dashboard/builder/settings",          icon: Settings },
    ]
  },
]

const OWNER_NAV = [
  { section: "Overview",
    items: [
      { label: "Analytics",          href: "/dashboard/owner/analytics",           icon: BarChart2 },
    ]
  },
  { section: "My Properties",
    items: [
      { label: "Properties",         href: "/dashboard/owner/properties",          icon: Home },
      { label: "Inquiries",          href: "/dashboard/owner/inquiries",           icon: MessageSquare },
      { label: "Viewings",           href: "/dashboard/owner/viewings",            icon: Calendar },
      { label: "Messages",           href: "/dashboard/owner/messages",            icon: Mail },
    ]
  },
  { section: "Account",
    items: [
      { label: "Profile",            href: "/dashboard/owner/profile",             icon: User },
      { label: "Settings",           href: "/dashboard/owner/settings",            icon: Settings },
    ]
  },
]

const ADMIN_NAV = [
  { section: "Overview",
    items: [
      { label: "Analytics",          href: "/dashboard/admin/analytics",           icon: BarChart2 },
    ]
  },
  { section: "Management",
    items: [
      { label: "Properties",         href: "/dashboard/admin/properties",          icon: Home,          badge: "145" },
      { label: "Users",              href: "/dashboard/admin/users",               icon: Users },
      { label: "Inquiries",          href: "/dashboard/admin/inquiries",           icon: MessageSquare },
    ]
  },
  { section: "Content",
    items: [
      { label: "Blog Posts",         href: "/dashboard/admin/content/blog",        icon: BookOpen },
      { label: "FAQs",               href: "/dashboard/admin/content/faqs",        icon: HelpCircle },
      { label: "Testimonials",       href: "/dashboard/admin/content/testimonials",icon: Star },
      { label: "Contact Messages",   href: "/dashboard/admin/content/contact-messages", icon: Mail },
      { label: "Announcements",      href: "/dashboard/admin/content/announcements", icon: Megaphone },
    ]
  },
  { section: "Finance",
    items: [
      { label: "Payments",           href: "/dashboard/admin/payments",            icon: DollarSign },
      { label: "Audit Logs",         href: "/dashboard/admin/audit-logs",          icon: Activity },
      { label: "Support",            href: "/dashboard/admin/support",             icon: AlertCircle },
    ]
  },
  { section: "Account",
    items: [
      { label: "Profile",            href: "/dashboard/admin/profile",             icon: User },
      { label: "Site Settings",      href: "/dashboard/admin/settings",            icon: Settings },
    ]
  },
]

const SUPERADMIN_NAV = [
  { section: "Overview",
    items: [
      { label: "Advanced Analytics", href: "/dashboard/superadmin/analytics",      icon: TrendingUp },
    ]
  },
  { section: "Platform Management",
    items: [
      { label: "Properties",         href: "/dashboard/admin/properties",          icon: Home,          badge: "145" },
      { label: "All Users",          href: "/dashboard/superadmin/users",          icon: Users },
      { label: "Inquiries",          href: "/dashboard/admin/inquiries",           icon: MessageSquare },
      { label: "Support Tickets",    href: "/dashboard/admin/support",             icon: AlertCircle },
    ]
  },
  { section: "Content",
    items: [
      { label: "Blog Posts",         href: "/dashboard/admin/content/blog",        icon: BookOpen },
      { label: "FAQs",               href: "/dashboard/admin/content/faqs",        icon: HelpCircle },
      { label: "Testimonials",       href: "/dashboard/admin/content/testimonials",icon: Star },
      { label: "Contact Messages",   href: "/dashboard/admin/content/contact-messages", icon: Mail },
      { label: "Announcements",      href: "/dashboard/admin/content/announcements", icon: Megaphone },
    ]
  },
  { section: "Finance & Governance",
    items: [
      { label: "Financial",          href: "/dashboard/superadmin/financial",      icon: DollarSign },
      { label: "Payments",           href: "/dashboard/admin/payments",            icon: CreditCard },
      { label: "Audit Logs",         href: "/dashboard/admin/audit-logs",          icon: Activity },
      { label: "Compliance",         href: "/dashboard/superadmin/compliance",     icon: ClipboardList },
    ]
  },
  { section: "Administration",
    items: [
      { label: "Manage Admins",      href: "/dashboard/superadmin/admins",         icon: Shield },
      { label: "System",             href: "/dashboard/superadmin/system",         icon: Server },
      { label: "Integrations",       href: "/dashboard/superadmin/integrations",   icon: Globe },
      { label: "Feature Flags",      href: "/dashboard/superadmin/features",       icon: Flag },
    ]
  },
  { section: "Account",
    items: [
      { label: "Profile",            href: "/dashboard/superadmin/profile",        icon: User },
      { label: "Settings",           href: "/dashboard/superadmin/settings",       icon: Settings },
    ]
  },
]


const NAV_BY_ROLE: Record<string, typeof BUYER_NAV> = {
  BUYER: BUYER_NAV, AGENT: AGENT_NAV, BUILDER: BUILDER_NAV,
  OWNER: OWNER_NAV, ADMIN: ADMIN_NAV, SUPERADMIN: SUPERADMIN_NAV,
}

interface DashboardLayoutProps {
  children: React.ReactNode
  // user is optional — if omitted, reads from the NextAuth session context
  user?: { id: string; firstName: string; lastName: string; role: string; email: string; profileImage?: string }
}

export default function DashboardLayout({ children, user: userProp }: DashboardLayoutProps) {
  const sessionUser = useDashboardUser()
  // Prefer explicitly passed user (server pages); fall back to session (client pages)
  const user = userProp ?? sessionUser
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const navGroups = NAV_BY_ROLE[user.role] || BUYER_NAV

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand — links to own dashboard */}
      <Link href={getDashboardPath(user.role)} className="flex items-center gap-3 px-5 py-5 border-b border-stone-100 hover:bg-stone-50 transition-colors">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-gold flex-shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-display text-lg font-semibold text-stone-900">PLOTIX</div>
          <div className="text-[9px] text-stone-400 font-body uppercase tracking-[.2em]">Reality</div>
        </div>
      </Link>

      {/* User card */}
      <div className="px-4 py-4 border-b border-stone-100">
        <div className="flex items-center gap-3 bg-stone-50 rounded-xl p-3">
          <Avatar src={user.profileImage} name={`${user.firstName} ${user.lastName}`} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-body font-semibold text-stone-900 truncate">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-stone-400 font-body capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-3">

        {/* Pinned: Dashboard home — always links to this role's root */}
        {(() => {
          const dashHome = getDashboardPath(user.role)
          const isHome   = pathname === dashHome
          return (
            <Link href={dashHome} className={cn(isHome ? "sidebar-link-active" : "sidebar-link", "mb-2")}>
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 truncate">Dashboard</span>
            </Link>
          )
        })()}

        {navGroups.map((group) => (
          <div key={group.section}>
            <p className="sidebar-section">{group.section}</p>
            <div className="space-y-0.5 mb-2">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))
                return (
                  <Link key={item.href} href={item.href}
                    className={cn(isActive ? "sidebar-link-active" : "sidebar-link")}>
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "text-[10px] font-semibold font-body px-1.5 py-0.5 rounded-full",
                        isActive ? "bg-white/20 text-white" : "bg-stone-200 text-stone-600"
                      )}>{item.badge}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-stone-100 space-y-0.5">
        <Link href="/" className="sidebar-link">
          <Globe className="w-4 h-4" /> View Website
        </Link>
        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="w-full sidebar-link text-rose-500 hover:bg-rose-50 hover:text-rose-600">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 bg-white border-r border-stone-100 h-full overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden transition-all duration-300", sidebarOpen ? "visible" : "invisible")}>
        <div className={cn("absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity", sidebarOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setSidebarOpen(false)} />
        <aside className={cn("absolute top-0 left-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full")}>
          <SidebarContent />
        </aside>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-100 px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <button className="lg:hidden p-2 rounded-xl hover:bg-stone-100 -ml-1" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-stone-600" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <Link href={`${getDashboardPath(user.role)}/notifications`}
              className="relative p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </Link>
            <Link href={`${getDashboardPath(user.role)}/messages`}
              className="relative p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </Link>
            <Link href={`${getDashboardPath(user.role)}/profile`} className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-stone-50 transition-colors">
              <Avatar src={user.profileImage} name={`${user.firstName} ${user.lastName}`} size="sm" />
              <span className="hidden sm:block text-sm font-body font-medium text-stone-700">{user.firstName}</span>
            </Link>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
