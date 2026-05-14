"use client"
// context/SessionContext.tsx
// Provides real session user data to all client-side dashboard components.
// Eliminates the need for MOCK_USER in every page.
import { createContext, useContext } from "react"
import { useSession } from "next-auth/react"

export interface DashboardUser {
  id: string
  firstName: string
  lastName: string
  role: string
  email: string
  profileImage?: string
  status?: string
}

const SessionCtx = createContext<DashboardUser | null>(null)

export function DashboardSessionProvider({ children }: { children: React.ReactNode }) {
  // SessionProvider (from next-auth/react) must be an ancestor — see app/dashboard/layout.tsx
  return (
    <SessionCtx.Provider value={null}>
      {children}
    </SessionCtx.Provider>
  )
}

/**
 * Hook to get the currently logged-in user inside any dashboard client component.
 * Falls back to a safe loading state (empty strings) so components never crash.
 *
 * Usage:
 *   const user = useDashboardUser()
 *   // Replace every MOCK_USER with: useDashboardUser()
 */
export function useDashboardUser(): DashboardUser {
  const { data: session } = useSession()
  if (session?.user) {
    return {
      id:           session.user.id           || "",
      firstName:    session.user.firstName    || session.user.name?.split(" ")[0] || "",
      lastName:     session.user.lastName     || session.user.name?.split(" ")[1] || "",
      role:         session.user.role         || "BUYER",
      email:        session.user.email        || "",
      profileImage: session.user.profileImage || session.user.image || undefined,
      status:       session.user.status,
    }
  }
  // Loading / unauthenticated fallback — components render without crashing
  return { id: "", firstName: "...", lastName: "", role: "BUYER", email: "" }
}
