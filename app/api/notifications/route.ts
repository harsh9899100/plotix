import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error:"Unauthorized" }, { status:401 })
    // const notifs = await db.notification.findMany({ where:{ userId:session.user.id }, orderBy:{ createdAt:"desc" }, take:50 })
    return NextResponse.json({ success:true, data:[] })
  } catch {
    return NextResponse.json({ error:"Failed to fetch notifications" }, { status:500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error:"Unauthorized" }, { status:401 })
    const { ids } = await req.json()
    // await db.notification.updateMany({ where:{ id:{ in:ids }, userId:session.user.id }, data:{ isRead:true } })
    return NextResponse.json({ success:"Notifications marked as read" })
  } catch {
    return NextResponse.json({ error:"Failed to update" }, { status:500 })
  }
}
