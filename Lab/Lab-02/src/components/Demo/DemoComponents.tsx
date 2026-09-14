/**
 * Demo components cho Lab-02
 * ProfilePage — Trang cá nhân (được bảo vệ bởi withAuth HOC)
 * ProductListDemo — Demo useFetch<T> với mock API
 */

import { withAuth } from "../../hoc/withAuth";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";

// ─── Định nghĩa type ───
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  rating: { rate: number; count: number };
}

// ─── Bài 1: ProfilePage bảo vệ bởi withAuth ───────────

interface ProfilePageProps {
  title?: string;
}

/** Trang profile thực — chỉ hiển thị khi đã đăng nhập */
function ProfilePage({ title = "Trang Cá Nhân" }: ProfilePageProps) {
  const { user } = useAuth();
  return (
    <div className="profile-card">
      <div className="profile-card__avatar">👤</div>
      <h3>{title}</h3>
      <p><strong>Tên:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Vai trò:</strong> {user?.role}</p>
      <div className="hoc-badge">
        🛡️ Component này được bảo vệ bởi <code>withAuth(ProfilePage)</code>
      </div>
    </div>
  );
}

/** ProfilePage được bọc bởi withAuth HOC */
export const ProtectedProfile = withAuth(ProfilePage);

// ─── Bài 3: ProductListDemo dùng useFetch ─────────────

/** Demo useFetch<T> với dữ liệu từ FakeStore API */
export function ProductListDemo() {
  const { data: products, loading, error, refetch } =
    useFetch<Product[]>("https://fakestoreapi.com/products?limit=6");

  return (
    <div className="fetch-demo">
      <div className="fetch-demo__header">
        <span className="hook-tag">useFetch&lt;Product[]&gt;</span>
        <button className="refetch-btn" onClick={refetch}>
          🔄 Refetch
        </button>
      </div>

      {loading && (
        <div className="fetch-loading">
          <div className="spinner" />
          <span>Đang gọi API...</span>
        </div>
      )}

      {error && (
        <div className="fetch-error">
          ⚠️ Lỗi: {error}
        </div>
      )}

      {!loading && !error && products && (
        <div className="products-mini-grid">
          {products.map((p) => (
            <div key={p.id} className="product-mini-card">
              <span className="product-mini-card__category">{p.category}</span>
              <p className="product-mini-card__title">
                {p.title.length > 40 ? p.title.slice(0, 40) + "..." : p.title}
              </p>
              <div className="product-mini-card__footer">
                <strong>${p.price}</strong>
                <span>⭐ {p.rating.rate} ({p.rating.count})</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
