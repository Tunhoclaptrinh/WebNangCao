# Demo Next.js trên Vercel

GitHub Pages chỉ phục vụ file tĩnh. Bài này có NextAuth, Middleware, Server Actions và dữ liệu theo tài khoản nên demo cần server Next.js.

- Local/CI: SQLite, chạy `npm run setup`, không cần cài PostgreSQL.
- Demo: Vercel + PostgreSQL lưu bền vững (ví dụ Neon). Không dùng file SQLite trên filesystem tạm của serverless.
- `prisma.config.ts` chọn schema/migration theo protocol của DATABASE_URL. Hai schema có cùng model; thay model phải cập nhật và tạo migration tương ứng ở cả hai.

## Thiết lập project

Import repository WebNangCao, chọn nhánh `ex-07-nextjs`, đặt Root Directory là `Ex/Ex-07`. File `vercel.json` dùng `npm run build:demo`: generate Prisma Client đúng PostgreSQL, migrate, seed dữ liệu mẫu nếu chưa có, rồi build Next.js. Build từ chối SQLite để tránh demo chạy với dữ liệu tạm.

Nếu deploy bằng CLI trực tiếp tại Ex/Ex-07, thư mục hiện tại là root project. `.vercel/` và tất cả env local được ignore.

## Environment variables

- DATABASE_URL: URL PostgreSQL cho runtime, được integration database cấp.
- DATABASE_URL_UNPOOLED: URL trực tiếp dùng migrate nếu integration có cung cấp.
- AUTH_SECRET: secret ngẫu nhiên riêng cho môi trường demo.
- AUTH_GITHUB_ID / AUTH_GITHUB_SECRET: thông tin OAuth App, nhập qua nơi quản lý env của hosting, không commit.
- AUTH_URL và NEXT_PUBLIC_SITE_URL: cùng origin HTTPS cố định của demo.

## GitHub OAuth trên demo

Trong Settings của OAuth App, thêm redirect URI `https://TEN-MIEN-DEMO/api/auth/callback/github`. Có thể giữ localhost callback riêng cho việc chạy local. Chỉ dùng hostname demo cố định, không dùng URL preview thay đổi theo từng commit.

Sau khi env được cấu hình, redeploy và kiểm thử Credentials user/admin, GitHub OAuth, /dashboard, /admin/products, Server Actions, dữ liệu sau refresh và SEO trên hostname thật. Chưa coi deploy/OAuth đã thành công nếu chưa có kết quả kiểm chứng.

Tài khoản và sản phẩm được seed là dữ liệu mẫu phục vụ bài tập. Không nhập dữ liệu cá nhân nhạy cảm vào demo. Lệnh seed không ghi đè thay đổi đã có.

Tài liệu: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Vercel CLI](https://vercel.com/docs/cli), [Neon native integration](https://neon.com/docs/guides/vercel-managed-integration).
