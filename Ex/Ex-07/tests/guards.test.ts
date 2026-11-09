/** @jest-environment node */
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { requireActor } from "@/features/auth/guards";
jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/db", () => ({ db: { user: { findUnique: jest.fn() } } }));
const mockAuth = jest.mocked(auth);
const mockFind = jest.mocked(db.user.findUnique);
const actor = {
  id: "u1",
  name: "Tuấn",
  role: "user",
  email: "user@test.local",
  passwordHash: null,
  githubId: null,
  createdAt: new Date(),
};
beforeEach(() => jest.resetAllMocks());
test("rejects a missing session without reading protected data", async () => {
  mockAuth.mockResolvedValue(null as never);
  await expect(requireActor()).rejects.toMatchObject({
    code: "UNAUTHENTICATED",
  });
  expect(mockFind).not.toHaveBeenCalled();
});
test("rejects deleted account despite existing cookie", async () => {
  mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } } as never);
  mockFind.mockResolvedValue(null);
  await expect(requireActor()).rejects.toMatchObject({
    code: "UNAUTHENTICATED",
  });
});
test("a stale admin JWT cannot override demotion in DB", async () => {
  mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } } as never);
  mockFind.mockResolvedValue(actor);
  await expect(requireActor("product:write")).rejects.toMatchObject({
    code: "FORBIDDEN",
  });
});
test("returns current actor from session identity only", async () => {
  mockAuth.mockResolvedValue({ user: { id: "u1", role: "user" } } as never);
  mockFind.mockResolvedValue({ ...actor, role: "admin" });
  await expect(requireActor("product:write")).resolves.toMatchObject({
    id: "u1",
    role: "admin",
  });
  expect(mockFind).toHaveBeenCalledWith(
    expect.objectContaining({ where: { id: "u1" } }),
  );
});
