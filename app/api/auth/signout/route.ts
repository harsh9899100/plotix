import { signOut } from "@/lib/auth"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export async function POST() {
  await signOut({ redirect: false })
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
}
