# Đề Bài: LTWNC - Bài Tập Tuần 3 (Nộp Trước Buổi 4)

- **Học viện Công nghệ Bưu chính Viễn thông (PTIT)**
- **Học phần:** Lập trình Web Nâng Cao
- **Giảng viên:** ThS. Ngô Văn Nhận (0888726113 – nhannv@ptit.edu.vn)
- **Nguồn tài liệu:** Slide bài giảng `Buoi3_Redux_Toolkit_TypeScript.pptx` (Trang 18, 19, 20, 22)
- **Thời gian giao bài:** 14/09/2026 11:20

---

## 📌 PHẦN 1: THỰC HÀNH TRÊN LỚP (LAB-03)

Áp dụng ngay Redux Toolkit vào 3 bài thực hành:

### Bài Thực Hành 1/3: `cartSlice` với `createSlice`
- **Yêu cầu:** Viết `cartSlice` quản lý danh sách sản phẩm trong giỏ hàng bằng `createSlice`.
- **Có đủ 3 reducers:** `addItem`, `removeItem`, `updateQuantity`.
- **Các bước thực hiện:**
  1. Định nghĩa `CartItem`, `CartState` bằng TypeScript.
  2. Viết `createSlice` với 3 reducers, dùng `PayloadAction<T>` cho từng action.
  3. Đặt file tại `features/cart/cartSlice.ts` (đúng cấu trúc feature-based), export actions và reducer, ghép vào `configureStore`.

```typescript
// cartSlice.ts
interface CartState {
  items: CartItem[];
  totalQuantity: number;
}

addItem(state, action: PayloadAction<CartItem>) {
  state.items.push(action.payload);
}
```

### Bài Thực Hành 2/3: `productsSlice` với `createAsyncThunk`
- **Yêu cầu:** Viết `fetchProducts` bằng `createAsyncThunk` gọi API `/api/products`.
- **Xử lý đủ 3 trạng thái:** `pending`, `fulfilled`, `rejected` trong `extraReducers`.
- **Các bước thực hiện:**
  1. Viết `createAsyncThunk<Product[], void>` gọi fetch.
  2. Khai báo `ProductsState` có `status: 'idle' | 'loading' | 'succeeded' | 'failed'`.
  3. Đặt file tại `features/products/productsSlice.ts`, xử lý từng `addCase` tương ứng, cập nhật `items` / `error`.

```typescript
// productsSlice.ts
export const fetchProducts = createAsyncThunk<Product[], void>(
  'products/fetchAll',
  async () => {
    const res = await fetch('/api/products');
    return (await res.json()) as Product[];
  }
);
```

### Bài Thực Hành 3/3: Typed Hooks Redux & Refactor Component
- **Yêu cầu:** Viết `useAppDispatch`, `useAppSelector` đã gõ kiểu theo `RootState` / `AppDispatch` của dự án.
- **Refactor:** Refactor lại component `CartSummary` (trước đây dùng `useState`) sang dùng Redux Toolkit.
- **Các bước thực hiện:**
  1. Tạo file `app/hooks.ts` theo đúng khuôn mẫu typed hooks.
  2. Thay `useSelector` / `useDispatch` gốc bằng `useAppSelector` / `useAppDispatch`.
  3. Kiểm tra TypeScript tự gợi ý đúng cấu trúc state khi gõ code.

```typescript
// app/hooks.ts
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

## 📌 PHẦN 2: BÀI TẬP VỀ NHÀ (EX-03 - NỘP TRƯỚC BUỔI 4)

### Đề bài
> **Xây dựng module giỏ hàng hoàn chỉnh bằng Redux Toolkit gồm `cartSlice` và `productsSlice`:**
> - `productsSlice` dùng `createAsyncThunk` lấy danh sách sản phẩm từ API giả lập (**khuyến khích thử RTK Query để lấy điểm cộng**).
> - `cartSlice` hỗ trợ **thêm**, **xoá**, **cập nhật số lượng** sản phẩm trong giỏ.
> - Toàn bộ component chỉ dùng `useAppDispatch` / `useAppSelector` đã gõ kiểu.
> - Tổ chức thư mục đúng chuẩn feature-based: `features/cart`, `features/products`, `app/store.ts`, `app/hooks.ts`.

---

## 🎯 TIÊU CHÍ ĐÁNH GIÁ

1. **Store cấu hình đúng** bằng `configureStore`, có `RootState` và `AppDispatch` xuất đúng kiểu.
2. **`createAsyncThunk`** (hoặc **RTK Query**) xử lý đủ trạng thái: **loading / thành công / lỗi**.
3. **Đúng cấu trúc thư mục feature-based**, **không dùng `any`** ở bất kỳ đâu.
4. **Redux DevTools** hiển thị được lịch sử action khi thao tác giỏ hàng (time-travel debugging).
5. **Nộp đúng hạn** trước giờ học Buổi 4.

---

## 🏗️ THIẾT KẾ KIẾN TRÚC FEATURE-BASED

```
src/
  app/                 // Cấu hình chung toàn ứng dụng
    store.ts           // configureStore
    hooks.ts           // Typed useAppSelector / useAppDispatch
  features/
    cart/              // Feature Giỏ hàng
      cartSlice.ts     // Slice reducer + actions
      cartTypes.ts     // TypeScript interfaces
      CartSummary.tsx  // Tóm tắt giỏ hàng
      CartDrawer.tsx   // Giao diện giỏ hàng chi tiết
    products/          // Feature Danh sách sản phẩm
      productsSlice.ts // createAsyncThunk fetchProducts
      productsApi.ts   // RTK Query endpoint (Bonus điểm cộng)
      productTypes.ts  // TypeScript interfaces
      ProductList.tsx  // Danh sách hiển thị sản phẩm
      ProductCard.tsx  // Card từng sản phẩm
```
