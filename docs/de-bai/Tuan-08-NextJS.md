# LTWNC — Bài tập tuần 8 — Next.js

Nơi làm bài: [Ex/Ex-07](../../Ex/Ex-07/). **Ex-07 là số thứ tự bài trong repository; tuần học vẫn là tuần 8.**

## Đề bài

- Tích hợp NextAuth vào dự án: ít nhất 1 OAuth provider và đăng nhập email/mật khẩu.
- Phân quyền 2 vai trò (admin, user) bằng Middleware + kiểm tra ở page và Server Action; kiểu TypeScript đầy đủ cho Session.
- SEO cho ít nhất 2 trang công khai: canonical, opengraph-image, JSON-LD.
- Báo cáo ngắn: sơ đồ các lớp bảo vệ và điểm Lighthouse / PageSpeed trước và sau.

## Đối chiếu slide của giảng viên

Nguồn gốc giữ nguyên trong [Buổi 7](../slides/Buoi7_NextJS_SSR_SSG_ISR.pptx) và [Buổi 8](../slides/Buoi8_NextJS_Nang_Cao.pptx).

| Vị trí slide Buổi 8 | Nội dung cần chú ý | Áp dụng trong Ex-07 |
| --- | --- | --- |
| 10–16 | NextAuth v5, Credentials JWT, route handler, callback GitHub, Session/User/JWT augmentation | auth.ts, auth.config.ts, types/next-auth.d.ts; GitHub + Credentials |
| 18–27 | Bảo vệ nhiều lớp; tránh chỉ ẩn nút; kiểm tra từng action, validate Zod; quyền từ server | Middleware, page guard, requireActor đọc lại DB, action validation, favorites lấy userId từ phiên |
| 30–34 | canonical, metadataBase, OG image, JSON-LD, private noindex, đo production | /products và /products/[slug]; sitemap/robots; Lighthouse raw JSON + HTML |
| 36 | Test Jest/RTL ít nhất 2 module; public SSG/ISR, private SSR | Unit/RTL auth, roles, guards, actions, catalogue; thêm E2E production |
| 38 | Đăng nhập GitHub/Credentials; header tên/role/logout | Header riêng tư render actor từ server; public header là static shell với account client island |
| 39 | /dashboard cần login; /admin cần admin; user → /403; action xóa phải chặn | Có các route và test trực tiếp Server Action sai quyền |
| 40 | opengraph-image.tsx trang chi tiết; Product + BreadcrumbList | Có ảnh OG 1200×630 và JSON-LD tương ứng |
| 42 | Tiêu chí chấm: đăng nhập thật, nhiều lớp, validation, SEO kiểm chứng, số liệu; không any/secret | Ma trận và minh chứng trong REPORT_EX_07.md; OAuth cần cấu hình thực tế trước khi nộp |

Buổi 7 cung cấp nền App Router, Server/Client Component, generateStaticParams, ISR, metadata và xử lý loading/error/not-found. Bài này dùng những phần đó để thực hiện đề tuần 8, không tự tạo thêm bài Ex-08. Chưa có nội dung đa ngôn ngữ nên không khai hreflang giả. PageSpeed Insights và Google Rich Results Test cần URL public để kiểm chứng từ xa; Lighthouse local và kiểm tra HTML không được mô tả thành kết quả của hai dịch vụ đó.
