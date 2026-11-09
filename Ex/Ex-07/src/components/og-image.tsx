import { ImageResponse } from "next/og";
export function createOgImage(title: string, subtitle: string) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#edf1e7",
        padding: "68px",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
        color: "#213c30",
      }}
    >
      <div style={{ display: "flex", fontSize: 31 }}>devworkspace.</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 70,
            letterSpacing: -3,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 25,
            color: "#526658",
            marginTop: 24,
          }}
        >
          {subtitle}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 20,
          justifyContent: "space-between",
        }}
      >
        <span>THE WORKSPACE COLLECTION</span>
        <span>2026 / CHON LOC DE TAP TRUNG</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
