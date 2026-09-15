import { useState } from 'react';
import { ConfigProvider, App as AntApp, Layout } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Navbar } from './components/Navbar.tsx';
import { TechBanner } from './components/TechBanner.tsx';
import { ProductList } from './features/products/ProductList.tsx';
import { CartDrawer } from './features/cart/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';

const { Content, Footer } = Layout;

export default function App() {
  const [dataSource, setDataSource] = useState<'thunk' | 'rtk-query'>('thunk');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          colorInfo: '#1677ff',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          colorBgBase: '#ffffff',
          colorBgLayout: '#f5f7fa',
          colorTextBase: '#1f2937',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <AntApp>
        <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
          {/* Header thanh điều hướng */}
          <Navbar dataSource={dataSource} setDataSource={setDataSource} />

          {/* Nội dung chính */}
          <Content style={{ padding: '24px', maxWidth: 1320, width: '100%', margin: '0 auto' }}>
            {/* Banner tóm tắt kiến trúc kỹ thuật */}
            <TechBanner />

            {/* Danh sách sản phẩm kết nối Redux Store */}
            <ProductList
              dataSource={dataSource}
              setDataSource={setDataSource}
            />
          </Content>

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
              borderTop: '1px solid #e5e7eb',
              padding: '24px 20px',
              marginTop: 'auto',
            }}
          >
            <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>
                  Lập trình Web Nâng Cao (LTWNC) • Lớp: <code>RIPT1411-20261-02</code>
                </p>
                <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '0.85rem' }}>
                  Học viện Công nghệ Bưu chính Viễn thông (PTIT) • GV: ThS. Ngô Văn Nhận
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>
                  Sinh viên: <strong>Nguyễn Tiến Tuấn</strong> (MSV: <code style={{ color: '#1677ff' }}>B23DCCC173</code>)
                </p>
                <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '0.85rem' }}>
                  Ant Design 5.x Light Mode • Redux Toolkit 2.x • RTK Query • Feature-Based
                </p>
              </div>
            </div>
          </Footer>
        </Layout>
      </AntApp>
    </ConfigProvider>
  );
}
