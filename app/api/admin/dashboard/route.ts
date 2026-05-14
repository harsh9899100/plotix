import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || !["ADMIN","SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error:"Forbidden" }, { status:403 })
    }
    // In production: const stats = await db.$transaction([...])
    return NextResponse.json({
      success: true,
      data: {
        totalUsers: 3420, totalProperties: 8920, activeProperties: 7240,
        pendingApproval: 145, totalInquiries: 15680, platformRevenue: 24500000,
        newUsersThisMonth: 342, newPropertiesThisMonth: 218,
      }
    })
  } catch {
    return NextResponse.json({ error:"Failed to fetch stats" }, { status:500 })
  }
}
