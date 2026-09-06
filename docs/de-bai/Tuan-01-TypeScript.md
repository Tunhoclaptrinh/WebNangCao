# Đề Bài: LTWNC - Bài Tập Tuần 1 (Nộp Trước Buổi 2)

- **Học viện Công nghệ Bưu chính Viễn thông (PTIT)**
- **Học phần:** Lập trình Web Nâng Cao
- **Giảng viên:** ThS. Ngô Văn Nhận (0888726113 – nhannv@ptit.edu.vn)
- **Nguồn tài liệu:** Slide bài giảng `Buoi1_TypeScript_Nang_Cao.pptx` (Trang 20)

---

## 📌 Nội Dung Đề Bài

- Thiết kế bộ type TypeScript đầy đủ (`interface`, `enum`, `generic`) cho module **"Quản lý đơn hàng"**:
  - 4 thực thể chính: `Order`, `OrderItem`, `Product`, `Customer`
- Bắt buộc tái sử dụng bằng generic và Utility Types đã học (`Partial`, `Pick`, `Omit`, `Readonly`, `Record`...)
- Nộp file `.ts` kèm đoạn giải thích ngắn (vì sao thiết kế như vậy).
- Push code lên GitHub, trả lời link repo vào bài tập này.

---

## 🎯 Tiêu Chí Đánh Giá

1. **Đầy đủ type cho 4 thực thể, đúng quan hệ dữ liệu:**
   - Quan hệ 1-N giữa `Customer` và `Order`.
   - Quan hệ 1-N giữa `Order` và `OrderItem`.
   - Quan hệ N-1 giữa `OrderItem` và `Product`.
2. **Có sử dụng generic hợp lý:** Không sử dụng `any` tuỳ tiện; generic giúp linh hoạt giữa dữ liệu thô (raw ID) và dữ liệu nạp kèm (populated entity).
3. **Áp dụng đúng tối thiểu 2 Utility Types:** Khai thác các utility types chuẩn (`Partial`, `Pick`, `Omit`, `Readonly`, `Record`) để chuẩn hoá các DTOs (Create, Update, Summary).
4. **Code rõ ràng, có comment giải thích lựa chọn thiết kế:** Phân tích lý do kỹ thuật và tính khả thi trong thực tế.
5. **Nộp đúng hạn trước giờ học Buổi 2.**
