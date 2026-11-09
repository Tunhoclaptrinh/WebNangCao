"use client";

import React from "react";
import { App, ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
          fontFamily: "inherit",
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
