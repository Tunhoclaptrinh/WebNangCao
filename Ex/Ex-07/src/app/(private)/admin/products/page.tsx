import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/header";
import { requirePageActor } from "@/features/auth/page-access";
import { getAdminProducts } from "@/features/products/data";
import { AdminTable } from "@/components/admin-table";
export const metadata: Metadata = {
  title: "Quản lý sản phẩm",
  robots: { index: false, follow: false },
};
export default async function AdminProductsPage() {
  const actor = await requirePageActor("/admin/products", "product:write");
  const products = await getAdminProducts();
  const stats = [
    {
      label: "Tổng sản phẩm",
      value: products.length.toString().padStart(2, "0"),
    },
    {
      label: "Sản phẩm còn hàng",
      value: products
        .filter((p) => p.stock > 0)
        .length.toString()
        .padStart(2, "0"),
    },
    {
      label: "Danh mục",
      value: new Set(products.map((p) => p.category)).size
        .toString()
        .padStart(2, "0"),
    },
  ];
  return (
    <>
      <Header actor={actor} />
      <main id="main" className="container admin-page">
        <div className="section-heading">
          <div>
            <span className="eyebrow">KHU VỰC QUẢN TRỊ</span>
            <h1>Quản lý sản phẩm</h1>
            <p>Cập nhật giá và tồn kho cho bộ sưu tập DevWorkspace.</p>
          </div>
          <Link className="button-outline" href="/products">
            Xem cửa hàng ↗
          </Link>
        </div>
        <div className="admin-stats">
          {stats.map((stat, index) => (
            <div key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>0{index + 1}</small>
            </div>
          ))}
        </div>
        <div className="section-heading admin-table-heading">
          <h2>Bộ sưu tập hiện tại</h2>
          <span>{products.length} sản phẩm</span>
        </div>
        <AdminTable
          products={products.map((p) => ({
            ...p,
            updatedAt: p.updatedAt.toISOString(),
          }))}
        />
      </main>
      <Footer />
    </>
  );
}
