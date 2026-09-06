# 🌐 LẬP TRÌNH WEB NÂNG CAO - ADVANCED WEB DEVELOPMENT

[![GitHub repo](https://img.shields.io/badge/Repository-WebNangCao-blue.svg?logo=github)](https://github.com/Tunhoclaptrinh/WebNangCao)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D20-green.svg?logo=node.js)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)](#-danh-mục-các-bài-đã-có)
[![Semester](https://img.shields.io/badge/H%E1%BB%8Dc%20K%E1%BB%B3-HK7-orange.svg)](#)

> Repository quản lý các bài thực hành (**Lab**) và bài tập (**Ex**) môn học **Lập trình Web Nâng Cao**.

---

## 📌 Thông Tin Chung

- **Môn học:** Lập trình Web Nâng Cao
- **Học kỳ:** HK7
- **Tác giả / Sinh viên:** [Tunhoclaptrinh](https://github.com/Tunhoclaptrinh)
- **Repository:** [https://github.com/Tunhoclaptrinh/WebNangCao](https://github.com/Tunhoclaptrinh/WebNangCao)

---

## 🗂️ Cấu Trúc Thư Mục (Repository Structure)

Repository được phân chia đồng bộ làm **2 khu vực chính**:
1. 🧪 **`Lab/`**: Chứa toàn bộ các bài thực hành trên lớp / phòng máy (`Lab-01`, `Lab-02`,...).
2. 📝 **`Ex/`**: Chứa toàn bộ các bài tập về nhà, bài tập tuần, bài tập rèn luyện (`Ex-01`, `Ex-02`,...).

```text
BaiTap/ (Workspace Root)
├── .gitignore               # Cấu hình bỏ qua file build, node_modules, env...
├── README.md                # Mục lục chính, chỉ gán các bài đã có
│
├── docs/                    # Tài liệu tham khảo, slide môn học, file đề bài gốc
│   └── de-bai/              # Nơi lưu file đề bài (PDF, ảnh, docx...)
│
├── Lab/                     # Khu vực 1: BÀI THỰC HÀNH (LAB)
│   ├── README.md            # Mục lục khu vực Lab
│   └── Lab-01/              # Bài thực hành số 1
│       └── README.md
│
└── Ex/                      # Khu vực 2: BÀI TẬP (EXERCISES)
    └── README.md            # Mục lục khu vực Bài tập
```

---

## 📋 Danh Mục Các Bài Đã Có

### 🧪 1. Danh Sách Bài Thực Hành (Lab)

| STT | Tên Lab | Đường Dẫn Thư Mục | Nội Dung / Yêu Cầu Chính | Công Nghệ | Trạng Thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 01 | [**Lab 01**](./Lab/Lab-01/) | [`Lab/Lab-01/`](./Lab/Lab-01/) | Khởi tạo môi trường & bài thực hành số 1 | HTML/CSS/JS, Node.js | 🟡 Đang chuẩn bị |

---

### 📝 2. Danh Sách Bài Tập (Ex)

| STT | Tên Bài Tập | Đường Dẫn Thư Mục | Nội Dung / Yêu Cầu Chính | Công Nghệ | Trạng Thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| — | *(Chưa có bài tập nào)* | — | Sẽ cập nhật khi có bài tập mới | — | ⏳ Chờ cập nhật |

> *Ghi chú:*
> - Danh mục chỉ hiển thị các bài tập đã có trong repository. Khi có bài mới sẽ được bổ sung trực tiếp vào bảng tương ứng.
> - Trạng thái: 🟢 Hoàn thành | 🟡 Đang thực hiện / chuẩn bị | 🔴 Cần chỉnh sửa.

---

## ⚙️ Hướng Dẫn Cài Đặt & Chạy Môi Trường Chung

### 1. Yêu cầu hệ thống
- [Node.js](https://nodejs.org/) (khuyến nghị phiên bản LTS >= 20.x)
- Trình quản lý gói: `npm` / `pnpm` / `yarn`
- [Git](https://git-scm.com/)

### 2. Hướng dẫn chạy bài tập cụ thể
```bash
# Clone repository
git clone https://github.com/Tunhoclaptrinh/WebNangCao.git
cd WebNangCao

# Vào thư mục bài thực hành hoặc bài tập cần chạy (Ví dụ Lab 01)
cd Lab/Lab-01
# Hoặc bài tập:
# cd Ex/Ex-01

# Cài đặt dependencies (nếu có package.json)
npm install

# Chạy project
npm run dev
```

---

## 📝 Quy Chuẩn Git Commit

- `feat(Lab-01): hoàn thành chức năng X`
- `feat(Ex-01): nộp bài tập số 1`
- `fix(Lab-01): sửa lỗi giao diện Y`
- `docs(README): cập nhật bài mới vào danh mục`
