/** @jest-environment node */
import { verifyCredentials } from "@/features/auth/credentials";
import { db } from "@/lib/db";
import { compare } from "bcryptjs";
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("dummy-hash"),
  compare: jest.fn(),
}));
jest.mock("@/lib/db", () => ({
  db: {
    $transaction: jest.fn(),
    user: { findUnique: jest.fn() },
    loginAttempt: { deleteMany: jest.fn() },
  },
}));
const transaction = jest.mocked(db.$transaction);
const find = jest.mocked(db.user.findUnique);
const check = jest.mocked(compare);
beforeEach(() => {
  jest.resetAllMocks();
  transaction.mockResolvedValue(true);
});
test("invalid inputs do not query user DB", async () => {
  expect(
    await verifyCredentials({ email: "invalid", password: "short" }),
  ).toBeNull();
  expect(find).not.toHaveBeenCalled();
});
test("throttled account is rejected", async () => {
  transaction.mockResolvedValue(false);
  expect(
    await verifyCredentials({
      email: "a@example.com",
      password: "password123",
    }),
  ).toBeNull();
  expect(find).not.toHaveBeenCalled();
});
test("unknown account still performs password comparison", async () => {
  find.mockResolvedValue(null);
  check.mockResolvedValue(false as never);
  expect(
    await verifyCredentials({
      email: "a@example.com",
      password: "password123",
    }),
  ).toBeNull();
  expect(check).toHaveBeenCalled();
});
test("wrong password is rejected", async () => {
  find.mockResolvedValue({ passwordHash: "hash" } as never);
  check.mockResolvedValue(false as never);
  expect(
    await verifyCredentials({
      email: "a@example.com",
      password: "password123",
    }),
  ).toBeNull();
});
test("valid password returns only safe typed identity", async () => {
  find.mockResolvedValue({
    id: "u1",
    email: "a@example.com",
    name: "A",
    role: "admin",
    passwordHash: "hash",
  } as never);
  check.mockResolvedValue(true as never);
  expect(
    await verifyCredentials({
      email: "A@EXAMPLE.COM",
      password: "password123",
    }),
  ).toEqual({ id: "u1", email: "a@example.com", name: "A", role: "admin" });
  expect(db.loginAttempt.deleteMany).toHaveBeenCalled();
});

test("bcrypt cannot silently truncate a long Unicode password", async () => {
  expect(
    await verifyCredentials({
      email: "a@example.com",
      password: "ấ".repeat(30),
    }),
  ).toBeNull();
  expect(find).not.toHaveBeenCalled();
});
