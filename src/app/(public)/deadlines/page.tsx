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
    <div className="container" style={{ paddingTop: 35, paddingBottom: 65 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <span className="eyebrow">
          <span className="tiny-dot" />
          DỮ LIỆU ĐỒNG BỘ ISR (60S) · KHÓA D23 PTIT
        </span>
        <h1 style={{ fontSize: 38, margin: "14px 0 10px", letterSpacing: "-1.5px" }}>
          Toàn Bộ Deadline & Bài Tập
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", maxWidth: 650, margin: 0 }}>
          Trang tự động tái tạo dữ liệu định kỳ mỗi 60 giây (<b>ISR — Incremental Static Regeneration</b>) kết hợp On-demand revalidation khi có thao tác thêm/xóa bài tập từ ban cán sự.
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
