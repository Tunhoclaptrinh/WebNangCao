import React from "react";
import { requireAdminActor } from "@/features/auth/guards";
import { getDeadlines, getSubjects, calculateStats } from "@/lib/data";
import { AdminDeadlineTable } from "@/components/admin-deadline-table";
import type { Metadata } from "next";

// SSR: Server-Side Rendering
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quản Trị Lớp Học — Lớp Trưởng",
  robots: { index: false, follow: false },
};

export default async function AdminPage(): Promise<React.JSX.Element> {
  const actor = await requireAdminActor();
  const deadlines = await getDeadlines();
  const subjects = await getSubjects();
  const stats = calculateStats(deadlines);

  return (
    <div className="container admin-page">
      {/* Top Session Notice */}
      <div
        style={{
          padding: "10px 16px",
          background: "#eef4ec",
          border: "1px solid #d4e2cf",
          borderRadius: 6,
          fontSize: 12,
          color: "#264f40",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <span>
          Đang truy cập với quyền <strong>Quản trị viên / Lớp trưởng</strong>: {actor.name} ({actor.email})
        </span>
        <span
          style={{
            fontFamily: "monospace",
            background: "#dbe5d0",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          SSR Dynamic Route
        </span>
      </div>

      {/* 4 Stat Cards */}
      <div className="admin-stats">
        <div>
          <span>Tổng số bài tập</span>
          <strong>{stats.total}</strong>
          <small>01</small>
        </div>
        <div>
          <span>Hạn nộp khẩn cấp</span>
          <strong style={{ color: "#c53030" }}>{stats.urgent}</strong>
          <small>02</small>
        </div>
        <div>
          <span>Đã quá hạn</span>
          <strong style={{ color: "#744210" }}>{stats.overdue}</strong>
          <small>03</small>
        </div>
        <div>
          <span>Bài tập sắp tới</span>
          <strong style={{ color: "#2f855a" }}>{stats.upcoming}</strong>
          <small>04</small>
        </div>
      </div>

      {/* Interactive Admin Table (Client island for adding/deleting) */}
      <AdminDeadlineTable initialDeadlines={deadlines} subjects={subjects} />
    </div>
  );
}
