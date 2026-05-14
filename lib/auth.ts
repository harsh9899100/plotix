// lib/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { LoginSchema } from "@/lib/validations/auth"
import type { UserRole } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date(), status: "ACTIVE" },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true
      const existingUser = await db.user.findUnique({ where: { id: user.id! } })
      if (!existingUser) return false
      if (existingUser.status === "SUSPENDED") return false
      // Auto-verify email if not already done (dev/demo convenience)
      if (!existingUser.emailVerified) {
        await db.user.update({ where: { id: user.id! }, data: { emailVerified: new Date() } })
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      if (token.sub) {
        const dbUser = await db.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true, role: true, status: true,
            firstName: true, lastName: true,
            profileImage: true, email: true,
          },
        })
        if (dbUser) {
          token.role    = dbUser.role
          token.status  = dbUser.status
          token.firstName    = dbUser.firstName
          token.lastName     = dbUser.lastName
          token.profileImage = dbUser.profileImage
          token.email        = dbUser.email
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id           = token.sub
        session.user.role         = token.role as UserRole
        session.user.status       = token.status as string
        session.user.firstName    = token.firstName as string
        session.user.lastName     = token.lastName as string
        session.user.profileImage = token.profileImage as string
      }
      return session
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const validated = LoginSchema.safeParse(credentials)
        if (!validated.success) return null
        const { email, password } = validated.data
        const user = await db.user.findUnique({
          where: { email: email.toLowerCase() },
        })
        if (!user || !user.password) return null
        const passwordsMatch = await bcrypt.compare(password, user.password)
        if (!passwordsMatch) return null
        return user
      },
    }),
  ],
})

declare module "next-auth" {
  interface User {
    role?: UserRole
    status?: string
    firstName?: string
    lastName?: string
    profileImage?: string
  }
  interface Session {
    user: User & {
      id: string
      role: UserRole
      status: string
      firstName: string
      lastName: string
      profileImage?: string
    }
  }
}