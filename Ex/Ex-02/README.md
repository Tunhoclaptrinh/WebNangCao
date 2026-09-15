# 📝 Ex-02 — LTWNC Bài Tập Tuần 2

## Thông Tin Bài Tập

| Mục | Thông tin |
|---|---|
| **Giảng viên** | Ngô Văn Nhận |
| **Thời hạn** | 09/09/2026 23:00 (cho phép nộp muộn) |
| **Công nghệ** | React 19 + TypeScript + Ant Design 5.x (Light Theme) + Vite |
| **Trạng thái** | 🟢 Hoàn thành |

---

## 📋 Yêu Cầu Bài Tập

### Bài 1 — Accordion Compound Component

> Xây dựng Compound Component Accordion hoàn chỉnh:
> - Nhiều panel, nhưng **chỉ mở 1 panel tại một thời điểm**
> - Dùng **Context API** tương tự Tabs đã thực hành

### Bài 2 — Custom Hook `usePagination<T>`

> Viết custom hook `usePagination<T>` áp dụng cho danh sách sản phẩm:
> - Nhận vào mảng dữ liệu `T[]` và số item/trang
> - Trả về: trang hiện tại, tổng số trang, hàm `next`/`prev`/`goToPage`

---

## 🏗️ Kiến Trúc & Thiết Kế

### Accordion — Compound Component Pattern

```
Accordion (Root)
│   └── AccordionContext { activePanel, togglePanel }
│
├── Accordion.Item (value="...")
│   └── AccordionItemContext { value, isOpen }
│
│   ├── Accordion.Trigger   — Button mở/đóng (ARIA compliant)
│   └── Accordion.Content   — Nội dung (smooth height animation)
```

**Cơ chế single-open:**
- `activePanel: string | null` — chỉ lưu 1 giá trị duy nhất
- `togglePanel(value)` — nếu đang mở thì đóng, nếu đóng thì mở và panel cũ tự đóng
- Không cần `Set<string>`, không cần loop

**Cách dùng:**

```tsx
<Accordion defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Câu hỏi 1?</Accordion.Trigger>
    <Accordion.Content>Câu trả lời 1...</Accordion.Content>
  </Accordion.Item>
  
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Câu hỏi 2?</Accordion.Trigger>
    <Accordion.Content>Câu trả lời 2...</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

---

### `usePagination<T>` — Custom Hook

**Signature:**

```typescript
function usePagination<T>(
  data: T[],
  itemsPerPage: number
): {
  currentPage: number       // trang hiện tại (bắt đầu từ 1)
  totalPages: number        // tổng số trang
  currentData: T[]          // data của trang hiện tại
  next: () => void          // sang trang tiếp (có boundary check)
  prev: () => void          // về trang trước (có boundary check)
  goToPage: (n: number) => void  // nhảy trang (tự clamp [1, totalPages])
  hasNext: boolean          // còn trang tiếp không
  hasPrev: boolean          // còn trang trước không
}
```

**Ví dụ dùng với Product:**

```tsx
const { currentPage, totalPages, currentData, next, prev, goToPage } =
  usePagination<Product>(products, 4);
```

---

## 📁 Cấu Trúc File

```
Ex-02/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx                        ← Demo page chính
    ├── App.css
    ├── index.css                      ← Global styles (dark mode)
    │
    ├── contexts/
    │   └── AccordionContext.ts        ← Context + custom hooks
    │
    ├── components/
    │   ├── Accordion/
    │   │   ├── Accordion.tsx          ← Root (state + Context.Provider)
    │   │   ├── AccordionItem.tsx      ← Item (ItemContext.Provider)
    │   │   ├── AccordionTrigger.tsx   ← Button toggle
    │   │   ├── AccordionContent.tsx   ← Nội dung (height animation)
    │   │   ├── Accordion.css
    │   │   └── index.ts              ← Public API (dot notation)
    │   │
    │   └── ProductList/
    │       ├── ProductList.tsx        ← Demo usePagination
    │       └── ProductList.css
    │
    ├── hooks/
    │   └── usePagination.ts           ← Custom hook generic
    │
    └── data/
        └── products.ts                ← 16 sản phẩm mẫu
```

---

## 🚀 Chạy Dự Án

```bash
# Cài dependencies
npm install

# Dev server (http://localhost:5173)
npm run dev

# Build production (kiểm tra TypeScript)
npm run build
```

---

## 🔑 Điểm Nổi Bật Kỹ Thuật

| Kỹ thuật | Mô tả |
|---|---|
| **Context API** | 2 context lồng nhau: `AccordionContext` (root) + `AccordionItemContext` (item) |
| **Compound Component** | Dùng `Object.assign` để tạo dot notation `Accordion.Item`, `Accordion.Trigger`, `Accordion.Content` |
| **Generic TypeScript** | `usePagination<T>` — type-safe cho mọi kiểu dữ liệu |
| **useMemo** | Tối ưu tính `totalPages` và `currentData` khi data hoặc page thay đổi |
| **Smooth Animation** | `AccordionContent` dùng `useRef` + `scrollHeight` để animate height chính xác |
| **Accessibility** | `aria-expanded`, `aria-controls`, `aria-labelledby`, `role="region"` |
| **Boundary Check** | `goToPage` dùng `Math.max/min` để clamp về `[1, totalPages]` |
