import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubjects, getSubjectBySlug, getDeadlines } from "@/lib/data";
import { DeadlineCard } from "@/components/deadline-card";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { UserIcon, CalendarIcon, LocationIcon } from "@/components/icons";
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
    <div className="container-custom py-8">
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-xs text-slate-500 flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
        <span>/</span>
        <span>Môn học</span>
        <span>/</span>
        <span className="font-semibold text-slate-800">{subject.name}</span>
      </nav>

      {/* Subject Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2.5 py-0.5 font-bold rounded bg-blue-100 text-blue-700">{subject.code}</span>
          <span className="text-xs px-2 py-0.5 font-medium rounded bg-purple-100 text-purple-700">{subject.badge}</span>
          <span className="text-xs px-2 py-0.5 font-medium rounded bg-teal-100 text-teal-700">{subject.credits} Tín chỉ</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
          {subject.name}
        </h1>

        <p className="text-sm text-slate-600 mb-6 max-w-3xl leading-relaxed">
          {subject.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-semibold text-slate-800">Giảng viên phụ trách</div>
              <div>{subject.lecturer} ({subject.lecturerEmail})</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-semibold text-slate-800">Lịch học định kỳ</div>
              <div>{subject.schedule}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LocationIcon className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-semibold text-slate-800">Địa điểm học</div>
              <div>{subject.room}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Deadlines */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>Danh sách Deadline môn {subject.code}</span>
          <span className="text-xs font-normal text-slate-500">
            Tổng cộng <b>{subjectDeadlines.length}</b> bài tập
          </span>
        </h2>

        {subjectDeadlines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subjectDeadlines.map((deadline) => (
              <div key={deadline.id}>
                <DeadlineCard deadline={deadline} />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm">
            <b>Chưa có deadline nào:</b> Môn học này hiện chưa có bài tập hoặc hạn nộp nào được giao.
          </div>
        )}
      </div>
    </div>
  );
}
