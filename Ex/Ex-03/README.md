# Báo Cáo Bài Tập Tuần 3: Module Giỏ Hàng Redux Toolkit + TypeScript (Feature-Based)

- **Học viện Công nghệ Bưu chính Viễn thông (PTIT)**
- **Học phần:** Lập trình Web Nâng Cao (LTWNC) — Mã lớp: `RIPT1411-20261-02`
- **Giảng viên hướng dẫn:** ThS. Ngô Văn Nhận (0888726113 – nhannv@ptit.edu.vn)
- **Sinh viên thực hiện:** Nguyễn Tiến Tuấn
- **Mã sinh viên:** `B23DCCC173`
- **Repository:** [https://github.com/Tunhoclaptrinh/WebNangCao](https://github.com/Tunhoclaptrinh/WebNangCao)
- **Thư mục bài làm:** `Ex/Ex-03/`

---

## 📑 Bảng Mục Lục

1. [Tổng Quan Đề Bài & Kết Quả Đạt Được](#1-tổng-quan-đề-bài--kết-quả-đạt-được)
2. [Cấu Trúc Thư Mục Feature-Based Chuẩn Mực](#2-cấu-trúc-thư-mục-feature-based-chuẩn-mực)
3. [Thiết Kế Redux Store & Typed Hooks](#3-thiết-kế-redux-store--typed-hooks)
4. [Chi Tiết Kỹ Thuật Feature: Cart (`cartSlice`)](#4-chi-tiết-kỹ-thuật-feature-cart-cartslice)
5. [Chi Tiết Kỹ Thuật Feature: Products (`productsSlice` & `productsApi`)](#5-chi-tiết-kỹ-thuật-feature-products-productsslice--productsapi)
6. [Phần Điểm Cộng Kỹ Thuật: RTK Query Caching](#6-phần-điểm-cộng-kỹ-thuật-rtk-query-caching)
7. [Giao Diện Người Dùng & Trải Nghiệm E-Commerce](#7-giao-diện-người-dùng--trải-nghiệm-e-commerce)
8. [Hướng Dẫn Cài Đặt & Chạy Thử Nghiệm](#8-hướng-dẫn-cài-đặt--chạy-thử-nghiệm)

---

## 1. Tổng Quan Đề Bài & Kết Quả Đạt Được

### 🎯 Yêu Cầu Đề Bài (Slide 22)
- Xây dựng module giỏ hàng hoàn chỉnh bằng **Redux Toolkit** gồm `cartSlice` và `productsSlice`.
- `productsSlice` dùng `createAsyncThunk` lấy danh sách sản phẩm từ API giả lập (**khuyến khích thử RTK Query để lấy điểm cộng**).
- `cartSlice` hỗ trợ: thêm, xoá, cập nhật số lượng sản phẩm trong giỏ.
- Toàn bộ component chỉ dùng `useAppDispatch` / `useAppSelector` đã gõ kiểu (`app/hooks.ts`).
- Tổ chức thư mục đúng chuẩn **feature-based**: `features/cart`, `features/products`, `app/store.ts`, `app/hooks.ts`.

### 🏆 Bảng Đánh Giá Mức Độ Hoàn Thành

| Yêu cầu tiêu chí | Hiện thực kỹ thuật | Đánh giá |
|---|---|:---:|
| **Cấu hình Store bằng `configureStore`** | Khởi tạo trong `app/store.ts`, export `RootState` & `AppDispatch` | 🟢 Hoàn thành |
| **`createAsyncThunk` 3 trạng thái** | `pending` (loading skeleton), `fulfilled` (data render), `rejected` (error message + retry) | 🟢 Hoàn thành |
| **RTK Query (Điểm cộng kỹ thuật ⭐)** | `productsApi.ts` với `createApi`, `fakeBaseQuery`, `providesTags`, tự sinh hook `useGetProductsQuery` | 🟢 **Đạt Điểm Cộng** |
| **Tính năng giỏ hàng `cartSlice`** | `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `applyCoupon`, `removeCoupon` | 🟢 Hoàn thành |
| **Typed Hooks bắt buộc** | 100% component chỉ import `useAppDispatch` và `useAppSelector` từ `app/hooks.ts` | 🟢 Hoàn thành |
| **Kiến trúc Feature-Based** | Đặt slice, component, types tương ứng bên trong từng thư mục tính năng | 🟢 Hoàn thành |
| **Không dùng kiểu `any`** | Strict TypeScript, độ bao phủ kiểu an toàn 100% | 🟢 Hoàn thành |
| **Hỗ trợ Redux DevTools** | `devTools: true`, theo dõi time-travel và action history chuẩn xác | 🟢 Hoàn thành |

---

## 2. Cấu Trúc Thư Mục Feature-Based Chuẩn Mực

Thay vì gom nhóm theo loại file rời rạc (`components/`, `reducers/`, `actions/`) như phong cách Redux cổ điển, dự án áp dụng kiến trúc **Feature-Based Colocation** theo đúng tài liệu chính thức của Redux Toolkit:

```
Ex/Ex-03/
├── index.html
├── package.json
├── tsconfig.app.json
├── vite.config.ts
├── src/
│   ├── app/                              # Cấu hình Store & Hooks dùng chung toàn ứng dụng
│   │   ├── store.ts                      # configureStore (kết hợp reducers + RTK Query middleware)
│   │   └── hooks.ts                      # Typed hooks: useAppDispatch & useAppSelector
│   ├── features/                         # Các mô-đun nghiệp vụ độc lập
│   │   ├── cart/                         # Feature: Giỏ Hàng Mua Sắm
│   │   │   ├── cartTypes.ts              # CartItem, CartState, Coupon interfaces
│   │   │   ├── cartSlice.ts              # addItem, removeItem, updateQuantity, applyCoupon...
│   │   │   ├── CartDrawer.tsx            # Drawer trượt từ cạnh phải màn hình hiển thị giỏ hàng
│   │   │   ├── CartItemRow.tsx           # Hàng sản phẩm kèm nút tăng/giảm số lượng
│   │   │   └── CartSummary.tsx           # Tóm tắt đơn hàng, nhập voucher, tính tiền
│   │   └── products/                     # Feature: Danh Sách & Chi Tiết Sản Phẩm
│   │       ├── productTypes.ts           # Product, ProductsState, FetchStatus
│   │       ├── mockProductData.ts        # Bộ dữ liệu mẫu sản phẩm công nghệ thực tế
│   │       ├── productsSlice.ts          # createAsyncThunk fetchProductsAsync + extraReducers
│   │       ├── productsApi.ts            # RTK Query Slice (Điểm cộng kỹ thuật ⭐)
│   │       ├── ProductCard.tsx           # Card hiển thị sản phẩm, tag giảm giá, nút Add to Cart
│   │       ├── ProductFilter.tsx         # Bộ lọc danh mục, tìm kiếm và sắp xếp giá/đánh giá
│   │       └── ProductList.tsx           # Grid sản phẩm kèm nút gạt Thunk / RTK Query
│   ├── components/                       # Shared UI Components
│   │   ├── Navbar.tsx                    # Header thương hiệu, thông tin SV, nút giỏ hàng & badge
│   │   ├── TechBanner.tsx                # Banner giới thiệu kiến trúc & checklist đồ án
│   │   ├── Toast.tsx                     # Thông báo toast khi thêm sản phẩm
│   │   └── CheckoutModal.tsx             # Modal xác nhận đặt hàng và hóa đơn thanh toán
│   ├── styles/
│   │   └── index.css                     # Hệ thống Design System Dark Mode Glassmorphism
│   ├── App.tsx                           # Layout trung tâm kết nối toàn bộ features
│   └── main.tsx                          # Điểm neo render React bọc Provider Redux Store
└── README.md                             # Báo cáo kỹ thuật chi tiết
```

---

## 3. Thiết Kế Redux Store & Typed Hooks

### Cấu hình `src/app/store.ts`
Store kết hợp cả `cartSlice`, `productsSlice` và API reducer của `productsApi`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import cartReducer from '../features/cart/cartSlice.ts';
import { productsApi } from '../features/products/productsApi.ts';
import productsReducer from '../features/products/productsSlice.ts';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Typed Hooks `src/app/hooks.ts`
Được gán sẵn kiểu của `RootState` và `AppDispatch`:

```typescript
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store.ts';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Lợi ích bắt buộc:**
- Khắc phục nhược điểm `useSelector` gốc phải gõ `(state: RootState) => ...` ở mọi nơi.
- Bắt lỗi typo ngay tại thời điểm viết code (compile time) khi truy cập sai thuộc tính.
- `useAppDispatch` tự động hiểu và hỗ trợ các Action Thunk bất đồng bộ trả về từ `createAsyncThunk`.

---

## 4. Chi Tiết Kỹ Thuật Feature: Cart (`cartSlice`)

State quản lý trong `cartSlice`:
```typescript
export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  isDrawerOpen: boolean;
}
```

### Các Reducer cốt lõi:
1. **`addItem`**:
   - Kiểm tra sản phẩm đã có trong `state.items` chưa qua `id`.
   - Nếu đã có: tăng `quantity` (giới hạn không vượt quá số lượng tồn kho `item.stock`).
   - Nếu chưa có: thêm mới vào mảng với `quantity`.
   - Tự động tính toán lại `totalQuantity`, `subtotal`, `discountAmount`, `finalAmount`.
   - Tự động bật mở `isDrawerOpen = true` để người dùng thấy phản hồi trực quan.
2. **`removeItem`**:
   - Lọc bỏ sản phẩm có `id` khớp.
   - Kiểm tra lại điều kiện mã giảm giá nếu tổng tiền sau khi xóa không còn đạt mức tối thiểu.
3. **`updateQuantity`**:
   - Nhận payload `{ id: string, quantity: number }`.
   - Nếu `quantity <= 0`: tự động xóa khỏi giỏ hàng.
   - Ngược lại: gán số lượng mới (tối đa bằng `item.stock`).
4. **`applyCoupon` & `removeCoupon` (Mở rộng thực tế)**:
   - Hỗ trợ các mã giảm giá:
     - `LTWNC10`: Giảm 10% (đơn từ 1.000.000 đ)
     - `PTIT200K`: Giảm 200.000 đ (đơn từ 3.000.000 đ)
     - `VIP500K`: Giảm 500.000 đ (đơn từ 10.000.000 đ)
5. **`clearCart`**:
   - Xóa toàn bộ sản phẩm và đặt lại các chỉ số về 0.

---

## 5. Chi Tiết Kỹ Thuật Feature: Products (`productsSlice` & `productsApi`)

### Quản lý Bất Đồng Bộ với `createAsyncThunk`
Trong `src/features/products/productsSlice.ts`:

```typescript
export const fetchProductsAsync = createAsyncThunk<
  Product[],
  FetchProductsArgs | undefined
>('products/fetchProducts', async (params, { rejectWithValue }) => {
  const delay = params?.delayMs ?? 750;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (params?.shouldFail) {
    return rejectWithValue('Lỗi 503 Service Unavailable: Không thể kết nối tới máy chủ sản phẩm!');
  }

  return MOCK_PRODUCTS;
});
```

Xử lý vòng đời Thunk trong `extraReducers(builder)`:
- **`pending`**: Gán `state.status = 'loading'`, reset lỗi `state.error = null`. Giao diện hiển thị Skeleton Cards nhấp nháy chuyển động.
- **`fulfilled`**: Gán `state.status = 'succeeded'`, nạp danh sách sản phẩm vào `state.items = action.payload`.
- **`rejected`**: Gán `state.status = 'failed'`, ghi nhận message lỗi vào `state.error`. Giao diện hiển thị Alert cảnh báo lỗi kèm nút **Thử lại ngay**.

---

## 6. Phần Điểm Cộng Kỹ Thuật: RTK Query Caching

> **Ghi chú giảng viên:** Đề bài nêu rõ *"khuyến khích thử RTK Query để lấy điểm cộng"*. Dự án đã hiện thực song song cả hai phương thức và cung cấp nút bấm chuyển đổi trực tiếp trên thanh điều hướng.

Trong `src/features/products/productsApi.ts`:
- Sử dụng `createApi` và `fakeBaseQuery()` từ `@reduxjs/toolkit/query/react`.
- Khai báo endpoint `getProducts`:
  ```typescript
  getProducts: builder.query<Product[], { shouldFail?: boolean } | void>({
    async queryFn(arg) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (arg?.shouldFail) {
        return { error: { status: 500, data: 'Lỗi máy chủ RTK Query!' } };
      }
      return { data: MOCK_PRODUCTS };
    },
    providesTags: (result) =>
      result
        ? [...result.map(({ id }) => ({ type: 'Product' as const, id })), { type: 'Product', id: 'LIST' }]
        : [{ type: 'Product', id: 'LIST' }],
  })
  ```
- **Lợi thế vượt trội của RTK Query so với Redux Thunk truyền thống:**
  1. Không cần viết thủ công `status: 'idle' | 'loading' | 'succeeded' | 'failed'`.
  2. Tự động sinh React Hook: `useGetProductsQuery()`.
  3. Cơ chế **tự động cache dữ liệu** dựa trên tham số query: khi chuyển tab hay re-render không phải tải lại dữ liệu không cần thiết.
  4. Hỗ trợ tính năng `refetch()` làm mới dữ liệu một chạm.

---

## 7. Giao Diện Người Dùng & Trải Nghiệm E-Commerce (Ant Design Light Mode)

- **Hệ thống Design System Ant Design 5.x:** Sử dụng `ConfigProvider` chuẩn hóa toàn bộ tokens: màu chủ đạo `#1677ff`, bo góc `8px`, nền xám sáng thanh lịch (`#f5f7fa`), card trắng tinh khôi (`#ffffff`).
- **Thanh điều hướng Navbar (Ant Design Header):** Header cố định với logo cửa hàng, chip sinh viên, bộ nút `Segmented` chuyển đổi linh hoạt giữa Redux Thunk và RTK Query (Bonus điểm cộng), nút giỏ hàng tích hợp `Badge` số lượng realtime.
- **Card sản phẩm (Ant Design Card):** Sử dụng `Card hoverable`, `Badge.Ribbon` hiển thị danh hiệu hot, `Tag` phân loại danh mục, `Rate` đánh giá sao, và nút `Button type="primary"` thêm giỏ hàng.
- **Drawer giỏ hàng (Ant Design Drawer):** Trượt mượt mà từ cạnh phải, quản lý danh sách mặt hàng qua `CartItemRow`, tăng giảm số lượng linh hoạt, nút xóa với icon `DeleteOutlined`.
- **Tóm tắt thanh toán (Ant Design Card & Statistic):** Hiển thị tổng tiền nổi bật, nhập và gợi ý mã voucher tiện dụng với `Tag` ưu đãi (`LTWNC10`, `PTIT200K`, `VIP500K`).
- **Modal đặt hàng (Ant Design Modal & Form):** Hóa đơn `Descriptions`, form xác nhận giao hàng và kết quả `Result status="success"` chuyên nghiệp.

---

## 8. Hướng Dẫn Cài Đặt & Chạy Thử Nghiệm

### Bước 1: Điều hướng vào thư mục
```bash
cd Ex/Ex-03
```

### Bước 2: Khởi chạy máy chủ phát triển Vite
```bash
npm run dev
```
Trình duyệt sẽ mở tại `http://localhost:5173` (hoặc cổng hiển thị trên terminal).

### Bước 3: Kiểm tra chất lượng TypeScript (Typecheck)
```bash
npx tsc --noEmit -p tsconfig.app.json
```
Kết quả trả về mã `0`, không có bất kỳ lỗi cú pháp hoặc sai lệch kiểu nào.
