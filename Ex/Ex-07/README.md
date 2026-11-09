# Ex-07 · DevWorkspace — Next.js

Bài tập tuần 8 · Lập trình Web Nâng Cao

Sinh viên: **Nguyễn Tiến Tuấn — B23DCCC173** · Lớp **RIPT1411-20261-02**

Giảng viên: **Ngô Văn Nhận**

Tiếp nối cửa hàng DevWorkspace ở Ex-03–06 bằng ứng dụng Next.js App Router: tra cứu thiết bị, lưu sản phẩm theo tài khoản, đăng nhập email/GitHub, quản trị giá/tồn kho và SEO phía server.

Demo public: https://devworkspace-ex07-b23dccc173.vercel.app

Đã kiểm chứng đăng nhập GitHub thật, Credentials và phân quyền trên demo. [Minh chứng demo](docs/evidence/demo/smoke-results.json) · [OAuth](docs/evidence/demo/oauth-results.json).

## Chạy bài

Node.js 22 LTS (>= 22.12); npm. Chạy trong đúng thư mục này:

```bash
npm ci
npm run setup
npm run dev
```

Mở http://localhost:3000. Setup tạo `.env.local` với secret ngẫu nhiên, migrate SQLite, seed dữ liệu. Chạy lại setup không ghi đè tài khoản/sản phẩm đã sửa. Dữ liệu local không được commit. Để đưa dữ liệu mẫu về ban đầu: `node --env-file=.env.local node_modules/prisma/build/index.js migrate reset --force` (xóa dữ liệu local).

| Vai trò | Email                    | Mật khẩu mẫu |
| ------- | ------------------------ | ------------ |
| user    | user@devworkspace.local  | Demo@12345   |
| admin   | admin@devworkspace.local | Demo@12345   |

Chỉ dùng các tài khoản này cho bài tập local. **GitHub OAuth cần đăng ký OAuth App riêng:** [hướng dẫn](docs/OAUTH_SETUP.md). Khi chưa cấu hình, UI thông báo và không giả lập đăng nhập thành công.

## Kiểm tra

```bash
npm run typecheck
npm run lint
npm test
npm run test:coverage
npm run build
npm run test:e2e
npm start
# Trong terminal khác, sau khi production server chạy tại port 3000:
npm run benchmark -- optimized
```

Playwright chạy trên production port 3100 với build `.next-e2e` và database `e2e.db` riêng, khởi tạo lại trước mỗi lần chạy. Không đụng `dev.db`. Chrome mặc định `/usr/bin/google-chrome`; có thể truyền `CHROME_PATH` tới trình duyệt Chromium trên máy bạn. Windows cần điều chỉnh đường dẫn trình duyệt. Không cần chạy app port 3000 cho test:e2e. Ảnh minh chứng lưu có chủ đích tại `docs/evidence/screenshots`; cache, traces và report tạm được ignore.

## Tuyến và quyền

| Tuyến                                | Quyền        | Kết xuất                                         |
| ------------------------------------ | ------------ | ------------------------------------------------ |
| `/`, `/products`, `/products/[slug]` | Công khai    | SSG + ISR 60 giây; revalidate sau admin mutation |
| `/login`                             | Công khai    | Dynamic; email/password + GitHub                 |
| `/dashboard`                         | Đã đăng nhập | SSR, noindex; dữ liệu theo session user ID       |
| `/admin`, `/admin/products`          | admin        | Middleware + page + DAL + action; noindex        |
| `/api/me/favorites`                  | Đã đăng nhập | Authenticated GET, private/no-store              |
| `/403`                               | Công khai    | Thông báo bị từ chối truy cập                    |

Trang công khai dùng controls native để giảm JavaScript; Ant Design và SSR Registry chỉ được nạp ở trang đăng nhập/quản trị. Header công khai giữ trang cache được; phần tài khoản là client island. Header trang riêng được Server Component render bằng actor đã xác thực. Không đặt `auth()` trong root/public layout vì sẽ biến toàn bộ catalogue thành dynamic.

## Tổ chức

```text
src/
  app/                 # App Router, metadata, OG image, sitemap, robots
  features/auth/       # Guards, role policy, Credentials, login actions
  features/products/   # Query/DAL, validation, Server Actions
  components/          # Server UI và các client island Ant Design
  lib/                 # Prisma, URL, định dạng
  types/next-auth.d.ts  # Session/User/JWT augmentation
  auth.config.ts       # JWT/session callbacks dùng được ở Edge
  auth.ts              # Node-only providers, Prisma, bcrypt
  middleware.ts        # Bảo vệ route theo JWT
prisma/                # Schema, migration SQL, seed
 tests/                # Jest + React Testing Library
 e2e/                  # Playwright trên production
```

[Đề bài và đối chiếu slide](../../docs/de-bai/Tuan-08-NextJS.md) · [Báo cáo](REPORT_EX_07.md) · [Slide Buổi 7](../../docs/slides/Buoi7_NextJS_SSR_SSG_ISR.pptx) · [Slide Buổi 8](../../docs/slides/Buoi8_NextJS_Nang_Cao.pptx).

Next.js 15 dùng `middleware.ts` để khớp đề và slide, Auth.js v5 pin chính xác bản beta trong lockfile. Prisma 6 + SQLite phù hợp một bài local; không dùng SQLite file trên filesystem tạm của serverless. Đây là bài tập có kiểm chứng, chưa phải hệ thống thương mại hoặc triển khai nhiều instance.

## Demo trên Vercel

Đã bổ sung PostgreSQL cho môi trường demo lưu bền vững; local/CI tiếp tục dùng SQLite. Cấu hình và cách deploy: [DEPLOYMENT.md](docs/DEPLOYMENT.md). Không dùng GitHub Pages để chạy phần NextAuth/Server Actions.
