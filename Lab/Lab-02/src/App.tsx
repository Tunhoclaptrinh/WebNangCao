/**
 * App.tsx — Lab-02 Demo Page
 * Hiển thị 3 bài thực hành từ Buổi 2:
 * 1. HOC withAuth<P>
 * 2. Tabs Compound Component (Context API)
 * 3. Custom Hook useFetch<T>
 */

import { Tabs } from "./components/Tabs/Tabs";
import { ProtectedProfile, ProductListDemo } from "./components/Demo/DemoComponents";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__badge">LTWNC · Lab Buổi 2</div>
        <h1 className="app-header__title">Design Patterns in React</h1>
        <p className="app-header__subtitle">
          HOC · Compound Component · Custom Hook · Context API · Generic TypeScript
        </p>
        <div className="slide-ref">
          📄 Nguồn: <code>Buoi2_Kien_Truc_Design_Pattern_React.pptx</code> · Slides 16–18
        </div>
      </header>

      <main className="app-main">
        {/* ═══════════════════════════════════════
            BÀI 1: HOC withAuth<P>
        ═══════════════════════════════════════ */}
        <section className="demo-section">
          <div className="section-label">
            <span className="section-label__tag">Bài 1/3</span>
            <h2 className="section-label__title">HOC — withAuth&lt;P&gt;</h2>
            <p className="section-label__desc">
              Higher-Order Component bọc component với kiểm tra đăng nhập.
              Dùng <code>useAuth()</code> hook giả lập.
            </p>
          </div>

          <div className="code-preview">
            <div className="code-preview__header">
              <span className="code-dot code-dot--red" /><span className="code-dot code-dot--yellow" /><span className="code-dot code-dot--green" />
              <span className="code-preview__title">withAuth HOC Usage</span>
            </div>
            <pre className="code-preview__body">{`// Bọc component bất kỳ bằng withAuth
const ProtectedProfile = withAuth(ProfilePage);

// Khi render: tự kiểm tra đăng nhập trước
<ProtectedProfile title="Trang Cá Nhân" />`}</pre>
          </div>

          <div className="demo-hint">
            💡 Thay <code>mockUser = null</code> trong <code>useAuth.ts</code> để xem màn hình "Chưa đăng nhập"
          </div>

          <ProtectedProfile title="Trang Cá Nhân Của Tôi" />
        </section>

        {/* ═══════════════════════════════════════
            BÀI 2: TABS COMPOUND COMPONENT
        ═══════════════════════════════════════ */}
        <section className="demo-section">
          <div className="section-label">
            <span className="section-label__tag">Bài 2/3</span>
            <h2 className="section-label__title">Compound Component — Tabs</h2>
            <p className="section-label__desc">
              Context API chia sẻ state giữa <code>Tabs.Tab</code> và <code>Tabs.Panel</code> không cần prop drilling.
            </p>
          </div>

          <div className="code-preview">
            <div className="code-preview__header">
              <span className="code-dot code-dot--red" /><span className="code-dot code-dot--yellow" /><span className="code-dot code-dot--green" />
              <span className="code-preview__title">Tabs Usage (Compound Component)</span>
            </div>
            <pre className="code-preview__body">{`<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">Giới thiệu</Tabs.Tab>
    <Tabs.Tab value="tab2">Chi tiết</Tabs.Tab>
    <Tabs.Tab value="tab3">Tài liệu</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="tab1">...</Tabs.Panel>
  <Tabs.Panel value="tab2">...</Tabs.Panel>
  <Tabs.Panel value="tab3">...</Tabs.Panel>
</Tabs>`}</pre>
          </div>

          <Tabs defaultValue="intro">
            <Tabs.List>
              <Tabs.Tab value="intro">🧩 Compound Component</Tabs.Tab>
              <Tabs.Tab value="context">⚡ Context API</Tabs.Tab>
              <Tabs.Tab value="hoc">🎭 HOC Pattern</Tabs.Tab>
              <Tabs.Tab value="hooks">🎣 Custom Hooks</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="intro">
              <div className="tab-content">
                <h3>Compound Component Pattern</h3>
                <p>Nhiều component nhỏ phối hợp với nhau để tạo thành 1 khối chức năng hoàn chỉnh.
                  Ví dụ điển hình: <code>&lt;Tabs&gt;</code>, <code>&lt;Accordion&gt;</code>, <code>&lt;Select&gt;</code>, <code>&lt;Menu&gt;</code>.</p>
                <ul>
                  <li>✅ API sử dụng tự nhiên, linh hoạt sắp xếp lại các phần con</li>
                  <li>✅ Không prop drilling — Context lo việc chia sẻ state</li>
                  <li>✅ Dễ mở rộng thêm sub-component mới</li>
                </ul>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="context">
              <div className="tab-content">
                <h3>Context API</h3>
                <p>React Context cho phép chia sẻ state xuống bất kỳ component con nào trong cây,
                  không cần truyền qua từng lớp (prop drilling).</p>
                <ul>
                  <li>🔧 <code>createContext()</code> — Tạo context</li>
                  <li>🔧 <code>Context.Provider</code> — Cung cấp giá trị</li>
                  <li>🔧 <code>useContext()</code> — Đọc giá trị trong component con</li>
                </ul>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="hoc">
              <div className="tab-content">
                <h3>Higher-Order Component (HOC)</h3>
                <p>HOC là hàm nhận vào một Component và trả về một Component mới với logic được bổ sung thêm.</p>
                <ul>
                  <li>🛡️ <code>withAuth(Component)</code> — Kiểm tra đăng nhập</li>
                  <li>📊 <code>withLogging(Component)</code> — Ghi log props thay đổi</li>
                  <li>🎨 <code>withTheme(Component)</code> — Inject theme vào props</li>
                </ul>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="hooks">
              <div className="tab-content">
                <h3>Custom Hooks</h3>
                <p>Custom Hook là hàm bắt đầu bằng <code>use</code>, cho phép tái sử dụng stateful logic.</p>
                <ul>
                  <li>🎣 <code>useFetch&lt;T&gt;(url)</code> — Fetch dữ liệu generic</li>
                  <li>🎣 <code>usePagination&lt;T&gt;(data, n)</code> — Phân trang generic</li>
                  <li>🎣 <code>useLocalStorage(key)</code> — Sync state với localStorage</li>
                  <li>🎣 <code>useDebounce(value, delay)</code> — Delay input changes</li>
                </ul>
              </div>
            </Tabs.Panel>
          </Tabs>
        </section>

        {/* ═══════════════════════════════════════
            BÀI 3: useFetch<T>
        ═══════════════════════════════════════ */}
        <section className="demo-section">
          <div className="section-label">
            <span className="section-label__tag">Bài 3/3</span>
            <h2 className="section-label__title">Custom Hook — useFetch&lt;T&gt;</h2>
            <p className="section-label__desc">
              Hook generic fetch dữ liệu từ API. Demo với <strong>FakeStore API</strong> thực tế.
            </p>
          </div>

          <div className="code-preview">
            <div className="code-preview__header">
              <span className="code-dot code-dot--red" /><span className="code-dot code-dot--yellow" /><span className="code-dot code-dot--green" />
              <span className="code-preview__title">useFetch&lt;T&gt; Usage</span>
            </div>
            <pre className="code-preview__body">{`const { data: products, loading, error, refetch } =
  useFetch<Product[]>('https://fakestoreapi.com/products?limit=6');

if (loading) return <p>Đang tải...</p>;
if (error)   return <p>Lỗi: {error}</p>;
// data: Product[] | null`}</pre>
          </div>

          <ProductListDemo />
        </section>
      </main>

      <footer className="app-footer">
        <p>LTWNC · HK7 · Lab-02 · HOC + Compound Component + Custom Hook · React + TypeScript + Vite</p>
      </footer>
    </div>
  );
}
