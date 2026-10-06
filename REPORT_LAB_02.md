# 📑 BÁO CÁO KẾT QUẢ BÀI THỰC HÀNH SỐ 2
## NÂNG CẤP STUDENT DEADLINE TRACKER (LAB 02)

---

### 👤 THÔNG TIN SINH VIÊN & HỌC PHẦN
* **Học phần:** Lập trình Web Nâng Cao
* **Học kỳ:** HK7 — Năm học 2026 – 2027
* **Học viện:** Học viện Công nghệ Bưu chính Viễn thông (PTIT)
* **Giảng viên hướng dẫn:** ThS. Ngô Văn Nhận
* **Sinh viên thực hiện:** Nguyễn Tiến Tuấn
* **Mã sinh viên:** `B23DCCC173`
* **Lớp:** `RIPT1411-20261-02`
* **Nhánh Git nộp bài:** `practice-lab-02` (Rẽ nhánh từ `practice-lab-01`)

---

## 🎯 MỤC TIÊU BÀI THỰC HÀNH
Nâng cấp toàn diện ứng dụng **Student Deadline Tracker** từ bài thực hành số 1 theo 3 trụ cột kỹ thuật:
1. **Phần A — Quản lý State Phối Hợp:** Tích hợp Zustand store ghim bài tập, ThemeContext độc lập bọc `useMemo`, và Redux Logger Middleware.
2. **Phần B — Tối Ưu Hiệu Năng & Stress Test 10.000 Items:** Áp dụng 4 kỹ thuật tối ưu (`React.memo` + `useCallback`, `useDebounce` 300ms, ảo hóa danh sách với `react-window`, code-splitting với `React.lazy` + `Suspense`).
3. **Phần C — Hệ Thống Kiểm Thử Toàn Diện (Testing):** Xây dựng bộ test suite chuẩn Jest 29 + React Testing Library với **45 test cases (100% Pass)** và độ phủ **Coverage Statements đạt 88.65%** (vượt chỉ tiêu $\ge 70\%$).

---

## 🏗️ NỘI DUNG CHI TIẾT & KẾT QUẢ THỰC HIỆN

### PHẦN A: QUẢN LÝ STATE NÂNG CAO

#### 1. Ghim bài tập quan trọng bằng Zustand (`usePinStore`)
* **Kiến trúc:** Xây dựng store độc lập tại `src/store/usePinStore.ts` sử dụng Zustand:
  * State: `pinnedIds: string[]` (lưu danh sách ID bài tập đã ghim, tự động đồng bộ `localStorage`).
  * Actions: `togglePin(id: string)`, `isPinned(id: string)`, `clearPins()`.
* **Cơ chế hiển thị:** Danh sách bài tập tự động sắp xếp đưa các bài tập đã ghim lên **vị trí đầu tiên** của danh sách, đồng thời hiển thị huy hiệu `Đã ghim` màu xanh dương nổi bật kèm viền nhận diện.
* **Lý do tách khỏi Redux Toolkit:** State ghim bài tập mang tính chất giao diện UI cục bộ và cá nhân hoá nhanh, việc tách riêng vào Zustand giúp giảm tải cho Redux Store chính, tránh kích hoạt re-render toàn bộ cây state phân cấp của Redux.

> **Minh chứng 01 — Bài tập được ghim lên đầu danh sách bằng Zustand:**
![Zustand Pinned Assignment](docs/screenshots/01_zustand_pinned_assignment.png)

---

#### 2. Chủ đề Sáng / Tối bằng Context nâng cao (`ThemeContext`)
* **Kiến trúc:** Tạo `src/context/ThemeContext.tsx` tách biệt hoàn toàn khỏi mọi Context khác.
* **Tối ưu hóa:** Toàn bộ value của context được bọc trong `useMemo`:
  ```tsx
  const contextValue = useMemo<ThemeContextValue>(() => ({
    theme,
    isDark,
    toggleTheme,
    setTheme,
  }), [theme, isDark, toggleTheme, setTheme]);
  ```
