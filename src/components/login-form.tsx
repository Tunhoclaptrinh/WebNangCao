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
    <Card className="shadow-lg border-slate-200 max-w-md w-full mx-auto rounded-2xl p-2 sm:p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Đăng nhập Cổng Deadline</h1>
        <p className="text-xs text-slate-500">
          Sử dụng tài khoản PTIT hoặc GitHub để theo dõi và quản lý hạn nộp
        </p>
      </div>

      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          className="mb-4"
          closable
          onClose={() => setErrorMessage("")}
        />
      )}

      {/* GitHub OAuth Button */}
      <Button
        size="large"
        icon={<GithubOutlined />}
        className="w-full h-11 flex items-center justify-center font-medium bg-slate-900 text-white hover:bg-slate-800 mb-4"
        onClick={() => signIn("github", { callbackUrl })}
      >
        Đăng nhập với GitHub
      </Button>

      <Divider className="text-xs text-slate-400">hoặc bằng tài khoản sinh viên</Divider>

      {/* Credentials Form */}
      <Form form={form} layout="vertical" onFinish={handleCredentialsSubmit}>
        <Form.Item
          name="email"
          label="Email PTIT / Tài khoản"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không đúng định dạng" },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="text-slate-400" />}
            placeholder="admin@ptit.edu.vn hoặc sv@ptit.edu.vn"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="text-slate-400" />}
            placeholder="Mật khẩu tài khoản"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          icon={<LoginOutlined />}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold mt-2"
        >
          Đăng nhập hệ thống
        </Button>
      </Form>

      {/* Quick Test Accounts */}
      <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
        <div className="text-xs font-bold text-slate-600 mb-2">⚡ Tài khoản mẫu chấm bài (Bấm để điền nhanh):</div>
        <div className="flex flex-col gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => handleFill("admin@ptit.edu.vn", "admin123")}
            className="text-left px-2.5 py-1.5 bg-white border border-slate-200 rounded-md hover:border-purple-400 hover:bg-purple-50 transition flex items-center justify-between"
          >
            <span>
              <b className="text-purple-600">Admin (Lớp trưởng):</b> <code>admin@ptit.edu.vn</code>
            </span>
            <span className="text-slate-400">pass: <code>admin123</code></span>
          </button>

          <button
            type="button"
            onClick={() => handleFill("sv@ptit.edu.vn", "sv123456")}
            className="text-left px-2.5 py-1.5 bg-white border border-slate-200 rounded-md hover:border-blue-400 hover:bg-blue-50 transition flex items-center justify-between"
          >
            <span>
              <b className="text-blue-600">User (Sinh viên):</b> <code>sv@ptit.edu.vn</code>
            </span>
            <span className="text-slate-400">pass: <code>sv123456</code></span>
          </button>
        </div>
      </div>
    </Card>
  );
}
