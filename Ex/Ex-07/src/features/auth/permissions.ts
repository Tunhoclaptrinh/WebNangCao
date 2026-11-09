export type Role = "admin" | "user";
export type Permission = "product:write" | "favorites:write" | "dashboard:read";
export const normalizeRole = (role: unknown): Role =>
  role === "admin" ? "admin" : "user";
const permissions: Record<Role, readonly Permission[]> = {
  admin: ["product:write", "favorites:write", "dashboard:read"],
  user: ["favorites:write", "dashboard:read"],
};
export const can = (role: Role, permission: Permission): boolean =>
  permissions[role].includes(permission);
export function routeAccess(
  pathname: string,
  role?: Role,
): "allow" | "login" | "forbidden" {
  const admin = pathname === "/admin" || pathname.startsWith("/admin/");
  const privatePage =
    admin || pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  if (!privatePage) return "allow";
  if (!role) return "login";
  return admin && !can(role, "product:write") ? "forbidden" : "allow";
}
