import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeadlines, getDeadlineById, getUserCompletions } from "@/lib/data";
import { getCurrentActor } from "@/features/auth/guards";
import { CountdownTimer } from "@/components/countdown-timer";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

// ISR with on-demand revalidation
export const revalidate = 60;

export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const deadline = await getDeadlineById(id);
  if (!deadline) return { title: "Không tìm thấy deadline" };

  return {
    title: deadline.title,
    description: `Hạn nộp: ${deadline.dueDate}. Môn học: ${deadline.subjectName}. Hình thức: ${deadline.format}.`,
    openGraph: {
      title: deadline.title,
      description: deadline.description,
      type: "article",
    },
  };
}

export default async function DeadlineDetailPage({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const { id } = await params;
  const deadline = await getDeadlineById(id);
  if (!deadline) notFound();

  const actor = await getCurrentActor();
  const completedIds = actor ? await getUserCompletions(actor.email) : [];
  const isCompleted = completedIds.includes(deadline.id);

  const formattedDate = new Date(deadline.dueDate).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const breadcrumbs = [
    { name: "Trang chủ", url: `${siteConfig.url}/` },
    { name: "Deadlines", url: `${siteConfig.url}/deadlines` },
    { name: deadline.title, url: `${siteConfig.url}/deadlines/${deadline.id}` },
  ];

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 65, maxWidth: 960 }}>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <nav style={{ marginBottom: 24, fontSize: 12, color: "var(--muted)", display: "flex", gap: 8, alignItems: "center" }} aria-label="Breadcrumb">
        <Link href="/" style={{ color: "var(--muted)" }}>Trang chủ</Link>
        <span>/</span>
        <Link href="/deadlines" style={{ color: "var(--muted)" }}>Deadlines</Link>
        <span>/</span>
        <span style={{ fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {deadline.title}
        </span>
      </nav>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid var(--line)",
          borderRadius: 8,
          padding: 36,
          boxShadow: "0 6px 20px rgba(36, 55, 46, 0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link href={`/subjects/${deadline.subjectSlug}`}>
              <span className="subject-code-pill">{deadline.subjectName}</span>
            </Link>
            <span
              className={`priority-pill ${
                deadline.priority === "urgent"
                  ? "priority-urgent"
                  : deadline.priority === "high"
                  ? "priority-high"
                  : deadline.priority === "medium"
                  ? "priority-medium"
                  : "priority-low"
              }`}
            >
              Ưu tiên {deadline.priority.toUpperCase()}
            </span>
          </div>
          <CountdownTimer dueDate={deadline.dueDate} isCompleted={isCompleted} />
        </div>

        <h1 style={{ fontSize: 32, letterSpacing: "-1.2px", margin: "14px 0 20px", color: "var(--ink)" }}>
          {deadline.title}
        </h1>

        <div className="subject-meta-card" style={{ marginBottom: 28 }}>
          <div className="subject-meta-item">
            <strong>Hạn chót nộp bài:</strong>
            <span style={{ fontSize: 13 }}>{formattedDate}</span>
          </div>
          <div className="subject-meta-item">
            <strong>Hình thức nộp:</strong>
            <span style={{ fontSize: 13 }}>{deadline.format}</span>
          </div>
          <div className="subject-meta-item">
            <strong>Thang điểm tối đa:</strong>
            <span style={{ fontSize: 13 }}>{deadline.maxScore} / 10 điểm</span>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 17, marginBottom: 10, letterSpacing: "-0.3px" }}>Mô tả chi tiết nội dung:</h2>
          <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.85, margin: 0, whiteSpace: "pre-line" }}>
            {deadline.description}
          </p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, marginBottom: 10, letterSpacing: "-0.3px" }}>Các tiêu chí đánh giá / chấm điểm:</h2>
          <ul style={{ paddingLeft: 20, margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.8 }}>
            {deadline.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>

        <div style={{ paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/deadlines" className="button-outline">
            ← Quay lại danh sách
          </Link>
          <Link href={`/subjects/${deadline.subjectSlug}`} className="button-primary">
            Xem môn {deadline.subjectName} →
          </Link>
        </div>
      </div>
    </div>
  );
}
