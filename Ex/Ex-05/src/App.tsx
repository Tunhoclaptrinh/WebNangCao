import React, { useState, useMemo, useCallback, Suspense } from 'react';
import {
  ConfigProvider,
  Layout,
  Tabs,
  Badge,
  Button,
  Space,
  notification,
  Spin,
} from 'antd';
import {
  ThunderboltFilled,
  ShoppingCartOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  FileDoneOutlined,
  CodeOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import type { Product, ProductCategory, ProductStatus, SortOption } from './types/product.ts';
import { generate10000Products } from './data/mockProducts.ts';
import { useDebounce } from './hooks/useDebounce.ts';
import { useFpsMeter } from './hooks/useFpsMeter.ts';

import { PerformanceDashboard } from './components/PerformanceDashboard.tsx';
import { ProductFilterBar } from './components/ProductFilterBar.tsx';
import { OptimizedList } from './components/OptimizedList.tsx';
import { UnoptimizedList } from './components/UnoptimizedList.tsx';
import { LighthouseReportView } from './components/LighthouseReportView.tsx';
import { CodeComparisonView } from './components/CodeComparisonView.tsx';
import { AboutAssignmentTab } from './components/AboutAssignmentTab.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';

import './styles/app.css';

// Lazy-loaded components (Code-Splitting - Slide 16-19)
const LazyAnalyticsDrawer = React.lazy(() => import('./components/LazyAnalyticsDrawer.tsx'));
const LazyProductDetailModal = React.lazy(() => import('./components/LazyProductDetailModal.tsx'));

const { Header, Content, Footer } = Layout;

export const App: React.FC = () => {
  // Kho 10.000 sản phẩm được tạo 1 lần duy nhất
  const allProducts = useMemo(() => generate10000Products(), []);

  // Đọc query param từ URL để Lighthouse benchmark tự động
  const initialOptimized = useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'unoptimized') return false;
    }
    return true;
  }, []);

  // Công tắc tối ưu
  const [isOptimized, setIsOptimized] = useState<boolean>(initialOptimized);
  const [useVirtualization, setUseVirtualization] = useState<boolean>(initialOptimized);
  const [useMemoization, setUseMemoization] = useState<boolean>(initialOptimized);
  const [useDebounceSearch, setUseDebounceSearch] = useState<boolean>(initialOptimized);

  // Bộ lọc
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Debounce search query
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const effectiveSearchQuery = useDebounceSearch ? debouncedSearchInput : searchInput;

  // Giỏ hàng & Modal
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [analyticsOpen, setAnalyticsOpen] = useState<boolean>(false);

  // Hiệu năng & Đo lường
  const [renderDuration, setRenderDuration] = useState<number>(24);
  const liveFps = useFpsMeter();
  const [activeTab, setActiveTab] = useState<string>('list');

  // Chuyển đổi toàn bộ chế độ
  const handleToggleGlobalOptimization = (checked: boolean) => {
    setIsOptimized(checked);
    setUseVirtualization(checked);
    setUseMemoization(checked);
    setUseDebounceSearch(checked);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', checked ? 'optimized' : 'unoptimized');
      window.history.replaceState({}, '', url.toString());
    }

    notification.info({
      message: checked ? '⚡ Đã chuyển sang Chế độ Tối Ưu' : '🐢 Đã chuyển sang Chế độ Chưa Tối Ưu',
      description: checked
        ? 'Đã bật Virtualization (react-window), Memoization (React.memo/useMemo/useCallback), Debounce 300ms và Code-Splitting.'
        : 'Đã tắt Virtualization (render toàn bộ 10.000 nodes), tắt memoization và tắt debounce để kiểm chứng nghẽn hiệu năng.',
      placement: 'topRight',
    });
  };

  // Logic lọc dữ liệu:
  // Nếu useMemoization bật -> dùng useMemo. Nếu tắt -> tính toán trực tiếp mỗi render
  const memoizedFilteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // 1. Tìm kiếm theo tên / SKU / thương hiệu
      if (effectiveSearchQuery.trim()) {
        const query = effectiveSearchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchSku = product.sku.toLowerCase().includes(query);
        const matchBrand = product.brand.toLowerCase().includes(query);
        if (!matchName && !matchSku && !matchBrand) return false;
      }

      // 2. Lọc danh mục
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Lọc trạng thái
      if (selectedStatus !== 'all' && product.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'sales_desc':
          return b.salesCount - a.salesCount;
        case 'rating_desc':
          return b.rating - a.rating;
        case 'stock_desc':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });
  }, [allProducts, effectiveSearchQuery, selectedCategory, selectedStatus, sortBy]);

  // Nếu tắt useMemoization, tính toán lại mảng không bọc useMemo
  const filteredProducts = useMemoization
    ? memoizedFilteredProducts
    : allProducts.filter((product) => {
        if (effectiveSearchQuery.trim()) {
          const query = effectiveSearchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(query);
          const matchSku = product.sku.toLowerCase().includes(query);
          const matchBrand = product.brand.toLowerCase().includes(query);
          if (!matchName && !matchSku && !matchBrand) return false;
        }
        if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
        if (selectedStatus !== 'all' && product.status !== selectedStatus) return false;
        return true;
      });

  // Callbacks: Khi useMemoization bật -> useCallback giữ nguyên tham chiếu
  const handleAddToCartMemo = useCallback((product: Product) => {
    setCart((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        notification.warning({
          message: 'Sản phẩm đã có trong giỏ',
          description: product.name,
          placement: 'bottomRight',
        });
        return prev;
      }
      notification.success({
        message: 'Đã thêm vào giỏ hàng',
        description: product.name,
        placement: 'bottomRight',
      });
      return [product, ...prev];
    });
  }, []);

  const handleQuickViewMemo = useCallback((product: Product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  }, []);

  // Callbacks không memoized cho chế độ unoptimized
  const handleAddToCartUnmemo = (product: Product) => {
    setCart((prev) => [product, ...prev]);
    notification.success({ message: 'Đã thêm: ' + product.name });
  };

  const handleQuickViewUnmemo = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  const handleAddToCart = useMemoization ? handleAddToCartMemo : handleAddToCartUnmemo;
  const handleQuickView = useMemoization ? handleQuickViewMemo : handleQuickViewUnmemo;

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSortBy('default');
  };

  // Ước tính DOM nodes thực tế đang nằm trong viewport
  const domNodeCount = useVirtualization
    ? Math.min(filteredProducts.length, 18)
    : filteredProducts.length;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontFamily: 'var(--font-sans)',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
        {/* Header Thanh Lịch */}
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
            padding: '0 28px',
            height: 68,
          }}
        >
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#1677ff',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                boxShadow: '0 3px 8px rgba(22, 119, 255, 0.3)',
              }}
            >
              <ThunderboltFilled />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#1f1f1f', letterSpacing: -0.3 }}>
                  LTWNC Ex-05: Tối Ưu Hiệu Năng React (10.000 Sản Phẩm)
                </span>
                <span
                  style={{
                    backgroundColor: isOptimized ? '#f6ffed' : '#fff1f0',
                    color: isOptimized ? '#52c41a' : '#cf1322',
                    border: `1px solid ${isOptimized ? '#b7eb8f' : '#ffa39e'}`,
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                  className={isOptimized ? 'optimized-badge-glow' : ''}
                >
                  {isOptimized ? '⚡ OPTIMIZED' : '🐢 UNOPTIMIZED'}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                Nguyễn Tiến Tuấn — MSV: <strong>B23DCCC173</strong> | ThS. Ngô Văn Nhận — PTIT
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <Space size="middle">
            <Button
              icon={<BarChartOutlined />}
              onClick={() => setAnalyticsOpen(true)}
            >
              Phân Tích Kho (Lazy)
            </Button>

            <Badge count={cart.length} showZero={false} overflowCount={99}>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => setCartOpen(true)}
              >
                Giỏ Hàng
              </Button>
            </Badge>
          </Space>
        </Header>

        {/* Content Body */}
        <Content style={{ padding: '24px 28px', maxWidth: 1440, margin: '0 auto', width: '100%' }}>
          {/* HUD Điều Khiển Hiệu Năng Thời Gian Thực */}
          <PerformanceDashboard
            isOptimized={isOptimized}
            onToggleOptimized={handleToggleGlobalOptimization}
            renderDuration={renderDuration}
            domNodeCount={domNodeCount}
            filteredCount={filteredProducts.length}
            totalCount={allProducts.length}
            fps={liveFps}
            onOpenAnalytics={() => setAnalyticsOpen(true)}
            useVirtualization={useVirtualization}
            onToggleVirtualization={(checked) => setUseVirtualization(checked)}
            useMemoization={useMemoization}
            onToggleMemoization={(checked) => setUseMemoization(checked)}
            useDebounceSearch={useDebounceSearch}
            onToggleDebounce={(checked) => setUseDebounceSearch(checked)}
          />

          {/* Tab Navigation */}
          <Tabs
            className="custom-app-tabs"
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            items={[
              {
                key: 'list',
                label: (
                  <span>
                    <AppstoreOutlined /> 1. Quản Lý 10.000 Sản Phẩm (Live Demo)
                  </span>
                ),
                children: (
                  <div>
                    {/* Thanh lọc & tìm kiếm */}
                    <ProductFilterBar
                      searchInput={searchInput}
                      onSearchChange={setSearchInput}
                      selectedCategory={selectedCategory}
                      onCategoryChange={setSelectedCategory}
                      selectedStatus={selectedStatus}
                      onStatusChange={setSelectedStatus}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      onResetFilters={handleResetFilters}
                      totalResults={filteredProducts.length}
                      useDebounceSearch={useDebounceSearch}
                      activeSearchQuery={effectiveSearchQuery}
                    />

                    {/* Danh sách sản phẩm: Chọn Virtualized hoặc Unoptimized theo công tắc */}
                    {useVirtualization ? (
                      <OptimizedList
                        products={filteredProducts}
                        onQuickView={handleQuickView}
                        onAddToCart={handleAddToCart}
                        onRenderDurationMeasured={setRenderDuration}
                      />
                    ) : (
                      <UnoptimizedList
                        products={filteredProducts}
                        onQuickView={handleQuickView}
                        onAddToCart={handleAddToCart}
                        onRenderDurationMeasured={setRenderDuration}
                      />
                    )}
                  </div>
                ),
              },
              {
                key: 'report',
                label: (
                  <span>
                    <FileDoneOutlined /> 2. Báo Cáo Đo Lường Lighthouse (Trước & Sau)
                  </span>
                ),
                children: <LighthouseReportView />,
              },
              {
                key: 'code',
                label: (
                  <span>
                    <CodeOutlined /> 3. Đối Chiếu Mã Nguồn & Giải Pháp Kỹ Thuật
                  </span>
                ),
                children: <CodeComparisonView />,
              },
              {
                key: 'about',
                label: (
                  <span>
                    <InfoCircleOutlined /> 4. Thông Tin Học Phần & Đề Bài (Slide 38)
                  </span>
                ),
                children: <AboutAssignmentTab />,
              },
            ]}
          />
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center', backgroundColor: '#ffffff', borderTop: '1px solid #e8e8e8', color: '#8c8c8c', padding: '16px 20px' }}>
          Học viện Công nghệ Bưu chính Viễn thông (PTIT) — Học phần Lập trình Web Nâng Cao (LTWNC) Buổi 5 © 2026.
          <br />
          Sinh viên thực hiện: <strong>Nguyễn Tiến Tuấn</strong> (MSV: <code>B23DCCC173</code>) — Giảng viên: <strong>ThS. Ngô Văn Nhận</strong>
        </Footer>

        {/* Drawer Giỏ Hàng */}
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={() => setCart([])}
        />

        {/* Lazy Chunk: Phân Tích Kho Hàng (Code-Splitting) */}
        <Suspense fallback={<Spin fullscreen tip="Đang nạp chunk phân tích kho (Code-Splitting)..." />}>
          {analyticsOpen && (
            <LazyAnalyticsDrawer
              open={analyticsOpen}
              onClose={() => setAnalyticsOpen(false)}
              products={allProducts}
            />
          )}
        </Suspense>

        {/* Lazy Chunk: Modal Chi Tiết Sản Phẩm (Code-Splitting) */}
        <Suspense fallback={<Spin tip="Đang tải thông tin sản phẩm..." />}>
          {detailModalOpen && (
            <LazyProductDetailModal
              open={detailModalOpen}
              product={selectedProduct}
              onClose={() => {
                setDetailModalOpen(false);
                setSelectedProduct(null);
              }}
              onAddToCart={handleAddToCart}
            />
          )}
        </Suspense>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
