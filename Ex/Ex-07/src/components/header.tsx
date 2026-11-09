import Link from "next/link";
import { AccountMenu } from "./account-menu";
import { logout } from "@/features/auth/actions";
import type { Actor } from "@/features/auth/guards";
export function Header({ actor }: { actor?: Actor }) {
  return (
    <>
      <div className="announcement">
        Một góc làm việc tốt. Một ngày nhiều cảm hứng.
      </div>
      <header className="header">
        <div className="container header-inner">
          <Link
            href="/"
            className="brand"
            aria-label="devworkspace. — Trang chủ"
          >
            <span className="brand-icon" aria-hidden="true">
              d<span>↗</span>
            </span>
            devworkspace<span className="brand-dot">.</span>
          </Link>
          <nav aria-label="Điều hướng chính">
            <Link href="/products">Sản phẩm</Link>
            <Link href="/dashboard">Không gian của tôi</Link>
          </nav>
          {actor ? (
            <div className="private-account">
              <Link href="/dashboard" className="account-link">
                <span className="avatar-mini">{actor.name.slice(0, 1)}</span>
                <span>
                  {actor.name}
                  <small>
                    {actor.role === "admin" ? "Quản trị viên" : "Thành viên"}
                  </small>
                </span>
              </Link>
              <form action={logout}>
                <button className="logout-link" type="submit">
                  Đăng xuất
                </button>
              </form>
            </div>
          ) : (
            <AccountMenu />
          )}
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <Link href="/" className="footer-brand">
            devworkspace.
          </Link>
          <p>Chọn ít hơn. Làm việc tốt hơn.</p>
        </div>
        <div>
          <Link href="/products">Khám phá sản phẩm</Link>
          <Link href="/dashboard">Tài khoản của tôi</Link>
        </div>
        <div className="footer-credit">
          Bài tập tuần 8 · Next.js
          <br />
          Nguyễn Tiến Tuấn · B23DCCC173
        </div>
      </div>
      <div className="container footer-bottom">
        © 2026 DevWorkspace. Dự án học tập, không cung cấp giao dịch thương mại.
      </div>
    </footer>
  );
}
