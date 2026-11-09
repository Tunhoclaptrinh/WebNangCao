import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubjects, getSubjectBySlug, getDeadlines } from "@/lib/data";
import { DeadlineCard } from "@/components/deadline-card";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

// SSG: generateStaticParams pre-renders all 4 subject routes at build time
export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((subject) => ({ slug: subject.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) return { title: "Môn học không tồn tại" };

  return {
    title: `${subject.code} — ${subject.name}`,
    description: `Thông tin môn học ${subject.name}, giảng viên ${subject.lecturer}, lịch học và danh sách deadline mới nhất.`,
  };
}

export default async function SubjectDetailPage({ params }: { params: Promise<{ slug: string }> }): Promise<React.JSX.Element> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  const allDeadlines = await getDeadlines();
  const subjectDeadlines = allDeadlines.filter((d) => d.subjectId === subject.id);

  const breadcrumbs = [
    { name: "Trang chủ", url: `${siteConfig.url}/` },
    { name: "Môn học", url: `${siteConfig.url}/` },
    { name: subject.name, url: `${siteConfig.url}/subjects/${subject.slug}` },
  ];

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 65 }}>
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Breadcrumb Navigation */}
      <nav style={{ marginBottom: 24, fontSize: 12, color: "var(--muted)", display: "flex", gap: 8, alignItems: "center" }} aria-label="Breadcrumb">
        <Link href="/" style={{ color: "var(--muted)" }}>Trang chủ</Link>
        <span>/</span>
        <span>Môn học</span>
        <span>/</span>
        <span style={{ fontWeight: 600, color: "var(--ink)" }}>{subject.name}</span>
      </nav>

      {/* Subject Header Card */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid var(--line)",
          borderRadius: 8,
          padding: "32px",
          marginBottom: 36,
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}>
          <span className="subject-code-pill">{subject.code}</span>
          <span style={{ fontSize: 11, background: "#f0f3eb", padding: "2px 8px", borderRadius: 4, color: "var(--green)", fontWeight: 600 }}>
            {subject.badge}
          </span>
          <span style={{ fontSize: 11, background: "#edf1e7", padding: "2px 8px", borderRadius: 4, color: "var(--muted)", fontWeight: 600 }}>
            {subject.credits} Tín chỉ
          </span>
        </div>

        <h1 style={{ fontSize: 36, letterSpacing: "-1.5px", margin: "10px 0 14px", color: "var(--ink)" }}>
          {subject.name}
        </h1>

        <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.85, maxWidth: 800, marginBottom: 24 }}>
          {subject.description}
        </p>

        <div className="subject-meta-card" style={{ marginBottom: 0 }}>
          <div className="subject-meta-item">
            <strong>Giảng viên phụ trách</strong>
            <span>{subject.lecturer}</span>
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>{subject.lecturerEmail}</div>
          </div>

          <div className="subject-meta-item">
            <strong>Lịch học định kỳ</strong>
            <span>{subject.schedule}</span>
          </div>

          <div className="subject-meta-item">
            <strong>Địa điểm học</strong>
            <span>{subject.room}</span>
          </div>
        </div>
      </div>

      {/* Subject Deadlines */}
      <div style={{ marginBottom: 40 }}>
        <div className="section-heading">
          <div>
            <span className="eyebrow">HẠN NỘP BÀI TẬP</span>
            <h2>
              Danh sách Deadline môn {subject.code}{" "}
              <span className="count-pill">{subjectDeadlines.length} bài tập</span>
            </h2>
          </div>
        </div>

        {subjectDeadlines.length > 0 ? (
          <div className="deadline-grid">
            {subjectDeadlines.map((deadline) => (
              <div key={deadline.id}>
                <DeadlineCard deadline={deadline} />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "40px 20px",
              border: "1px dashed #d1dbca",
              borderRadius: 8,
              textAlign: "center",
              background: "#f7f9f4",
              color: "var(--muted)",
              fontSize: 13,
            }}
          >
            Môn học này hiện chưa có bài tập hoặc hạn nộp nào được giao.
          </div>
        )}
      </div>
    </div>
  );
}