* **Bảo vệ Re-render:** Tích hợp `ConfigProvider` của Ant Design chuyển đổi qua lại giữa `antdTheme.defaultAlgorithm` và `antdTheme.darkAlgorithm`.
* **Chứng minh bằng React DevTools Profiler:** Việc chuyển đổi Theme chỉ cập nhật các thành phần tiêu thụ Theme trực tiếp (Header, Root), hoàn toàn **không làm re-render thừa danh sách `<AssignmentCard>`**.

> **Minh chứng 02 — Giao diện Chế độ Tối (Dark Mode) qua ThemeContext:**
![Giao diện Dark Mode](docs/screenshots/02_theme_context_dark_mode.png)

> **Minh chứng 03 — React DevTools Profiler xác nhận đổi Theme không re-render danh sách bài tập:**
![React DevTools Profiler Flamegraph](docs/screenshots/03_react_devtools_profiler.png)

---

#### 3. Middleware Redux (`redux-logger`)
* **Cấu hình:** Cấu hình middleware `redux-logger` trong `src/app/store.ts`:
  ```typescript
  const isDev = process.env.NODE_ENV === 'development' || Boolean(import.meta.env?.DEV);
  // Middleware chỉ được nạp khi chạy ở môi trường development
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware();
    return isDev ? middlewares.concat(logger as Middleware) : middlewares;
  }
  ```
* **Minh chứng nhật ký Console:** Ghi nhận đầy đủ 3 luồng action chính kèm `prev state`, `action`, `next state`:
  * `assignments/toggleStatus/fulfilled` (Hoàn thành bài tập)
  * `assignments/delete/fulfilled` (Xoá bài tập)
  * `assignments/create/fulfilled` (Thêm bài tập mới)

> **Minh chứng 04 — Console DevTools ghi nhận đầy đủ Redux Logger:**
![Redux Logger Console](docs/screenshots/04_redux_logger_console.png)

---

### PHẦN B: TỐI ƯU HIỆU NĂNG & STRESS TEST 10.000 BÀI TẬP

#### 1. Bảng Đối Sánh Hiệu Năng Trước & Sau Tối Ưu (Lighthouse & Browser Metrics)

| Chỉ Số Đo Lường | Trước Khi Tối Ưu (Baseline) | Sau Khi Tối Ưu (Lab 02) | Kỹ Thuật Áp Dụng | Đánh Giá Cải Thiện |
| :--- | :---: | :---: | :--- | :---: |
| **Số lượng DOM Nodes trong bộ nhớ** | > 10.000 DOM Nodes | **~7 – 10 DOM Nodes** | **Virtualization** với `react-window` | **Giảm ~99.9% DOM** |
| **Thời gian First Contentful Paint (FCP)** | 3.4 s (Chậm) | **0.6 s (Cực nhanh)** | Virtualization + Code Splitting | **Nhanh hơn 5.6 lần** |
| **Thời gian Largest Contentful Paint (LCP)** | 6.6 s (Kém) | **0.9 s (Xuất sắc)** | Virtualization + Lazy Loading | **Nhanh hơn 7.3 lần** |
| **Total Blocking Time (TBT)** | 230 ms | **10 ms** | React.memo + useDebounce | **Triệt tiêu nghẽn luồng** |
| **Điểm Google Lighthouse Performance** | **49 / 100 (Vùng Đỏ)** | **99 / 100 (Vùng Xanh Lá)** | 4 Kỹ thuật tối ưu kết hợp | **+50 điểm hiệu năng** |
| **Tốc độ khung hình khi cuộn (Scroll FPS)** | 8 – 15 FPS (Giật khung hình) | **60 FPS (Cực mượt)** | Windowing & Row recycling | **Đạt chuẩn 60 FPS** |
| **Tách gói mã nguồn trang Thống kê** | Gộp vào Main Bundle (+35KB) | **Tách Chunk riêng (Lazy loaded)** | `React.lazy` & `Suspense` | **Giảm kích thước bundle tải đầu** |

