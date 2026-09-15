import React from 'react';
import { Drawer, Button, Popconfirm, Descriptions, Typography, Divider } from 'antd';
import { 
  CheckOutlined, 
  DeleteOutlined, 
  ClockCircleOutlined, 
  AlertOutlined
} from '@ant-design/icons';
import { SUBJECT_METAS, PRIORITY_METAS } from '../../types/assignment.types';
import { useDeadlineCountdown } from '../../hooks/useDeadlineCountdown';
import { AssignmentDetailDrawerProps } from './AssignmentDetailDrawer.types';
import './AssignmentDetailDrawer.css';

const { Title } = Typography;

export const AssignmentDetailDrawer: React.FC<AssignmentDetailDrawerProps> = ({
  assignment,
  open,
  onClose,
  onToggleStatus,
  onDelete,
}) => {
  if (!assignment) return null;

  const { id, title, subject, dueDate, priority, completed, description, createdAt, completedAt } = assignment;
  const countdown = useDeadlineCountdown(dueDate, completed);
  const subjectMeta = SUBJECT_METAS[subject] || SUBJECT_METAS.OTHER;
  const priorityMeta = PRIORITY_METAS[priority];

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span className="detail-drawer__header-title">
            Chi Tiết Deadline Bài Tập
          </span>
        </div>
      }
      open={open}
      onClose={onClose}
      width={480}
      styles={{
        body: { padding: '24px' }
      }}
      footer={
        <div className="detail-drawer__footer">
          <Popconfirm
            title="Xoá bài tập này?"
            description="Thao tác này không thể hoàn tác."
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
            onConfirm={() => {
              onDelete(id);
              onClose();
            }}
          >
            <Button danger icon={<DeleteOutlined />} style={{ borderRadius: '8px' }}>
              Xoá bài tập
            </Button>
          </Popconfirm>

          <Button
            type={completed ? 'default' : 'primary'}
            icon={<CheckOutlined />}
            onClick={() => onToggleStatus(id)}
            style={{ 
              borderRadius: '8px', 
              fontWeight: 600,
              background: completed ? undefined : '#16a34a',
              borderColor: completed ? undefined : '#16a34a',
            }}
          >
            {completed ? 'Chuyển về chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
          </Button>
        </div>
      }
    >
      {/* Thanh trạng thái hạn nộp */}
      <div 
        className="detail-drawer__status-bar"
        style={{
          background: countdown.bg,
          borderColor: countdown.borderColor,
          color: countdown.textColor,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13px' }}>
          {countdown.status === 'urgent' && <span className="pulse-indicator" />}
          {countdown.status === 'overdue' && <AlertOutlined />}
          {countdown.status === 'upcoming' && <ClockCircleOutlined />}
          {countdown.status === 'completed' && <CheckOutlined />}
          <span>{countdown.text}</span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 600 }}>
          {countdown.formattedDueDate}
        </span>
      </div>

      {/* Tên bài tập */}
      <Title level={4} className="detail-drawer__title">
        {title}
      </Title>

      {/* Bảng thông tin chi tiết */}
      <Descriptions 
        column={1} 
        size="small" 
        bordered
        style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}
      >
        <Descriptions.Item label="Môn học">
          <span 
            style={{ 
              display: 'inline-flex',
              padding: '2px 8px', 
              borderRadius: '6px', 
              background: subjectMeta.bg, 
              color: subjectMeta.textColor, 
              fontWeight: 700,
              fontSize: '12px'
            }}
          >
            {subjectMeta.name} ({subjectMeta.code})
          </span>
        </Descriptions.Item>

        <Descriptions.Item label="Mức độ ưu tiên">
          <span 
            style={{ 
              display: 'inline-flex',
              padding: '2px 8px', 
              borderRadius: '6px', 
              background: priorityMeta.bg, 
              color: priorityMeta.textColor, 
              fontWeight: 700,
              fontSize: '12px'
            }}
          >
            Ưu tiên {priorityMeta.label}
          </span>
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          <span style={{ fontWeight: 700, color: completed ? '#16a34a' : '#2563eb' }}>
            {completed ? 'Đã hoàn thành' : 'Đang chờ nộp'}
          </span>
        </Descriptions.Item>

        <Descriptions.Item label="Thời hạn nộp">
          <strong>{countdown.formattedDueDate}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          <span style={{ color: '#64748b' }}>
            {new Date(createdAt).toLocaleString('vi-VN')}
          </span>
        </Descriptions.Item>

        {completedAt && (
          <Descriptions.Item label="Ngày hoàn thành">
            <span style={{ color: '#16a34a', fontWeight: 600 }}>
              {new Date(completedAt).toLocaleString('vi-VN')}
            </span>
          </Descriptions.Item>
        )}
      </Descriptions>

      {/* Mô tả chi tiết nếu có */}
      <Divider style={{ margin: '16px 0' }} />
      <div style={{ marginBottom: '8px', fontWeight: 700, fontSize: '13px', color: '#475569' }}>
        Nội dung &amp; Hướng dẫn thực hiện:
      </div>
      {description ? (
        <div className="detail-drawer__desc-box">
          {description}
        </div>
      ) : (
        <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>
          Không có ghi chú thêm cho bài tập này.
        </div>
      )}
    </Drawer>
  );
};
