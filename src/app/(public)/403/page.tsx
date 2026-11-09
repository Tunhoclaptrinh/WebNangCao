import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 — Từ chối truy cập",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <div className="container status-page">
      <div className="status-code">403</div>
      <h1>403 — Từ chối truy cập</h1>
      <p>
        Bạn không có quyền truy cập vào khu vực Quản trị Lớp học. Trang này yêu cầu vai trò Lớp trưởng (Admin).
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/dashboard" className="button-primary">
          Về Dashboard Cá Nhân ↗
        </Link>
        <Link href="/" className="button-outline">
          Về Trang chủ ↗
        </Link>
      </div>
    </div>
  );
}
