import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page    = parseInt(searchParams.get("page") || "1")
    const limit   = parseInt(searchParams.get("limit") || "12")
    const city    = searchParams.get("city") || undefined
    const type    = searchParams.get("type") || undefined
    const lFor    = searchParams.get("listingFor") || undefined
    const status  = searchParams.get("status") || "ACTIVE"
    const featured = searchParams.get("featured") === "true"

    // In production, query Prisma DB
    // const properties = await db.property.findMany({ where:{ city, type:type as any, listingFor:lFor as any, status:status as any, ...(featured && {featured:true}) }, skip:(page-1)*limit, take:limit, orderBy:{createdAt:"desc"} })
    // For now, return mock data shape
    return NextResponse.json({ success:true, data:[], total:0, page, limit, totalPages:0 })
  } catch (err) {
    return NextResponse.json({ error:"Failed to fetch properties" }, { status:500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error:"Unauthorized" }, { status:401 })
    const body = await req.json()
    // const property = await db.property.create({ data:{ ...body, userId:session.user.id, status:"PENDING_APPROVAL" } })
    return NextResponse.json({ success:"Property submitted for review" }, { status:201 })
  } catch (err) {
    return NextResponse.json({ error:"Failed to create property" }, { status:500 })
  }
}
