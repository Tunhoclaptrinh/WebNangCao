import React from 'react';
import { Card, Button, Tooltip, Popconfirm } from 'antd';
import { 
  CheckOutlined, 
  DeleteOutlined, 
  ClockCircleOutlined, 
  AlertOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { SUBJECT_METAS, PRIORITY_METAS, isOverdueAssignment, isUrgentAssignment } from '../../types/assignment.types';
import { useDeadlineCountdown } from '../../hooks/useDeadlineCountdown';
import { KanbanCardProps } from './KanbanBoard.types';

export const KanbanCard: React.FC<KanbanCardProps> = ({
  assignment,
  onToggleStatus,
  onDelete,
  onClick,
}) => {
  const { id, title, subject, dueDate, priority, completed } = assignment;
  const countdown = useDeadlineCountdown(dueDate, completed);
  const subjectMeta = SUBJECT_METAS[subject] || SUBJECT_METAS.OTHER;
  const priorityMeta = PRIORITY_METAS[priority];

  const isOverdue = !completed && isOverdueAssignment(assignment);
  const isUrgent = !completed && isUrgentAssignment(assignment, 24);

  const statusModifier = completed 
    ? 'kanban-card--completed' 
    : isOverdue 
      ? 'kanban-card--overdue' 
      : isUrgent 
        ? 'kanban-card--urgent' 
        : '';

  return (
    <Card
      hoverable
      onClick={onClick}
      className={`kanban-card ${statusModifier}`}
      styles={{ body: { padding: '12px 14px' } }}
    >
      {/* Header Metadata dạng link nhẹ nhàng, đồng bộ giao diện */}
      <div className="kanban-card__tag-row">
        <span className="kanban-card__subject-link">
          <span 
            className="kanban-card__dot" 
            style={{ background: subjectMeta.textColor }} 
          />
          <strong>{subjectMeta.code}</strong>
        </span>

        <span style={{ fontSize: '10px', color: '#94a3b8' }}>•</span>

        <span style={{ fontSize: '11px', color: priorityMeta.textColor, fontWeight: 600 }}>
          {priorityMeta.label}
        </span>

        <span style={{ fontSize: '10px', color: '#94a3b8' }}>•</span>

        <span 
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            padding: '1px 6px', 
            borderRadius: '4px', 
            background: countdown.bg, 
            color: countdown.textColor, 
            fontSize: '10px',
            fontWeight: 700,
            border: `1px solid ${countdown.borderColor}`
          }}
        >
          {countdown.status === 'urgent' && <span className="pulse-indicator" />}
          {countdown.status === 'overdue' && <AlertOutlined style={{ fontSize: '9px' }} />}
          {countdown.status === 'upcoming' && <ClockCircleOutlined style={{ fontSize: '9px' }} />}
          {countdown.status === 'completed' && <CheckOutlined style={{ fontSize: '9px' }} />}
          <span>{countdown.text}</span>
        </span>
      </div>

      {/* Tên bài tập */}
      <div 
        className={`kanban-card__title ${completed ? 'kanban-card__title--completed' : ''}`}
      >
        {title}
      </div>

      {/* Card Footer */}
      <div className="kanban-card__footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CalendarOutlined style={{ color: '#94a3b8' }} />
          <span>{countdown.formattedDueDate.split(' ')[0]}</span>
        </div>

        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút toggle hoàn thành */}
          <Tooltip title={completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}>
            <button
              type="button"
              onClick={() => onToggleStatus(id)}
              className={`kanban-card__check-btn ${completed ? 'kanban-card__check-btn--checked' : ''}`}
            >
              {completed && <CheckOutlined style={{ fontSize: '10px' }} />}
            </button>
          </Tooltip>

          {/* Nút xoá */}
          <Popconfirm
            title="Xoá bài tập này?"
            description="Bạn có chắc chắn?"
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true, size: 'small' }}
            cancelButtonProps={{ size: 'small' }}
            onConfirm={() => onDelete(id)}
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined style={{ fontSize: '12px' }} />}
            />
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
};
