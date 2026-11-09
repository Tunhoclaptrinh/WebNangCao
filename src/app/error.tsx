"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime error caught:", error);
  }, [error]);

  return (
    <div className="container-custom py-20 flex flex-col items-center justify-center text-center">
      <div className="text-6xl font-black text-rose-500 mb-4">500</div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
        Đã xảy ra sự cố
      </h1>
      <p className="text-sm text-slate-600 max-w-md mb-8">
        Hệ thống gặp lỗi trong quá trình xử lý yêu cầu. Vui lòng bấm thử lại hoặc quay về trang chủ.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition"
        >
          Thử lại
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg transition"
        >
          Trang chủ
        </Link>
      </div>
    </div>
  );
}
