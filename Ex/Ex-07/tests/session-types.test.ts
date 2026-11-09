/** @jest-environment node */
import config from "@/auth.config";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
test("JWT callback stores server identity and role", () => {
  const token = config.callbacks.jwt({
    token: {},
    user: { id: "u1", name: "Tuấn", role: "admin" },
  } as Parameters<typeof config.callbacks.jwt>[0]);
  expect(token).toMatchObject({ id: "u1", role: "admin" });
});
test("JWT callback ignores client-supplied session role changes", () => {
  const token: JWT = { id: "u1", role: "user" };
  const result = config.callbacks.jwt({
    token,
    trigger: "update",
    session: { role: "admin" },
  } as Parameters<typeof config.callbacks.jwt>[0]);
  expect(result.role).toBe("user");
});
test("session exposes typed identity and role without sensitive token fields", () => {
  const session: Session = {
    expires: "2026-12-01T00:00:00Z",
    user: { id: "", role: "user", name: "Tuấn" },
  };
  const result = config.callbacks.session({
    session,
    token: { id: "u1", role: "admin", access_token: "never-expose" },
  } as unknown as Parameters<typeof config.callbacks.session>[0]);
  expect(result.user).toMatchObject({ id: "u1", role: "admin" });
  expect(result).not.toHaveProperty("access_token");
});
