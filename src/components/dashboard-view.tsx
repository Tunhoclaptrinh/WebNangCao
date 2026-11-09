"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Progress, Tabs, Empty } from "antd";
import type { Deadline, UserActor } from "@/types";
import { DeadlineCard } from "./deadline-card";

interface DashboardViewProps {
  actor: UserActor;
  allDeadlines: Deadline[];
  completedIds: string[];
}

export function DashboardView({ actor, allDeadlines, completedIds }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<string>("pending");

  const pendingDeadlines = allDeadlines.filter((d) => !completedIds.includes(d.id));
  const completedDeadlines = allDeadlines.filter((d) => completedIds.includes(d.id));
  const percent = allDeadlines.length > 0 ? Math.round((completedDeadlines.length / allDeadlines.length) * 100) : 0;
  const cleanName = actor.name.replace(/\s*\(.*?\)/g, "").trim();
  const firstName = cleanName.split(" ").slice(-1)[0] || cleanName;

  const displayedDeadlines =
    activeTab === "all"
      ? allDeadlines
      : activeTab === "completed"
      ? completedDeadlines
      : pendingDeadlines;

  return (
    <div className="container dashboard-page">
      {/* Top Editorial Heading + Profile Card */}
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">
            <span className="tiny-dot" />
            KHÔNG GIAN CÁ NHÂN · TIẾN ĐỘ HỌC TẬP
          </span>
          <h1>
            Chào {firstName},<br />
            <em>hôm nay bạn có deadline nào cần nộp?</em>
          </h1>
          <p>
            Theo dõi tiến độ hoàn thành bài tập, đồ án môn Lập trình Web nâng cao và các học phần chuyên ngành Học kỳ 7.
          </p>
        </div>

        <div className="profile-card">
          <span className="profile-avatar">{actor.name.charAt(0)}</span>
          <h2 style={{ fontSize: 16, margin: "2px 0 0", letterSpacing: "-0.3px" }}>
            {actor.name}
          </h2>
          <span>{actor.email}</span>
          <span className="role-badge">
            {actor.role === "admin" ? "Lớp trưởng PTIT (Admin)" : "Sinh viên PTIT"}
          </span>
          <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
            Mã sinh viên: <b>{actor.studentId || "B23DCCC173"}</b>
          </span>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>
            Lớp: <b>RIPT1411-20261-02</b>
          </span>

          {actor.role === "admin" && (
            <Link
              href="/admin"
              style={{
                marginTop: 8,
                fontSize: 11.5,
                fontWeight: 600,
                color: "var(--green)",
                textDecoration: "underline",
              }}
            >
              Quản trị deadline lớp học ↗
            </Link>
          )}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="admin-stats">
        <div>
          <span>Tổng số deadline HK7</span>
          <strong>{allDeadlines.length}</strong>
          <small>01</small>
        </div>
        <div>
          <span>Đã hoàn thành</span>
          <strong style={{ color: "#2f855a" }}>{completedDeadlines.length}</strong>
          <small>02</small>
        </div>
        <div>
          <span>Chưa hoàn thành</span>
          <strong style={{ color: "#c53030" }}>{pendingDeadlines.length}</strong>
          <small>03</small>
        </div>
        <div>
          <span>Tỷ lệ hoàn thành học kỳ</span>
          <strong style={{ color: "var(--green)" }}>{percent}%</strong>
          <small>04</small>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid var(--line)",
          borderRadius: 8,
          padding: "20px 24px",
          marginBottom: 36,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>
          <span>Tiến độ hoàn thành bài tập học kỳ ({completedDeadlines.length}/{allDeadlines.length})</span>
          <span style={{ color: "var(--green)" }}>{percent}%</span>
        </div>
        <Progress percent={percent} strokeColor="#264f40" showInfo={false} />
      </div>

      {/* Section Heading + Tabs */}
      <div className="section-heading">
        <h2>
          Danh sách Deadline HK7 <span className="count-pill">{displayedDeadlines.length}</span>
        </h2>
        <Link href="/deadlines" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--green)" }}>
          Khám phá thêm ↗
        </Link>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: "pending", label: `Chưa hoàn thành (${pendingDeadlines.length})` },
          { key: "completed", label: `Đã hoàn thành (${completedDeadlines.length})` },
          { key: "all", label: `Tất cả (${allDeadlines.length})` },
        ]}
        style={{ marginBottom: 24 }}
      />

      {displayedDeadlines.length > 0 ? (
        <div className="deadline-grid">
          {displayedDeadlines.map((deadline) => (
            <div key={deadline.id}>
              <DeadlineCard
                deadline={deadline}
                isCompleted={completedIds.includes(deadline.id)}
                canToggle={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "50px 20px",
            border: "1px dashed #d1dbca",
            borderRadius: 8,
            textAlign: "center",
            background: "#f7f9f4",
          }}
        >
          <Empty description="Không có deadline nào trong danh mục này." />
        </div>
      )}
    </div>
  );
}
