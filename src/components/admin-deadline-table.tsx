"use client";

import React, { useState, useTransition } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Tag,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { Deadline, Subject } from "@/types";
import { createDeadlineAction, deleteDeadlineAction } from "@/features/deadlines/actions";
import { CountdownTimer } from "./countdown-timer";

interface AdminDeadlineTableProps {
  initialDeadlines: Deadline[];
  subjects: Subject[];
}

export function AdminDeadlineTable({ initialDeadlines, subjects }: AdminDeadlineTableProps) {
  const [deadlines, setDeadlines] = useState(initialDeadlines);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isPending, startTransition] = useTransition();

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.set("title", values.title);
      formData.set("description", values.description);
      formData.set("subjectId", values.subjectId);
      formData.set("dueDate", values.dueDate.toISOString());
      formData.set("priority", values.priority);
      formData.set("format", values.format);
      formData.set("maxScore", String(values.maxScore || 10));
      formData.set("requirements", values.requirements || "");

      startTransition(async () => {
        const res = await createDeadlineAction(formData);
        if (res.success && res.data) {
          message.success(res.message);
          setDeadlines([res.data as Deadline, ...deadlines]);
          form.resetFields();
          setIsModalOpen(false);
        } else {
          message.error(res.message);
        }
      });
    } catch {
      // Form validation error
    }
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteDeadlineAction(id);
      if (res.success) {
        message.success(res.message);
        setDeadlines(deadlines.filter((d) => d.id !== id));
      } else {
        message.error(res.message);
      }
    });
  };

  const columns = [
    {
      title: "Tên bài tập / Deadline",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: Deadline) => (
        <div>
          <div className="font-semibold text-slate-900">{title}</div>
          <div className="text-xs text-slate-500 line-clamp-1">{record.description}</div>
        </div>
      ),
    },
    {
      title: "Môn học",
      dataIndex: "subjectName",
      key: "subjectName",
      render: (subjectName: string) => <Tag color="blue">{subjectName}</Tag>,
    },
    {
      title: "Hạn nộp bài",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate: string) => {
        const d = new Date(dueDate);
        return (
          <div>
            <div className="text-xs font-semibold text-slate-800">
              {d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
            </div>
            <div className="text-xs text-slate-500">
              {d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        );
      },
    },
    {
      title: "Đếm ngược",
      key: "countdown",
      render: (_: unknown, record: Deadline) => <CountdownTimer dueDate={record.dueDate} />,
    },
    {
      title: "Mức ưu tiên",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => {
        const colors: Record<string, string> = { urgent: "red", high: "volcano", medium: "orange", low: "blue" };
        const labels: Record<string, string> = { urgent: "Khẩn cấp", high: "Cao", medium: "Bình thường", low: "Thấp" };
        return <Tag color={colors[priority] || "default"}>{labels[priority] || priority}</Tag>;
      },
    },
    {
      title: "Hình thức",
      dataIndex: "format",
      key: "format",
      render: (format: string) => <span className="text-xs font-medium text-slate-600">{format}</span>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: Deadline) => (
        <Popconfirm
          title="Xóa deadline này?"
          description="Hành động này sẽ xóa vĩnh viễn bài tập khỏi hệ thống."
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true, loading: isPending }}
          onConfirm={() => handleDelete(record.id)}
        >
          <Button size="small" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      {/* Top Action Bar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 m-0">Quản lý Deadline Lớp học</h2>
          <p className="text-xs text-slate-500 mt-1">
            Quyền hạn Lớp trưởng: Thêm bài tập mới, xóa deadline và kích hoạt On-demand Revalidation.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Thêm Deadline mới
        </Button>
      </div>

      {/* Main Table */}
      <Card className="shadow-sm border-slate-200">
        <Table
          dataSource={deadlines}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8, showTotal: (total) => `Tổng cộng ${total} bài tập` }}
        />
      </Card>

      {/* Modal Add Deadline */}
      <Modal
        title="Thêm Deadline mới cho Lớp"
        open={isModalOpen}
        onOk={handleCreate}
        confirmLoading={isPending}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu Deadline"
        cancelText="Hủy bỏ"
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Tên bài tập / Deadline"
            rules={[{ required: true, message: "Vui lòng nhập tên bài tập" }]}
          >
            <Input placeholder="Ví dụ: Bài thực hành số 3 — Class Deadline Hub" />
          </Form.Item>

          <Form.Item
            name="subjectId"
            label="Môn học phụ trách"
            rules={[{ required: true, message: "Vui lòng chọn môn học" }]}
          >
            <Select
              placeholder="Chọn môn học"
              options={subjects.map((s) => ({ label: `${s.code} - ${s.name}`, value: s.id }))}
            />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Hạn chót nộp bài"
                rules={[{ required: true, message: "Vui lòng chọn ngày giờ" }]}
              >
                <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" placeholder="Chọn ngày & giờ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Mức độ ưu tiên"
                initialValue="high"
                rules={[{ required: true, message: "Vui lòng chọn mức ưu tiên" }]}
              >
                <Select
                  options={[
                    { label: "Khẩn cấp", value: "urgent" },
                    { label: "Ưu tiên cao", value: "high" },
                    { label: "Bình thường", value: "medium" },
                    { label: "Thấp", value: "low" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="format"
                label="Hình thức nộp"
                initialValue="Source Code GitHub"
                rules={[{ required: true, message: "Vui lòng nhập hình thức" }]}
              >
                <Input placeholder="Ví dụ: Báo cáo PDF, Source Code..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxScore" label="Thang điểm tối đa" initialValue={10}>
                <InputNumber min={1} max={10} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả chi tiết yêu cầu"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={3} placeholder="Mô tả các yêu cầu kỹ thuật cần đạt được..." />
          </Form.Item>

          <Form.Item name="requirements" label="Các tiêu chí chấm điểm (mỗi dòng 1 tiêu chí)">
            <Input.TextArea rows={2} placeholder="Yêu cầu 1&#10;Yêu cầu 2&#10;Yêu cầu 3..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
