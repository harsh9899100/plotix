// lib/tokens.ts
import { db } from "@/lib/db"
import crypto from "crypto"

export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 3_600_000) // 1 hour

  const existing = await db.verificationToken.findFirst({ where: { identifier: email } })
  if (existing) await db.verificationToken.delete({ where: { token: existing.token } })

  return db.verificationToken.create({ data: { identifier: email, token, expires } })
}

export async function generatePasswordResetToken(email: string) {
  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 3_600_000)

  const existing = await db.passwordResetToken.findFirst({ where: { email } })
  if (existing) await db.passwordResetToken.delete({ where: { id: existing.id } })

  return db.passwordResetToken.create({ data: { email, token, expires } })
}
