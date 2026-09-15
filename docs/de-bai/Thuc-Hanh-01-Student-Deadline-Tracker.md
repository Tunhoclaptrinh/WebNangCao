# 📝 Đề Bài Thực Hành Phòng Máy Số 1: Student Deadline Tracker

> **Môn học:** Lập trình Web Nâng Cao (LTWNC - HK7)  
> **Giảng viên:** ThS. Ngô Văn Nhận  
> **Chủ đề:** Ứng dụng Quản lý Deadline Bài tập Cá nhân (Student Deadline Tracker)

---

## 🎯 1. Bối Cảnh

Mỗi sinh viên đều đang phải theo dõi hàng chục deadline bài tập từ nhiều môn học khác nhau, dễ quên hoặc nộp trễ. Sinh viên sẽ xây dựng **"Student Deadline Tracker" — Ứng dụng quản lý deadline bài tập cá nhân**, giúp theo dõi các bài tập sắp đến hạn của chính mình.

---

## 🚀 2. Mục Tiêu

Vận dụng tổng hợp các nội dung đã học trên lớp:
- **Buổi 1 — TypeScript nâng cao:** `generic`, `utility types`, `type guard`.
- **Buổi 2 — Design pattern React:** `custom hook` nâng cao + 1 trong 2 pattern `HOC` / `Compound Component`.
- **Buổi 3 — Redux Toolkit + TypeScript:** `feature-based structure`, `typed hooks`, `createAsyncThunk`.

---

## 📋 3. Yêu Cầu Chức Năng

1. **Hiển thị danh sách bài tập:** môn học, tên bài tập, hạn nộp, độ ưu tiên, trạng thái hoàn thành.
2. **Thêm bài tập mới qua form:** (môn học, tên bài tập, hạn nộp, độ ưu tiên).
3. **Đánh dấu hoàn thành / bỏ đánh dấu.**
4. **Xoá bài tập.**
5. **Lọc theo trạng thái:** Tất cả / Chưa hoàn thành / Quá hạn / Đã hoàn thành.
6. **Mỗi bài tập hiển thị:** "Còn X ngày" hoặc "Quá hạn Y ngày" (hoặc "Hôm nay đến hạn").
7. **Khi khởi động app:** lấy danh sách mẫu ban đầu từ 1 API giả lập (`createAsyncThunk`).

---

## 🛠️ 4. Yêu Cầu Kỹ Thuật Chi Tiết

### TypeScript Nâng Cao (Buổi 1)
- Tạo các interface / types: `Assignment`, `Subject`, `Priority` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), `AssignmentFilterStatus`.
- Sử dụng Generic Types và Utility Types (`Pick`, `Omit`, `Partial`, `Record`).
- Viết các hàm Type Guards:
  - `isOverdueAssignment(assignment: Assignment): boolean`
  - `isCompletedAssignment(assignment: Assignment): boolean`
  - `isUrgentAssignment(assignment: Assignment): boolean`

### React Design Patterns (Buổi 2)
- **Compound Component Pattern:** Xây dựng `FilterGroup` Compound Component gồm `FilterGroup`, `FilterGroup.Status`, `FilterGroup.Priority`, `FilterGroup.Search` chia sẻ ngữ cảnh qua `FilterContext`.
- **Higher-Order Component (HOC):** `withUrgencyHighlight` bọc thẻ bài tập và tự động tô điểm viền / badge cảnh báo cho các deadline khẩn cấp (< 24h).
- **Custom Hooks:**
  - `useDeadlineCountdown(dueDate: string)`: Tính toán thời gian thực chính xác: "Còn X ngày Y giờ", "Hôm nay", "Quá hạn Y ngày".
  - `useAssignmentFilter(items, filter)`: Custom hook lọc danh sách theo nhiều tiêu chí.

### Redux Toolkit & Feature-Based (Buổi 3)
- Cấu trúc thư mục theo tính năng: `src/features/assignments/`.
- Quản lý trạng thái bằng `assignmentSlice.ts` (`createSlice`, `createAsyncThunk`).
- Giả lập API trong `src/api/mockAssignmentApi.ts` với `setTimeout` 800ms mô phỏng độ trễ mạng thực tế.
- Store trung tâm `src/app/store.ts` với `useAppDispatch` và `useAppSelector`.

### Giao Diện & Trải Nghiệm Người Dùng (UI/UX)
- Thiết kế giao diện sáng (**Light Theme**) sử dụng **Ant Design 5.x (`antd`) + `@ant-design/icons`**.
- Thẻ thống kê KPI với `Statistic`, bộ đếm số lượng bài tập theo trạng thái.
- Form nhập bài tập mượt mà với `Modal`, `Form`, `DatePicker`, `Select`.
- Thông báo tương tác (Feedback) nhanh chóng bằng `message` API của Ant Design.
