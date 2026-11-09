import React from "react";
import { LoginForm } from "@/components/login-form";
import { getCurrentActor } from "@/features/auth/guards";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Đăng Nhập Cổng Deadline",
  description: "Trang đăng nhập tài khoản sinh viên hoặc lớp trưởng PTIT để theo dõi deadline và quản trị.",
};

export default async function LoginPage() {
  const actor = await getCurrentActor();
  if (actor) {
    redirect("/dashboard");
  }

  return (
    <div className="container login-page">
      {/* Left: Editorial Hero Art */}
      <div className="login-editorial">
        <div>
          <span className="eyebrow">
            <span className="tiny-dot" />
            XÁC THỰC TÀI KHOẢN PTIT
          </span>
          <h1>
            Cổng Deadline<br />
            <em>Học kỳ 7 PTIT</em>
          </h1>
          <p>
            Hệ thống hỗ trợ sinh viên và ban cán sự lớp theo dõi hạn nộp bài tập, đồ án và revalidation tiến độ thời gian thực.
          </p>
        </div>

        <div style={{ padding: 22, background: "rgba(255, 255, 255, 0.7)", borderRadius: 8, border: "1px solid #c9d5bf" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", marginBottom: 4 }}>
            BẢO MẬT & ĐỒNG BỘ
          </div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.7 }}>
            Tích hợp OAuth 2.0 PKCE, NextAuth v5 Credentials và mã hóa dữ liệu an toàn trên nền tảng Next.js 15 App Router.
          </div>
        </div>

        <div style={{ fontSize: 10, color: "#77856b", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>
          KHOA CÔNG NGHỆ THÔNG TIN 1 · HỌC KỲ 1 (2026 - 2027)
        </div>
      </div>

      {/* Right: Login Form Card */}
      <div className="login-card">
        <Providers>
          <LoginForm />
        </Providers>
      </div>
    </div>
  );
}
