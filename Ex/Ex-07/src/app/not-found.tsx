import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container status-page">
      <span className="status-code">404</span>
      <h1>Góc này chưa có gì.</h1>
      <p>Trang hoặc sản phẩm bạn tìm có thể đã được chuyển đi.</p>
      <Link className="button-primary" href="/products">
        Về bộ sưu tập ↗
      </Link>
    </main>
  );
}
