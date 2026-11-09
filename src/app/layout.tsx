import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Quản lý hạn nộp bài tập PTIT`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Deadline PTIT", "Class Deadline Hub", "Lập trình Web nâng cao", "Học viện Bưu chính Viễn thông", "Next.js 15"],
  authors: [{ name: "Nguyễn Tiến Tuấn — B23DCCC173" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-slate-50 min-h-screen flex flex-col text-slate-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
          <div className="container-custom">
            <p className="font-semibold text-slate-700">
              Class Deadline Hub — Lớp {siteConfig.class} · {siteConfig.department}
            </p>
            <p className="mt-1 text-slate-400">
              Sinh viên thực hiện: <b>Nguyễn Tiến Tuấn (B23DCCC173)</b> · Giảng viên hướng dẫn: <b>ThS. Ngô Văn Nhận</b>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
