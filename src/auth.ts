import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { authConfig } from "./auth.config";
import { verifyCredentials } from "@/features/auth/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "credentials",
      name: "Tài khoản PTIT",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email);
        const password = String(credentials.password);

        const verified = verifyCredentials(email, password);
        if (!verified) return null;

        return {
          id: verified.id,
          name: verified.name,
          email: verified.email,
          role: verified.role,
          studentId: verified.studentId,
        };
      },
    }),
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
      ? [
          GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
            profile(profile) {
              return {
                id: String(profile.id),
                name: profile.name || profile.login || "Thành viên GitHub",
                email: profile.email || `${profile.login}@github.com`,
                image: profile.avatar_url,
                role: "user" as const,
                studentId: "B23DCCC173",
              };
            },
          }),
        ]
      : []),
  ],
});
