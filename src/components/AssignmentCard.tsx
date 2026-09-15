import React from 'react';
import { Card, Typography, Button, Popconfirm, Tooltip } from 'antd';
import { 
  CheckOutlined, 
  UndoOutlined, 
  DeleteOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined,
  AlertOutlined
} from '@ant-design/icons';
import { Assignment, SUBJECT_METAS, PRIORITY_METAS } from '../types/assignment.types';
import { useDeadlineCountdown } from '../hooks/useDeadlineCountdown';
import { withUrgentHighlight } from '../hoc/withUrgentHighlight';

const { Text, Paragraph } = Typography;

export interface AssignmentCardProps {
  assignment: Assignment;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const BaseAssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onToggleStatus,
  onDelete,
}) => {
  const { id, title, subject, dueDate, priority, completed, description } = assignment;
  
  // Custom Hook tính countdown theo yêu cầu 6
  const countdown = useDeadlineCountdown(dueDate, completed);

  const subjectMeta = SUBJECT_METAS[subject] || SUBJECT_METAS.OTHER;
  const priorityMeta = PRIORITY_METAS[priority];

  return (
    <Card
      className="assignment-card-wrapper"
      hoverable
      style={{
        borderRadius: '14px',
        border: completed ? '1px solid #f1f5f9' : '1px solid #e2e8f0',
        background: completed ? '#fafafa' : '#ffffff',
        opacity: completed ? 0.8 : 1,
      }}
      styles={{
        body: { padding: '18px 22px' }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        {/* Khối bên trái: Checkbox + Chi tiết */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
          {/* Nút checkmark hoàn thành (Yêu cầu 3) */}
          <Tooltip title={completed ? 'Chuyển về chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}>
            <button
              type="button"
              onClick={() => onToggleStatus(id)}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                border: completed ? '1px solid #16a34a' : '2px solid #cbd5e1',
                background: completed ? '#16a34a' : '#ffffff',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                marginTop: '3px',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                outline: 'none',
                boxShadow: completed ? '0 2px 6px rgba(22, 163, 74, 0.3)' : 'none',
              }}
              aria-label={completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
            >
              {completed && <CheckOutlined style={{ fontSize: '13px' }} />}
            </button>
          </Tooltip>

          {/* Chi tiết bài tập */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Hàng nhãn Tags Pastel */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {/* Tag môn học */}
              <span 
                style={{ 
                  padding: '2px 8px', 
                  borderRadius: '6px', 
                  background: subjectMeta.bg, 
                  color: subjectMeta.textColor, 
                  border: `1px solid ${subjectMeta.borderColor}`,
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}
              >
                {subjectMeta.name} ({subjectMeta.code})
              </span>

              {/* Tag mức ưu tiên */}
              <span 
                style={{ 
                  padding: '2px 8px', 
                  borderRadius: '6px', 
                  background: priorityMeta.bg, 
                  color: priorityMeta.textColor, 
                  border: `1px solid ${priorityMeta.borderColor}`,
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                Ưu tiên {priorityMeta.label}
              </span>

              {/* Tag Countdown (Yêu cầu 6: Còn X ngày / Quá hạn Y ngày) */}
              <span 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '2px 9px', 
                  borderRadius: '6px', 
                  background: countdown.bg, 
                  color: countdown.textColor, 
                  border: `1px solid ${countdown.borderColor}`,
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {countdown.status === 'urgent' && <span className="pulse-indicator" />}
                {countdown.status === 'overdue' && <AlertOutlined style={{ fontSize: '12px' }} />}
                {countdown.status === 'upcoming' && <ClockCircleOutlined style={{ fontSize: '12px' }} />}
                {countdown.status === 'completed' && <CheckOutlined style={{ fontSize: '12px' }} />}
                <span>{countdown.text}</span>
              </span>
            </div>

            {/* Tên bài tập */}
            <Text
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: completed ? '#94a3b8' : '#0f172a',
                textDecoration: completed ? 'line-through' : 'none',
                display: 'block',
                lineHeight: 1.4,
                letterSpacing: '-0.015em',
                marginBottom: description ? '6px' : '8px',
                transition: 'all 0.2s ease',
              }}
            >
              {title}
            </Text>

            {/* Mô tả phụ nếu có */}
            {description && (
              <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: 'Xem thêm' }}
                style={{
                  color: completed ? '#94a3b8' : '#475569',
                  fontSize: '13px',
                  marginBottom: '10px',
                  lineHeight: 1.6,
                }}
              >
                {description}
              </Paragraph>
            )}

            {/* Thông tin deadline chi tiết */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px' }}>
              <CalendarOutlined style={{ color: '#94a3b8' }} />
              <span>Hạn nộp: <strong style={{ color: completed ? '#94a3b8' : '#1e293b' }}>{countdown.formattedDueDate}</strong></span>
            </div>
          </div>
        </div>

        {/* Khối bên phải: Nút hành động */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {completed && (
            <Tooltip title="Chuyển về chưa hoàn thành">
              <Button
                type="text"
                size="small"
                icon={<UndoOutlined style={{ color: '#64748b' }} />}
                onClick={() => onToggleStatus(id)}
              />
            </Tooltip>
          )}

          {/* Xoá bài tập (Yêu cầu 4) */}
          <Popconfirm
            title="Xoá bài tập này?"
            description="Bạn có chắc chắn muốn xoá bài tập này khỏi danh sách?"
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true, style: { borderRadius: '6px' } }}
            cancelButtonProps={{ style: { borderRadius: '6px' } }}
            onConfirm={() => onDelete(id)}
          >
            <Tooltip title="Xoá bài tập">
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined style={{ fontSize: '14px' }} />}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
};

// Áp dụng HOC withUrgentHighlight (Buổi 2 React Design Patterns)
export const AssignmentCard = withUrgentHighlight(BaseAssignmentCard);
