import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/header";
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
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
