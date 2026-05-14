"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Building2, Menu, X, Search, Heart, Bell, ChevronDown, LogOut, User, LayoutDashboard } from "lucide-react"
import { cn, getDashboardPath } from "@/lib/utils"
import { Avatar } from "@/components/ui"

const NAV_LINKS = [
  { label: "Properties", href: "/properties" },
  { label: "Buy",        href: "/properties?listingFor=SALE" },
  { label: "Rent",       href: "/properties?listingFor=RENT" },
  { label: "Blog",       href: "/blog" },
  { label: "About",      href: "/about" },
]

// Optional prop — still accepted so homepage (server component) can pre-populate
interface NavbarProps {
  user?: { id: string; firstName: string; lastName: string; role: string; profileImage?: string } | null
}

export default function Navbar({ user: userProp }: NavbarProps) {
  const { data: sessionData } = useSession()
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const pathname = usePathname()
  const isHome   = pathname === "/"

  // Prefer the server-passed prop (homepage), fall back to client session (all other pages)
  const sessionUser = sessionData?.user as any
  const user = userProp ?? (sessionUser?.role ? sessionUser : null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false) }, [pathname])

  const transparent = isHome && !scrolled
  const textClass   = transparent ? "text-white/80 hover:text-white hover:bg-white/10" : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"

  // Role-aware dashboard URL — always derived from the actual role
  const dashUrl = user?.role ? getDashboardPath(user.role) : "/login"

  return (
    <>
      <header className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-300",
        transparent ? "bg-transparent" : "bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm"
      )}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-gold">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none">
                <div className={cn("font-display text-xl font-semibold transition-colors", transparent ? "text-white" : "text-stone-900")}>PLOTIX</div>
                <div className={cn("text-[9px] font-body font-medium uppercase tracking-[.2em] transition-colors", transparent ? "text-white/50" : "text-stone-400")}>Reality</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href}
                  className={cn("px-4 py-2 rounded-xl text-sm font-body font-medium transition-all", textClass,
                    pathname.startsWith(l.href) && !transparent && "bg-stone-100 text-stone-900"
                  )}>{l.label}</Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/properties" className={cn("p-2.5 rounded-xl transition-all", textClass)}>
                <Search className="w-5 h-5" />
              </Link>

              {user ? (
                <>
                  {/* Favorites — only for buyers */}
                  {user.role === "BUYER" && (
                    <Link href="/dashboard/buyer/favorites" className={cn("p-2.5 rounded-xl transition-all relative", textClass)}>
                      <Heart className="w-5 h-5" />
                    </Link>
                  )}
                  <Link href={`${dashUrl}/notifications`} className={cn("p-2.5 rounded-xl transition-all relative", textClass)}>
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                  </Link>
                  <div className="w-px h-6 bg-stone-200 mx-1" />

                  {/* User Menu */}
                  <div className="relative">
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={cn("flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all", transparent ? "hover:bg-white/10" : "hover:bg-stone-50")}>
                      <Avatar src={user.profileImage} name={`${user.firstName} ${user.lastName}`} size="sm" />
                      <span className={cn("text-sm font-body font-medium hidden xl:block transition-colors", transparent ? "text-white/90" : "text-stone-700")}>
                        {user.firstName}
                      </span>
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-all", transparent ? "text-white/60" : "text-stone-400", userMenuOpen && "rotate-180")} />
                    </button>

                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-lg z-20 overflow-hidden animate-fade-in">
                          <div className="px-4 py-3 border-b border-stone-100">
                            <p className="font-body font-semibold text-stone-900 text-sm">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-stone-400 font-body capitalize">{user.role.toLowerCase()}</p>
                          </div>
                          <div className="py-1">
                            <Link href={dashUrl}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-stone-700 hover:bg-stone-50 transition-colors">
                              <LayoutDashboard className="w-4 h-4 text-stone-400" />
                              {user.role === "BUYER" ? "Buyer Dashboard"
                                : user.role === "AGENT" ? "Agent Dashboard"
                                : user.role === "BUILDER" ? "Builder Dashboard"
                                : user.role === "OWNER" ? "Owner Dashboard"
                                : user.role === "ADMIN" ? "Admin Dashboard"
                                : user.role === "SUPERADMIN" ? "Admin Panel"
                                : "Dashboard"}
                            </Link>
                            <Link href={`${dashUrl}/profile`}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-stone-700 hover:bg-stone-50 transition-colors">
                              <User className="w-4 h-4 text-stone-400" /> Profile
                            </Link>
                          </div>
                          <div className="py-1 border-t border-stone-100">
                            <form action="/api/auth/signout" method="POST">
                              <button type="submit" className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-rose-600 hover:bg-rose-50 transition-colors">
                                <LogOut className="w-4 h-4" /> Sign Out
                              </button>
                            </form>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className={cn("w-px h-6 mx-1", transparent ? "bg-white/20" : "bg-stone-200")} />
                  <Link href="/login" className={cn("px-4 py-2 rounded-xl text-sm font-body font-medium transition-all", textClass)}>
                    Log in
                  </Link>
                  <Link href="/register" className="btn-gold text-sm px-5 py-2.5 rounded-xl">
                    List Property
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className={cn("lg:hidden p-2.5 rounded-xl transition-colors", transparent ? "text-white" : "text-stone-900")}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={cn("fixed inset-0 z-30 lg:hidden transition-all duration-300", mobileOpen ? "visible" : "invisible")}>
        <div className={cn("absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity", mobileOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setMobileOpen(false)} />
        <div className={cn("absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "translate-x-full")}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <span className="font-display text-xl font-semibold">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-stone-100"><X className="w-5 h-5" /></button>
          </div>
          <div className="overflow-y-auto h-full pb-20">
            <nav className="px-3 py-4 space-y-0.5">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href}
                  className={cn("flex items-center px-4 py-3 rounded-xl text-sm font-body font-medium transition-colors",
                    pathname.startsWith(l.href) ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-50")}>
                  {l.label}
                </Link>
              ))}
            </nav>
            {user ? (
              <div className="px-4 pt-2 border-t border-stone-100 space-y-1">
                <div className="px-4 py-3">
                  <p className="font-body font-semibold text-stone-900 text-sm">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-stone-400 font-body capitalize">{user.role?.toLowerCase()}</p>
                </div>
                <Link href={dashUrl} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body text-stone-700 hover:bg-stone-50">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link href={`${dashUrl}/profile`} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body text-stone-700 hover:bg-stone-50">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body text-rose-600 hover:bg-rose-50">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="px-4 pt-2 border-t border-stone-100 space-y-3">
                <Link href="/login" className="btn-secondary w-full justify-center">Log in</Link>
                <Link href="/register" className="btn-gold w-full justify-center">List Property</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
