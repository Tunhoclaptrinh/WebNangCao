"use client";
import { App, ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: "#264f40",
          colorInfo: "#264f40",
          colorText: "#202c28",
          borderRadius: 10,
          fontFamily: "Arial, Helvetica, sans-serif",
          controlHeight: 44,
        },
        components: {
          Button: { fontWeight: 600 },
          Table: { headerBg: "#f4f6f2" },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
