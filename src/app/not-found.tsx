import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-custom py-20 flex flex-col items-center justify-center text-center">
      <div className="text-7xl font-black text-blue-600 mb-4">404</div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
        Không tìm thấy trang
      </h1>
      <p className="text-sm text-slate-600 max-w-md mb-8">
        Đường dẫn bài tập, môn học hoặc nội dung bạn tìm kiếm không tồn tại hoặc đã được chuyển đi.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition"
      >
        ← Về Trang chủ
      </Link>
    </div>
  );
}
