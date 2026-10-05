# Báo Cáo Bài Tập Tuần 6: Kiểm Thử Frontend (Jest, React Testing Library & Redux Mocking)

- **Học viện Công nghệ Bưu chính Viễn thông (PTIT)**
- **Học phần:** Lập trình Web Nâng Cao (LTWNC) — Mã lớp: `RIPT1411-20261-02`
- **Giảng viên hướng dẫn:** ThS. Ngô Văn Nhận (0888726113 – nhannv@ptit.edu.vn)
- **Sinh viên thực hiện:** Nguyễn Tiến Tuấn
- **Mã sinh viên:** `B23DCCC173`
- **Repository:** [https://github.com/Tunhoclaptrinh/WebNangCao](https://github.com/Tunhoclaptrinh/WebNangCao)
- **Thư mục bài làm:** `Ex/Ex-06/`
- **Nhánh Git:** `main`

---

## 📑 Bảng Mục Lục

1. [Tổng Quan Đề Bài & Mức Độ Hoàn Thành (Slide 36)](#1-tổng-quan-đề-bài--mức-độ-hoàn-thành-slide-36)
2. [Bảng Báo Cáo Độ Phủ Mã Nguồn (Code Coverage `>= 70%`)](#2-bảng-báo-cáo-độ-phủ-mã-nguồn-code-coverage--70)
3. [Chi Tiết 11 Bộ Test Suite & 69 Test Cases](#3-chi-tiết-11-bộ-test-suite--69-test-cases)
   - [3.1. Unit Tests — Hàm thuần túy & Tính toán giỏ hàng](#31-unit-tests--hàm-thuần-túy--tính-toán-giỏ-hàng)
   - [3.2. Unit Tests — Redux Reducers & State Slices](#32-unit-tests--redux-reducers--state-slices)
   - [3.3. Unit Tests — Custom Hooks & Fake Timers](#33-unit-tests--custom-hooks--fake-timers)
   - [3.4. Unit Tests — Zustand Store](#34-unit-tests--zustand-store)
   - [3.5. Integration Tests — React Testing Library (RTL)](#35-integration-tests--react-testing-library-rtl)
   - [3.6. Async Tests — Mock API & Thunk Lifecycle](#36-async-tests--mock-api--thunk-lifecycle)
4. [Cấu Hình Kỹ Thuật (Jest, ts-jest, Ant Design JSDOM Polyfills)](#4-cấu-hình-kỹ-thuật-jest-ts-jest-ant-design-jsdom-polyfills)
5. [Cấu Trúc Thư Mục Dự Án](#5-cấu-trúc-thư-mục-dự-án)
6. [Hướng Dẫn Cài Đặt & Chạy Bộ Test](#6-hướng-dẫn-cài-đặt--chạy-bộ-test)

---

## 1. Tổng Quan Đề Bài & Mức Độ Hoàn Thành (Slide 36)

### 🎯 Yêu Cầu Đề Bài (Slide 36 — Buổi 6: Kiểm Thử Frontend)
- Viết test suite cho module **giỏ hàng / sản phẩm** đã xây dựng trong các tuần trước (Tuần 3–4).
- **Tối thiểu 10 test case** bao gồm:
  - **Unit test:** Hàm tiện ích tính toán, Redux Reducer, Custom Hook.
  - **Integration test:** Component tương tác với React Testing Library (RTL).
- **Tối thiểu 1 test bất đồng bộ (Async test)** có mock API.
- Chạy `jest --coverage` đạt **`>= 70%`** cho các module đã chọn; nộp kèm báo cáo coverage.

### 🏆 Bảng Đánh Giá Mức Độ Hoàn Thành

| Tiêu chí đề bài (Slide 36) | Yêu cầu tối thiểu | Kết quả thực tế đạt được | Đánh giá |
|---|:---:|:---:|:---:|
| **Số lượng test case** | $\ge 10$ test | **69 test cases** (vượt 690% chỉ tiêu) | 🟢 **Xuất sắc** |
| **Số lượng test suite** | Module giỏ hàng/sản phẩm | **11 test suites** chuyên biệt | 🟢 **Xuất sắc** |
| **Phân loại kiểm thử** | Đủ Unit & Integration | Đủ 4 tầng: Unit hàm, Reducer, Hook, RTL Component | 🟢 **Đạt chuẩn** |
| **Async Test với Mock API** | $\ge 1$ test | **4 test cases** (`fetchProductsAsync` fulfilled/rejected, loading/error UI) | 🟢 **Vượt chỉ tiêu** |
| **Độ phủ Statements** | $\ge 70\%$ | **93.37%** | 🟢 **Vượt chỉ tiêu** |
| **Độ phủ Branches** | $\ge 70\%$ | **75.64%** | 🟢 **Vượt chỉ tiêu** |
| **Độ phủ Functions** | $\ge 70\%$ | **88.00%** | 🟢 **Vượt chỉ tiêu** |
| **Độ phủ Lines** | $\ge 70\%$ | **94.38%** | 🟢 **Vượt chỉ tiêu** |
| **Tuân thủ quy ước Slide** | AAA Pattern, getByRole, fake timers | Áp dụng 100% đúng chuẩn giáo trình | 🟢 **Chuẩn mực** |

---

## 2. Bảng Báo Cáo Độ Phủ Mã Nguồn (Code Coverage `>= 70%`)

Lệnh thực thi: `npm run test:coverage` (hoặc `npx jest --coverage`).

```
-----------------------|---------|----------|---------|---------|----------------------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                
-----------------------|---------|----------|---------|---------|----------------------------------
All files              |   93.37 |    75.64 |      88 |   94.38 |                                  
 features/cart         |   96.37 |    92.85 |   85.71 |   96.12 |                                  
  CartDrawer.tsx       |   92.85 |      100 |      80 |   92.85 | 30                               
  CartItemRow.tsx      |     100 |    72.72 |     100 |     100 | 59-60,63                         
  CartSummary.tsx      |      88 |      100 |   66.66 |    87.5 | 54,97,193                        
  cartSlice.ts         |    98.8 |      100 |   94.11 |   98.68 | 192                              
 features/products     |    87.3 |    66.33 |    82.5 |   90.26 |                                  
  ProductCard.tsx      |   96.15 |    86.48 |     100 |     100 | 29-47,85,87,181                  
  ProductFilter.tsx    |   93.33 |      100 |   85.71 |   93.33 | 53                               
  ProductList.tsx      |   76.27 |       50 |   66.66 |   79.59 | 69,77,99,103-106,113,115,117,161 
  productsSlice.ts     |     100 |    66.66 |     100 |     100 | 72                               
 hooks                 |     100 |      100 |     100 |     100 |                                  
  useDebounce.ts       |     100 |      100 |     100 |     100 |                                  
 store                 |     100 |      100 |     100 |     100 |                                  
  useFavoritesStore.ts |     100 |      100 |     100 |     100 |                                  
 utils                 |   97.22 |    88.88 |     100 |   96.96 |                                  
  cartCalculations.ts  |   97.22 |    88.88 |     100 |   96.96 | 57                               
-----------------------|---------|----------|---------|---------|----------------------------------

Test Suites: 11 passed, 11 total
Tests:       69 passed, 69 total
Snapshots:   0 total
Time:        14.926 s
```

> [!NOTE]
> Báo cáo HTML trực quan được sinh tự động tại thư mục `Ex/Ex-06/coverage/lcov-report/index.html`.

---

## 3. Chi Tiết 11 Bộ Test Suite & 69 Test Cases

### 3.1. Unit Tests — Hàm thuần túy & Tính toán giỏ hàng
**File:** `src/utils/__tests__/cartCalculations.test.ts` (14 test cases)
- `calculateSubtotal`: Tính tổng tiền từ danh sách sản phẩm theo giá và số lượng.
- `calculateSubtotal`: Trả về 0 khi giỏ hàng rỗng.
- `calcTotal`: Tính tổng số lượng mặt hàng (totalQuantity).
- `validateCoupon`: Xác thực mã giảm giá hợp lệ theo mã code (case-insensitive).
- `validateCoupon`: Báo lỗi mã không tồn tại / hết hạn.
- `validateCoupon`: Báo lỗi khi đơn hàng chưa đạt giá trị chi tiêu tối thiểu (`minSpend`).
- `calculateDiscount`: Tính số tiền giảm theo phần trăm (`discountPercent`).
- `calculateDiscount`: Tính số tiền giảm theo số tiền cố định (`discountFixed`).
- `calculateDiscount`: Giới hạn mức giảm cố định không vượt quá tổng tiền hàng.
- `calculateDiscount`: Trả về 0 khi không có coupon hoặc subtotal < minSpend.
- `calculateFinalAmount`: Tính tiền thanh toán cuối cùng (`max(0, subtotal - discount)`).
- `formatCurrency`: Định dạng tiền tệ chuẩn tiếng Việt (`xx.xxx.xxx đ`).

### 3.2. Unit Tests — Redux Reducers & State Slices
**File:** `src/features/cart/__tests__/cartSlice.test.ts` (14 test cases)
- `addItem`: Thêm sản phẩm mới vào giỏ hàng trống, cập nhật `totalQuantity`, `subtotal`, tự động mở drawer.
- `addItem`: Tăng số lượng khi thêm sản phẩm đã tồn tại trong giỏ.
- `addItem`: Không cho phép số lượng vượt quá tồn kho khả dụng (`stock`).
- `updateQuantity`: Cập nhật số lượng sản phẩm hợp lệ.
- `updateQuantity`: Tự động xóa sản phẩm khi số lượng cập nhật `<= 0`.
- `removeItem`: Xóa sản phẩm theo ID và tính toán lại các chỉ số giỏ hàng.
- `removeItem`: Tự động hủy coupon khi việc xóa sản phẩm khiến `subtotal < minSpend`.
- `removeItem`: Xử lý an toàn khi truyền ID không tồn tại.
- `clearCart`: Làm trống toàn bộ giỏ hàng và đặt lại các trạng thái về 0.
- `applyCoupon`: Áp dụng thành công coupon theo % (`LTWNC10`).
- `applyCoupon`: Áp dụng thành công coupon tiền cố định (`PTIT200K`).
- `applyCoupon`: Báo lỗi khi mã không tồn tại.
- `applyCoupon`: Báo lỗi khi đơn hàng chưa đạt giá trị tối thiểu.
- `removeCoupon`: Gỡ bỏ mã giảm giá và khôi phục giá gốc.
- `setDrawerOpen`: Điều khiển đóng/mở Drawer giỏ hàng.

**File:** `src/features/products/__tests__/productsSlice.test.ts` (8 test cases)
- Trả về state mặc định khi action không khớp.
- `setSelectedCategory`: Cập nhật danh mục được chọn để lọc.
- `setSearchQuery`: Cập nhật từ khóa tìm kiếm.
- `setSortBy`: Cập nhật tiêu chí sắp xếp (giá tăng, giá giảm, rating).
- `resetProductsFilter`: Hoàn tác tất cả bộ lọc về mặc định.
- `fetchProductsAsync.pending`: Chuyển `status = 'loading'`, xóa `error`.
- `fetchProductsAsync.fulfilled`: Chuyển `status = 'succeeded'`, nạp danh sách items.
- `fetchProductsAsync.rejected`: Chuyển `status = 'failed'`, lưu thông báo lỗi.

### 3.3. Unit Tests — Custom Hooks & Fake Timers
**File:** `src/hooks/__tests__/useDebounce.test.ts` (4 test cases)
- Áp dụng `jest.useFakeTimers()` và `jest.advanceTimersByTime()` theo đúng Slide 34.
- Trả về giá trị ban đầu ngay khi mount hook.
- Sử dụng delay mặc định 500ms khi không truyền tham số.
- Giữ nguyên giá trị cũ khi chưa đủ thời gian delay (150ms / 300ms).
- Cập nhật giá trị mới sau khi hết thời gian debounce.
- Hủy timer cũ khi giá trị thay đổi liên tục, chỉ lấy giá trị cuối cùng.

### 3.4. Unit Tests — Zustand Store
**File:** `src/store/__tests__/useFavoritesStore.test.ts` (5 test cases)
- State ban đầu là danh sách rỗng `[]`.
- `toggleFavorite`: Thêm sản phẩm vào danh sách yêu thích khi chưa có.
- `toggleFavorite`: Xóa sản phẩm khỏi danh sách yêu thích khi đã có.
- `isFavorite`: Trả về `true` / `false` chính xác theo ID sản phẩm.
- `clearFavorites`: Xóa toàn bộ sản phẩm yêu thích.

### 3.5. Integration Tests — React Testing Library (RTL)
**File:** `src/features/products/__tests__/ProductCard.test.tsx` (3 test cases)
- Render đúng tên sản phẩm, danh mục, giá tiền và rating theo Slide 29.
- Click nút "Thêm vào giỏ" cập nhật đúng Redux Store (kiểm tra `store.getState().cart`).
- Nút "Tạm hết hàng" bị vô hiệu hóa (`disabled`) khi tồn kho `stock = 0`.

**File:** `src/features/products/__tests__/ProductFilter.test.tsx` (4 test cases)
- Render ô tìm kiếm, dropdown sắp xếp và danh sách radio buttons danh mục.
- Nhập từ khóa tìm kiếm kích hoạt action `setSearchQuery`.
- Chọn radio danh mục kích hoạt action `setSelectedCategory`.
- Hiển thị nút "Đặt lại" khi bộ lọc hoạt động và click sẽ hoàn tác về mặc định.

**File:** `src/features/cart/__tests__/CartSummary.test.tsx` (6 test cases)
- Trả về rỗng (null) khi giỏ hàng hoàn toàn trống.
- Hiển thị số món, tạm tính và tổng thanh toán đúng định dạng.
- Nhập mã giảm giá hợp lệ và click áp dụng cập nhật chiết khấu trong Redux.
- Hiển thị thông báo lỗi Alert khi nhập mã không tồn tại.
- Click nút "Gỡ bỏ" hủy coupon và cập nhật lại tổng tiền.
- Click nút "Tiến Hành Thanh Toán" kích hoạt callback `onCheckout`.

**File:** `src/features/cart/__tests__/CartItemRow.test.tsx` (5 test cases)
- Hiển thị tên sản phẩm, danh mục, đơn giá và thành tiền theo dòng.
- Click nút Minus giảm số lượng mặt hàng.
- Click nút Plus tăng số lượng mặt hàng.
- Nút Plus bị disabled khi đạt tồn kho tối đa (`stock`).
- Click nút Trash xóa mặt hàng khỏi giỏ.

**File:** `src/features/cart/__tests__/CartDrawer.test.tsx` (2 test cases)
- Hiển thị thông báo giỏ hàng trống và nút "Tiếp tục mua sắm" khi giỏ rỗng.
- Hiển thị danh sách sản phẩm và tổng kết thanh toán khi giỏ có hàng.

### 3.6. Async Tests — Mock API & Thunk Lifecycle
**File:** `src/features/products/__tests__/ProductListAsync.test.tsx` (4 test cases)
- `fetchProductsAsync.fulfilled`: Nạp danh sách sản phẩm thành công khi API giả lập phản hồi, chuyển `status = 'succeeded'`.
- `fetchProductsAsync.rejected`: Xử lý lỗi 503 Service Unavailable khi API giả lập thất bại, chuyển `status = 'failed'`.
- Render UI khi `status = 'succeeded'`: Danh sách sản phẩm và bộ lọc hiển thị đầy đủ trên DOM.
- Render UI khi `status = 'failed'`: Hiển thị Result Error "Gặp lỗi khi tải dữ liệu sản phẩm", nút "Thử lại ngay" và click sẽ kích hoạt dispatch lại request.

---

## 4. Cấu Hình Kỹ Thuật (Jest, ts-jest, Ant Design JSDOM Polyfills)

### ⚙️ Thách thức & Giải pháp trong môi trường Jest + React 19 + Ant Design 5
1. **Ant Design ESM Parsing trong Jest CommonJS:**
   - *Vấn đề:* Jest ném lỗi `Cannot use import statement outside a module` khi nạp `@ant-design/colors/es` và `@ant-design/icons/es`.
   - *Giải pháp:* Thiết lập `moduleNameMapper` trong `jest.config.cjs` chuyển hướng sang bản `lib/` (CommonJS) tương thích hoàn hảo.
2. **TypeScript 5097 Error (`.tsx?` import extensions):**
   - *Vấn đề:* TypeScript báo lỗi TS5097 khi import có đuôi file `.ts` / `.tsx`.
   - *Giải pháp:* Cấu hình `diagnostics: { ignoreCodes: [5097] }` và mapper `'^(\\.{1,2}/.*)\\.tsx?$': '$1'`.
3. **Ant Design JSDOM Polyfills (`jest.setup.ts`):**
   - Polyfill `window.matchMedia` cho hệ thống Responsive của Ant Design.
   - Polyfill `window.scrollTo`.
   - Polyfill `ResizeObserver` cho Card, Table, Drawer components.
4. **Helper tái sử dụng (`src/test-utils.tsx`):**
   - Hàm `renderWithProviders` tự động bọc Redux `<Provider store={...}>`, Ant Design `<AntApp>` và `<FavoritesProvider>` cho mọi integration test.

---

## 5. Cấu Trúc Thư Mục Dự Án

```
Ex/Ex-06/
├── __mocks__/
│   └── fileMock.js                      # Mock hình ảnh và file tĩnh cho Jest
├── coverage/                            # Báo cáo HTML/LCOV sinh tự động
│   └── lcov-report/index.html
├── src/
│   ├── app/
│   │   ├── hooks.ts                     # Typed useDispatch & useSelector
│   │   └── store.ts                     # Redux Toolkit store cấu hình RTK Query
│   ├── context/
│   │   └── FavoritesContext.tsx         # Context nâng cao (Điểm cộng Buổi 4)
│   ├── features/
│   │   ├── cart/
│   │   │   ├── __tests__/
│   │   │   │   ├── CartDrawer.test.tsx  # RTL Integration test cho Drawer
│   │   │   │   ├── CartItemRow.test.tsx # RTL Integration test cho từng dòng giỏ
│   │   │   │   ├── CartSummary.test.tsx # RTL Integration test cho coupon & tổng tiền
│   │   │   │   └── cartSlice.test.ts    # 14 Unit tests cho Cart Reducer (AAA)
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItemRow.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   ├── cartSlice.ts
│   │   │   └── cartTypes.ts
│   │   ├── favorites/                   # Tính năng yêu thích (Buổi 4)
│   │   └── products/
│   │       ├── __tests__/
│   │       │   ├── ProductCard.test.tsx     # RTL Integration test cho ProductCard
│   │       │   ├── ProductFilter.test.tsx   # RTL Integration test cho bộ lọc
│   │       │   ├── ProductListAsync.test.tsx# Async tests cho API mock & trạng thái
│   │       │   └── productsSlice.test.ts    # Unit tests cho Products Reducer
│   │       ├── ProductCard.tsx
│   │       ├── ProductFilter.tsx
│   │       ├── ProductList.tsx
│   │       ├── mockProductData.ts
│   │       ├── productTypes.ts
│   │       ├── productsApi.ts
│   │       └── productsSlice.ts
│   ├── hooks/
│   │   ├── __tests__/
│   │   │   └── useDebounce.test.ts      # Unit tests cho Hook với Fake Timers
│   │   └── useDebounce.ts
│   ├── store/
│   │   ├── __tests__/
│   │   │   └── useFavoritesStore.test.ts# Unit tests cho Zustand Store
│   │   └── useFavoritesStore.ts
│   ├── utils/
│   │   ├── __tests__/
│   │   │   └── cartCalculations.test.ts # 14 Unit tests cho hàm thuần túy
│   │   └── cartCalculations.ts
│   ├── jest.setup.ts                    # Polyfill matchMedia, ResizeObserver
│   └── test-utils.tsx                   # renderWithProviders tiện ích cho RTL
├── jest.config.cjs                      # Cấu hình Jest & Coverage threshold
├── package.json
└── README.md
```

---

## 6. Hướng Dẫn Cài Đặt & Chạy Bộ Test

### 1. Di chuyển vào thư mục bài tập
```bash
cd Ex/Ex-06
```

### 2. Cài đặt các gói phụ thuộc (nếu chưa cài)
```bash
npm install
```

### 3. Chạy toàn bộ các bộ test (Interactive / Watch mode)
```bash
npm test
```

### 4. Chạy kiểm tra độ phủ mã nguồn (Coverage Report)
```bash
npm run test:coverage
```

### 5. Khởi chạy ứng dụng giao diện (Vite Dev Server)
```bash
npm run dev
```
Truy cập trình duyệt tại `http://localhost:5173/` để trải nghiệm trực quan.
