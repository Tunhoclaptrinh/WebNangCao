import type { Metadata } from "next";
import { site } from "@/lib/site";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "DevWorkspace — Góc làm việc của bạn",
    template: "%s | DevWorkspace",
  },
  description: site.description,
  openGraph: { siteName: site.name, locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <a href="#main" className="skip-link">
          Đến nội dung chính
        </a>
        {children}
      </body>
    </html>
  );
}
