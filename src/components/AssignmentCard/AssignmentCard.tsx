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
import { SUBJECT_METAS, PRIORITY_METAS } from '../../types/assignment.types';
import { useDeadlineCountdown } from '../../hooks/useDeadlineCountdown';
import { withUrgentHighlight } from '../../hoc/withUrgentHighlight';
import { AssignmentCardProps } from './AssignmentCard.types';
import './AssignmentCard.css';

const { Text, Paragraph } = Typography;

const BaseAssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onToggleStatus,
  onDelete,
  onSelect,
}) => {
  const { id, title, subject, dueDate, priority, completed, description } = assignment;
  
  // Custom Hook tính countdown theo yêu cầu 6
  const countdown = useDeadlineCountdown(dueDate, completed);

  const subjectMeta = SUBJECT_METAS[subject] || SUBJECT_METAS.OTHER;
  const priorityMeta = PRIORITY_METAS[priority];

  return (
    <Card
      className={`assignment-card ${completed ? 'assignment-card--completed' : ''}`}
      hoverable
      onClick={() => onSelect?.(id)}
      styles={{ body: { padding: '18px 22px' } }}
    >
      <div className="assignment-card__body">
        {/* Khối bên trái: Nút Checkmark + Chi tiết */}
        <div className="assignment-card__content-row">
          <Tooltip title={completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(id);
              }}
              className={`assignment-card__check-btn ${completed ? 'assignment-card__check-btn--checked' : ''}`}
              aria-label={completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
            >
              {completed && <CheckOutlined style={{ fontSize: '12px' }} />}
            </button>
          </Tooltip>

          {/* Chi tiết nội dung bài tập */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Nhãn Tags Pastel */}
            <div className="assignment-card__meta-row">
              <span 
                className="assignment-card__tag"
                style={{ 
                  background: subjectMeta.bg, 
                  color: subjectMeta.textColor, 
                  border: `1px solid ${subjectMeta.borderColor}` 
                }}
              >
                {subjectMeta.name} ({subjectMeta.code})
              </span>

              <span 
                className="assignment-card__tag"
                style={{ 
                  background: priorityMeta.bg, 
                  color: priorityMeta.textColor, 
                  border: `1px solid ${priorityMeta.borderColor}` 
                }}
              >
                Ưu tiên {priorityMeta.label}
              </span>

              {/* Tag Countdown (Yêu cầu 6: Còn X ngày / Quá hạn Y ngày) */}
              <span 
                className="assignment-card__tag"
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: countdown.bg, 
                  color: countdown.textColor, 
                  border: `1px solid ${countdown.borderColor}` 
                }}
              >
                {countdown.status === 'urgent' && <span className="pulse-indicator" />}
                {countdown.status === 'overdue' && <AlertOutlined style={{ fontSize: '11px' }} />}
                {countdown.status === 'upcoming' && <ClockCircleOutlined style={{ fontSize: '11px' }} />}
                {countdown.status === 'completed' && <CheckOutlined style={{ fontSize: '11px' }} />}
                <span>{countdown.text}</span>
              </span>
            </div>

            {/* Tên bài tập */}
            <Text
              className={`assignment-card__title ${completed ? 'assignment-card__title--completed' : ''}`}
              style={{ display: 'block' }}
            >
              {title}
            </Text>

            {/* Mô tả phụ nếu có */}
            {description && (
              <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: 'Xem thêm' }}
                className={`assignment-card__desc ${completed ? 'assignment-card__desc--completed' : ''}`}
              >
                {description}
              </Paragraph>
            )}

            {/* Hạn nộp */}
            <div className="assignment-card__deadline">
              <CalendarOutlined style={{ color: '#94a3b8' }} />
              <span>Hạn nộp: <strong style={{ color: completed ? '#94a3b8' : '#1e293b' }}>{countdown.formattedDueDate}</strong></span>
            </div>
          </div>
        </div>

        {/* Khối bên phải: Nút thao tác nhanh */}
        <div 
          className="assignment-card__actions"
          onClick={(e) => e.stopPropagation()}
        >
          {completed && (
            <Tooltip title="Chuyển về chưa hoàn thành">
              <Button
                type="text"
                size="small"
                icon={<UndoOutlined style={{ color: '#64748b' }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus(id);
                }}
              />
            </Tooltip>
          )}

          {/* Nút xoá kèm Popconfirm (Yêu cầu 4) */}
          <Popconfirm
            title="Xoá bài tập này?"
            description="Bạn có chắc muốn xoá bài tập này khỏi danh sách?"
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
