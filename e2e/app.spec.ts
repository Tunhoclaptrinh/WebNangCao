import { test, expect } from "@playwright/test";
import path from "node:path";

const SCREENSHOT_DIR = path.join(process.cwd(), "docs/screenshots");

test.describe("Class Deadline Hub — Comprehensive E2E Tests", () => {
  test("1. Homepage (SSG) renders properly and captures screenshot", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Class Deadline Hub");
    await expect(page.getByText("INT1411")).toBeVisible();
    await expect(page.getByText("INT1340")).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "01-home-ssg.png"), fullPage: true });
  });

  test("2. Subject detail (SSG) pre-renders for Lập trình Web nâng cao", async ({ page }) => {
    await page.goto("/subjects/lap-trinh-web-nang-cao");
    await expect(page.locator("h1")).toContainText("Lập trình Web nâng cao");
    await expect(page.getByText("Phòng máy 302 - Nhà A2")).toBeVisible();
    await expect(page.getByText("ThS. Ngô Văn Nhận", { exact: true })).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "02-subjects-ssg.png"), fullPage: true });
  });

  test("3. Deadlines list (ISR) allows real-time debounce search & filtering", async ({ page }) => {
    await page.goto("/deadlines");
    await expect(page.locator("h1")).toContainText("Toàn Bộ Deadline");

    // Search filter
    const searchInput = page.getByPlaceholder("Tìm kiếm deadline, môn học, từ khóa...");
    await searchInput.fill("Next.js");
    await page.waitForTimeout(500); // debounce 300ms

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "03-deadlines-isr.png"), fullPage: true });
  });

  test("4. Deadline detail page (ISR with on-demand) renders requirements", async ({ page }) => {
    await page.goto("/deadlines/dl_01");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("Hình thức nộp:")).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "04-deadline-detail.png"), fullPage: true });
  });

  test("5. Login page with 1-click credential fill chips", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Đăng nhập Cổng Deadline")).toBeVisible();
    await expect(page.getByRole("button", { name: "Đăng nhập hệ thống" })).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "05-login-ptit.png"), fullPage: true });
  });

  test("6. Student login flow -> redirects to SSR Dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("admin@ptit.edu.vn hoặc sv@ptit.edu.vn").fill("sv@ptit.edu.vn");
    await page.getByPlaceholder("Mật khẩu tài khoản").fill("sv123456");
    await page.getByRole("button", { name: "Đăng nhập hệ thống" }).click();

    await page.waitForURL("**/dashboard", { timeout: 15000 });
    await expect(page.getByRole("heading", { name: /Nguyễn Tiến Tuấn/ })).toBeVisible();
    await expect(page.getByText("B23DCCC173", { exact: false }).first()).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "06-dashboard-student-ssr.png"), fullPage: true });
  });

  test("7. RBAC: Student accessing /admin is redirected to 403 Forbidden", async ({ page }) => {
    // Log in as student
    await page.goto("/login");
    await page.getByPlaceholder("admin@ptit.edu.vn hoặc sv@ptit.edu.vn").fill("sv@ptit.edu.vn");
    await page.getByPlaceholder("Mật khẩu tài khoản").fill("sv123456");
    await page.getByRole("button", { name: "Đăng nhập hệ thống" }).click();
    await page.waitForURL("**/dashboard", { timeout: 15000 });

    // Navigate to admin
    await page.goto("/admin");
    await page.waitForURL("**/403", { timeout: 15000 });
    await expect(page.getByText("403 — Từ chối truy cập")).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "08-forbidden-403.png"), fullPage: true });
  });

  test("8. Admin login flow -> accesses SSR Admin page with Ant Design table", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("admin@ptit.edu.vn hoặc sv@ptit.edu.vn").fill("admin@ptit.edu.vn");
    await page.getByPlaceholder("Mật khẩu tài khoản").fill("admin123");
    await page.getByRole("button", { name: "Đăng nhập hệ thống" }).click();

    await page.waitForURL("**/dashboard", { timeout: 15000 });
    await page.goto("/admin");
    await page.waitForURL("**/admin", { timeout: 15000 });

    await expect(page.getByText("Quản lý Deadline Lớp học")).toBeVisible();
    await expect(page.getByText("Thêm Deadline mới")).toBeVisible();

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "07-admin-ssr.png"), fullPage: true });
  });
});
