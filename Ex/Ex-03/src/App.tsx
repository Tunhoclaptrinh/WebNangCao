import { useState } from 'react';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { Navbar } from './components/Navbar.tsx';
import { TechBanner } from './components/TechBanner.tsx';
import { Toast } from './components/Toast.tsx';
import { CartDrawer } from './features/cart/CartDrawer.tsx';
import { ProductList } from './features/products/ProductList.tsx';

export default function App() {
  const [dataSource, setDataSource] = useState<'thunk' | 'rtk-query'>('thunk');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleAddToCartSuccess = (productName: string) => {
    setToastMessage(`Đã thêm "${productName}" vào giỏ hàng!`);
  };

  return (
    <div className="app-shell">
      {/* Thanh điều hướng Navbar */}
      <Navbar dataSource={dataSource} setDataSource={setDataSource} />

      <main className="main-content">
        <div className="content-container">
          {/* Banner kiến trúc kỹ thuật */}
          <TechBanner />

          {/* Danh sách sản phẩm kết nối Redux Store */}
          <ProductList
            dataSource={dataSource}
            setDataSource={setDataSource}
            onAddToCartSuccess={handleAddToCartSuccess}
          />
        </div>
      </main>

      {/* Slide-over Drawer Giỏ hàng */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      {/* Modal xác nhận đặt hàng */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Toast thông báo nhanh */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Footer bản quyền & thông tin học phần */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-left">
            <p className="footer-title">
              Học phần: <strong>Lập trình Web Nâng Cao (LTWNC)</strong> — Học kỳ 1 (2026 - 2027)
            </p>
            <p className="footer-sub">
              Học viện Công nghệ Bưu chính Viễn thông (PTIT) • Giảng viên: ThS. Ngô Văn Nhận
            </p>
          </div>
          <div className="footer-right">
            <p>
              Sinh viên: <strong>Nguyễn Tiến Tuấn</strong> — MSV: <code>B23DCCC173</code>
            </p>
            <p className="footer-tech">
              Redux Toolkit 2.x • RTK Query • TypeScript 5.x • React 19 • Feature-Based Architecture
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
