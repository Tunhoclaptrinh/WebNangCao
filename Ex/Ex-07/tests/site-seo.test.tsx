import { render } from "@testing-library/react";
import { safeRedirect } from "@/lib/site";
import { JsonLd, serializeJsonLd } from "@/components/json-ld";
test.each([
  "https://evil.test",
  "//evil.test",
  "\\evil.test",
  "/\\evil.test",
  undefined,
  "/login?callbackUrl=/login",
])("rejects unsafe callback %p", (value) =>
  expect(safeRedirect(value)).toBe("/dashboard"),
);
test("preserves a safe internal path and query", () =>
  expect(safeRedirect("/products/keychron-q1?from=login")).toBe(
    "/products/keychron-q1?from=login",
  ));
test("JSON-LD prevents closing script injection while retaining valid JSON", () => {
  const payload = { name: "</script><script>alert(1)</script>" };
  const json = serializeJsonLd(payload);
  expect(json).not.toContain("<");
  expect(JSON.parse(json)).toEqual(payload);
  const { container } = render(<JsonLd data={payload} />);
  expect(container.querySelectorAll("script")).toHaveLength(1);
  expect(container.querySelector("script")?.type).toBe("application/ld+json");
});
