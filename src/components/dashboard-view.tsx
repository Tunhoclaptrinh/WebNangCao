"use client";

import React from "react";
import { Card, Progress, Tag, Tabs, Row, Col, Empty } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { Deadline, UserActor } from "@/types";
import { DeadlineCard } from "./deadline-card";

interface DashboardViewProps {
  actor: UserActor;
  allDeadlines: Deadline[];
  completedIds: string[];
}

export function DashboardView({ actor, allDeadlines, completedIds }: DashboardViewProps) {
  const pendingDeadlines = allDeadlines.filter((d) => !completedIds.includes(d.id));
  const completedDeadlines = allDeadlines.filter((d) => completedIds.includes(d.id));
  const percent = allDeadlines.length > 0 ? Math.round((completedDeadlines.length / allDeadlines.length) * 100) : 0;

  return (
    <div>
      {/* Student Profile Card */}
      <Card className="mb-6 shadow-sm border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
              {actor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 m-0">{actor.name}</h1>
                <Tag color={actor.role === "admin" ? "purple" : "blue"}>
                  {actor.role === "admin" ? "Lớp trưởng (Admin)" : "Sinh viên"}
                </Tag>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                <span><b>Email:</b> {actor.email}</span>
                <span><b>Mã sinh viên:</b> {actor.studentId || "B23DCCC173"}</span>
                <span><b>Lớp:</b> RIPT1411-20261-02</span>
              </div>
            </div>
          </div>

          <div className="text-right sm:border-l sm:pl-6 border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-1">Tiến độ hoàn thành bài tập</div>
            <div className="text-xl font-black text-blue-600">
              {completedDeadlines.length} / {allDeadlines.length} bài
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
            <span>Tỷ lệ hoàn thành học kỳ</span>
            <span>{percent}%</span>
          </div>
          <Progress percent={percent} strokeColor="#1677ff" showInfo={false} />
        </div>
      </Card>

      {/* Tabs for Pending vs Completed Deadlines */}
      <Card className="shadow-sm border-slate-200" bodyStyle={{ padding: "1.25rem" }}>
        <Tabs
          defaultActiveKey="pending"
          items={[
            {
              key: "pending",
              label: (
                <span className="flex items-center gap-1.5 font-semibold">
                  <ClockCircleOutlined className="text-amber-500" />
                  Bài tập cần nộp ({pendingDeadlines.length})
                </span>
              ),
              children: (
                <div className="pt-2">
                  {pendingDeadlines.length > 0 ? (
                    <Row gutter={[16, 16]}>
                      {pendingDeadlines.map((deadline) => (
                        <Col xs={24} md={12} key={deadline.id}>
                          <DeadlineCard deadline={deadline} isCompleted={false} canToggle={true} />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Empty
                      description="Tuyệt vời! Bạn đã hoàn thành toàn bộ deadline hiện có."
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </div>
              ),
            },
            {
              key: "completed",
              label: (
                <span className="flex items-center gap-1.5 font-semibold text-green-600">
                  <CheckCircleOutlined />
                  Đã hoàn thành ({completedDeadlines.length})
                </span>
              ),
              children: (
                <div className="pt-2">
                  {completedDeadlines.length > 0 ? (
                    <Row gutter={[16, 16]}>
                      {completedDeadlines.map((deadline) => (
                        <Col xs={24} md={12} key={deadline.id}>
                          <DeadlineCard deadline={deadline} isCompleted={true} canToggle={true} />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Empty
                      description="Chưa có bài tập nào được đánh dấu hoàn thành."
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
