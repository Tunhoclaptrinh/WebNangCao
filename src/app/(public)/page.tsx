import React from "react";
import Link from "next/link";
import { getSubjects, getDeadlines, calculateStats } from "@/lib/data";
import { getCurrentActor } from "@/features/auth/guards";
import { DeadlineCard } from "@/components/deadline-card";
import {
  CalendarIcon,
  BookIcon,
  ClockIcon,
  ArrowRightIcon,
  UserIcon,
} from "@/components/icons";
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
    <div>
      <WebsiteJsonLd
        name={siteConfig.name}
        url={siteConfig.url}
        description={siteConfig.description}
      />

      {/* Hero Banner Section */}
      <section className="hero-gradient text-white py-16 px-4">
        <div className="container-custom max-w-4xl text-center">
          <span className="inline-block mb-4 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider bg-white/20 text-blue-100 backdrop-blur-sm border border-white/20">
            Cổng Thông Tin Học Tập Chính Thức · {siteConfig.academicYear}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight leading-tight">
            Class Deadline Hub
          </h1>
          <p className="text-base sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-normal leading-relaxed">
            Hệ thống quản lý thời hạn nộp bài tập, đồ án và theo dõi tiến độ học tập đồng bộ dành riêng cho tập thể lớp <b>{siteConfig.class}</b>.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/deadlines"
              className="inline-flex items-center gap-2 bg-white text-blue-800 hover:bg-blue-50 font-bold h-12 px-6 rounded-lg shadow-sm transition"
            >
              <CalendarIcon className="w-5 h-5 text-blue-700" />
              Xem Tất Cả Deadline
            </Link>

            {actor ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-blue-700/60 text-white hover:bg-blue-700 border border-blue-400/50 font-medium h-12 px-6 rounded-lg transition"
              >
                <UserIcon className="w-5 h-5" />
                Dashboard Cá Nhân
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-blue-700/60 text-white hover:bg-blue-700 border border-blue-400/50 font-medium h-12 px-6 rounded-lg transition"
              >
                <UserIcon className="w-5 h-5" />
                Đăng Nhập Sinh Viên
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="container-custom -mt-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-center p-2 border-r border-slate-100 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">{stats.subjectsCount}</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Môn học đang theo</div>
          </div>
          <div className="text-center p-2 border-r border-slate-100 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.total}</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Tổng số deadline</div>
          </div>
          <div className="text-center p-2 border-r border-slate-100 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-red-500">{stats.urgent}</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Hạn nộp khẩn cấp (≤ 3 ngày)</div>
          </div>
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-green-600">{stats.upcoming}</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Bài tập sắp tới</div>
          </div>
        </div>
      </section>

      {/* Urgent Deadlines Section */}
      {urgentDeadlines.length > 0 && (
        <section className="container-custom mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 m-0">
                <ClockIcon className="w-5 h-5 text-red-500" />
                Hạn Chót Cần Ưu Tiên Hoàn Thành
              </h2>
              <p className="text-xs text-slate-500 mt-1">Các bài tập và bài kiểm tra có thời hạn nộp gần nhất</p>
            </div>
            <Link
              href="/deadlines"
              className="text-blue-600 hover:text-blue-700 font-semibold text-xs flex items-center gap-1"
            >
              Xem tất cả <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {urgentDeadlines.map((deadline) => (
              <div key={deadline.id}>
                <DeadlineCard deadline={deadline} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Subjects Grid (SSG linked) */}
      <section className="container-custom mb-14">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 m-0">
            <BookIcon className="w-5 h-5 text-blue-600" />
            Danh Mục Môn Học Học Kỳ 7
          </h2>
          <p className="text-xs text-slate-500 mt-1">Thông tin chi tiết giảng viên, lịch học và deadline theo từng môn</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((subject) => {
            const subjectDeadlines = deadlines.filter((d) => d.subjectId === subject.id);
            return (
              <div
                key={subject.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition flex flex-col h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-semibold text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">{subject.code}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">{subject.badge}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  <Link href={`/subjects/${subject.slug}`} className="hover:text-blue-600 transition">
                    {subject.name}
                  </Link>
                </h3>

                <p className="text-xs text-slate-500 mb-4 line-clamp-3 leading-relaxed">
                  {subject.description}
                </p>

                <div className="mt-auto pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div><b>Giảng viên:</b> {subject.lecturer}</div>
                  <div><b>Lịch học:</b> {subject.schedule}</div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-medium text-blue-600">
                      {subjectDeadlines.length} deadline
                    </span>
                    <Link
                      href={`/subjects/${subject.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-xs"
                    >
                      Chi tiết →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
