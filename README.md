# 🌐 LẬP TRÌNH WEB NÂNG CAO - ADVANCED WEB DEVELOPMENT

[![GitHub repo](https://img.shields.io/badge/Repository-WebNangCao-blue.svg?logo=github)](https://github.com/Tunhoclaptrinh/WebNangCao)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D20-green.svg?logo=node.js)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)](#danh-mục-bài-tập-thực-hành)
[![Semester](https://img.shields.io/badge/H%E1%BB%8Dc%20K%E1%BB%B3-HK7-orange.svg)](#)

> Repository lưu trữ và quản lý toàn bộ các bài tập thực hành (Labs), bài tập lớn, mã nguồn và tài liệu liên quan cho môn học **Lập trình Web nâng cao**.

---

## 📌 Thông Tin Chung

- **Môn học:** Lập trình Web Nâng Cao
- **Học kỳ:** HK7
- **Tác giả / Sinh viên:** [Tunhoclaptrinh](https://github.com/Tunhoclaptrinh)
- **Repository:** [https://github.com/Tunhoclaptrinh/WebNangCao](https://github.com/Tunhoclaptrinh/WebNangCao)

---

## 🗂️ Cấu Trúc Thư Mục (Repository Structure)

Toàn bộ các bài tập được chuẩn hoá theo từng thư mục riêng biệt độc lập để dễ dàng cài đặt, quản lý dependencies và chấm điểm:

```text
BaiTap/
├── .gitignore               # Cấu hình bỏ qua các file không cần thiết (node_modules, build, env...)
├── README.md                # Mục lục chính, giới thiệu và lộ trình bài tập
│
├── docs/                    # Tài liệu tham khảo môn học, slide, đề bài
│   ├── de-bai/              # Nơi lưu trữ file đề bài gốc (PDF, ảnh, docx...)
│   └── README.md            # Ghi chú tài liệu học tập
│
├── Lab-01/                  # Bài tập thực hành số 01
│   ├── README.md            # Yêu cầu đề bài, hướng dẫn chạy và demo Lab 01
│   └── ...                  # Mã nguồn bài tập Lab 01
│
├── Lab-02/                  # Bài tập thực hành số 02 (sắp tới)
└── ...
```

---

## 📋 Danh Mục Bài Tập Thực Hành

| STT | Bài Tập | Thư Mục | Nội Dung / Yêu Cầu Chính | Công Nghệ | Trạng Thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 01 | [**Lab 01**](./Lab-01/) | [`Lab-01/`](./Lab-01/) | Khởi tạo môi trường, bài tập thực hành số 1 | HTML/CSS/JS, Vite / React / Node.js | 🟡 Đang chuẩn bị |
| 02 | **Lab 02** | [`Lab-02/`](./Lab-02/) | Bài tập thực hành số 2 | *Đang cập nhật* | ⏳ Chưa bắt đầu |
| 03 | **Lab 03** | [`Lab-03/`](./Lab-03/) | Bài tập thực hành số 3 | *Đang cập nhật* | ⏳ Chưa bắt đầu |
| 04 | **Lab 04** | [`Lab-04/`](./Lab-04/) | Bài tập thực hành số 4 | *Đang cập nhật* | ⏳ Chưa bắt đầu |
| 05 | **Lab 05** | [`Lab-05/`](./Lab-05/) | Bài tập thực hành số 5 | *Đang cập nhật* | ⏳ Chưa bắt đầu |
| 06 | **Lab 06** | [`Lab-06/`](./Lab-06/) | Bài tập thực hành số 6 | *Đang cập nhật* | ⏳ Chưa bắt đầu |
| 07 | **Lab 07** | [`Lab-07/`](./Lab-07/) | Bài tập thực hành số 7 | *Đang cập nhật* | ⏳ Chưa bắt đầu |
| 08 | **Đồ án** | `Project/` | Đồ án môn học Lập trình Web Nâng Cao | *Đang cập nhật* | ⏳ Chưa bắt đầu |

> *Ghi chú trạng thái:*
> - 🟢 **Hoàn thành:** Đã hoàn thiện toàn bộ yêu cầu, test kỹ và có tài liệu demo.
> - 🟡 **Đang thực hiện:** Đang trong quá trình code và kiểm thử.
> - ⏳ **Chưa bắt đầu:** Chưa đến lịch học hoặc chưa có đề bài.

---

## ⚙️ Hướng Dẫn Cài Đặt & Chạy Môi Trường Chung

### 1. Yêu cầu hệ thống (Prerequisites)
- [Node.js](https://nodejs.org/) (khuyến nghị phiên bản LTS >= 20.x)
- Quản lý gói: `npm` (có sẵn với Node.js) hoặc `pnpm` / `yarn`
- [Git](https://git-scm.com/)

### 2. Hướng dẫn Clone và Thao tác
```bash
# Clone repository
git clone https://github.com/Tunhoclaptrinh/WebNangCao.git

# Di chuyển vào thư mục bài tập
cd WebNangCao

# Vào thư mục bài tập cần chạy (Ví dụ Lab-01)
cd Lab-01

# Cài đặt dependencies (nếu bài tập có package.json)
npm install

# Khởi chạy dev server
npm run dev
```

---

## 📝 Quy Chuẩn Thực Hiện & Commit

- **Tổ chức thư mục:** Mỗi bài tập nằm trong một thư mục riêng (`Lab-XX`). Bên trong thư mục luôn có file `README.md` trình bày:
  1. Đề bài và mục tiêu
  2. Hướng dẫn chạy và test
  3. Ảnh minh hoạ / Kết quả thực hiện
- **Quy chuẩn Git Commit:** Áp dụng Conventional Commits:
  - `feat(Lab-01): hoàn thành chức năng X`
  - `fix(Lab-01): sửa lỗi hiển thị layout`
  - `docs(README): cập nhật danh mục bài tập`
  - `refactor(Lab-01): tối ưu hoá cấu trúc component`
