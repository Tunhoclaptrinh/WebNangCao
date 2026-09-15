# 🎓 Student Deadline Tracker — Ứng Dụng Quản Lý Deadline Bài Tập Cá Nhân

> **Bài thực hành phòng máy số 1 (Practice Lab 01)**  
> **Sinh viên:** Nguyễn Tiến Tuấn — **MSV:** B23DCCC173  
> **Lớp:** RIPT1411-20261-02 — **Học kỳ:** HK7 (PTIT)  
> **Giảng viên:** ThS. Ngô Văn Nhận  
> **Branch bài nộp:** `practice-lab-01`  
> **Repository:** [https://github.com/Tunhoclaptrinh/WebNangCao/tree/practice-lab-01](https://github.com/Tunhoclaptrinh/WebNangCao/tree/practice-lab-01)

---

## 📌 1. Bối Cảnh & Đề Bài

Mỗi sinh viên đều đang phải theo dõi hàng chục deadline bài tập từ nhiều môn học khác nhau, dễ quên hoặc nộp trễ. **"Student Deadline Tracker"** là ứng dụng hỗ trợ sinh viên quản lý, theo dõi các bài tập sắp đến hạn một cách khoa học, trực quan và tiện lợi.

Tài liệu chi tiết đề bài được lưu trữ tại: [`docs/de-bai/Thuc-Hanh-01-Student-Deadline-Tracker.md`](./docs/de-bai/Thuc-Hanh-01-Student-Deadline-Tracker.md).

---

## 🏆 2. Đáp Ứng Đầy Đủ 7 Yêu Cầu Chức Năng

| # | Yêu Cầu Chức Năng | Hiện Thực Trong Dự Án | Trạng Thái |
|:---:|:---|:---|:---:|
| 1 | **Hiển thị danh sách bài tập** | Môn học, tên bài tập, hạn nộp, độ ưu tiên, trạng thái hoàn thành dạng thẻ Card trực quan | 🟢 Đạt 100% |
| 2 | **Thêm bài tập mới qua form** | Form Modal Ant Design với DatePicker (ngăn chọn ngày quá khứ), Select môn học, độ ưu tiên | 🟢 Đạt 100% |
| 3 | **Đánh dấu hoàn thành / bỏ đánh dấu** | Nút Checkmark đổi trạng thái với animation gạch ngang chữ và cập nhật thời gian hoàn tất | 🟢 Đạt 100% |
| 4 | **Xoá bài tập** | Nút xoá có hộp thoại xác nhận an toàn `Popconfirm` ngăn việc bấm nhầm | 🟢 Đạt 100% |
| 5 | **Lọc theo trạng thái** | `FilterGroup.Status` dạng Segmented: Tất cả / Chưa hoàn thành / Quá hạn / Đã hoàn thành | 🟢 Đạt 100% |
| 6 | **Hiển thị "Còn X ngày" hoặc "Quá hạn Y ngày"** | Custom hook `useDeadlineCountdown` tự động tính và hiển thị tag màu cảnh báo trực quan | 🟢 Đạt 100% |
| 7 | **Khởi động app tải danh sách từ API giả lập** | Redux Toolkit `createAsyncThunk` (`fetchInitialAssignments`) kết nối mock API delay 700ms | 🟢 Đạt 100% |

---

## 🧠 3. Vận Dụng Tổng Hợp Kiến Thức 3 Buổi Học

### 🔷 Buổi 1 — TypeScript Nâng Cao
- **Generics & Utility Types (`src/types/assignment.types.ts`):**
  - `CreateAssignmentPayload = Omit<Assignment, 'id' | 'createdAt' | 'completed' | 'completedAt'>`
  - `UpdateAssignmentPayload = Partial<Omit<Assignment, 'id' | 'createdAt'>> & { id: string }`
  - `Record<SubjectCode, SubjectMeta>`, `Record<Priority, PriorityMeta>`
  - Generic interfaces: `ApiResponse<T>`, `FilterCriteria<T>`.
- **Type Guards Chuyên Biệt:**
  - `isCompletedAssignment(assignment: Assignment): boolean`
  - `isOverdueAssignment(assignment: Assignment, referenceDate?: Date): boolean`
  - `isUrgentAssignment(assignment: Assignment, hoursThreshold?: number): boolean`

### 🔶 Buổi 2 — React Design Patterns
- **Compound Component Pattern (`src/components/FilterGroup/`):**
  - Quản lý ngữ cảnh bằng `FilterContext` (Context API).
  - Cấu trúc: `FilterGroup.Status`, `FilterGroup.Subject`, `FilterGroup.Priority`, `FilterGroup.Search`, `FilterGroup.Actions`.
- **Higher-Order Component - HOC (`src/hoc/withUrgentHighlight.tsx`):**
  - HOC `withUrgentHighlight` tự động kiểm tra và bọc viền phát sáng đỏ/cam cho các bài tập khẩn cấp (< 24h) hoặc đã quá hạn.
- **Custom Hook Nâng Cao (`src/hooks/useDeadlineCountdown.ts`):**
  - Tự động phân tích chênh lệch thời gian, trả về nhãn *"Còn X ngày"*, *"Hôm nay (còn Y giờ)"*, hoặc *"Quá hạn Z ngày"* cùng màu tag tương ứng.

### 🔷 Buổi 3 — Redux Toolkit Feature-Based + TypeScript
- **Cấu trúc Feature-Based:** `src/features/assignments/assignmentSlice.ts`.
- **Async Thunk:** `fetchInitialAssignments`, `createNewAssignment`, `toggleAssignmentStatus`, `deleteAssignment`, `resetAssignmentsData`.
- **Typed Hooks:** `useAppDispatch` và `useAppSelector` tại `src/app/hooks.ts`.
- **Selectors kết hợp Type Guards:** `selectFilteredAssignments`, `selectAssignmentStats`.

---

## 🎨 4. Thiết Kế Giao Diện Sáng (Ant Design Light Theme)

- **ConfigProvider Light Theme:**
  - Primary Color: `#1677ff`
  - Background Layout: `#f5f7fa`
  - Card & Container: `#ffffff`
  - Font chữ: Google Font `Inter` hiện đại
- **Trải nghiệm trực quan:**
  - Thẻ thống kê KPI với biểu đồ tròn `Progress` tỷ lệ hoàn thành.
  - Phản hồi hành động tức thời bằng `message.success` / `message.error`.
  - Nút "Dữ liệu mẫu" cho phép khôi phục lại trạng thái ban đầu bất kỳ lúc nào để demo.

---

## 🚀 5. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

```bash
# 1. Checkout sang nhánh bài thực hành phòng máy 1
git checkout practice-lab-01

# 2. Cài đặt các thư viện phụ thuộc
npm install

# 3. Chạy ở chế độ phát triển
npm run dev

# 4. Kiểm tra tính an toàn kiểu dữ liệu (0 errors)
npm run type-check

# 5. Build bản production bundle
npm run build
```

---

## 🗂️ 6. Cấu Trúc Thư Mục

```text
├── docs/                                 # Tài liệu bài học & đề bài thực hành
│   ├── de-bai/
│   │   └── Thuc-Hanh-01-Student-Deadline-Tracker.md
│   └── slides/                           # Slides Buổi 1, 2, 3
├── src/
│   ├── api/
│   │   └── mockAssignmentApi.ts          # API giả lập với Promise & setTimeout
│   ├── app/
│   │   ├── hooks.ts                      # Typed hooks useAppDispatch, useAppSelector
│   │   └── store.ts                      # Redux Toolkit store configure
│   ├── components/
│   │   ├── AssignmentCard.tsx            # Card bài tập + HOC withUrgentHighlight
│   │   ├── AssignmentFormModal.tsx       # Form Modal thêm mới + DatePicker
│   │   ├── AssignmentList.tsx            # Danh sách bài tập + Skeleton + Empty
│   │   ├── DeadlineHeader.tsx            # Header thông tin sinh viên + KPI thống kê
│   │   ├── TechArchitectureBanner.tsx    # Banner giải thích kiến trúc 3 buổi học
│   │   └── FilterGroup/                  # Compound Component lọc trạng thái
│   │       ├── FilterContext.ts
│   │       ├── FilterGroup.tsx
│   │       └── index.ts
│   ├── features/
│   │   └── assignments/
│   │       └── assignmentSlice.ts        # Redux Slice + createAsyncThunk + Selectors
│   ├── hoc/
│   │   └── withUrgentHighlight.tsx       # HOC cảnh báo deadline khẩn cấp
│   ├── hooks/
│   │   └── useDeadlineCountdown.ts       # Custom Hook tính "Còn X ngày / Quá hạn Y ngày"
│   ├── types/
│   │   └── assignment.types.ts           # Types, Generics, Utility Types, Type Guards
│   ├── App.tsx                           # Ant Design ConfigProvider Light Theme
│   ├── index.css                         # CSS reset & Inter font
│   └── main.tsx                          # React Root
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```
