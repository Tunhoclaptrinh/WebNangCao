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
    <div>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex justify-between items-center">
        <span>
          Đang truy cập với quyền <strong>Quản trị viên / Lớp trưởng</strong>: {actor.name} ({actor.email})
        </span>
        <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-[11px]">SSR Dynamic Route</span>
      </div>

      {/* Admin KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Tổng số bài tập</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Hạn khẩn cấp</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{stats.urgent}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Đã quá hạn</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{stats.overdue}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Bài tập sắp tới</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.upcoming}</div>
        </div>
      </div>

      {/* Interactive Admin Table (Client island for adding/deleting) */}
      <AdminDeadlineTable initialDeadlines={deadlines} subjects={subjects} />
    </div>
  );
}
