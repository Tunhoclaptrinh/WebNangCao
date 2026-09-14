# Đề Bài: LTWNC - Bài Tập Tuần 2 (Nộp Trước Buổi 3)

- **Học viện Công nghệ Bưu chính Viễn thông (PTIT)**
- **Học phần:** Lập trình Web Nâng Cao
- **Giảng viên:** ThS. Ngô Văn Nhận (0888726113 – nhannv@ptit.edu.vn)
- **Nguồn tài liệu:** Slide bài giảng `Buoi2_Kien_Truc_Design_Pattern_React.pptx` (Trang 20)
- **Thời hạn:** 09/09/2026 23:00 (Cho phép nộp bài sau thời gian hết hạn)

---

## 📌 Nội Dung Đề Bài

### Bài 1 — Accordion Compound Component

> Xây dựng Compound Component Accordion **hoàn chỉnh**:
> - Nhiều panel, nhưng **chỉ mở 1 panel tại một thời điểm**
> - Dùng **Context API** tương tự Tabs đã thực hành trên lớp (Buổi 2)

### Bài 2 — Custom Hook `usePagination<T>`

> Viết custom hook `usePagination<T>` áp dụng cho danh sách sản phẩm:
> - Nhận vào mảng dữ liệu `T[]` và số item/trang
> - Trả về: trang hiện tại, tổng số trang, hàm `next` / `prev` / `goToPage`

---

## 🎯 Tiêu Chí Đánh Giá

1. **Accordion hoạt động đúng:** Mở panel này thì đóng panel khác
2. **`usePagination<T>` có type generic rõ ràng:** Không dùng `any`
3. **Tách bạch logic (hook/context) và phần hiển thị (UI)**
4. **Code có tổ chức, đặt tên rõ ràng, có comment cần thiết**
5. **Nộp đúng hạn trước giờ học Buổi 3**

---

## 🏗️ Gợi Ý Kiến Trúc

### Accordion (Compound Component + Context API)

```
AccordionContext { activePanel: string | null, togglePanel: (v) => void }
  └── Accordion (Root — Provider)
        └── Accordion.Item (value="...")
              ├── Accordion.Trigger   → Button mở/đóng
              └── Accordion.Content  → Nội dung (ẩn/hiện)
```

- Chỉ lưu **1 giá trị** `activePanel` → panel cũ tự đóng khi mở panel mới

### usePagination\<T\>

```typescript
function usePagination<T>(data: T[], itemsPerPage: number) {
  return {
    currentPage,   // number (bắt đầu từ 1)
    totalPages,    // number
    currentData,   // T[]
    next,          // () => void
    prev,          // () => void
    goToPage,      // (page: number) => void
  }
}
```

---

## 📎 Liên Quan

- **Slide nguồn:** [`docs/slides/Buoi2_Kien_Truc_Design_Pattern_React.pptx`](../slides/Buoi2_Kien_Truc_Design_Pattern_React.pptx)
- **Bài thực hành buổi 2:** [`Lab/Lab-02/`](../../Lab/Lab-02/) — HOC withAuth, Tabs Compound Component, useFetch
- **Bài nộp:** [`Ex/Ex-02/`](../../Ex/Ex-02/)
