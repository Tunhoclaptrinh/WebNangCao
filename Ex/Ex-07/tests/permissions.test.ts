import { can, normalizeRole, routeAccess } from "@/features/auth/permissions";
describe("RBAC policy", () => {
  test("only admin can mutate products", () => {
    expect(can("admin", "product:write")).toBe(true);
    expect(can("user", "product:write")).toBe(false);
  });
  test("both roles can manage their favorites", () => {
    expect(can("user", "favorites:write")).toBe(true);
    expect(can("admin", "dashboard:read")).toBe(true);
  });
  test.each([undefined, null, "root", "ADMIN", {}, 1])(
    "untrusted role %p defaults to user",
    (value) => expect(normalizeRole(value)).toBe("user"),
  );
  test("admin remains admin", () =>
    expect(normalizeRole("admin")).toBe("admin"));
  test.each(["/admin", "/admin/products", "/dashboard", "/dashboard/settings"])(
    "guests cannot access %s",
    (path) => expect(routeAccess(path)).toBe("login"),
  );
  test("user cannot access admin subtree", () =>
    expect(routeAccess("/admin/products", "user")).toBe("forbidden"));
  test("valid roles can access their routes", () => {
    expect(routeAccess("/admin", "admin")).toBe("allow");
    expect(routeAccess("/dashboard", "user")).toBe("allow");
  });
  test("similarly named public routes remain public", () =>
    expect(routeAccess("/administrator")).toBe("allow"));
});