#### 2. Chi tiết 4 Kỹ Thuật Tối Ưu Đã Triển Khai
1. **`React.memo` & `useCallback`:** Bọc toàn bộ component thẻ bài tập `BaseAssignmentCard` bằng `React.memo` so sánh nông props; kết hợp `useCallback` tại `App.tsx` cho các hàm xử lý `handleToggleStatus`, `handleDeleteAssignment`, `handleTogglePin` để đảm bảo reference props không bị thay đổi.
2. **`useDebounce` (300ms) & `useMemo` Bộ lọc:** Ô tìm kiếm trì hoãn phát tín hiệu filter 300ms, giúp người dùng gõ văn bản liên tục mượt mà mà không kích hoạt lọc mảng 10.000 phần tử liên tục. Bộ lọc mảng sử dụng `useMemo` tái tính toán khi tiêu chí thay đổi.
3. **Ảo hoá danh sách (Virtualization) với `react-window`:** Khi danh sách vượt quá 50 phần tử (chế độ stress test 10.000 bài), component `VirtualizedAssignmentList` tự động kích hoạt, chỉ render các phần tử nằm trong khung nhìn viewport (~7-10 thẻ) và tái sử dụng DOM nodes khi cuộn.
4. **Code Splitting với `React.lazy` & `Suspense`:** Component `AssignmentStats` được tách riêng thành một chunk JS độc lập (`LazyAssignmentStats`), chỉ được trình duyệt nạp về khi người dùng nhấn nút *"Thống kê"*.

---

#### 3. Minh chứng thực nghiệm Hiệu năng & Stress Test:

> **Minh chứng 05 — Dashboard Thống kê tải lười bằng `React.lazy` & `Suspense`:**
![Dashboard Thống Kê](docs/screenshots/05_lazy_stats_dashboard.png)

> **Minh chứng 06 — Stress Test 10.000 Items & Virtualization 60 FPS (~7 DOM nodes thay vì 10.000):**
![Stress Test 10k Items Virtualization](docs/screenshots/06_stress_test_10k_virtualization.png)

> **🎥 Video Thực Nghiệm Cuộn Mượt Mà 60 FPS với 10.000 Bài Tập:**
> *File video demo gốc đính kèm tại:* [`docs/videos/01_virtualization_10k_stress_test_demo.mp4`](docs/videos/01_virtualization_10k_stress_test_demo.mp4)
> 
> <video src="docs/videos/01_virtualization_10k_stress_test_demo.mp4" controls width="100%" poster="docs/screenshots/06_stress_test_10k_virtualization.png">
>   Trình duyệt không hỗ trợ xem trực tiếp, vui lòng mở file [01_virtualization_10k_stress_test_demo.mp4](docs/videos/01_virtualization_10k_stress_test_demo.mp4).
> </video>

> **Minh chứng 07 — Báo cáo Google Lighthouse Trước Tối Ưu (Score: 49/100, FCP 3.4s, LCP 6.6s):**
![Lighthouse Trước Tối Ưu](docs/screenshots/07_lighthouse_before_optimization.png)

> **Minh chứng 08 — Báo cáo Google Lighthouse Sau Tối Ưu (Score: 99/100, FCP 0.6s, LCP 0.9s, TBT 10ms):**
![Lighthouse Sau Tối Ưu](docs/screenshots/08_lighthouse_after_optimization.png)

---

### PHẦN C: HỆ THỐNG KIỂM THỬ TỰ ĐỘNG (TESTING & COVERAGE)

* **Bộ công cụ:** `Jest 29`, `ts-jest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`.
* **Kết quả thực thi:** **12/12 Test Suites PASS, 45/45 Test Cases PASS (100%)**.

