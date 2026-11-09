/** @jest-environment node */
import { redirect } from "next/navigation";
import { requireActor, AccessError } from "@/features/auth/guards";
import { requirePageActor } from "@/features/auth/page-access";
jest.mock("@/features/auth/guards", () => {
  const original = jest.requireActual<typeof import("@/features/auth/guards")>(
    "@/features/auth/guards",
  );
  return { ...original, requireActor: jest.fn() };
});
jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/db", () => ({ db: {} }));
jest.mock("next/navigation", () => ({
  redirect: jest.fn((path: string) => {
    throw new Error("REDIRECT:" + path);
  }),
}));
beforeEach(() => jest.clearAllMocks());
test("page check still rejects user when Middleware is bypassed", async () => {
  jest.mocked(requireActor).mockRejectedValue(new AccessError("FORBIDDEN"));
  await expect(
    requirePageActor("/admin/products", "product:write"),
  ).rejects.toThrow("REDIRECT:/403");
  expect(redirect).toHaveBeenCalledWith("/403");
});
test("guest page access preserves callback route", async () => {
  jest
    .mocked(requireActor)
    .mockRejectedValue(new AccessError("UNAUTHENTICATED"));
  await expect(requirePageActor("/dashboard")).rejects.toThrow(
    "REDIRECT:/login?callbackUrl=%2Fdashboard",
  );
});
