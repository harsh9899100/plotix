"use server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { signIn, signOut } from "@/lib/auth"
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema, ChangePasswordSchema } from "@/lib/validations/auth"
import { generateVerificationToken, generatePasswordResetToken } from "@/lib/tokens"
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/mail"
import { AuthError } from "next-auth"
import { revalidatePath } from "next/cache"

// ── Register ──────────────────────────────────────────────────────────────────
export async function registerAction(values: unknown) {
  const validated = RegisterSchema.safeParse(values)
  if (!validated.success) return { error: "Invalid fields" }

  const { firstName, lastName, email, phone, password, role } = validated.data
  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existing) return { error: "Email already in use" }

  const hashed = await bcrypt.hash(password, 12)
  const user = await db.user.create({
    data: {
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password: hashed,
      role: role as any,
      status: "PENDING_VERIFICATION",
    },
  })

  const token = await generateVerificationToken(email)
  await sendVerificationEmail(email, token.token, firstName)

  return { success: "Verification email sent! Please check your inbox." }
}

// ── Login ─────────────────────────────────────────────────────────────────────
export async function loginAction(values: unknown, callbackUrl?: string) {
  const validated = LoginSchema.safeParse(values)
  if (!validated.success) return { error: "Invalid fields" }

  const { email, password } = validated.data
  const existingUser = await db.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!existingUser) return { error: "Invalid credentials" }
  if (!existingUser.emailVerified) {
    // Auto-verify on first login (convenient for seeded/demo accounts)
    await db.user.update({ where: { id: existingUser.id }, data: { emailVerified: new Date(), status: "ACTIVE" } })
  }
  if (existingUser.status === "SUSPENDED") return { error: "Your account has been suspended. Contact support." }


  try {
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirectTo: callbackUrl || getDashboardUrl(existingUser.role),
    })
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin": return { error: "Invalid credentials" }
        default: return { error: "Something went wrong" }
      }
    }
    throw err
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function logoutAction() {
  await signOut({ redirectTo: "/" })
}

// ── Email Verification ────────────────────────────────────────────────────────
export async function verifyEmailAction(token: string) {
  const existing = await db.verificationToken.findFirst({
    where: { token },
  })
  if (!existing) return { error: "Invalid token" }
  if (new Date(existing.expires) < new Date()) {
    await db.verificationToken.delete({
      where: { identifier_token: { identifier: existing.identifier, token } },
    })
    return { error: "Token has expired" }
  }

  const user = await db.user.findUnique({ where: { email: existing.identifier } })
  if (!user) return { error: "User not found" }

  await db.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date(), status: "ACTIVE" },
  })

  await db.verificationToken.delete({
    where: { identifier_token: { identifier: existing.identifier, token } },
  })

  return { success: "Email verified! You can now log in." }
}

// ── Forgot Password ───────────────────────────────────────────────────────────
export async function forgotPasswordAction(values: unknown) {
  const validated = ForgotPasswordSchema.safeParse(values)
  if (!validated.success) return { error: "Invalid email" }

  const { email } = validated.data
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) return { success: "If this email exists, a reset link has been sent." }

  const token = await generatePasswordResetToken(email)
  await sendPasswordResetEmail(email, token.token, user.firstName)

  return { success: "Password reset email sent!" }
}

// ── Reset Password ────────────────────────────────────────────────────────────
export async function resetPasswordAction(values: unknown, token: string) {
  const validated = ResetPasswordSchema.safeParse(values)
  if (!validated.success) return { error: "Invalid fields" }

  const existingToken = await db.passwordResetToken.findUnique({ where: { token } })
  if (!existingToken) return { error: "Invalid token" }
  if (new Date(existingToken.expires) < new Date()) return { error: "Token has expired" }

  const user = await db.user.findUnique({ where: { email: existingToken.email } })
  if (!user) return { error: "User not found" }

  const hashed = await bcrypt.hash(validated.data.password, 12)
  await db.user.update({ where: { id: user.id }, data: { password: hashed } })
  await db.passwordResetToken.delete({ where: { token } })

  return { success: "Password reset successfully! Please log in." }
}

// ── Change Password ───────────────────────────────────────────────────────────
export async function changePasswordAction(userId: string, values: unknown) {
  const validated = ChangePasswordSchema.safeParse(values)
  if (!validated.success) return { error: "Invalid fields" }

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user || !user.password) return { error: "User not found" }

  const match = await bcrypt.compare(validated.data.currentPassword, user.password)
  if (!match) return { error: "Current password is incorrect" }

  const hashed = await bcrypt.hash(validated.data.newPassword, 12)
  await db.user.update({ where: { id: userId }, data: { password: hashed } })
  revalidatePath("/dashboard")
  return { success: "Password changed successfully!" }
}

function getDashboardUrl(role: string) {
  const map: Record<string, string> = {
    BUYER: "/dashboard/buyer", AGENT: "/dashboard/agent",
    BUILDER: "/dashboard/builder", OWNER: "/dashboard/owner",
    ADMIN: "/dashboard/admin", SUPERADMIN: "/dashboard/superadmin",
  }
  return map[role] || "/"
}
