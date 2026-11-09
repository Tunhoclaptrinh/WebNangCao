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
    <div className="container-custom py-12 flex items-center justify-center">
      <Providers>
        <LoginForm />
      </Providers>
    </div>
  );
}