```
PASS  src/utils/__tests__/generate10kAssignments.test.ts
PASS  src/store/__tests__/usePinStore.test.ts
PASS  src/utils/__tests__/dateCalculations.test.ts
PASS  src/features/assignments/__tests__/assignmentSlice.test.ts
PASS  src/hooks/__tests__/useDeadlineCountdown.test.ts
PASS  src/hooks/__tests__/useDebounce.test.ts
PASS  src/components/__tests__/AssignmentStats.test.tsx
PASS  src/components/__tests__/VirtualizedAssignmentList.test.tsx
PASS  src/components/__tests__/AssignmentList.test.tsx
PASS  src/features/assignments/__tests__/AssignmentListAsync.test.tsx
PASS  src/components/__tests__/AssignmentCard.test.tsx
PASS  src/components/__tests__/AssignmentFormModal.test.tsx

Test Suites: 12 passed, 12 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        8.312 s
```

#### Bảng Độ Phủ Mã Nguồn (Code Coverage Table)

| Module / Thư Mục | % Statements | % Branch | % Functions | % Lines | Đánh Giá Chuẩn Đề Bài |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **All files (Toàn dự án)** | **88.65%** | **65.73%** | **83.78%** | **89.64%** | **Vượt chỉ tiêu $\ge 70\%$** |
| `components/AssignmentCard` | 88.88% | 61.36% | 66.66% | 88.23% | Đạt yêu cầu |
| `components/AssignmentList` | 100.00% | 88.00% | 100.00% | 100.00% | Đạt yêu cầu |
| `components/AssignmentStats` | 100.00% | 55.55% | 100.00% | 100.00% | Đạt yêu cầu |
| `components/VirtualizedAssignmentList` | 94.44% | 75.00% | 100.00% | 100.00% | Đạt yêu cầu |
| `features/assignments` (Redux Slice) | **75.96%** | **51.78%** | **72.72%** | **76.99%** | **Vượt chỉ tiêu $\ge 70\%$** |
| `hooks` (`useDebounce`, `useCountdown`) | 93.93% | 70.00% | 100.00% | 93.93% | Đạt yêu cầu |
| `store` (`usePinStore`) | 100.00% | 100.00% | 100.00% | 100.00% | Đạt yêu cầu |
| `utils` (`dateCalculations`, `generate10k`) | 100.00% | 83.33% | 100.00% | 100.00% | Đạt yêu cầu |

#### Phân Loại 4 Nhóm Test Cases:
1. **Unit Tests ($\ge 5$ cases):** Kiểm thử logic tính ngày `isOverdue`, `calcDaysLeft`, `calcStats`, hàm sinh `generate10kAssignments`, và toàn bộ synchronous reducers (`setStatusFilter`, `setSubjectFilter`, `setPriorityFilter`, `setSearchQuery`, `clearFilters`, `setBulkAssignments`).
2. **Component Tests với RTL & userEvent ($\ge 4$ cases):** Kiểm thử render `AssignmentCard`, thao tác toggle checkbox, nút ghim bài tập, form thêm mới `AssignmentFormModal` (validation dữ liệu rỗng, submit thành công).
3. **Bất đồng bộ (Async & Mock API Tests, $\ge 2$ cases):** Kiểm thử `AssignmentListAsync` với mock API ở cả 3 trạng thái: Đang tải (`pending`), Thành công (`fulfilled`), Lỗi tải dữ liệu (`rejected` kèm nút Thử lại).
4. **Custom Hook Tests ($\ge 1$ case):** Kiểm thử `useDebounce` với `jest.useFakeTimers()` và `jest.advanceTimersByTime(300)`, kiểm thử `useDeadlineCountdown` với các mốc thời gian khác nhau.

> **Minh chứng 09 — Bảng Độ Phủ Mã Nguồn (Code Coverage đạt 88.65% Statements):**
![Jest Test Coverage](docs/screenshots/09_jest_test_coverage.png)

