# 📸 Bộ Minh Chứng Kiểm Thử & Giao Diện Ex-07

> **Học phần:** Lập trình Web Nâng Cao · **Bài tập tuần 8 — Next.js**  
> **Sinh viên:** Nguyễn Tiến Tuấn — **B23DCCC173** · **Lớp:** RIPT1411-20261-02  
> **Giảng viên hướng dẫn:** ThS. Ngô Văn Nhận  
> **URL Demo Trực Tuyến:** https://devworkspace-ex07-b23dccc173.vercel.app  

Tất cả ảnh chụp dưới đây được ghi nhận trực tiếp từ hệ thống đang hoạt động thực tế (gồm cả môi trường chạy production local và môi trường cloud public trên Vercel / Neon PostgreSQL).

---

## 🌐 PHẦN 1: MINH CHỨNG DEMO PUBLIC & KIỂM CHỨNG GITHUB OAUTH THẬT

> **URL Ứng dụng Public:** https://devworkspace-ex07-b23dccc173.vercel.app  
> **Cơ sở dữ liệu:** Neon PostgreSQL Free (Region: Singapore)  
> **Dữ liệu kiểm thử tự động:** [smoke-results.json](demo/smoke-results.json) · [oauth-results.json](demo/oauth-results.json) · [seo.json](demo/seo.json)

### 1. Hộp thoại Ủy quyền GitHub OAuth (Consent Dialog thực tế)
*Cửa sổ `github.com/login/oauth/authorize` yêu cầu cấp quyền đọc thông tin cơ bản (email & profile read-only) cho ứng dụng `DevWorkspcae Ex-07` của sinh viên Nguyễn Tiến Tuấn.*
![Xác thực GitHub OAuth thực tế](demo/00-oauth-authorize-consent.jpg)

---

### 2. Trang Đăng nhập Demo (Hỗ trợ GitHub Provider & Email/Mật khẩu)
*Tích hợp cả nút 'Đăng nhập với GitHub' và biểu mẫu Credentials thông thường.*
![Trang đăng nhập có GitHub](demo/03-login-github-enabled.png)

---

### 3. Dashboard Thành viên sau khi Đăng nhập qua GitHub OAuth thật
*Hệ thống ghi nhận callback thành công, gán vai trò `user` (Thành viên) và hiển thị chào mừng người dùng GitHub.*
![Dashboard Thành viên GitHub](demo/07-github-dashboard.png)

---

### 4. Kiểm tra Phân quyền (RBAC): Chặn User GitHub khỏi Trang Quản trị (`/403`)
*Khi tài khoản GitHub có role `user` cố gắng truy cập `/admin/products`, Middleware và Page Guard lập tức chặn lại và điều hướng về trang 403 Forbidden.*
![Chặn truy cập quản trị 403](demo/08-github-forbidden.png)

---

### 5. Trang chủ Công khai trên Domain HTTPS Public
*Giao diện tĩnh được render trước (SSG + ISR), tốc độ phản hồi cực nhanh trên hạ tầng Vercel Edge.*
![Trang chủ public](demo/01-public-home.png)

---

### 6. Danh mục Sản phẩm & Bộ lọc trên Demo Public
*Dữ liệu sản phẩm hiển thị đầy đủ, hỗ trợ lọc theo danh mục và tìm kiếm nhanh.*
![Danh mục sản phẩm public](demo/02-public-catalogue.png)

---

### 7. Dashboard Tài khoản User (Credentials) & Danh sách Sản phẩm đã lưu
*Lưu trữ và đồng bộ hóa danh sách sản phẩm yêu thích độc lập theo từng tài khoản trên PostgreSQL.*
![Dashboard user credentials](demo/04-user-dashboard.png)

---

### 8. Trang Quản trị Sản phẩm trên Cloud Database PostgreSQL (Neon)
*Bảng quản trị Ant Design chuyên nghiệp: xem tồn kho, giá bán và cập nhật thông tin sản phẩm.*
![Quản trị sản phẩm PostgreSQL](demo/05-admin.png)

---

### 9. Giao diện Danh mục Sản phẩm trên Thiết bị Di động (Mobile View Demo)
*Thiết kế Responsive mượt mà trên khung hình điện thoại di động.*
![Danh mục sản phẩm mobile](demo/06-mobile-catalogue.png)

---

## ⚡ PHẦN 2: BÁO CÁO ĐO LƯỜNG HIỆU NĂNG GOOGLE LIGHTHOUSE

