import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { InquirySchema } from "@/lib/validations/auth"
import { sendInquiryNotification } from "@/lib/mail"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error:"Unauthorized" }, { status:401 })
    // const inquiries = await db.inquiry.findMany({ where:{ buyerId:session.user.id }, include:{ property:true }, orderBy:{ createdAt:"desc" } })
    return NextResponse.json({ success:true, data:[] })
  } catch (err) {
    return NextResponse.json({ error:"Failed to fetch inquiries" }, { status:500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = InquirySchema.safeParse(body)
    if (!validated.success) return NextResponse.json({ error:"Invalid fields", issues:validated.error.issues }, { status:400 })
    const session = await auth()
    // const inquiry = await db.inquiry.create({ data:{ ...validated.data, buyerId:session?.user?.id || "" } })
    // await sendInquiryNotification(agentEmail, agentName, validated.data.name, propertyTitle, validated.data.message)
    return NextResponse.json({ success:"Inquiry sent successfully" }, { status:201 })
  } catch (err) {
    return NextResponse.json({ error:"Failed to send inquiry" }, { status:500 })
  }
}
