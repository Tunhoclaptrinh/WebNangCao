import { test, expect, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const evidence = "docs/evidence/screenshots";
const runtimeErrors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});
test.afterEach(({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});
async function shot(page: Page, name: string) {
  await expect(page.locator(".loading-page")).toHaveCount(0);
  await expect(page.locator("main h1")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await mkdir(evidence, { recursive: true });
  await page.screenshot({ path: `${evidence}/${name}.png`, fullPage: true });
}
async function login(page: Page, role: "admin" | "user") {
  await page.goto("/login");
  await page
    .getByLabel("Email", { exact: true })
    .fill(`${role}@devworkspace.local`);
  await page.getByLabel("Mật khẩu", { exact: true }).fill("Demo@12345");
  await page.getByRole("button", { name: /Đăng nhập bằng email/ }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
test("public pages render and catalogue filters/sorts work", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Một góc nhỏ",
  );
  await shot(page, "01-home-desktop");
  await page.goto("/products");
  await expect(
    page.getByRole("heading", { name: "Keychron Q1" }),
  ).toBeVisible();
  await shot(page, "02-catalogue-desktop");
  await page.getByRole("button", { name: "Âm thanh", exact: true }).click();
  await expect(
    page.locator(".catalogue-meta p").filter({ hasText: "2 sản phẩm" }),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "Tìm sản phẩm" }).fill("SONY");
  await expect(
    page.getByRole("heading", { name: "Sony WH-1000XM5" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Marshall Emberton II" }),
  ).toHaveCount(0);
});
test("server HTML contains full SEO on both public target pages and OG returns PNG", async ({
  request,
}) => {
  for (const path of ["/products", "/products/keychron-q1"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(
      `rel="canonical" href="http://localhost:3000${path}"`,
    );
    expect(html).toContain('property="og:image"');
    expect(html).toContain('type="application/ld+json"');
    const og = html.match(/property="og:image" content="([^"]+)"/);
    expect(og).not.toBeNull();
    const url = new URL(og![1].replaceAll("&amp;", "&"));
    const image = await request.get(url.pathname + url.search);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
    const imageBody = await image.body();
    expect(imageBody.readUInt32BE(16)).toBe(1200);
    expect(imageBody.readUInt32BE(20)).toBe(630);
  }
  const detail = await (await request.get("/products/keychron-q1")).text();
  expect(detail).toContain('"@type":"Product"');
  expect(detail).toContain('"@type":"BreadcrumbList"');
});
test("guests are redirected by Middleware and API rejects unauthorized data", async ({
  page,
  request,
}) => {
  await page.goto("/admin/products");
  await expect(page).toHaveURL(/\/login\?callbackUrl=/);
  await expect(
    page.getByRole("heading", { name: "Đăng nhập", exact: true }),
  ).toBeVisible();
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?callbackUrl=/);
  expect((await request.get("/api/me/favorites")).status()).toBe(401);
  await shot(page, "03-login-desktop");
});
test("wrong credentials fail without a session", async ({ page }) => {
  await page.goto("/login");
  await page
    .getByLabel("Email", { exact: true })
    .fill("user@devworkspace.local");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("wrongPassword123");
  await page.getByRole("button", { name: /Đăng nhập bằng email/ }).click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Email hoặc mật khẩu không đúng" }),
  ).toContainText("Email hoặc mật khẩu không đúng");
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("button", { name: /Đăng nhập với GitHub/ }),
  ).toBeDisabled();
});
test("user login, server header role, forbidden admin, favorites and logout", async ({
  page,
}) => {
  await login(page, "user");
  await expect(page.locator("header")).toContainText("Thành viên");
  await page.goto("/admin/products");
  await expect(page).toHaveURL(/\/403$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "chưa có quyền",
  );
  await shot(page, "04-forbidden");
  await page.goto("/products/keychron-q1");
  await page
    .getByRole("button", { name: "Lưu vào không gian của tôi" })
    .click();
  await expect(
    page.getByRole("button", { name: "Đã lưu sản phẩm" }),
  ).toBeVisible();
  await shot(page, "05-product-desktop");
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Keychron Q1" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await shot(page, "06-dashboard-user");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Keychron Q1" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Đăng xuất" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?callbackUrl=/);
});
test("admin persists edits, public cache refreshes, deletes real product", async ({
  page,
}) => {
  await login(page, "admin");
  await expect(page.getByRole("heading", { name: "Keychron Q1" })).toHaveCount(
    0,
  );
  await page.getByRole("link", { name: "Quản lý sản phẩm" }).click();
  await expect(page).toHaveURL(/\/admin\/products$/);
  await expect(page.locator("header")).toContainText("Quản trị viên");
  await shot(page, "07-admin-desktop");
  await page
    .getByRole("button", { name: "Sửa Keychron Q1", exact: true })
    .click();
  await page.getByLabel("Giá bán (VNĐ)").fill("3990000");
  await page.getByLabel("Số lượng tồn kho").fill("17");
  await shot(page, "08-admin-edit");
  await page.getByRole("button", { name: "Lưu thay đổi" }).click();
  await expect(
    page.getByText("Đã cập nhật sản phẩm.", { exact: true }),
  ).toBeVisible();
  await page.reload();
  const row = page.getByRole("row").filter({ hasText: "Keychron Q1" });
  await expect(row).toContainText("3.990.000");
  await expect(row).toContainText("17 sản phẩm");
  await page.goto("/products/keychron-q1");
  await expect(page.locator(".detail-price")).toContainText("3.990.000");
  await page.goto("/admin/products");
  await page
    .getByRole("button", { name: "Xóa Baseus Monitor Light", exact: true })
    .click();
  await page.getByRole("button", { name: "Xóa sản phẩm", exact: true }).click();
  await expect(
    page.getByText("Đã xoá sản phẩm.", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("row").filter({ hasText: "Baseus Monitor Light" }),
  ).toHaveCount(0);
  await page.goto("/products/baseus-monitor-light");
  await expect(
    page.getByRole("heading", { name: "Góc này chưa có gì." }),
  ).toBeVisible();
});
test("mobile layouts have no horizontal overflow and usable navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [path, name] of [
    ["/", "09-home-mobile"],
    ["/products", "10-catalogue-mobile"],
    ["/products/sony-wh-1000xm5", "11-product-mobile"],
    ["/login", "12-login-mobile"],
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await shot(page, name);
  }
});
test("robots, sitemap and missing routes are correct", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /admin/");
  expect(robots).toContain("Sitemap:");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/products/keychron-q1");
  expect(sitemap).not.toContain("/dashboard");
  expect((await request.get("/products/does-not-exist")).status()).toBe(404);
});
