import "server-only";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types";

export interface SessionActor {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
}

export async function getCurrentActor(): Promise<SessionActor | null> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return null;

  return {
    id: session.user.id,
    name: session.user.name || "Thành viên",
    email: session.user.email,
    role: session.user.role || "user",
    studentId: session.user.studentId || "B23DCCC173",
  };
}

export async function requireUserActor(): Promise<SessionActor> {
  const actor = await getCurrentActor();
  if (!actor) {
    redirect("/login?callbackUrl=/dashboard");
  }
  return actor;
}

export async function requireAdminActor(): Promise<SessionActor> {
  const actor = await getCurrentActor();
  if (!actor) {
    redirect("/login?callbackUrl=/admin");
  }
  if (actor.role !== "admin") {
    redirect("/403");
  }
  return actor;
}
