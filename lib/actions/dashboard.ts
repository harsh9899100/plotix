// lib/actions/dashboard.ts
// Server Actions for dashboard data — called directly from Client/Server components.
// No API round-trip, no JSON serialization overhead — runs right on the server.
"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// ── Auth guard helper ──────────────────────────────────────────────────────────
async function requireSession(allowedRoles?: string[]) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthenticated")
  if (allowedRoles && !allowedRoles.includes(session.user.role)) throw new Error("Unauthorized")
  return session
}

// ── Profile ────────────────────────────────────────────────────────────────────
export async function getMyProfile() {
  const session = await requireSession()
  return db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, firstName: true, lastName: true, email: true,
      phone: true, profileImage: true, bio: true, role: true, status: true,
      createdAt: true, agentProfile: true, builderProfile: true,
    },
  })
}

export async function updateMyProfile(data: {
  firstName?: string; lastName?: string; phone?: string; bio?: string; profileImage?: string
}) {
  const session = await requireSession()
  await db.user.update({ where: { id: session.user.id }, data })
  revalidatePath("/dashboard")
  return { success: true }
}

// ── Buyer ──────────────────────────────────────────────────────────────────────
export async function getMyFavorites() {
  const session = await requireSession(["BUYER"])
  return db.favorite.findMany({
    where: { userId: session.user.id },
    include: { property: { select: { id: true, title: true, slug: true, price: true, images: true, city: true, listingFor: true, bedrooms: true, area: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getMyInquiries() {
  const session = await requireSession(["BUYER"])
  return db.inquiry.findMany({
    where: { buyerId: session.user.id },
    include: { property: { select: { id: true, title: true, images: true, city: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getMyViewings() {
  const session = await requireSession(["BUYER", "AGENT", "OWNER"])
  const key = session.user.role === "BUYER" ? "buyerId" : session.user.role === "AGENT" ? "agentId" : "property.userId"
  return db.viewing.findMany({
    where: { buyerId: session.user.id },
    include: {
      property: { select: { id: true, title: true, address: true, images: true, city: true } },
      agent: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
    },
    orderBy: { scheduledAt: "desc" },
  })
}

export async function getMyMessages() {
  const session = await requireSession()
  return db.message.findMany({
    where: { OR: [{ senderId: session.user.id }, { receiverId: session.user.id }] },
    include: {
      sender: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
      receiver: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
}

export async function getMyNotifications() {
  const session = await requireSession()
  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  })
  return notifications
}

export async function markNotificationRead(id: string) {
  const session = await requireSession()
  await db.notification.update({ where: { id, userId: session.user.id }, data: { isRead: true } })
  return { success: true }
}

export async function getMyPropertyRequests() {
  const session = await requireSession(["BUYER"])
  return db.propertyRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })
}

// ── Agent ──────────────────────────────────────────────────────────────────────
export async function getAgentProperties() {
  const session = await requireSession(["AGENT"])
  return db.property.findMany({
    where: { userId: session.user.id },
    select: { id: true, title: true, slug: true, price: true, status: true, images: true, city: true, listingFor: true, bedrooms: true, area: true, views: true, inquiryCount: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAgentInquiries() {
  const session = await requireSession(["AGENT"])
  return db.inquiry.findMany({
    where: { agentId: session.user.id },
    include: {
      property: { select: { id: true, title: true, images: true, city: true } },
      buyer: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, profileImage: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAgentLeads() {
  const session = await requireSession(["AGENT"])
  return db.lead.findMany({
    where: { agentId: session.user.id },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAgentCommissions() {
  const session = await requireSession(["AGENT"])
  return db.commission.findMany({
    where: { agentId: session.user.id },
    orderBy: { createdAt: "desc" },
  })
}

// ── Owner ──────────────────────────────────────────────────────────────────────
export async function getOwnerProperties() {
  const session = await requireSession(["OWNER"])
  return db.property.findMany({
    where: { userId: session.user.id },
    select: { id: true, title: true, slug: true, price: true, status: true, images: true, city: true, listingFor: true, bedrooms: true, area: true, views: true, inquiryCount: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getOwnerInquiries() {
  const session = await requireSession(["OWNER"])
  return db.inquiry.findMany({
    where: { property: { userId: session.user.id } },
    include: {
      property: { select: { id: true, title: true, images: true } },
      buyer: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, profileImage: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

// ── Builder ────────────────────────────────────────────────────────────────────
export async function getBuilderProjects() {
  const session = await requireSession(["BUILDER"])
  const profile = await db.builderProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return []
  return db.project.findMany({
    where: { builderId: profile.id },
    include: { properties: { select: { id: true, status: true, price: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getBuilderInquiries() {
  const session = await requireSession(["BUILDER"])
  return db.inquiry.findMany({
    where: { property: { userId: session.user.id } },
    include: {
      property: { select: { id: true, title: true, project: { select: { title: true } } } },
      buyer: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, profileImage: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

// ── Admin / Superadmin ─────────────────────────────────────────────────────────
export async function getAdminStats() {
  const session = await requireSession(["ADMIN", "SUPERADMIN"])
  const [users, properties, inquiries, pendingProperties] = await Promise.all([
    db.user.count(),
    db.property.count(),
    db.inquiry.count(),
    db.property.count({ where: { status: "PENDING_APPROVAL" } }),
  ])
  return { users, properties, inquiries, pendingProperties }
}

export async function getAllUsers(role?: string, search?: string) {
  const session = await requireSession(["ADMIN", "SUPERADMIN"])
  return db.user.findMany({
    where: {
      ...(role ? { role: role as any } : {}),
      ...(search ? { OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName:  { contains: search, mode: "insensitive" } },
        { email:     { contains: search, mode: "insensitive" } },
      ]} : {}),
    },
    select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, status: true, profileImage: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  })
}

export async function updateUserStatus(userId: string, status: "ACTIVE" | "SUSPENDED" | "INACTIVE") {
  const session = await requireSession(["ADMIN", "SUPERADMIN"])
  await db.user.update({ where: { id: userId }, data: { status } })
  revalidatePath("/dashboard/admin/users")
  return { success: true }
}

export async function getPendingProperties() {
  const session = await requireSession(["ADMIN", "SUPERADMIN"])
  return db.property.findMany({
    where: { status: "PENDING_APPROVAL" },
    include: { owner: { select: { firstName: true, lastName: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function approveProperty(propertyId: string) {
  const session = await requireSession(["ADMIN", "SUPERADMIN"])
  await db.property.update({
    where: { id: propertyId },
    data: { status: "ACTIVE", approvedAt: new Date(), approvedById: session.user.id },
  })
  revalidatePath("/dashboard/admin/properties")
  return { success: true }
}

export async function getSupportTickets() {
  const session = await requireSession(["ADMIN", "SUPERADMIN"])
  return db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 50 })
}

export async function getFeatureFlags() {
  await requireSession(["SUPERADMIN"])
  return db.featureFlag.findMany({ orderBy: { key: "asc" } })
}

export async function toggleFeatureFlag(key: string, enabled: boolean) {
  await requireSession(["SUPERADMIN"])
  await db.featureFlag.update({ where: { key }, data: { enabled } })
  revalidatePath("/dashboard/superadmin/features")
  return { success: true }
}
