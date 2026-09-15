import React from 'react';
import { Card, Typography, Tooltip } from 'antd';
import { CheckOutlined, CalendarOutlined } from '@ant-design/icons';
import { useDeadlineCountdown } from '../../hooks/useDeadlineCountdown';
import { withUrgentHighlight } from '../../hoc/withUrgentHighlight';
import { AssignmentCardProps } from './AssignmentCard.types';
import { AssignmentCardTags } from './AssignmentCardTags';
import { AssignmentCardActions } from './AssignmentCardActions';
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
            <AssignmentCardTags
              subject={subject}
              priority={priority}
              countdown={countdown}
            />

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
        <AssignmentCardActions
          id={id}
          completed={completed}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      </div>
    </Card>
  );
};

// Áp dụng HOC withUrgentHighlight (Buổi 2 React Design Patterns)
export const AssignmentCard = withUrgentHighlight(BaseAssignmentCard);
