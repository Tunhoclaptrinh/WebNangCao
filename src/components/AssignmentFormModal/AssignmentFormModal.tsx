import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { 
  CreateAssignmentPayload, 
  SUBJECT_METAS, 
  PRIORITY_METAS 
} from '../../types/assignment.types';
import { AssignmentFormModalProps, AssignmentFormValues } from './AssignmentFormModal.types';
import './AssignmentFormModal.css';

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

  // Nút chọn nhanh hạn nộp
  const setQuickDeadline = (type: 'today' | 'tomorrow' | 'weekend' | 'nextWeek') => {
    let target: Dayjs;
    if (type === 'today') {
      target = dayjs().set('hour', 23).set('minute', 59).set('second', 0);
    } else if (type === 'tomorrow') {
      target = dayjs().add(1, 'day').set('hour', 23).set('minute', 59).set('second', 0);
    } else if (type === 'weekend') {
      const dayOfWeek = dayjs().day();
      const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
      target = dayjs().add(daysUntilSunday, 'day').set('hour', 23).set('minute', 59).set('second', 0);
    } else {
      target = dayjs().add(7, 'day').set('hour', 23).set('minute', 59).set('second', 0);
    }
    form.setFieldsValue({ dueDateTime: target });
  };

  return (
    <Modal
      title={
        <div className="assignment-form-modal__header">
          <FormOutlined style={{ color: '#2563eb' }} />
          <span>Thêm Deadline Bài Tập Mới</span>
        </div>
      }
      open={open}
      confirmLoading={submitting}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      okText="Lưu bài tập"
      cancelText="Huỷ"
      okButtonProps={{ style: { borderRadius: '8px', background: '#2563eb', fontWeight: 600 } }}
      cancelButtonProps={{ style: { borderRadius: '8px' } }}
      destroyOnClose
      width={520}
      className="assignment-form-modal"
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
        {/* Tên bài tập */}
        <Form.Item
          name="title"
          label={<strong>Tên bài tập / Đề mục</strong>}
          rules={[
            { required: true, message: 'Vui lòng nhập tên bài tập' },
            { min: 3, message: 'Tên bài tập cần ít nhất 3 ký tự' },
          ]}
        >
          <Input 
            placeholder="Ví dụ: Bài tập lớn — Chuẩn hoá lược đồ cơ sở dữ liệu BCNF" 
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Môn học */}
          <Form.Item
            name="subject"
            label={<strong>Môn học</strong>}
            rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
          >
            <Select style={{ width: '100%' }}>
              {Object.entries(SUBJECT_METAS).map(([code, meta]) => (
                <Select.Option key={code} value={code}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span 
                      style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: meta.textColor,
                        display: 'inline-block' 
                      }} 
                    />
                    <span>{meta.name}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Mức độ ưu tiên */}
          <Form.Item
            name="priority"
            label={<strong>Độ ưu tiên</strong>}
            rules={[{ required: true, message: 'Vui lòng chọn mức ưu tiên' }]}
          >
            <Select style={{ width: '100%' }}>
              {Object.entries(PRIORITY_METAS).map(([val, meta]) => (
                <Select.Option key={val} value={val}>
                  <span style={{ color: meta.textColor, fontWeight: 600 }}>
                    {meta.label}
                  </span>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Thời hạn nộp & Chọn nhanh */}
        <Form.Item
          name="dueDateTime"
          label={<strong>Thời hạn nộp (Deadline)</strong>}
          rules={[{ required: true, message: 'Vui lòng chọn ngày giờ hết hạn' }]}
          extra={
            <div className="assignment-form-modal__presets">
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Chọn nhanh:</span>
              <Button type="text" size="small" onClick={() => setQuickDeadline('today')} className="assignment-form-modal__preset-btn">
                Hôm nay 23:59
              </Button>
              <Button type="text" size="small" onClick={() => setQuickDeadline('tomorrow')} className="assignment-form-modal__preset-btn">
                Ngày mai
              </Button>
              <Button type="text" size="small" onClick={() => setQuickDeadline('weekend')} className="assignment-form-modal__preset-btn">
                Chủ nhật
              </Button>
              <Button type="text" size="small" onClick={() => setQuickDeadline('nextWeek')} className="assignment-form-modal__preset-btn">
                +7 ngày
              </Button>
            </div>
          }
        >
          <DatePicker 
            showTime 
            format="YYYY-MM-DD HH:mm" 
            style={{ width: '100%', borderRadius: '8px' }}
            placeholder="Chọn ngày và giờ hết hạn"
          />
        </Form.Item>

        {/* Ghi chú thêm */}
        <Form.Item
          name="description"
          label={<strong>Ghi chú / Yêu cầu chi tiết (tuỳ chọn)</strong>}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Ghi chú yêu cầu nộp bài, link repo GitHub, định dạng file nộp..."
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
