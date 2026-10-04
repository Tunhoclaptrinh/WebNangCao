import React from 'react';
import { Card, Tabs, Tag, Alert, Row, Col } from 'antd';
import { CodeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export const CodeComparisonView: React.FC = () => {
  const tabItems = [
    {
      key: 'virtualization',
      label: '1. Virtualization (react-window)',
      children: (
        <div>
          <Alert
            type="info"
            showIcon
            message="Kỹ thuật Virtualization (Cửa sổ ảo) — Slide 20-23 Buổi 5"
            description="Thay vì render toàn bộ 10.000 phần tử HTML thật vào DOM, react-window chỉ mount đúng số lượng dòng hiển thị trong viewport tại một thời điểm."
            style={{ marginBottom: 16 }}
          />
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card
                size="small"
                title={
                  <span style={{ color: '#cf1322' }}>
                    <CloseCircleOutlined /> Trước Tối Ưu: .map() thông thường
                  </span>
                }
                style={{ borderColor: '#ffa39e', backgroundColor: '#fffbfb' }}
              >
                <pre style={{ margin: 0, fontSize: 12, overflowX: 'auto', backgroundColor: '#2d3748', color: '#f7fafc', padding: 12, borderRadius: 6 }}>
{`// ❌ Render toàn bộ 10.000 nodes trực tiếp
<div className="product-list-container">
  {products.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      onAdd={() => handleAdd(product.id)}
    />
  ))}
</div>

// ⚠️ Vấn đề:
// - Sinh ra hơn 10.000 DOM nodes thật
// - CPU bận tính Layout/Paint (TBT > 1.4s)
// - Cuộn màn hình bị giật lag (Jank ~15 FPS)`}
                </pre>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                size="small"
                title={
                  <span style={{ color: '#389e0d' }}>
                    <CheckCircleOutlined /> Sau Tối Ưu: react-window FixedSizeList
                  </span>
                }
                style={{ borderColor: '#b7eb8f', backgroundColor: '#f6ffed' }}
              >
                <pre style={{ margin: 0, fontSize: 12, overflowX: 'auto', backgroundColor: '#1a202c', color: '#e2e8f0', padding: 12, borderRadius: 6 }}>
{`// ⚡ Sử dụng react-window FixedSizeList
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  width="100%"
  itemCount={products.length} // 10.000 items
  itemSize={78}               // Chiều cao mỗi dòng
>
  {({ index, style }) => (
    <ProductItemMemo
      key={products[index].id}
      product={products[index]}
      style={style}
      onAddToCart={handleAddToCart}
    />
  )}
</FixedSizeList>

// ✅ Hiệu quả:
// - Chỉ mount ~15-18 DOM nodes trong viewport
// - Render đầu <30ms, cuộn 60 FPS mượt mà!`}
                </pre>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'memoization',
      label: '2. Memoization (memo + useCallback)',
      children: (
        <div>
          <Alert
            type="info"
            showIcon
            message="Kỹ thuật Memoization — Slide 8-15 Buổi 5"
            description="Kết hợp React.memo trên component con và useCallback trên hàm handler của cha để ngăn chặn triệt để re-render thừa."
            style={{ marginBottom: 16 }}
          />
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card
                size="small"
                title={
                  <span style={{ color: '#cf1322' }}>
                    <CloseCircleOutlined /> Trước Tối Ưu: Inline Handlers & No Memo
                  </span>
                }
                style={{ borderColor: '#ffa39e', backgroundColor: '#fffbfb' }}
              >
                <pre style={{ margin: 0, fontSize: 12, overflowX: 'auto', backgroundColor: '#2d3748', color: '#f7fafc', padding: 12, borderRadius: 6 }}>
{`// ❌ Hàm con thông thường không bọc memo
function ProductCard({ product, onAdd }) {
  return (
    <div onClick={() => onAdd(product.id)}>
      {product.name}
    </div>
  );
}

// ❌ Component cha truyền inline callback & inline style
function ProductList() {
  const [query, setQuery] = useState('');
  
  // Handler tạo mới ở MỖI lần render!
  const handleAdd = (id) => console.log(id);

  return (
    <ProductCard 
      style={{ padding: 10 }} // object mới liên tục
      onAdd={handleAdd}       // tham chiếu mới liên tục
    />
  );
}`}
                </pre>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                size="small"
                title={
                  <span style={{ color: '#389e0d' }}>
                    <CheckCircleOutlined /> Sau Tối Ưu: React.memo + useCallback
                  </span>
                }
                style={{ borderColor: '#b7eb8f', backgroundColor: '#f6ffed' }}
              >
                <pre style={{ margin: 0, fontSize: 12, overflowX: 'auto', backgroundColor: '#1a202c', color: '#e2e8f0', padding: 12, borderRadius: 6 }}>
{`// ⚡ Bọc component con bằng React.memo (Slide 8, 9)
export const ProductItemMemo = React.memo(
  function ProductItemMemo({ product, style, onAddToCart }) {
    return <div style={style}>{product.name}</div>;
  },
  (prev, next) => prev.product.id === next.product.id
);

// ⚡ Giữ nguyên tham chiếu hàm bằng useCallback (Slide 12, 13)
function ProductList() {
  const handleAddToCart = useCallback((product: Product) => {
    notification.success({ message: 'Đã thêm ' + product.name });
  }, []); // deps rỗng -> giữ nguyên tham chiếu

  return (
    <ProductItemMemo 
      product={product} 
      onAddToCart={handleAddToCart} // Props không đổi!
    />
  );
}`}
                </pre>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'debounce',
      label: '3. useDebounce (300ms)',
      children: (
        <div>
          <Alert
            type="info"
            showIcon
            message="Kỹ thuật useDebounce cho ô tìm kiếm — Slide 30 Buổi 5"
            description="Tránh kích hoạt thuật toán tìm kiếm và lọc trên 10.000 phần tử liên tục sau mỗi ký tự người dùng gõ."
            style={{ marginBottom: 16 }}
          />
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card
                size="small"
                title={
                  <span style={{ color: '#cf1322' }}>
                    <CloseCircleOutlined /> Trước Tối Ưu: Lọc ngay lập tức mỗi phím
                  </span>
                }
                style={{ borderColor: '#ffa39e', backgroundColor: '#fffbfb' }}
              >
                <pre style={{ margin: 0, fontSize: 12, overflowX: 'auto', backgroundColor: '#2d3748', color: '#f7fafc', padding: 12, borderRadius: 6 }}>
{`// ❌ Gõ 10 ký tự -> lọc mảng 10.000 phần tử 10 lần!
function SearchBar() {
  const [search, setSearch] = useState('');

  // Chạy ngay lập tức khi gõ phím -> lag giật input
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <input 
      value={search} 
      onChange={e => setSearch(e.target.value)} 
    />
  );
}`}
                </pre>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                size="small"
                title={
                  <span style={{ color: '#389e0d' }}>
                    <CheckCircleOutlined /> Sau Tối Ưu: useDebounce Hook 300ms
                  </span>
                }
                style={{ borderColor: '#b7eb8f', backgroundColor: '#f6ffed' }}
              >
                <pre style={{ margin: 0, fontSize: 12, overflowX: 'auto', backgroundColor: '#1a202c', color: '#e2e8f0', padding: 12, borderRadius: 6 }}>
{`// ⚡ Áp dụng custom hook useDebounce (Slide 30)
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ⚡ Sử dụng trong Component:
const debouncedSearch = useDebounce(searchQuery, 300);

// Chỉ lọc khi người dùng ngừng gõ 300ms!
const filtered = useMemo(() => {
  return products.filter(p =>
    p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );
}, [products, debouncedSearch]);`}
                </pre>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'codesplitting',
      label: '4. Code-Splitting (React.lazy & Suspense)',
      children: (
        <div>
          <Alert
            type="info"
            showIcon
            message="Kỹ thuật Code-Splitting chia nhỏ bundle — Slide 16-19, 36 Buổi 5"
            description="Tách module báo cáo phân tích kho nặng thành một chunk JS riêng, chỉ nạp về khi người dùng click xem."
            style={{ marginBottom: 16 }}
          />
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card
                size="small"
                title={
                  <span style={{ color: '#cf1322' }}>
                    <CloseCircleOutlined /> Trước Tối Ưu: Static Import toàn bộ
                  </span>
                }
                style={{ borderColor: '#ffa39e', backgroundColor: '#fffbfb' }}
              >
                <pre style={{ margin: 0, fontSize: 12, overflowX: 'auto', backgroundColor: '#2d3748', color: '#f7fafc', padding: 12, borderRadius: 6 }}>
{`// ❌ Import tĩnh trực tiếp module phân tích nặng
import AnalyticsDrawer from './components/AnalyticsDrawer';
import ProductDetailModal from './components/ProductDetailModal';

function App() {
  return (
    <div>
      <AnalyticsDrawer open={open} />
      <ProductDetailModal open={detailOpen} />
    </div>
  );
}

// ⚠️ Vấn đề:
// Bundle chính (main.js) phình to >1.5MB
// Trình duyệt phải nạp cả code chưa dùng đến
// FCP và LCP bị kéo dài đáng kể!`}
                </pre>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                size="small"
                title={
                  <span style={{ color: '#389e0d' }}>
                    <CheckCircleOutlined /> Sau Tối Ưu: React.lazy + Suspense
                  </span>
                }
                style={{ borderColor: '#b7eb8f', backgroundColor: '#f6ffed' }}
              >
                <pre style={{ margin: 0, fontSize: 12, overflowX: 'auto', backgroundColor: '#1a202c', color: '#e2e8f0', padding: 12, borderRadius: 6 }}>
{`// ⚡ Dynamic import qua React.lazy (Slide 16-19)
const LazyAnalyticsDrawer = React.lazy(
  () => import('./components/LazyAnalyticsDrawer')
);
const LazyProductDetailModal = React.lazy(
  () => import('./components/LazyProductDetailModal')
);

function App() {
  return (
    <Suspense fallback={<Spin tip="Đang nạp chunk..." />}>
      {openAnalytics && (
        <LazyAnalyticsDrawer 
          open={openAnalytics} 
          onClose={() => setOpen(false)} 
        />
      )}
    </Suspense>
  );
}
// ✅ Bundle chính giảm dung lượng, FCP chỉ 0.7s!`}
                </pre>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CodeOutlined style={{ color: '#1677ff', fontSize: 18 }} />
          <span>Đối Chiếu Mã Nguồn & Giải Pháp Kỹ Thuật (Before vs After)</span>
          <Tag color="cyan">Slide 8 - 36</Tag>
        </div>
      }
      style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      <Tabs defaultActiveKey="virtualization" items={tabItems} />
    </Card>
  );
};
