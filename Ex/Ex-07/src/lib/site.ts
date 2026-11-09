const configured = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const site = {
  name: "DevWorkspace",
  url: new URL(configured).origin,
  description:
    "Thiết bị được chọn lọc cho một góc làm việc tốt hơn. Màn hình, bàn phím, âm thanh và phụ kiện từ DevWorkspace.",
};
export const absoluteUrl = (path: string) => new URL(path, site.url).toString();
export const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
export function safeRedirect(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  )
    return "/dashboard";
  try {
    const url = new URL(value, site.url);
    return url.origin === site.url && !url.pathname.startsWith("/login")
      ? url.pathname + url.search
      : "/dashboard";
  } catch {
    return "/dashboard";
  }
}
