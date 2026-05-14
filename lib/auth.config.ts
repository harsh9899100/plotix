// lib/auth.config.ts
// Edge-safe auth config — used by middleware (cannot import Prisma or bcrypt).
// CRITICAL: The jwt callback MUST forward all existing token fields on every
// request, not just on first sign-in. Otherwise role/name/etc get dropped.
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

export default {
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({}),
  ],
  callbacks: {
    jwt({ token, user }) {
      // On first sign-in `user` is populated — copy custom fields into token.
      // On subsequent requests `user` is undefined — token already has the fields.
      if (user) {
        token.id           = user.id
        token.role         = (user as any).role         ?? token.role
        token.status       = (user as any).status       ?? token.status
        token.firstName    = (user as any).firstName    ?? token.firstName
        token.lastName     = (user as any).lastName     ?? token.lastName
        token.profileImage = (user as any).profileImage ?? token.profileImage
      }
      // Always return the full token so nothing is lost between requests.
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id           = token.sub           as string
        session.user.role         = token.role          as any
        session.user.status       = token.status        as string
        session.user.firstName    = token.firstName     as string
        session.user.lastName     = token.lastName      as string
        session.user.profileImage = token.profileImage  as string
      }
      return session
    },
  },
} satisfies NextAuthConfig