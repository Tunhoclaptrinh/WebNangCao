# 🧪 Lab-02: Kiến Trúc & Design Pattern trong React

- **Buổi học:** Buổi 2
- **Slide:** `Buoi2_Kien_Truc_Design_Pattern_React.pptx` (Phần 2 — Slides 15–18)
- **Giảng viên:** ThS. Ngô Văn Nhận

---

## 📋 Danh Sách Bài Thực Hành (3 bài)

| # | Bài | Pattern | Mô tả |
|:---:|:---|:---|:---|
| 1 | [withAuth HOC](#bài-13--hoc-withAuthp) | Higher-Order Component (HOC) | Bọc component với kiểm tra đăng nhập |
| 2 | [Tabs Compound Component](#bài-23--compound-component-tabs) | Compound Component + Context API | Tabs với Context, không prop drilling |
| 3 | [useFetch\<T\>](#bài-33--custom-hook-usefetcht) | Custom Hook | Generic data fetching hook |

---

## Bài 1/3 — HOC `withAuth<P>`

> **Slide 16** — Thực hành 1

### Yêu cầu

Viết HOC `withAuth<P>` kiểm tra đăng nhập trước khi render component:
- Nếu chưa đăng nhập: điều hướng về trang `/login`

### Bước thực hiện

1. Viết hàm `withAuth` nhận vào Component generic `<P>`
2. Bên trong, dùng hook `useAuth()` (giả lập) lấy thông tin `user`
3. Trả về component mới: nếu có `user` thì render `Component`, ngược lại điều hướng

```tsx
// Mục tiêu: Dùng được như thế này
const ProtectedProfile = withAuth(ProfilePage);
// <ProtectedProfile /> tự động kiểm tra đăng nhập trước khi hiển thị
```

### Gợi ý code

```tsx
// hooks/useAuth.ts
export function useAuth() {
  // Giả lập: return { user: { name: "Tuấn" } } hoặc { user: null }
  return { user: { name: "Tuấn" } };
}

// hoc/withAuth.tsx
import { ComponentType } from "react";
import { useAuth } from "../hooks/useAuth";

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthGuard(props: P) {
    const { user } = useAuth();
    if (!user) {
      // Trong môi trường lab: hiển thị thông báo thay vì redirect
      return <div>🔒 Chưa đăng nhập. Vui lòng <a href="/login">đăng nhập</a>.</div>;
    }
    return <Component {...props} />;
  };
}
```

---

## Bài 2/3 — Compound Component `Tabs`

> **Slide 17** — Thực hành 2

### Yêu cầu

Xây dựng bộ component `Tabs`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel` bằng TypeScript + Context:

### Bước thực hiện

1. Tạo `TabsContext` lưu giá trị tab đang active
2. Component `Tabs` cung cấp Context, quản lý state `value`
3. `Tabs.Tab` đọc/ghi Context để chuyển tab khi click
4. `Tabs.Panel` chỉ hiển thị nội dung khi `value` trùng với tab đang active

```tsx
// Mục tiêu: Dùng được như thế này
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">Giới thiệu</Tabs.Tab>
    <Tabs.Tab value="tab2">Chi tiết</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="tab1">Nội dung 1</Tabs.Panel>
  <Tabs.Panel value="tab2">Nội dung 2</Tabs.Panel>
</Tabs>
```

---

## Bài 3/3 — Custom Hook `useFetch<T>`

> **Slide 18** — Thực hành 3

### Yêu cầu

Viết custom hook `useFetch<T>(url: string)` trả về `{ data, loading, error }` có generic type:

### Bước thực hiện

1. Khởi tạo 3 state: `data`, `loading`, `error` với kiểu tường minh
2. Dùng `useEffect` gọi `fetch(url)` mỗi khi `url` thay đổi
3. Áp dụng hook cho danh sách sản phẩm: `useFetch<Product[]>('/api/products')`

```tsx
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Dùng:
function ProductList() {
  const { data: products, loading, error } = useFetch<Product[]>('/api/products');
  if (loading) return <p>Đang tải...</p>;
  // ...
}
```

---

## 🔗 Tài Liệu Tham Khảo

- **Slide buổi 2:** [`docs/slides/Buoi2_Kien_Truc_Design_Pattern_React.pptx`](../../docs/slides/Buoi2_Kien_Truc_Design_Pattern_React.pptx)
- **React Docs — Context:** https://react.dev/learn/passing-data-deeply-with-context
- **React Docs — Custom Hooks:** https://react.dev/learn/reusing-logic-with-custom-hooks
