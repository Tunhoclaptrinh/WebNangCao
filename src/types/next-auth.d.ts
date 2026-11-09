import "next-auth";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";
import type { UserRole } from "./index";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: UserRole;
    studentId?: string;
  }
  interface Session {
    user: {
      id: string;
      role: UserRole;
      studentId?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    studentId?: string;
  }
}
