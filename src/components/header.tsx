import React from "react";
import Link from "next/link";
import { getCurrentActor } from "@/features/auth/guards";
import { signOut } from "@/auth";

export async function Header() {
  const actor = await getCurrentActor();

  return (
    <>
      <div className="announcement">
        Cổng Thông Tin Học Tập Chính Thức · Lớp RIPT1411-20261-02 · PTIT
      </div>
      <header className="header">
        <div className="container header-inner">
          {/* Brand */}
          <Link href="/" className="brand" aria-label="Class Deadline Hub — Trang chủ">
            <span className="brand-icon" aria-hidden="true">
              C<span>↗</span>
            </span>
            Class Deadline Hub<span className="brand-dot">.ptit</span>
          </Link>

          {/* Navigation */}
          <nav aria-label="Điều hướng chính">
            <Link href="/">Trang chủ</Link>
            <Link href="/deadlines">Tất cả Deadline</Link>
            <Link href="/subjects/lap-trinh-web-nang-cao">Môn học</Link>
            {actor && (
              <>
                <Link href="/dashboard" style={{ fontWeight: 600, color: "var(--green)" }}>
                  Tiến độ của tôi
                </Link>
                {actor.role === "admin" && (
                  <Link href="/admin" style={{ fontWeight: 600, color: "#7c3aed" }}>
                    Quản trị
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Auth State */}
          {actor ? (
            <div className="private-account">
              <Link href="/dashboard" className="account-link">
                <span className="avatar-mini">{actor.name.charAt(0)}</span>
                <span>
                  {actor.name}
                  <small>
                    {actor.role === "admin" ? "Lớp trưởng (Admin)" : "Sinh viên"}
                  </small>
                </span>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="logout-link">
                  Đăng xuất
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="button-primary">
              Đăng nhập PTIT ↗
            </Link>
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
            Class Deadline Hub<span style={{ color: "#66815d" }}>.ptit</span>
          </Link>
          <p>Hệ thống theo dõi tiến độ nộp bài & đồ án chuyên ngành CNTT 1.</p>
        </div>
        <div>
          <Link href="/deadlines" style={{ display: "block", marginBottom: 8, fontSize: 13, color: "var(--muted)" }}>
            Khám phá toàn bộ deadline ↗
          </Link>
          <Link href="/dashboard" style={{ display: "block", fontSize: 13, color: "var(--muted)" }}>
            Bảng điều khiển cá nhân ↗
          </Link>
        </div>
        <div className="footer-credit">
          Bài thực hành số 3 · Next.js App Router
          <br />
          Nguyễn Tiến Tuấn · B23DCCC173 · D23CQCC01-B
          <br />
          Giảng viên hướng dẫn: ThS. Ngô Văn Nhận
        </div>
      </div>
      <div className="container footer-bottom">
        © 2026 PTIT — Học viện Công nghệ Bưu chính Viễn thông. Bài tập thực hành phòng máy RIPT1411-20261-02.
      </div>
    </footer>
  );
}
