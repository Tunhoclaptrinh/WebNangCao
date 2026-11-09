"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Input, Button, Alert, Divider, Card } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GithubOutlined,
  LoginOutlined,
} from "@ant-design/icons";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form] = Form.useForm();

  const handleCredentialsSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMessage("Email hoặc mật khẩu không chính xác. Vui lòng thử lại.");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage("Đã xảy ra sự cố trong quá trình xác thực.");
      setLoading(false);
    }
  };

  const handleFill = (email: string, pass: string) => {
    form.setFieldsValue({ email, password: pass });
    setErrorMessage("");
  };

  return (
    <Card
      style={{
        border: "1px solid var(--line)",
        borderRadius: 8,
        boxShadow: "0 8px 30px rgba(36, 55, 46, 0.06)",
        background: "#ffffff",
      }}
      styles={{ body: { padding: 28 } }}
    >
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, letterSpacing: "-0.8px", margin: "0 0 6px", color: "var(--ink)" }}>
          Đăng nhập Cổng Deadline
        </h2>
        <p style={{ fontSize: 12.5, color: "var(--muted)", margin: 0 }}>
          Sử dụng tài khoản sinh viên PTIT hoặc GitHub cá nhân để theo dõi hạn nộp bài.
        </p>
      </div>

      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          closable
          onClose={() => setErrorMessage("")}
        />
      )}

      {/* GitHub OAuth Button */}
      <Button
        size="large"
        icon={<GithubOutlined />}
        style={{
          width: "100%",
          height: 44,
          background: "#1f2d26",
          borderColor: "#1f2d26",
          color: "#ffffff",
          fontWeight: 600,
          fontSize: 13,
          marginBottom: 12,
        }}
        onClick={() => signIn("github", { callbackUrl })}
      >
        Đăng nhập với GitHub
      </Button>

      <Divider style={{ fontSize: 11, color: "var(--muted)", margin: "14px 0" }}>
        hoặc bằng tài khoản sinh viên PTIT
      </Divider>

      {/* Credentials Form */}
      <Form form={form} layout="vertical" onFinish={handleCredentialsSubmit}>
        <Form.Item
          name="email"
          label={<span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink)" }}>Email PTIT / Tài khoản</span>}
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không đúng định dạng" },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined style={{ color: "#8a9685" }} />}
            placeholder="admin@ptit.edu.vn hoặc sv@ptit.edu.vn"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink)" }}>Mật khẩu tài khoản</span>}
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: "#8a9685" }} />}
            placeholder="Mật khẩu tài khoản"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          icon={<LoginOutlined />}
          style={{
            width: "100%",
            height: 44,
            background: "var(--green)",
            borderColor: "var(--green)",
            fontWeight: 600,
            fontSize: 13,
            marginTop: 4,
          }}
        >
          Đăng nhập hệ thống
        </Button>
      </Form>

      {/* Quick Test Accounts */}
      <div
        style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: "1px solid var(--line)",
          background: "#f7f9f4",
          marginInline: -28,
          marginBottom: -28,
          padding: "18px 28px",
          borderRadius: "0 0 8px 8px",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", marginBottom: 8, letterSpacing: 0.5 }}>
          ⚡ TÀI KHOẢN MẪU CHẤM BÀI (BẤM ĐỂ ĐIỀN NHANH):
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11.5 }}>
          <button
            type="button"
            onClick={() => handleFill("admin@ptit.edu.vn", "admin123")}
            style={{
              textAlign: "left",
              padding: "8px 12px",
              background: "#ffffff",
              border: "1px solid #c9d5bf",
              borderRadius: 6,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "all 0.15s",
            }}
          >
            <span>
              <b style={{ color: "#7c3aed" }}>Admin: </b>
              <code style={{ fontSize: 11 }}>admin@ptit.edu.vn</code>
            </span>
            <span style={{ color: "var(--muted)", fontSize: 10.5 }}>mật khẩu: <code>admin123</code></span>
          </button>

          <button
            type="button"
            onClick={() => handleFill("sv@ptit.edu.vn", "sv123456")}
            style={{
              textAlign: "left",
              padding: "8px 12px",
              background: "#ffffff",
              border: "1px solid #c9d5bf",
              borderRadius: 6,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "all 0.15s",
            }}
          >
            <span>
              <b style={{ color: "var(--green)" }}>Sinh viên: </b>
              <code style={{ fontSize: 11 }}>sv@ptit.edu.vn</code>
            </span>
            <span style={{ color: "var(--muted)", fontSize: 10.5 }}>mật khẩu: <code>sv123456</code></span>
          </button>
        </div>
      </div>
    </Card>
  );
}
