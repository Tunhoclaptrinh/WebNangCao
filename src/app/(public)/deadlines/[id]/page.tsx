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
    <div className="container-custom py-8 max-w-4xl">
      <BreadcrumbJsonLd items={breadcrumbs} />

      <nav className="mb-6 text-xs text-slate-500 flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
        <span>/</span>
        <Link href="/deadlines" className="hover:text-blue-600 transition">Deadlines</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 line-clamp-1">{deadline.title}</span>
      </nav>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Link href={`/subjects/${deadline.subjectSlug}`}>
              <span className="text-xs px-2.5 py-0.5 font-bold rounded bg-blue-100 text-blue-700 cursor-pointer hover:opacity-80">
                {deadline.subjectName}
              </span>
            </Link>
            <span
              className={`text-xs px-2.5 py-0.5 font-semibold rounded ${
                deadline.priority === "urgent"
                  ? "bg-red-100 text-red-700"
                  : deadline.priority === "high"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              Ưu tiên {deadline.priority.toUpperCase()}
            </span>
          </div>
          <CountdownTimer dueDate={deadline.dueDate} isCompleted={isCompleted} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
          {deadline.title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl mb-6 text-xs text-slate-700">
          <div>
            <div className="text-slate-400 font-medium mb-0.5">Hạn chót nộp bài:</div>
            <div className="font-semibold text-slate-800">{formattedDate}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium mb-0.5">Hình thức nộp:</div>
            <div className="font-semibold text-slate-800">{deadline.format}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium mb-0.5">Thang điểm tối đa:</div>
            <div className="font-semibold text-slate-800">{deadline.maxScore} / 10 điểm</div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900 mb-2">Mô tả chi tiết nội dung:</h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {deadline.description}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900 mb-2">Các tiêu chí đánh giá / chấm điểm:</h2>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            {deadline.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link
            href="/deadlines"
            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition"
          >
            ← Quay lại danh sách
          </Link>
          <Link
            href={`/subjects/${deadline.subjectSlug}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            Xem môn {deadline.subjectName} →
          </Link>
        </div>
      </div>
    </div>
  );
}
