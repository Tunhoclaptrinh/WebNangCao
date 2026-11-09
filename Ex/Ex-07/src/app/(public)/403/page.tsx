import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Không có quyền truy cập",
  robots: { index: false, follow: false },
};
export default function ForbiddenPage() {
  return (
    <main id="main" className="container status-page">
      <span className="status-code">403</span>
      <span className="eyebrow">KHU VỰC GIỚI HẠN</span>
      <h1>Bạn chưa có quyền truy cập.</h1>
      <p>
        Trang này dành cho quản trị viên. Bạn vẫn có thể khám phá
        <br />
        sản phẩm và quản lý không gian của riêng mình.
      </p>
      <div>
        <Link href="/dashboard" className="button-primary">
          Về không gian của tôi ↗
        </Link>
        <Link className="text-link" href="/products">
          Khám phá sản phẩm
        </Link>
      </div>
    </main>
  );
}
