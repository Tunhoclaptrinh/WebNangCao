import "server-only";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { can, normalizeRole, type Permission, type Role } from "./permissions";
export class AccessError extends Error {
  constructor(public readonly code: "UNAUTHENTICATED" | "FORBIDDEN") {
    super(code);
  }
}
export interface Actor {
  id: string;
  name: string;
  role: Role;
  email: string | null;
}
export async function requireActor(
  permission: Permission = "dashboard:read",
): Promise<Actor> {
  const session = await auth();
  if (!session?.user.id) throw new AccessError("UNAUTHENTICATED");
  // Re-read current role: role revocation/deleted accounts take effect even with an old JWT.
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, role: true, email: true },
  });
  if (!user) throw new AccessError("UNAUTHENTICATED");
  const actor = { ...user, role: normalizeRole(user.role) };
  if (!can(actor.role, permission)) throw new AccessError("FORBIDDEN");
  return actor;
}
