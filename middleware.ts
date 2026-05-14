// middleware.ts — Role-based access control for all dashboard routes
import NextAuth from "next-auth"
import authConfig from "@/lib/auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

// Routes accessible without login
const PUBLIC_PREFIXES = [
  "/", "/properties", "/blog", "/about",
  "/contactus", "/faqs", "/testimonials",
  "/terms", "/privacy-policy",
]

// Routes that redirect logged-in users away to their dashboard
const AUTH_ROUTES = [
  "/login", "/register", "/forgot-password",
  "/reset-password", "/verify-email",
]

// Which dashboard prefix each role may access
const ROLE_DASHBOARD: Record<string, string> = {
  BUYER:      "/dashboard/buyer",
  AGENT:      "/dashboard/agent",
  BUILDER:    "/dashboard/builder",
  OWNER:      "/dashboard/owner",
  ADMIN:      "/dashboard/admin",
  SUPERADMIN: "/dashboard/superadmin",
}

// Superadmin can also access /dashboard/admin
const EXTRA_ACCESS: Record<string, string[]> = {
  SUPERADMIN: ["/dashboard/admin"],
}

export default auth((req) => {
  const { nextUrl } = req
  const session  = (req as any).auth
  const pathname = nextUrl.pathname

  // ── 1. Always allow public pages ────────────────────────────────────────────
  // Note: '/' must be exact-matched only — startsWith('/') is always true!
  const isPublic = PUBLIC_PREFIXES.some((p) => {
    if (p === "/") return pathname === "/"  // exact match for root
    return pathname === p || pathname.startsWith(p + "/")
  })
  if (isPublic) return NextResponse.next()

  // ── 2. Auth pages: redirect logged-in users to their dashboard ───────────────
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))
  if (isAuthRoute) {
    if (session?.user?.role) {
      const dest = ROLE_DASHBOARD[session.user.role] ?? "/"
      return NextResponse.redirect(new URL(dest, nextUrl))
    }
    return NextResponse.next()
  }

  // ── 3. Dashboard routes ──────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    // Not logged in → send to login
    if (!session?.user) {
      const callbackUrl = encodeURIComponent(pathname)
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
      )
    }

    const role     = session.user.role as string | undefined
    const ownDash  = role ? ROLE_DASHBOARD[role] : null
    const extras   = role ? (EXTRA_ACCESS[role] ?? []) : []

    // If role somehow missing (edge case) — send to login for re-auth
    if (!role || !ownDash) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }

    const allowed =
      pathname.startsWith(ownDash) ||
      extras.some((p) => pathname.startsWith(p))

    // Cross-role access → redirect to homepage
    if (!allowed) {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}