import "next-auth/jwt";
import type { DefaultSession } from "next-auth";
import type { Role } from "@/features/auth/permissions";
declare module "next-auth" {
  interface Session {
    user: { id: string; role: Role } & DefaultSession["user"];
  }
  interface User {
    role: Role;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}

// Auth.js core owns the token type used by NextAuth callbacks.
declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}
