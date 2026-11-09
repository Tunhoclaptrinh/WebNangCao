"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Input, Select, Radio, Empty, Row, Col } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import type { Deadline, Subject } from "@/types";
import { DeadlineCard } from "./deadline-card";

interface DeadlineFilterBoardProps {
  initialDeadlines: Deadline[];
  subjects: Subject[];
  userCompletions?: string[];
  canToggle?: boolean;
}

export function DeadlineFilterBoard({
  initialDeadlines,
  subjects,
  userCompletions = [],
  canToggle = false,
}: DeadlineFilterBoardProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "urgent" | "upcoming" | "overdue">("all");

  // Debounce search 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Filter logic
  const filteredDeadlines = useMemo(() => {
    const now = new Date();
    return initialDeadlines.filter((item) => {
      // Search
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchSubject = item.subjectName.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchSubject) return false;
      }

      // Subject
      if (selectedSubject !== "all" && item.subjectSlug !== selectedSubject && item.subjectId !== selectedSubject) {
        return false;
      }

      // Priority
      if (selectedPriority !== "all" && item.priority !== selectedPriority) {
        return false;
      }

      // Status
      if (statusFilter !== "all") {
        const due = new Date(item.dueDate);
        const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        if (statusFilter === "overdue" && diffDays >= 0) return false;
        if (statusFilter === "urgent" && (diffDays < 0 || diffDays > 3)) return false;
        if (statusFilter === "upcoming" && diffDays <= 3) return false;
      }

      return true;
    });
  }, [initialDeadlines, debouncedSearch, selectedSubject, selectedPriority, statusFilter]);

  return (
    <div>
      {/* Filter Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          {/* Search */}
          <div className="md:col-span-2">
            <Input
              size="large"
              placeholder="Tìm kiếm deadline, môn học, từ khóa..."
              prefix={<SearchOutlined className="text-slate-400 mr-1" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </div>

          {/* Subject Select */}
          <div>
            <Select
              size="large"
              className="w-full"
              value={selectedSubject}
              onChange={setSelectedSubject}
              options={[
                { label: "Tất cả môn học", value: "all" },
                ...subjects.map((s) => ({ label: `${s.code} - ${s.name}`, value: s.slug })),
              ]}
            />
          </div>

          {/* Priority Select */}
          <div>
            <Select
              size="large"
              className="w-full"
              value={selectedPriority}
              onChange={setSelectedPriority}
              options={[
                { label: "Tất cả mức ưu tiên", value: "all" },
                { label: "Khẩn cấp", value: "urgent" },
                { label: "Ưu tiên cao", value: "high" },
                { label: "Bình thường", value: "medium" },
                { label: "Thấp", value: "low" },
              ]}
            />
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <FilterOutlined /> Trạng thái:
            </span>
            <Radio.Group
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="all">Tất cả ({initialDeadlines.length})</Radio.Button>
              <Radio.Button value="urgent">Khẩn cấp (≤ 3 ngày)</Radio.Button>
              <Radio.Button value="upcoming">Sắp tới</Radio.Button>
              <Radio.Button value="overdue">Đã quá hạn</Radio.Button>
            </Radio.Group>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Hiển thị <b>{filteredDeadlines.length}</b> / {initialDeadlines.length} deadline
          </div>
        </div>
      </div>

      {/* Grid Results */}
      {filteredDeadlines.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredDeadlines.map((deadline) => (
            <Col xs={24} sm={12} lg={8} key={deadline.id}>
              <DeadlineCard
                deadline={deadline}
                isCompleted={userCompletions.includes(deadline.id)}
                canToggle={canToggle}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="bg-white py-12 rounded-xl border border-slate-200 text-center">
          <Empty
            description={
              <span className="text-slate-500">
                Không tìm thấy bài tập nào khớp với bộ lọc hiện tại.
              </span>
            }
          />
        </div>
      )}
    </div>
  );
}
