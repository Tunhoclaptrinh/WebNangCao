import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { verifyCredentials } from "@/features/auth/credentials";
import { normalizeRole } from "@/features/auth/permissions";
export const githubConfigured = Boolean(
  process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
);
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GitHub,
    Credentials({
      credentials: { email: { type: "email" }, password: { type: "password" } },
      authorize: verifyCredentials,
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ account }) {
      // Credentials users are verified by authorize. OAuth identity is provider ID, never client email/role.
      return (
        account?.provider !== "github" || Boolean(account.providerAccountId)
      );
    },
    async jwt(params) {
      const token = await authConfig.callbacks.jwt(params);
      if (params.account?.provider === "github") {
        const githubId = params.account.providerAccountId;
        const user = await db.user.upsert({
          where: { githubId },
          create: {
            githubId,
            name: params.user.name || "Thành viên GitHub",
            role: "user",
          },
          update: { name: params.user.name || "Thành viên GitHub" },
        });
        token.id = user.id;
        token.role = normalizeRole(user.role);
      }
      return token;
    },
  },
});
