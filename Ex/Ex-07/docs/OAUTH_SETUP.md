# Cấu hình GitHub OAuth

Demo đã cấu hình và kiểm chứng: https://devworkspace-ex07-b23dccc173.vercel.app

Callback demo: `https://devworkspace-ex07-b23dccc173.vercel.app/api/auth/callback/github`. Hướng dẫn dưới đây dành cho người muốn cấu hình lại môi trường local.

Credentials chạy ngay sau `npm run setup`. Để hoàn tất provider OAuth thật:

1. Đăng nhập GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
2. Application name: `DevWorkspace Ex-07`.
3. Homepage URL: `http://localhost:3000`.
4. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`.
5. Tạo Client Secret. Chỉ điền Client ID và Client Secret vào `Ex/Ex-07/.env.local`:

```dotenv
AUTH_GITHUB_ID="client-id-cua-ban"
AUTH_GITHUB_SECRET="client-secret-cua-ban"
```

Giữ nguyên AUTH_SECRET ngẫu nhiên do `npm run setup` sinh. Không gửi secret qua chat, không commit file env. Khởi động lại server sau khi sửa env. Với production, dùng HTTPS và callback cùng hostname thực tế; thay AUTH_URL, NEXT_PUBLIC_SITE_URL và build lại. `localhost` là địa chỉ của máy đang mở trình duyệt.

## Kiểm chứng thủ công sau cấu hình

- Vào `/login`, chọn GitHub. Trình duyệt phải chuyển đến github.com; xác nhận quyền truy cập rồi quay về `/dashboard`.
- Header hiển thị tên GitHub và vai trò Thành viên. `/admin/products` phải chuyển `/403`.
- `/api/auth/session` có `user.id` và `user.role: "user"`, không có access token/mật khẩu.
- Đăng xuất, tải lại `/dashboard` → `/login`.
- Thử hủy consent → thông báo lỗi có thể hiểu được, không tạo phiên giả.

OAuth dùng `providerAccountId` để lưu danh tính riêng, không tự nối với tài khoản admin theo email. Tài khoản GitHub mới luôn có role user do server gán. Nếu chưa có OAuth App, nút GitHub bị vô hiệu hóa kèm giải thích; đây không phải OAuth đã được xác thực.

Tài liệu chính thức: [GitHub provider](https://authjs.dev/getting-started/providers/github), [NextAuth installation](https://authjs.dev/getting-started/installation).