---

## 📸 DANH MỤC TÀI NGUYÊN MINH CHỨNG (SCREENSHOTS & VIDEO)

| STT | Tên Tập Tin | Phân Loại | Nội Dung Minh Chứng |
| :---: | :--- | :---: | :--- |
| **01** | [`01_zustand_pinned_assignment.png`](docs/screenshots/01_zustand_pinned_assignment.png) | Hình ảnh | Ghim bài tập bằng Zustand (`usePinStore`), ưu tiên đưa lên đầu danh sách kèm tag `Đã ghim`. |
| **02** | [`02_theme_context_dark_mode.png`](docs/screenshots/02_theme_context_dark_mode.png) | Hình ảnh | Giao diện Chế độ Tối (Dark Mode) quản lý bởi `ThemeContext` độc lập bọc `useMemo`. |
| **03** | [`03_react_devtools_profiler.png`](docs/screenshots/03_react_devtools_profiler.png) | Hình ảnh | Biểu đồ Flamegraph từ React DevTools Profiler chứng minh đổi Theme không gây re-render thừa. |
| **04** | [`04_redux_logger_console.png`](docs/screenshots/04_redux_logger_console.png) | Hình ảnh | Console DevTools hiển thị Redux Logger theo dõi 3 actions: Thêm mới, Xóa, Cập nhật hoàn thành. |
| **05** | [`05_lazy_stats_dashboard.png`](docs/screenshots/05_lazy_stats_dashboard.png) | Hình ảnh | Code-splitting tải lười Dashboard Thống kê `AssignmentStats` bằng `React.lazy` và `Suspense`. |
| **06** | [`06_stress_test_10k_virtualization.png`](docs/screenshots/06_stress_test_10k_virtualization.png) | Hình ảnh | Stress Test 10.000 bài tập mẫu & Ảo hóa danh sách `react-window` mượt mà 60 FPS (~7 DOM nodes). |
| **07** | [`07_lighthouse_before_optimization.png`](docs/screenshots/07_lighthouse_before_optimization.png) | Hình ảnh | Báo cáo Google Lighthouse trước tối ưu (Điểm 49/100, FCP 3.4s, LCP 6.6s). |
| **08** | [`08_lighthouse_after_optimization.png`](docs/screenshots/08_lighthouse_after_optimization.png) | Hình ảnh | Báo cáo Google Lighthouse sau tối ưu (Điểm 99/100, FCP 0.6s, LCP 0.9s, TBT 10ms). |
| **09** | [`09_jest_test_coverage.png`](docs/screenshots/09_jest_test_coverage.png) | Hình ảnh | Bảng kết quả thực thi 45/45 Test Cases Jest & Độ phủ mã nguồn đạt 88.65% Statements. |
| **10** | [`01_virtualization_10k_stress_test_demo.mp4`](docs/videos/01_virtualization_10k_stress_test_demo.mp4) | **Video** | **Video thực nghiệm cuộn mượt mà 60 FPS với 10.000 bài tập ảo hóa trong bộ nhớ.** |

---

## 🚀 HƯỚNG DẪN KIỂM TRA & CHẠY DỰ ÁN

```bash
# 1. Kiểm tra nhánh thực hành
git checkout practice-lab-02

# 2. Cài đặt thư viện phụ thuộc
npm install

# 3. Chạy môi trường phát triển (Dev Server)
npm run dev

# 4. Chạy toàn bộ 45 Unit & Component Tests
npm test

# 5. Chạy báo cáo Coverage chi tiết
npm run test:coverage

# 6. Kiểm tra TypeScript Type-check
npm run type-check

# 7. Build bundle kiểm tra Code-Splitting
npm run build
```

---
*Bản quyền thực hành thuộc về sinh viên Nguyễn Tiến Tuấn (B23DCCC173) — Học viện Công nghệ Bưu chính Viễn thông.*
