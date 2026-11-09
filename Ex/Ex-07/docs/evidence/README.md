# Minh chứng Ex-07

Ảnh trình duyệt production được chụp ngày 09/11/2026. Desktop 1440×1000, mobile 390×844; modal chụp theo viewport. Các ảnh quản trị trước khi xác nhận thay đổi, dữ liệu test tách khỏi dữ liệu local.

| Ảnh | Nội dung |
| --- | --- |
| [01-home-desktop.png](screenshots/01-home-desktop.png) | Trang chủ desktop |
| [02-catalogue-desktop.png](screenshots/02-catalogue-desktop.png) | Bộ sưu tập desktop |
| [03-login-desktop.png](screenshots/03-login-desktop.png) | Đăng nhập desktop |
| [04-forbidden.png](screenshots/04-forbidden.png) | User bị từ chối vào quản trị |
| [05-product-desktop.png](screenshots/05-product-desktop.png) | Chi tiết sản phẩm desktop, đã lưu |
| [06-dashboard-user.png](screenshots/06-dashboard-user.png) | Dashboard user |
| [07-admin-desktop.png](screenshots/07-admin-desktop.png) | Quản trị desktop |
| [08-admin-edit.png](screenshots/08-admin-edit.png) | Hộp sửa sản phẩm desktop |
| [09-home-mobile.png](screenshots/09-home-mobile.png) | Trang chủ mobile |
| [10-catalogue-mobile.png](screenshots/10-catalogue-mobile.png) | Bộ sưu tập mobile |
| [11-product-mobile.png](screenshots/11-product-mobile.png) | Chi tiết mobile |
| [12-login-mobile.png](screenshots/12-login-mobile.png) | Đăng nhập mobile |
| [13-dashboard-mobile.png](screenshots/13-dashboard-mobile.png) | Dashboard mobile |
| [14-admin-mobile.png](screenshots/14-admin-mobile.png) | Quản trị mobile, cuộn ngang bên trong bảng |
| [15-admin-edit-mobile.png](screenshots/15-admin-edit-mobile.png) | Hộp sửa sản phẩm mobile |

Lighthouse: [baseline](lighthouse/baseline/summary.json), [bản cuối](lighthouse/optimized/summary.json), [vòng trung gian](lighthouse/iteration-1/summary.json). Mỗi thư mục có raw JSON của cả 3 lần/trang và HTML của lần Performance trung vị. Tải file HTML về rồi mở bằng trình duyệt để xem đầy đủ.

Ảnh GitHub OAuth thật chưa có vì chưa cấu hình OAuth App; không dùng ảnh giả thay cho đăng nhập thành công.

## Ảnh chụp kết quả Lighthouse thực tế

Bốn ảnh dưới đây được chụp trực tiếp khi mở báo cáo HTML gốc của lần đo có Performance trung vị. Ảnh thể hiện URL, bốn nhóm điểm và các chỉ số FCP/LCP/TBT/CLS. Không dựng lại bảng điểm và không đo lại để tạo ảnh. Số liệu chi tiết trong JSON có thể nhiều chữ số hơn giá trị làm tròn trên giao diện Lighthouse.

| Ảnh | Performance / Accessibility / Best Practices / SEO | Báo cáo HTML gốc |
| --- | --- | --- |
| [Danh sách — trước tối ưu](lighthouse/screenshots/01-catalogue-before.png) | 91 / 94 / 100 / 100 | [baseline/catalogue-median.html](lighthouse/baseline/catalogue-median.html) |
| [Danh sách — sau tối ưu](lighthouse/screenshots/02-catalogue-after.png) | 98 / 100 / 100 / 100 | [optimized/catalogue-median.html](lighthouse/optimized/catalogue-median.html) |
| [Chi tiết — trước tối ưu](lighthouse/screenshots/03-product-before.png) | 96 / 96 / 96 / 100 | [baseline/product-median.html](lighthouse/baseline/product-median.html) |
| [Chi tiết — sau tối ưu](lighthouse/screenshots/04-product-after.png) | 100 / 100 / 100 / 100 | [optimized/product-median.html](lighthouse/optimized/product-median.html) |

Tổng cộng: **15 ảnh giao diện + 4 ảnh kết quả đo**. Thời điểm đo và báo cáo nguồn của từng ảnh được ghi trong [verification.json](verification.json).
