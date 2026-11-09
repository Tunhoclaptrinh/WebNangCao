"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { Card, Tag, Button, message } from "antd";
import {
  FileTextOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import type { Deadline } from "@/types";
import { CountdownTimer } from "./countdown-timer";
import { toggleCompletionAction } from "@/features/deadlines/actions";

interface DeadlineCardProps {
  deadline: Deadline;
  isCompleted?: boolean;
  canToggle?: boolean;
}

export function DeadlineCard({ deadline, isCompleted = false, canToggle = false }: DeadlineCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleCompletionAction(deadline.id);
      if (res.success) {
        message.success(res.message);
      } else {
        message.error(res.message);
      }
    });
  };

  const priorityColors = {
    urgent: "red",
    high: "volcano",
    medium: "orange",
    low: "blue",
  };

  const priorityLabels = {
    urgent: "Khẩn cấp",
    high: "Ưu tiên cao",
    medium: "Bình thường",
    low: "Thấp",
  };

  const formattedDate = new Date(deadline.dueDate).toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card
      className={`h-full flex flex-col justify-between transition-all hover:shadow-md border ${
        isCompleted ? "border-green-300 bg-green-50/20" : "border-slate-200 bg-white"
      }`}
      styles={{ body: { padding: "1.25rem", display: "flex", flexDirection: "column", height: "100%" } }}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href={`/subjects/${deadline.subjectSlug}`}>
              <Tag color="blue" className="cursor-pointer hover:opacity-80 m-0">
                {deadline.subjectName}
              </Tag>
            </Link>
            <Tag color={priorityColors[deadline.priority]} className="m-0">
              {priorityLabels[deadline.priority]}
            </Tag>
          </div>
          <CountdownTimer dueDate={deadline.dueDate} isCompleted={isCompleted} />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug line-clamp-2 hover:text-blue-600 transition">
          <Link href={`/deadlines/${deadline.id}`}>{deadline.title}</Link>
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
          {deadline.description}
        </p>
      </div>

      {/* Meta & Footer */}
      <div className="pt-3 border-t border-slate-100 mt-auto">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <CalendarOutlined />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1 font-medium text-slate-600">
            <FileTextOutlined />
            {deadline.format}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          {canToggle ? (
            <Button
              size="small"
              type={isCompleted ? "default" : "dashed"}
              icon={<CheckOutlined />}
              loading={isPending}
              onClick={handleToggle}
              className={isCompleted ? "text-green-600 border-green-400" : ""}
            >
              {isCompleted ? "Đã nộp" : "Đánh dấu xong"}
            </Button>
          ) : (
            <span className="text-xs text-slate-400">Thang điểm {deadline.maxScore}</span>
          )}

          <Link href={`/deadlines/${deadline.id}`}>
            <Button size="small" type="link" className="p-0 flex items-center gap-1">
              Chi tiết <ArrowRightOutlined className="text-xs" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
