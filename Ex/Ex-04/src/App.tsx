import { useState } from 'react';
import { ConfigProvider, App as AntApp, Layout } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Navbar } from './components/Navbar.tsx';
import { TechBanner } from './components/TechBanner.tsx';
import { ProductList } from './features/products/ProductList.tsx';
import { CartDrawer } from './features/cart/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { FavoritesDrawer } from './features/favorites/FavoritesDrawer.tsx';
import { FavoriteComparisonCard } from './features/favorites/FavoriteComparisonCard.tsx';
import { FavoritesProvider } from './context/FavoritesContext.tsx';
import type { StateEngine } from './types/favoriteTypes.ts';

const { Content, Footer } = Layout;

export default function App() {
  const [dataSource, setDataSource] = useState<'thunk' | 'rtk-query'>('thunk');
  const [engine, setEngine] = useState<StateEngine>('zustand');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#7c3aed',
          colorInfo: '#7c3aed',
          colorSuccess: '#16a34a',
          colorWarning: '#d97706',
          colorError: '#dc2626',
          colorBgBase: '#ffffff',
          colorBgLayout: '#f8fafc',
          colorTextBase: '#0f172a',
          borderRadius: 6,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <AntApp>
        <FavoritesProvider>
          <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header thanh điều hướng */}
            <Navbar
              dataSource={dataSource}
              setDataSource={setDataSource}
              engine={engine}
              setEngine={setEngine}
              onOpenFavorites={() => setIsFavoritesOpen(true)}
            />

            {/* Nội dung chính */}
            <Content style={{ padding: '24px', maxWidth: 1320, width: '100%', margin: '0 auto' }}>
              {/* Banner tóm tắt kiến trúc kỹ thuật Buổi 4 */}
              <TechBanner />

              {/* ⭐ Card Nhận Xét Kỹ Thuật (5-7 dòng) So Sánh Zustand vs Redux Toolkit theo đề bài */}
              <FavoriteComparisonCard />

              {/* Danh sách sản phẩm với nút FavoriteButton & Thêm Giỏ Hàng */}
              <ProductList
                dataSource={dataSource}
                setDataSource={setDataSource}
                engine={engine}
              />
            </Content>

            {/* Drawer Sản Phẩm Yêu Thích (Wishlist) */}
            <FavoritesDrawer
              isOpen={isFavoritesOpen}
              onClose={() => setIsFavoritesOpen(false)}
              engine={engine}
            />

            {/* Drawer Giỏ Hàng trượt ra từ bên phải */}
            <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

            {/* Modal xác nhận đặt hàng */}
            <CheckoutModal
              isOpen={isCheckoutOpen}
              onClose={() => setIsCheckoutOpen(false)}
            />

            {/* Footer thông tin môn học & sinh viên */}
            <Footer
              style={{
                textAlign: 'center',
                background: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                padding: '24px 20px',
                marginTop: 'auto',
              }}
            >
              <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>
                    Lập trình Web Nâng Cao (LTWNC) • Bài tập tuần 4 • Lớp: <code>RIPT1411-20261-02</code>
                  </p>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                    Học viện Công nghệ Bưu chính Viễn thông (PTIT) • Giảng viên: ThS. Ngô Văn Nhận
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>
                    Sinh viên: <strong>Nguyễn Tiến Tuấn</strong> (MSV: <code style={{ color: '#7c3aed' }}>B23DCCC173</code>)
                  </p>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                    Zustand 5.x Store • Advanced Context API • Redux Toolkit 2.x • Ant Design Light
                  </p>
                </div>
              </div>
            </Footer>
          </Layout>
        </FavoritesProvider>
      </AntApp>
    </ConfigProvider>
  );
}
