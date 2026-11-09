"use client";
import { useActionState } from "react";
import { Input, Button, Alert } from "antd";
import { MailOutlined, LockOutlined, GithubOutlined } from "@ant-design/icons";
import { loginWithCredentials, loginWithGithub } from "@/features/auth/actions";
export function LoginForm({
  callbackUrl,
  githubReady,
  oauthError,
}: {
  callbackUrl: string;
  githubReady: boolean;
  oauthError: boolean;
}) {
  const [state, action, pending] = useActionState(loginWithCredentials, {});
  return (
    <>
      <form action={action} className="login-form">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        {(state.error || oauthError) && (
          <Alert
            type="error"
            showIcon
            title={
              state.error ||
              "Không thể đăng nhập GitHub. Vui lòng thử lại hoặc dùng email."
            }
            role="alert"
          />
        )}
        <div>
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="ban@example.com"
            prefix={<MailOutlined />}
            required
            maxLength={254}
            size="large"
          />
        </div>
        <div>
          <label htmlFor="password">Mật khẩu</label>
          <Input.Password
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Nhập mật khẩu của bạn"
            prefix={<LockOutlined />}
            required
            minLength={8}
            maxLength={72}
            size="large"
          />
        </div>
        <Button
          htmlType="submit"
          type="primary"
          size="large"
          block
          loading={pending}
        >
          Đăng nhập bằng email <span aria-hidden="true">→</span>
        </Button>
      </form>
      <div className="divider">
        <span>hoặc tiếp tục với</span>
      </div>
      <form action={loginWithGithub}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <Button
          htmlType="submit"
          size="large"
          block
          icon={<GithubOutlined />}
          disabled={!githubReady}
        >
          Đăng nhập với GitHub
        </Button>
      </form>
      {!githubReady && (
        <p className="configuration-note">
          GitHub chưa được cấu hình trong môi trường này. Bạn vẫn có thể đăng
          nhập bằng tài khoản email mẫu.
        </p>
      )}
      <details className="demo-accounts">
        <summary>Tài khoản trải nghiệm</summary>
        <p>
          Thành viên: <code>user@devworkspace.local</code>
          <br />
          Quản trị: <code>admin@devworkspace.local</code>
          <br />
          Mật khẩu chung: <code>Demo@12345</code>
        </p>
        <small>Chỉ dùng dữ liệu mẫu trong môi trường học tập.</small>
      </details>
    </>
  );
}
