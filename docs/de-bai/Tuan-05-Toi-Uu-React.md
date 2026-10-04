# Đề Bài: LTWNC - Bài Tập Tuần 5 (Nộp Trước Buổi 6)

- **Học viện Công nghệ Bưu chính Viễn thông (PTIT)**
- **Học phần:** Lập trình Web Nâng Cao
- **Giảng viên:** ThS. Ngô Văn Nhận (0888726113 – nhannv@ptit.edu.vn)
- **Nguồn tài liệu:** Slide bài giảng `Buoi5_Toi_Uu_Hieu_Nang_React.pptx` (Trang 34, 35, 36, 38)
- **Chủ đề:** Tối Ưu Hiệu Năng Ứng Dụng React (React Performance Optimization)

---

## 📌 PHẦN 1: THỰC HÀNH TRÊN LỚP (3 BÀI THỰC HÀNH)

### Thực Hành 1/3: Sửa Re-render Thừa Bằng Profiler (Slide 34)
- **Yêu cầu:** Dùng React DevTools Profiler phát hiện component re-render thừa trong ứng dụng mẫu (giỏ hàng). Sửa bằng `React.memo` + `useCallback`.
- **Bước thực hiện:**
  1. Bật "Highlight updates when components render", thao tác thêm/xoá sản phẩm và quan sát.
  2. Xác định component nào sáng lên dù props không đổi – thường do handler tạo mới mỗi lần render.
  3. Bọc component đó bằng `React.memo`, bọc handler bằng `useCallback`, đo lại bằng Profiler.

### Thực Hành 2/3: Virtualization Cho 10.000 Sản Phẩm (Slide 35)
- **Yêu cầu:** Sinh danh sách giả lập 10.000 sản phẩm, cài đặt virtualization bằng `react-window`. So sánh thời gian render/FPS với cách render toàn bộ danh sách thông thường.
- **Bước thực hiện:**
  1. Sinh mảng 10.000 sản phẩm mock (`Array.from({ length: 10_000 }, ...)`)
  2. Thay `.map()` render toàn bộ bằng `FixedSizeList` của `react-window`.
  3. Đo lại bằng Profiler / Performance tab, ghi nhận sự khác biệt.

### Thực Hành 3/3: Lazy Load Theo Route (Slide 36)
- **Yêu cầu:** Áp dụng `React.lazy` + `Suspense` để chia nhỏ theo route/module cho ứng dụng đã xây. Kiểm tra bằng tab Network: chunk chỉ tải khi vào đúng route/module.
- **Bước thực hiện:**
  1. Liệt kê các module/route hiện có trong ứng dụng.
  2. Chuyển ít nhất 1 component sang `React.lazy(() => import(...))`.
  3. Bọc `<Suspense fallback={...}>` ở cấp Router/Modal, build production và kiểm tra chunk riêng.

---

## 📌 PHẦN 2: BÀI TẬP VỀ NHÀ (SLIDE 38)

### Yêu Cầu Đề Bài (Slide 38):
1. **Xây dựng 1 trang ReactJS cần tối ưu** (Quản lý user/product 10.000 sản phẩm…).
2. **Đo hiệu năng trang đó bằng Lighthouse TRƯỚC khi tối ưu** — lưu lại điểm số & chỉ số (FCP, LCP, TBT, CLS).
3. **Áp dụng ít nhất 2 kỹ thuật đã học** (memoization, code-splitting, virtualization...) phù hợp với vấn đề đã phát hiện.
4. **Đo lại bằng Lighthouse SAU khi tối ưu**, viết báo cáo so sánh chỉ số kèm giải pháp đã áp dụng.

### Tiêu Chí Đánh Giá (Slide 38):
- Có report Lighthouse trước và sau (ảnh chụp hoặc export HTML/JSON).
- Có ít nhất 2 chỉ số cải thiện rõ rệt (Performance score, LCP, TBT...).
- Giải pháp áp dụng phù hợp với vấn đề đã phát hiện, không tối ưu ngẫu nhiên.
- Báo cáo trình bày rõ ràng, có nhận xét hợp lý.
- Nộp đúng hạn trước giờ học Buổi 6.

---

## 🔗 Liên Kết Bài Làm Đã Hoàn Thành:
- **Thư mục bài làm:** [`Ex/Ex-05/`](../../Ex/Ex-05/)
- **Báo cáo chi tiết:** [`Ex/Ex-05/README.md`](../../Ex/Ex-05/README.md)
- **Báo cáo Lighthouse gốc:** [`Ex/Ex-05/reports/`](../../Ex/Ex-05/reports/)
