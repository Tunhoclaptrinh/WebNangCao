import React from "react";
import { getDeadlines, getSubjects, getUserCompletions } from "@/lib/data";
import { getCurrentActor } from "@/features/auth/guards";
import { DeadlineFilterBoard } from "@/components/deadline-filter-board";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";

// ISR: Incremental Static Regeneration every 60 seconds according to Lab 3 rubric
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Danh Sách Toàn Bộ Deadline",
  description: "Bảng tra cứu và theo dõi toàn bộ hạn nộp bài tập, đồ án của lớp RIPT1411-20261-02 kèm bộ lọc môn học và mức độ ưu tiên.",
};

export default async function DeadlinesPage(): Promise<React.JSX.Element> {
  const deadlines = await getDeadlines();
  const subjects = await getSubjects();
  const actor = await getCurrentActor();
  const userCompletions = actor ? await getUserCompletions(actor.email) : [];

  return (
    <div className="container-custom py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Toàn Bộ Deadline & Bài Tập
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Trang tự động tái tạo dữ liệu định kỳ mỗi 60 giây (<b>ISR — Incremental Static Regeneration</b>) kết hợp On-demand revalidation khi có thay đổi từ quản trị.
        </p>
      </div>

      {/* Interactive Filter Board (Client island with 300ms debounce) */}
      <Providers>
        <DeadlineFilterBoard
          initialDeadlines={deadlines}
          subjects={subjects}
          userCompletions={userCompletions}
          canToggle={!!actor}
        />
      </Providers>
    </div>
  );
}
