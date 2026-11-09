import React from "react";
import Link from "next/link";
import { getSubjects, getDeadlines, calculateStats } from "@/lib/data";
import { getCurrentActor } from "@/features/auth/guards";
import { DeadlineCard } from "@/components/deadline-card";
import { WebsiteJsonLd } from "@/components/json-ld";
import { siteConfig } from "@/lib/site";

// SSG: Static Site Generation
export const dynamic = "force-static";

export default async function HomePage() {
  const subjects = await getSubjects();
  const deadlines = await getDeadlines();
  const actor = await getCurrentActor();
  const stats = calculateStats(deadlines);

  // Top 3 urgent deadlines
  const urgentDeadlines = deadlines
    .filter((d) => d.priority === "urgent" || new Date(d.dueDate).getTime() - Date.now() < 3 * 86400000)
    .slice(0, 3);

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 60 }}>
      <WebsiteJsonLd
        name={siteConfig.name}
        url={siteConfig.url}
        description={siteConfig.description}
      />

      {/* Hero Editorial Section */}
      <section className="hero-editorial">
        <div className="hero-editorial-inner">
          <div>
            <span className="eyebrow">
              <span className="tiny-dot" />
              CỔNG THÔNG TIN HỌC TẬP CHÍNH THỨC · {siteConfig.academicYear}
            </span>
            <h1>
              Class Deadline <em>Hub</em>
            </h1>
            <p>
              Hệ thống quản lý thời hạn nộp bài tập, đồ án và theo dõi tiến độ học tập đồng bộ dành riêng cho tập thể lớp <b>{siteConfig.class}</b>.
            </p>

            <div className="hero-actions">
              <Link href="/deadlines" className="button-primary">
                Xem Tất Cả Deadline ↗
              </Link>

              {actor ? (
                <Link href="/dashboard" className="button-outline">
                  Không Gian Cá Nhân ↗
                </Link>
              ) : (
                <Link href="/login" className="button-outline">
                  Đăng Nhập Sinh Viên ↗
                </Link>
              )}
            </div>
          </div>

          <div className="hero-visual-card">
            <div>
              <span className="eyebrow" style={{ color: "var(--green)" }}>TỔNG QUAN HỌC KỲ</span>
              <h3 style={{ fontSize: 20, marginTop: 6, marginBottom: 8 }}>
                Lớp {siteConfig.class}
              </h3>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
                Khoa Công nghệ Thông tin 1 — Học viện Công nghệ Bưu chính Viễn thông.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
              <div>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>Học phần cốt lõi</span>
                <strong style={{ display: "block", fontSize: 13, color: "var(--ink)" }}>Lập trình Web NC</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>Giảng viên</span>
                <strong style={{ display: "block", fontSize: 13, color: "var(--ink)" }}>ThS. Ngô Văn Nhận</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section>
        <div className="stat-grid">
          <div className="stat-card">
            <span>Môn học đang theo</span>
            <strong style={{ color: "var(--green)" }}>{stats.subjectsCount}</strong>
            <small>01</small>
          </div>
          <div className="stat-card">
            <span>Tổng số deadline</span>
            <strong>{stats.total}</strong>
            <small>02</small>
          </div>
          <div className="stat-card">
            <span>Hạn nộp khẩn cấp (≤ 3 ngày)</span>
            <strong style={{ color: "#c53030" }}>{stats.urgent}</strong>
            <small>03</small>
          </div>
          <div className="stat-card">
            <span>Bài tập sắp tới</span>
            <strong style={{ color: "#2f855a" }}>{stats.upcoming}</strong>
            <small>04</small>
          </div>
        </div>
      </section>

      {/* Urgent Deadlines Section */}
      {urgentDeadlines.length > 0 && (
        <section style={{ marginBottom: 50 }}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">ƯU TIÊN XỬ LÝ</span>
              <h2>Hạn Chót Cần Ưu Tiên Hoàn Thành</h2>
              <p>Các bài tập và bài kiểm tra có thời hạn nộp gần nhất cần hoàn thành gấp.</p>
            </div>
            <Link href="/deadlines" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--green)" }}>
              Xem tất cả ↗
            </Link>
          </div>

          <div className="deadline-grid">
            {urgentDeadlines.map((deadline) => (
              <div key={deadline.id}>
                <DeadlineCard deadline={deadline} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Subjects Grid (SSG linked) */}
      <section style={{ marginBottom: 50 }}>
        <div className="section-heading">
          <div>
            <span className="eyebrow">HỌC KỲ 7 CHUYÊN NGÀNH</span>
            <h2>Danh Mục Môn Học Học Kỳ 7</h2>
            <p>Thông tin chi tiết giảng viên, lịch học và phân bổ deadline theo từng môn.</p>
          </div>
        </div>

        <div className="subject-grid">
          {subjects.map((sub) => {
            const count = deadlines.filter((d) => d.subjectId === sub.id).length;
            return (
              <Link
                key={sub.code}
                href={`/subjects/${sub.slug}`}
                className="deadline-card"
                style={{ padding: 24, textDecoration: "none" }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span className="subject-code-pill">{sub.code}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>{sub.credits} tín chỉ</span>
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 8 }}>{sub.name}</h3>
                  <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 16 }}>{sub.description}</p>
                </div>

                <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, fontSize: 12, color: "var(--muted)" }}>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ color: "var(--green)", fontWeight: 600 }}>GV: </span>
                    <b>{sub.lecturer}</b>
                  </div>
                  <div>
                    <span>Lịch học: </span>
                    <span>{sub.schedule}</span>
                  </div>
                  <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="count-pill">{count} deadline</span>
                    <span style={{ color: "var(--green)", fontWeight: 600, fontSize: 12 }}>Chi tiết ↗</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
