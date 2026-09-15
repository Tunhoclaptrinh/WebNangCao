import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Space, Tag } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { 
  CreateAssignmentPayload, 
  Priority, 
  SubjectCode, 
  SUBJECT_METAS, 
  PRIORITY_METAS 
} from '../types/assignment.types';

interface AssignmentFormValues {
  title: string;
  subject: SubjectCode;
  dueDateTime: Dayjs;
  priority: Priority;
  description?: string;
}

export interface AssignmentFormModalProps {
  open: boolean;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (payload: CreateAssignmentPayload) => void;
}

export const AssignmentFormModal: React.FC<AssignmentFormModalProps> = ({
  open,
  submitting,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<AssignmentFormValues>();

  const handleFinish = (values: AssignmentFormValues) => {
    const payload: CreateAssignmentPayload = {
      title: values.title.trim(),
      subject: values.subject,
      dueDate: values.dueDateTime.toISOString(),
      priority: values.priority,
      description: values.description?.trim(),
    };
    onSubmit(payload);
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: 600 }}>
          <FormOutlined style={{ color: '#1677ff' }} />
          <span>Thêm Deadline Bài Tập Mới</span>
        </div>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Lưu bài tập"
      cancelText="Huỷ"
      confirmLoading={submitting}
      onOk={() => form.submit()}
      destroyOnClose
      width={560}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          subject: 'LTWNC',
          priority: 'MEDIUM',
          dueDateTime: dayjs().add(3, 'day').set('hour', 23).set('minute', 59),
        }}
        style={{ marginTop: '16px' }}
      >
        {/* 1. Môn học */}
        <Form.Item
          name="subject"
          label={<span style={{ fontWeight: 600 }}>Môn học</span>}
          rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
        >
          <Select
            size="large"
            options={Object.values(SUBJECT_METAS).map((s) => ({
              value: s.code,
              label: (
                <Space>
                  <Tag color={s.color} style={{ margin: 0, fontWeight: 600 }}>{s.code}</Tag>
                  <span>{s.name}</span>
                </Space>
              ),
            }))}
          />
        </Form.Item>

        {/* 2. Tên bài tập */}
        <Form.Item
          name="title"
          label={<span style={{ fontWeight: 600 }}>Tên bài tập / Đề tài</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập tên bài tập' },
            { min: 5, message: 'Tên bài tập phải có ít nhất 5 ký tự' },
          ]}
        >
          <Input
            size="large"
            placeholder="Ví dụ: Bài tập tuần 3 - Redux Toolkit Shopping Cart..."
            allowClear
          />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* 3. Hạn nộp (Ngày & Giờ) */}
          <Form.Item
            name="dueDateTime"
            label={<span style={{ fontWeight: 600 }}>Hạn nộp (Deadline)</span>}
            rules={[{ required: true, message: 'Vui lòng chọn hạn nộp' }]}
          >
            <DatePicker
              size="large"
              showTime={{ format: 'HH:mm' }}
              format="DD/MM/YYYY HH:mm"
              style={{ width: '100%' }}
              placeholder="Chọn ngày và giờ"
              // Vô hiệu hóa ngày trong quá khứ khi tạo mới
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          {/* 4. Mức độ ưu tiên */}
          <Form.Item
            name="priority"
            label={<span style={{ fontWeight: 600 }}>Mức độ ưu tiên</span>}
            rules={[{ required: true }]}
          >
            <Select
              size="large"
              options={Object.values(PRIORITY_METAS).map((p) => ({
                value: p.priority,
                label: (
                  <Space>
                    <Tag color={p.color} style={{ margin: 0 }}>{p.label}</Tag>
                  </Space>
                ),
              }))}
            />
          </Form.Item>
        </div>

        {/* 5. Ghi chú / Mô tả thêm */}
        <Form.Item
          name="description"
          label={<span style={{ fontWeight: 600 }}>Ghi chú / Yêu cầu chi tiết</span>}
        >
          <Input.TextArea
            rows={3}
            placeholder="Nội dung cần lưu ý, link tài liệu hoặc yêu cầu nộp file zip..."
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
