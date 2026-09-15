import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Space, Button } from 'antd';
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

  // Quick preset deadline handlers
  const setQuickDeadline = (type: 'today' | 'tomorrow' | 'weekend' | 'nextWeek') => {
    let target: Dayjs;
    if (type === 'today') {
      target = dayjs().set('hour', 23).set('minute', 59).set('second', 0);
    } else if (type === 'tomorrow') {
      target = dayjs().add(1, 'day').set('hour', 23).set('minute', 59).set('second', 0);
    } else if (type === 'weekend') {
      // Chủ nhật tuần này
      const dayOfWeek = dayjs().day();
      const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
      target = dayjs().add(daysUntilSunday, 'day').set('hour', 23).set('minute', 59).set('second', 0);
    } else {
      // 7 ngày nữa
      target = dayjs().add(7, 'day').set('hour', 23).set('minute', 59).set('second', 0);
    }
    form.setFieldValue('dueDateTime', target);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FormOutlined style={{ fontSize: '16px' }} />
          </div>
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
      okButtonProps={{ style: { background: '#2563eb', borderRadius: '8px', fontWeight: 600 } }}
      cancelButtonProps={{ style: { borderRadius: '8px' } }}
      destroyOnClose
      width={560}
      styles={{
        content: { borderRadius: '16px', padding: '24px' }
      }}
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
        style={{ marginTop: '20px' }}
      >
        {/* 1. Môn học */}
        <Form.Item
          name="subject"
          label={<span style={{ fontWeight: 600, color: '#334155' }}>Môn học</span>}
          rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
        >
          <Select
            size="large"
            options={Object.values(SUBJECT_METAS).map((s) => ({
              value: s.code,
              label: (
                <Space size={8}>
                  <span 
                    style={{ 
                      padding: '1px 6px', 
                      borderRadius: '4px', 
                      background: s.bg, 
                      color: s.textColor, 
                      border: `1px solid ${s.borderColor}`,
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {s.code}
                  </span>
                  <span>{s.name}</span>
                </Space>
              ),
            }))}
          />
        </Form.Item>

        {/* 2. Tên bài tập */}
        <Form.Item
          name="title"
          label={<span style={{ fontWeight: 600, color: '#334155' }}>Tên bài tập / Đề tài</span>}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
          {/* 3. Hạn nộp (Ngày & Giờ) */}
          <div>
            <Form.Item
              name="dueDateTime"
              label={<span style={{ fontWeight: 600, color: '#334155' }}>Hạn nộp (Deadline)</span>}
              rules={[{ required: true, message: 'Vui lòng chọn hạn nộp' }]}
              style={{ marginBottom: '8px' }}
            >
              <DatePicker
                size="large"
                showTime={{ format: 'HH:mm' }}
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
                placeholder="Chọn ngày và giờ"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            {/* Quick preset deadline chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <Button size="small" type="dashed" onClick={() => setQuickDeadline('today')} style={{ fontSize: '11px', borderRadius: '4px' }}>
                Hôm nay 23:59
              </Button>
              <Button size="small" type="dashed" onClick={() => setQuickDeadline('tomorrow')} style={{ fontSize: '11px', borderRadius: '4px' }}>
                Ngày mai
              </Button>
              <Button size="small" type="dashed" onClick={() => setQuickDeadline('weekend')} style={{ fontSize: '11px', borderRadius: '4px' }}>
                Chủ nhật
              </Button>
              <Button size="small" type="dashed" onClick={() => setQuickDeadline('nextWeek')} style={{ fontSize: '11px', borderRadius: '4px' }}>
                +7 ngày
              </Button>
            </div>
          </div>

          {/* 4. Mức độ ưu tiên */}
          <Form.Item
            name="priority"
            label={<span style={{ fontWeight: 600, color: '#334155' }}>Mức độ ưu tiên</span>}
            rules={[{ required: true }]}
          >
            <Select
              size="large"
              options={Object.values(PRIORITY_METAS).map((p) => ({
                value: p.priority,
                label: (
                  <span 
                    style={{ 
                      padding: '1px 8px', 
                      borderRadius: '4px', 
                      background: p.bg, 
                      color: p.textColor, 
                      border: `1px solid ${p.borderColor}`,
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {p.label}
                  </span>
                ),
              }))}
            />
          </Form.Item>
        </div>

        {/* 5. Ghi chú / Mô tả thêm */}
        <Form.Item
          name="description"
          label={<span style={{ fontWeight: 600, color: '#334155' }}>Ghi chú / Yêu cầu chi tiết (tuỳ chọn)</span>}
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
