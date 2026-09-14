/**
 * App.tsx
 * Demo page tổng hợp:
 * 1. Accordion Compound Component (Context API)
 * 2. usePagination<T> Hook với danh sách sản phẩm
 */

import { Accordion } from "./components/Accordion";
import { ProductList } from "./components/ProductList/ProductList";
import "./App.css";

const FAQ_ITEMS = [
  {
    value: "compound-component",
    question: "🧩 Compound Component Pattern là gì?",
    answer:
      "Compound Component là pattern cho phép chia nhỏ một UI phức tạp thành nhiều sub-component liên kết với nhau qua một shared state ẩn (thường dùng Context API). Người dùng có thể compose chúng linh hoạt mà không cần truyền props phức tạp. Ví dụ: <Accordion>, <Tabs>, <Select>.",
  },
  {
    value: "context-api",
    question: "⚡ Tại sao dùng Context API thay vì prop drilling?",
    answer:
      "Prop drilling xảy ra khi bạn phải truyền dữ liệu qua nhiều lớp component trung gian không cần dùng. Context API giải quyết vấn đề này bằng cách tạo một 'kho' dữ liệu chia sẻ, bất kỳ component con nào cũng có thể đọc trực tiếp mà không cần qua trung gian.",
  },
  {
    value: "custom-hooks",
    question: "🎣 Custom Hook là gì và khi nào nên dùng?",
    answer:
      "Custom Hook là một hàm JavaScript bắt đầu bằng 'use', cho phép tái sử dụng logic có trạng thái (stateful logic) giữa các component. Dùng khi có logic phức tạp lặp lại nhiều nơi, ví dụ: useFetch, usePagination, useForm, useLocalStorage.",
  },
  {
    value: "generic-typescript",
    question: "🔷 Generic TypeScript <T> hoạt động như thế nào?",
    answer:
      "Generic (T) là một 'placeholder' kiểu dữ liệu, được xác định khi gọi hàm/component. usePagination<Product> nghĩa là T = Product. TypeScript sẽ tự suy luận kiểu cho currentData là Product[], đảm bảo type safety mà không cần viết lại code cho từng kiểu.",
  },
  {
    value: "accordion-single",
    question: "🎯 Vì sao Accordion chỉ mở 1 panel?",
    answer:
      "Bằng cách lưu activePanel là một string | null duy nhất trong Context (thay vì Set<string>), khi toggle một panel mới, panel cũ tự động đóng vì state chỉ giữ được 1 giá trị. Đây là cách đơn giản nhất để enforce 'single-open' behavior.",
  },
  {
    value: "vite-react",
    question: "⚡ Tại sao chọn Vite thay vì Create React App?",
    answer:
      "Vite nhanh hơn CRA nhiều lần nhờ dùng ES Modules native và esbuild. Dev server start gần như tức thì (< 1s), HMR (Hot Module Replacement) cực nhanh. CRA đã bị deprecated từ 2023. Với TypeScript support tốt, Vite là lựa chọn mặc định cho các project React mới.",
  },
];

export default function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__badge">LTWNC · Bài Tập Tuần 2</div>
        <h1 className="app-header__title">
          React Design Patterns
        </h1>
        <p className="app-header__subtitle">
          Compound Component · Context API · Custom Hooks · Generic TypeScript
        </p>
      </header>

      <main className="app-main">
        {/* ═══════════════════════════════════════════
            PHẦN 1: ACCORDION COMPOUND COMPONENT
        ═══════════════════════════════════════════ */}
        <section className="demo-section">
          <div className="section-label">
            <span className="section-label__tag">Bài 1</span>
            <h2 className="section-label__title">Accordion Compound Component</h2>
            <p className="section-label__desc">
              Dùng <code>Context API</code> — nhiều panel, chỉ mở <strong>1 panel</strong> tại một thời điểm.
            </p>
          </div>

          {/* Hiển thị API usage */}
          <div className="code-preview">
            <div className="code-preview__header">
              <span className="code-dot code-dot--red" />
              <span className="code-dot code-dot--yellow" />
              <span className="code-dot code-dot--green" />
              <span className="code-preview__title">Accordion Usage</span>
            </div>
            <pre className="code-preview__body">{`<Accordion defaultValue="compound-component">
  <Accordion.Item value="compound-component">
    <Accordion.Trigger>Câu hỏi?</Accordion.Trigger>
    <Accordion.Content>Câu trả lời...</Accordion.Content>
  </Accordion.Item>
</Accordion>`}</pre>
          </div>

          <Accordion defaultValue="compound-component">
            {FAQ_ITEMS.map((item) => (
              <Accordion.Item key={item.value} value={item.value}>
                <Accordion.Trigger>{item.question}</Accordion.Trigger>
                <Accordion.Content>{item.answer}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion>
        </section>

        {/* ═══════════════════════════════════════════
            PHẦN 2: usePagination CUSTOM HOOK
        ═══════════════════════════════════════════ */}
        <section className="demo-section">
          <div className="section-label">
            <span className="section-label__tag">Bài 2</span>
            <h2 className="section-label__title">Custom Hook: usePagination&lt;T&gt;</h2>
            <p className="section-label__desc">
              Hook generic nhận <code>T[]</code> và số item/trang,
              trả về <code>currentPage</code>, <code>totalPages</code>, <code>next</code>, <code>prev</code>, <code>goToPage</code>.
            </p>
          </div>

          {/* Hook signature */}
          <div className="code-preview">
            <div className="code-preview__header">
              <span className="code-dot code-dot--red" />
              <span className="code-dot code-dot--yellow" />
              <span className="code-dot code-dot--green" />
              <span className="code-preview__title">usePagination&lt;T&gt; Signature</span>
            </div>
            <pre className="code-preview__body">{`function usePagination<T>(data: T[], itemsPerPage: number): {
  currentPage: number   // trang hiện tại (1-indexed)
  totalPages: number    // tổng số trang
  currentData: T[]      // data của trang hiện tại
  next: () => void      // trang tiếp theo
  prev: () => void      // trang trước
  goToPage: (n) => void // nhảy đến trang n
  hasNext: boolean
  hasPrev: boolean
}`}</pre>
          </div>

          <ProductList />
        </section>
      </main>

      <footer className="app-footer">
        <p>LTWNC · HK7 · Compound Component + Custom Hook · React + TypeScript + Vite</p>
      </footer>
    </div>
  );
}
