import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = "Class Deadline Hub — PTIT";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          padding: "60px",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: "bold", background: "rgba(255,255,255,0.2)", padding: "8px 20px", borderRadius: 30 }}>
            {siteConfig.class} · PTIT
          </div>
          <div style={{ display: "flex", fontSize: 22, opacity: 0.9 }}>
            {siteConfig.academicYear}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 900, letterSpacing: -2, lineHeight: 1.1 }}>
            Class Deadline Hub
          </div>
          <div style={{ display: "flex", fontSize: 26, opacity: 0.9, marginTop: 18, maxWidth: 900 }}>
            Cổng quản lý thời hạn nộp bài tập, đồ án và theo dõi tiến độ học tập sinh viên PTIT.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.2)",
            fontSize: 20,
            opacity: 0.85,
          }}
        >
          <span>Sinh viên: {siteConfig.student.name} ({siteConfig.student.id})</span>
          <span>Giảng viên: {siteConfig.instructor}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

