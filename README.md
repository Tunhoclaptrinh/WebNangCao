# 🧪 LẬP TRÌNH WEB NÂNG CAO - NHÁNH KHỞI TẠO THỰC HÀNH PHÒNG MÁY

> **Nhánh:** `practice-lab-init` (Template Starter Branch)  
> **Sinh viên:** Nguyễn Tiến Tuấn — **MSV:** B23DCCC173  
> **Lớp:** RIPT1411-20261-02 — **Giảng viên:** ThS. Ngô Văn Nhận  
> **Học kỳ:** HK7 — Học viện Công nghệ Bưu chính Viễn thông (PTIT)  
> **Repository:** [https://github.com/Tunhoclaptrinh/WebNangCao](https://github.com/Tunhoclaptrinh/WebNangCao)

---

## 📌 1. Mục Đích Của Nhánh `practice-lab-init`

Nhánh **`practice-lab-init`** được tạo ra đóng vai trò là **nhánh mẫu khởi tạo (Starter Template)** chuyên biệt cho tất cả các buổi thực hành phòng máy (Practice Labs). 

- **Đặc điểm:** Nhánh được dọn dẹp sạch sẽ toàn bộ mã nguồn bài tập cũ, chỉ lưu trữ tài liệu tham khảo (`docs/` gồm slides bài giảng, đề bài gốc) và cấu hình chuẩn `.gitignore`.
- **Lợi ích:** Mỗi khi có một bài thực hành phòng máy mới, sinh viên chỉ việc **checkout một nhánh mới từ `practice-lab-init`** mà không sợ xung đột mã nguồn với bài tập trên lớp lý thuyết (`main`) hay các bài thực hành khác.

---

## 🗂️ 2. Cấu Trúc Nhánh Khởi Tạo

```text
BaiTap/ (Root của nhánh practice-lab-init)
├── .gitignore                   # Cấu hình bỏ qua file build, node_modules, log...
├── README.md                    # Hướng dẫn quy trình checkout và làm bài thực hành
└── docs/                        # Tài liệu tham khảo và slide môn học
    ├── slides/                  # Slide bài giảng chính thức
    │   ├── Buoi1_TypeScript_Nang_Cao.pptx
    │   ├── Buoi2_Kien_Truc_Design_Pattern_React.pptx
    │   └── Buoi3_Redux_Toolkit_TypeScript.pptx
    └── de-bai/                  # File đề bài gốc qua các buổi
        ├── Tuan-01-TypeScript.md
        ├── Tuan-02-React-Patterns.md
        └── Tuan-03-Redux-Toolkit.md
```

---

## 🚀 3. Hướng Dẫn Quy Trình Làm Bài Thực Hành Phòng Máy Mới

### Bước 1: Đồng bộ và checkout nhánh mới từ `practice-lab-init`
Từ thư mục dự án, chạy lệnh sau trong terminal:
```bash
# 1. Chuyển về nhánh mẫu
git checkout practice-lab-init

# 2. Cập nhật mới nhất từ remote
git pull origin practice-lab-init

# 3. Tạo và chuyển sang nhánh bài thực hành mới (Ví dụ: practice-lab-01)
git checkout -b practice-lab-01
```

---

### Bước 2: Cập nhật tài liệu đề bài
1. Thêm file mô tả đề bài thực hành vào thư mục `docs/de-bai/`:
   - Ví dụ: `docs/de-bai/Thuc-Hanh-01-Student-Deadline-Tracker.md`
2. Ghi rõ: Bối cảnh, mục tiêu kiến thức (Buổi 1, Buổi 2, Buổi 3), yêu cầu chức năng (1..N), và tiêu chí đánh giá.

---

### Bước 3: Khởi tạo mã nguồn và cài đặt thư viện
Khởi tạo dự án trực tiếp tại thư mục làm việc theo công nghệ yêu cầu:
```bash
# Cài đặt các package chuẩn (Vite React TypeScript, Ant Design, Redux Toolkit):
npm install antd @ant-design/icons @reduxjs/toolkit react-redux dayjs
```

**Cấu trúc thư mục khuyến nghị cho bài thực hành:**
```text
src/
├── api/                         # Mock API giả lập (Promise, setTimeout, network delay)
├── app/                         # Cấu hình Redux store, typed hooks (useAppDispatch, useAppSelector)
├── components/                  # UI Components (Compound Components, HOCs, Modals, Cards)
├── features/                    # Redux slices feature-based (slices, asyncThunks, selectors)
├── hooks/                       # Custom Hooks (useCountdown, useFilter...)
├── types/                       # TypeScript Generics, Utility Types, Type Guards
├── App.tsx                      # ConfigProvider Ant Design Light Theme
└── main.tsx                     # Entry point React
```

---

### Bước 4: Kiểm thử và xác minh tính an toàn
Trước khi nộp bài hoặc đẩy lên Git, luôn kiểm tra:
```bash
# 1. Kiểm tra Type-check tuyệt đối không có lỗi:
npx tsc --noEmit

# 2. Build thử bản production bundle:
npm run build
```

---

### Bước 5: Commit và đẩy bài nộp lên GitHub
```bash
# Thêm toàn bộ file thay đổi
git add -A

# Commit theo chuẩn Conventional Commits
git commit -m "feat(practice-lab-01): hoan thanh ung dung Student Deadline Tracker"

# Push nhánh bài thực hành lên GitHub
git push -u origin practice-lab-01
```

---

## 📋 Danh Sách Các Nhánh Thực Hành Trong Repository

| Tên Nhánh | Buổi / Nội Dung | Trạng Thái |
| :--- | :--- | :---: |
| `main` | Nhánh chính: Chứa các bài tập lý thuyết trên lớp (`Ex/`, `Lab/`) | 🟢 Đang hoạt động |
| `practice-lab-init` | Nhánh template gốc cho các bài thực hành phòng máy | 🟢 Đang hoạt động |
| `practice-lab-01` | Thực hành phòng máy 1: **Student Deadline Tracker** (TS + Design Patterns + Redux Toolkit) | 🟢 Đang triển khai |
