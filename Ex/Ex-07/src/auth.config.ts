import type { NextAuthConfig } from "next-auth";
import { normalizeRole } from "@/features/auth/permissions";
// Edge-safe configuration: no Prisma or password hashing in Middleware.
export default {
  providers: [],
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = normalizeRole(user.role);
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id ?? "";
      session.user.role = normalizeRole(token.role);
      return session;
    },
  },
} satisfies NextAuthConfig;
