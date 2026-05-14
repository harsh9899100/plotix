// app/unauthorized/page.tsx
// Shown when a logged-in user tries to access a route they're not permitted to.
// Reads the session directly to build the correct role-specific "back" link.
import Link from "next/link"
import { auth } from "@/lib/auth"
import { ShieldAlert, ArrowLeft, Home } from "lucide-react"

export const metadata = { title: "Access Denied | PLOTIX Reality" }

const ROLE_HOME: Record<string, string> = {
  BUYER:      "/dashboard/buyer",
  AGENT:      "/dashboard/agent",
  BUILDER:    "/dashboard/builder",
  OWNER:      "/dashboard/owner",
  ADMIN:      "/dashboard/admin",
  SUPERADMIN: "/dashboard/superadmin",
}

const ROLE_LABEL: Record<string, string> = {
  BUYER: "Buyer", AGENT: "Agent", BUILDER: "Builder",
  OWNER: "Owner", ADMIN: "Admin", SUPERADMIN: "Superadmin",
}

export default async function UnauthorizedPage() {
  const session = await auth()
  const role    = session?.user?.role as string | undefined
  const name    = session?.user?.firstName
  const home    = role ? (ROLE_HOME[role] ?? "/") : "/login"
  const label   = role ? ROLE_LABEL[role] : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <div className="max-w-md w-full text-center">

        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
        </div>

        {/* Heading */}
        <h1 className="font-display text-3xl font-light text-stone-900 mb-3">
          Access Denied
        </h1>

        {/* Message — personalised if logged in */}
        <p className="font-body text-stone-500 mb-2 leading-relaxed">
          {name
            ? `Sorry ${name}, this section is restricted to a different role.`
            : "You don't have permission to view this page."}
        </p>
        {label && (
          <p className="font-body text-sm text-stone-400 mb-8">
            Your account role: <span className="font-semibold text-stone-700">{label}</span>
          </p>
        )}
        {!label && <div className="mb-8" />}

        {/* CTA — always goes to the right dashboard */}
        <Link
          href={home}
          className="inline-flex items-center gap-2 bg-stone-900 text-white font-body font-medium px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {label ? `Go to ${label} Dashboard` : "Go to Dashboard"}
        </Link>

        {/* If not logged in at all */}
        {!session?.user && (
          <p className="mt-5 text-sm text-stone-400 font-body">
            Or{" "}
            <Link href="/login" className="text-amber-700 hover:underline font-medium">
              sign in to a different account
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
