import React from 'react';
import { Card, Button, Tooltip, Popconfirm } from 'antd';
import { 
  CheckOutlined, 
  DeleteOutlined, 
  ClockCircleOutlined, 
  AlertOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { SUBJECT_METAS, PRIORITY_METAS } from '../../types/assignment.types';
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

  return (
    <Card
      hoverable
      onClick={onClick}
      className={`kanban-card ${completed ? 'kanban-card--completed' : ''}`}
      styles={{ body: { padding: '14px 16px' } }}
    >
      {/* Header Tag Row */}
      <div className="kanban-card__tag-row">
        <span 
          style={{ 
            padding: '2px 7px', 
            borderRadius: '4px', 
            background: subjectMeta.bg, 
            color: subjectMeta.textColor, 
            fontSize: '10px',
            fontWeight: 700,
            border: `1px solid ${subjectMeta.borderColor}`
          }}
        >
          {subjectMeta.code}
        </span>

        <span 
          style={{ 
            padding: '2px 7px', 
            borderRadius: '4px', 
            background: priorityMeta.bg, 
            color: priorityMeta.textColor, 
            fontSize: '10px',
            fontWeight: 700,
            border: `1px solid ${priorityMeta.borderColor}`
          }}
        >
          {priorityMeta.label}
        </span>
      </div>

      {/* Tên bài tập */}
      <div 
        className={`kanban-card__title ${completed ? 'kanban-card__title--completed' : ''}`}
      >
        {title}
      </div>

      {/* Tag Countdown */}
      <div style={{ marginBottom: '8px' }}>
        <span 
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px', 
            borderRadius: '4px', 
            background: countdown.bg, 
            color: countdown.textColor, 
            fontSize: '10px',
            fontWeight: 700,
            border: `1px solid ${countdown.borderColor}`
          }}
        >
          {countdown.status === 'urgent' && <span className="pulse-indicator" />}
          {countdown.status === 'overdue' && <AlertOutlined style={{ fontSize: '10px' }} />}
          {countdown.status === 'upcoming' && <ClockCircleOutlined style={{ fontSize: '10px' }} />}
          {countdown.status === 'completed' && <CheckOutlined style={{ fontSize: '10px' }} />}
          <span>{countdown.text}</span>
        </span>
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
