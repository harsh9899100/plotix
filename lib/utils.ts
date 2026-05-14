// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, listingFor: string): string {
  if (listingFor === "RENT") return `₹${price.toLocaleString("en-IN")}/mo`
  if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(2)} Cr`
  if (price >= 100_000)   return `₹${(price / 100_000).toFixed(1)} L`
  return `₹${price.toLocaleString("en-IN")}`
}

export function formatCurrency(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`
  if (amount >= 100_000)   return `₹${(amount / 100_000).toFixed(1)} L`
  return `₹${amount.toLocaleString("en-IN")}`
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy")
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy, hh:mm a")
}

export function formatTimeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "…"
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase()
}

export function generateSlug(title: string, id?: string): string {
  const base = slugify(title)
  return id ? `${base}-${id.slice(0, 8)}` : base
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

export function getDashboardPath(role: string): string {
  const map: Record<string, string> = {
    BUYER: "/dashboard/buyer", AGENT: "/dashboard/agent",
    BUILDER: "/dashboard/builder", OWNER: "/dashboard/owner",
    ADMIN: "/dashboard/admin", SUPERADMIN: "/dashboard/superadmin",
  }
  return map[role] || "/"
}

export function getRoleBadgeColor(role: string): string {
  const colors: Record<string, string> = {
    BUYER:      "bg-blue-50 text-blue-700 border-blue-200",
    AGENT:      "bg-violet-50 text-violet-700 border-violet-200",
    BUILDER:    "bg-amber-50 text-amber-700 border-amber-200",
    OWNER:      "bg-emerald-50 text-emerald-700 border-emerald-200",
    ADMIN:      "bg-rose-50 text-rose-700 border-rose-200",
    SUPERADMIN: "bg-stone-900 text-white border-stone-900",
  }
  return colors[role] || "bg-stone-100 text-stone-600"
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700",
    INACTIVE: "bg-stone-50 text-stone-500",
    SUSPENDED: "bg-rose-50 text-rose-700",
    PENDING_VERIFICATION: "bg-amber-50 text-amber-700",
    DRAFT: "bg-stone-50 text-stone-500",
    PENDING_APPROVAL: "bg-amber-50 text-amber-700",
    SOLD: "bg-blue-50 text-blue-700",
    ARCHIVED: "bg-stone-100 text-stone-400",
    NEW: "bg-blue-50 text-blue-700",
    VIEWED: "bg-amber-50 text-amber-700",
    RESPONDED: "bg-emerald-50 text-emerald-700",
    CLOSED: "bg-stone-100 text-stone-500",
    HOT: "bg-rose-50 text-rose-700",
    WARM: "bg-amber-50 text-amber-700",
    COLD: "bg-blue-50 text-blue-700",
    OPEN: "bg-emerald-50 text-emerald-700",
    MATCHED: "bg-violet-50 text-violet-700",
    SCHEDULED: "bg-blue-50 text-blue-700",
    COMPLETED: "bg-emerald-50 text-emerald-700",
    CANCELLED: "bg-rose-50 text-rose-700",
    NO_SHOW: "bg-stone-100 text-stone-500",
  }
  return colors[status] || "bg-stone-50 text-stone-600"
}

export function parseAmount(value: string): number {
  const str = value.replace(/[^\d.]/g, "")
  return parseFloat(str) || 0
}
