import "server-only";
import { redirect } from "next/navigation";
import { requireActor, AccessError } from "./guards";
import type { Permission } from "./permissions";
export async function requirePageActor(
  path: string,
  permission: Permission = "dashboard:read",
) {
  try {
    return await requireActor(permission);
  } catch (error) {
    if (error instanceof AccessError)
      redirect(
        error.code === "FORBIDDEN"
          ? "/403"
          : `/login?callbackUrl=${encodeURIComponent(path)}`,
      );
    throw error;
  }
}
