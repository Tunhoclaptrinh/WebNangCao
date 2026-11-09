import type { Metadata } from "next";
import { auth, githubConfigured } from "@/auth";
import { redirect } from "next/navigation";
import { safeRedirect } from "@/lib/site";
import { LoginForm } from "@/components/login-form";
export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const query = await searchParams;
  const callbackUrl = safeRedirect(query.callbackUrl);
  const session = await auth();
  if (session?.user.id) redirect(callbackUrl);
  return (
    <main id="main" className="container login-page">
      <div className="login-editorial">
        <span className="eyebrow">YOUR SPACE. YOUR INSPIRATION.</span>
        <h1>
          Chào bạn,
          <br />
          mời về <em>góc riêng.</em>
        </h1>
        <p>
          Một nơi để lưu những lựa chọn yêu thích
          <br />
          và tìm cảm hứng cho ngày làm việc mới.
        </p>
        <div className="login-art" aria-hidden="true">
          <span className="login-art-ring" />
          <span className="login-art-square" />
          <span className="login-art-note">
            Make room
            <br />
            <em>for better.</em>
          </span>
        </div>
        <span className="login-editorial-foot">
          CHỌN LỌC ĐỂ TẬP TRUNG · DEVWORKSPACE
        </span>
      </div>
      <div className="login-card">
        <span className="eyebrow">BẮT ĐẦU TẠI ĐÂY</span>
        <h2>Đăng nhập</h2>
        <p className="login-subtitle">Chào mừng trở lại với DevWorkspace.</p>
        <LoginForm
          callbackUrl={callbackUrl}
          githubReady={githubConfigured}
          oauthError={Boolean(query.error)}
        />
      </div>
    </main>
  );
}
