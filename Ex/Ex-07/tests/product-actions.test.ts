/** @jest-environment node */
import { db } from "@/lib/db";
import { requireActor, AccessError } from "@/features/auth/guards";
import {
  updateProduct,
  deleteProduct,
  toggleFavorite,
} from "@/features/products/actions";
import { revalidatePath, revalidateTag } from "next/cache";
jest.mock("@/lib/db", () => ({
  db: {
    product: {
      findUnique: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    favorite: { upsert: jest.fn(), deleteMany: jest.fn() },
  },
}));
jest.mock("@/features/auth/guards", () => {
  const original = jest.requireActual<typeof import("@/features/auth/guards")>(
    "@/features/auth/guards",
  );
  return { ...original, requireActor: jest.fn() };
});
jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));
const guard = jest.mocked(requireActor);
const product = jest.mocked(db.product);
const favorite = jest.mocked(db.favorite);
const input = {
  id: "prod-01",
  price: 1000000,
  stock: 5,
  updatedAt: "2026-11-09T00:00:00.000Z",
};
beforeEach(() => {
  jest.resetAllMocks();
  guard.mockResolvedValue({
    id: "session-user",
    name: "Tuấn",
    role: "admin",
    email: null,
  });
});
test.each(["UNAUTHENTICATED", "FORBIDDEN"] as const)(
  "direct delete call rejects %s before DB mutation",
  async (code) => {
    guard.mockRejectedValue(new AccessError(code));
    const result = await deleteProduct("prod-01");
    expect(result.ok).toBe(false);
    expect(product.deleteMany).not.toHaveBeenCalled();
    expect(product.findUnique).not.toHaveBeenCalled();
  },
);
test("direct update call rejects user without trusting payload role", async () => {
  guard.mockRejectedValue(new AccessError("FORBIDDEN"));
  expect((await updateProduct({ ...input, role: "admin" })).ok).toBe(false);
  expect(product.updateMany).not.toHaveBeenCalled();
});
test.each([
  { ...input, price: -10 },
  { ...input, stock: 1.5 },
  { ...input, id: "../../../users" },
  { ...input, updatedAt: "today" },
])("invalid update is rejected: %p", async (value) => {
  expect((await updateProduct(value)).ok).toBe(false);
  expect(product.updateMany).not.toHaveBeenCalled();
});
test("admin update mutates persisted data and invalidates public cache", async () => {
  product.findUnique.mockResolvedValue({ slug: "a-product" } as never);
  product.updateMany.mockResolvedValue({ count: 1 });
  expect((await updateProduct(input)).ok).toBe(true);
  expect(guard).toHaveBeenCalledWith("product:write");
  expect(product.updateMany).toHaveBeenCalledWith({
    where: { id: input.id, updatedAt: new Date(input.updatedAt) },
    data: { price: input.price, stock: input.stock },
  });
  expect(revalidateTag).toHaveBeenCalledWith("products");
  expect(revalidatePath).toHaveBeenCalledWith("/products/a-product");
});
test("conflicting stale edit is not reported successful", async () => {
  product.findUnique.mockResolvedValue({ slug: "a-product" } as never);
  product.updateMany.mockResolvedValue({ count: 0 });
  expect(await updateProduct(input)).toMatchObject({
    ok: false,
    message: expect.stringContaining("đã thay đổi"),
  });
});
test("updating missing product returns a useful result", async () => {
  product.findUnique.mockResolvedValue(null);
  expect((await updateProduct(input)).ok).toBe(false);
});
test("deletion rejects malformed and missing IDs", async () => {
  expect((await deleteProduct("bad")).ok).toBe(false);
  product.findUnique.mockResolvedValue(null);
  expect((await deleteProduct("prod-01")).ok).toBe(false);
});
test("admin deletion invalidates detail, catalogue and dashboard", async () => {
  product.findUnique.mockResolvedValue({ slug: "a-product" } as never);
  product.deleteMany.mockResolvedValue({ count: 1 });
  expect((await deleteProduct("prod-01")).ok).toBe(true);
  expect(product.deleteMany).toHaveBeenCalledWith({ where: { id: "prod-01" } });
  expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
});
test("favorites bind ownership to session, ignoring a supplied user ID", async () => {
  product.findUnique.mockResolvedValue({ id: "prod-01" } as never);
  expect((await toggleFavorite("prod-01", true)).ok).toBe(true);
  expect(favorite.upsert).toHaveBeenCalledWith({
    where: {
      userId_productId: { userId: "session-user", productId: "prod-01" },
    },
    create: { userId: "session-user", productId: "prod-01" },
    update: {},
  });
});
test("unfavorite deletes only current user's row", async () => {
  expect((await toggleFavorite("prod-01", false)).ok).toBe(true);
  expect(favorite.deleteMany).toHaveBeenCalledWith({
    where: { userId: "session-user", productId: "prod-01" },
  });
});
test("missing product and invalid favorite input are rejected", async () => {
  product.findUnique.mockResolvedValue(null);
  expect((await toggleFavorite("prod-01", true)).ok).toBe(false);
  expect((await toggleFavorite("bad", true)).ok).toBe(false);
});
test("guest favorite mutation is denied", async () => {
  guard.mockRejectedValue(new AccessError("UNAUTHENTICATED"));
  expect((await toggleFavorite("prod-01", true)).ok).toBe(false);
  expect(favorite.upsert).not.toHaveBeenCalled();
});
test("unexpected database failures propagate to error boundary", async () => {
  guard.mockRejectedValue(new Error("database unavailable"));
  await expect(deleteProduct("prod-01")).rejects.toThrow(
    "database unavailable",
  );
  await expect(updateProduct(input)).rejects.toThrow("database unavailable");
  await expect(toggleFavorite("prod-01", true)).rejects.toThrow(
    "database unavailable",
  );
});