Bốn ảnh dưới đây được chụp trực tiếp từ báo cáo HTML gốc của Google Lighthouse (chạy trên build production local):

### 1. Trang Danh mục Sản phẩm (`/products`) — Trước tối ưu (Score 91)
*Điểm đo: Performance 91 · Accessibility 94 · Best Practices 100 · SEO 100. [Báo cáo gốc HTML](lighthouse/baseline/catalogue-median.html)*
![Lighthouse Catalogue Trước](lighthouse/screenshots/01-catalogue-before.png)

---

### 2. Trang Danh mục Sản phẩm (`/products`) — Sau tối ưu (Score 98)
*Điểm đo: Performance 98 · Accessibility 100 · Best Practices 100 · SEO 100. Tối ưu bundle Ant Design và ảnh webp. [Báo cáo gốc HTML](lighthouse/optimized/catalogue-median.html)*
![Lighthouse Catalogue Sau](lighthouse/screenshots/02-catalogue-after.png)

---

### 3. Trang Chi tiết Sản phẩm (`/products/[slug]`) — Trước tối ưu (Score 96)
*Điểm đo: Performance 96 · Accessibility 96 · Best Practices 96 · SEO 100. [Báo cáo gốc HTML](lighthouse/baseline/product-median.html)*
![Lighthouse Product Trước](lighthouse/screenshots/03-product-before.png)

---

### 4. Trang Chi tiết Sản phẩm (`/products/[slug]`) — Sau tối ưu (Score 100 Tuyệt Đối)
*Điểm đo: Performance 100 · Accessibility 100 · Best Practices 100 · SEO 100. Đạt điểm số hoàn hảo 4x100. [Báo cáo gốc HTML](lighthouse/optimized/product-median.html)*
![Lighthouse Product Sau](lighthouse/screenshots/04-product-after.png)

---

## 🖥️ PHẦN 3: GIAO DIỆN DESKTOP & MOBILE TRÊN MÔI TRƯỜNG PRODUCTION LOCAL

### 1. Giao diện Desktop (1440 × 1000)

| STT | Tên ảnh | Minh chứng trực quan |
| :---: | :--- | :--- |
| 01 | **Trang chủ Desktop** | ![Trang chủ desktop](screenshots/01-home-desktop.png) |
| 02 | **Bộ sưu tập Desktop** | ![Bộ sưu tập desktop](screenshots/02-catalogue-desktop.png) |
| 03 | **Trang Đăng nhập Desktop** | ![Đăng nhập desktop](screenshots/03-login-desktop.png) |
| 04 | **Màn hình Chặn 403 Forbidden** | ![Chặn 403 desktop](screenshots/04-forbidden.png) |
| 05 | **Chi tiết Sản phẩm (Đã yêu thích)** | ![Chi tiết desktop](screenshots/05-product-desktop.png) |
| 06 | **Dashboard Tài khoản User** | ![Dashboard user desktop](screenshots/06-dashboard-user.png) |
| 07 | **Trang Quản trị Admin Desktop** | ![Admin desktop](screenshots/07-admin-desktop.png) |
| 08 | **Modal Chỉnh sửa Sản phẩm Admin** | ![Admin edit modal](screenshots/08-admin-edit.png) |

---

### 2. Giao diện Mobile (390 × 844)

| STT | Tên ảnh | Minh chứng trực quan |
| :---: | :--- | :--- |
| 09 | **Trang chủ Mobile** | ![Trang chủ mobile](screenshots/09-home-mobile.png) |
| 10 | **Bộ sưu tập Mobile** | ![Bộ sưu tập mobile](screenshots/10-catalogue-mobile.png) |
| 11 | **Chi tiết Sản phẩm Mobile** | ![Chi tiết mobile](screenshots/11-product-mobile.png) |
| 12 | **Trang Đăng nhập Mobile** | ![Đăng nhập mobile](screenshots/12-login-mobile.png) |
| 13 | **Dashboard Tài khoản Mobile** | ![Dashboard mobile](screenshots/13-dashboard-mobile.png) |
| 14 | **Quản trị Bảng Sản phẩm Mobile** | ![Admin mobile](screenshots/14-admin-mobile.png) |
| 15 | **Modal Chỉnh sửa Mobile** | ![Admin edit mobile](screenshots/15-admin-edit-mobile.png) |
