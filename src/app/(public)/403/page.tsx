import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 — Từ chối truy cập",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <div className="container-custom py-20 flex flex-col items-center justify-center text-center">
      <div className="text-7xl font-black text-amber-500 mb-4">403</div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
        403 — Từ chối truy cập (Forbidden)
      </h1>
      <p className="text-sm text-slate-600 max-w-lg mb-8 leading-relaxed">
        Bạn không có quyền truy cập vào trang Quản trị Lớp học. Khu vực này chỉ dành riêng cho tài khoản Lớp trưởng (Admin).
      </p>
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <Link
          href="/dashboard"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition"
        >
          Về Dashboard Cá Nhân
        </Link>
        <Link
          href="/"
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg transition"
        >
          Về Trang chủ
        </Link>
      </div>
    </div>
  );
}
