import type { Metadata } from "next";
import Link from "next/link";
import { requirePageActor } from "@/features/auth/page-access";
import { getMyFavorites } from "@/features/products/data";
import { Header, Footer } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { FavoriteButton } from "@/components/favorite-button";
export const metadata: Metadata = {
  title: "Không gian của tôi",
  robots: { index: false, follow: false },
};
export default async function DashboardPage() {
  const actor = await requirePageActor("/dashboard");
  const favorites = await getMyFavorites();
  return (
    <>
      <Header actor={actor} />
      <main id="main" className="container dashboard-page">
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">KHÔNG GIAN CỦA TÔI</span>
            <h1>
              Chào {actor.name.split(" ").slice(-1)[0]},<br />
              <em>hôm nay bạn chọn gì?</em>
            </h1>
            <p>Những lựa chọn bạn lưu, ở một nơi dành riêng cho bạn.</p>
          </div>
          <div className="profile-card">
            <span className="profile-avatar">{actor.name.slice(0, 1)}</span>
            <strong>{actor.name}</strong>
            <span>{actor.email || "Đã kết nối qua GitHub"}</span>
            <span className="role-badge">
              {actor.role === "admin" ? "Quản trị viên" : "Thành viên"}
            </span>
            {actor.role === "admin" && (
              <Link href="/admin/products" className="text-link">
                Quản lý sản phẩm ↗
              </Link>
            )}
          </div>
        </div>
        <div className="section-heading saved-heading">
          <h2>
            Đã lưu <span className="count-pill">{favorites.length}</span>
          </h2>
          <Link className="text-link" href="/products">
            Khám phá thêm ↗
          </Link>
        </div>
        {favorites.length ? (
          <div className="product-grid">
            {favorites.map(({ product }) => (
              <div key={product.id}>
                <ProductCard product={product} />
                <div className="favorite-control">
                  <FavoriteButton id={product.id} initialSaved />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="saved-empty">
            <span aria-hidden="true">♡</span>
            <h3>Một góc trống, nhiều khả năng.</h3>
            <p>Lưu sản phẩm bạn thích để bắt đầu bộ sưu tập của riêng mình.</p>
            <Link href="/products" className="button-primary">
              Khám phá sản phẩm ↗
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
