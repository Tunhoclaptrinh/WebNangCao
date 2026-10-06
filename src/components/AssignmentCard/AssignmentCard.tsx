import React from 'react';
import { Card, Typography, Tooltip, Tag } from 'antd';
import { CheckOutlined, CalendarOutlined, PushpinFilled } from '@ant-design/icons';
import { useDeadlineCountdown } from '../../hooks/useDeadlineCountdown';
import { withUrgentHighlight } from '../../hoc/withUrgentHighlight';
import { AssignmentCardProps } from './AssignmentCard.types';
import { AssignmentCardTags } from './AssignmentCardTags';
import { AssignmentCardActions } from './AssignmentCardActions';
import './AssignmentCard.css';

const { Text, Paragraph } = Typography;

/**
 * BaseAssignmentCard: Thành phần hiển thị thẻ bài tập
 * Được tối ưu hóa bằng React.memo để ngăn re-render không cần thiết khi danh sách cập nhật
 */
const BaseAssignmentCard: React.FC<AssignmentCardProps> = React.memo(({
  assignment,
  isPinned = false,
  onToggleStatus,
  onDelete,
  onSelect,
  onTogglePin,
}) => {
  const { id, title, subject, dueDate, priority, completed, description } = assignment;
  
  // Custom Hook tính countdown theo yêu cầu
  const countdown = useDeadlineCountdown(dueDate, completed);

  return (
    <Card
      className={`assignment-card ${completed ? 'assignment-card--completed' : ''} ${isPinned ? 'assignment-card--pinned' : ''}`}
      hoverable
      onClick={() => onSelect?.(id)}
      styles={{ body: { padding: '16px 20px' } }}
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
            {/* Nhãn Tags & Pinned Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {isPinned && (
                <Tag
                  color="blue"
                  icon={<PushpinFilled />}
                  style={{
                    borderRadius: '4px',
                    marginRight: 0,
                    fontWeight: 500,
                    fontSize: '11px',
                    padding: '0 6px',
                  }}
                >
                  Đã ghim
                </Tag>
              )}
              <AssignmentCardTags
                subject={subject}
                priority={priority}
                countdown={countdown}
              />
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
              <span>Hạn nộp: <strong style={{ color: completed ? '#94a3b8' : 'inherit' }}>{countdown.formattedDueDate}</strong></span>
            </div>
          </div>
        </div>

        {/* Khối bên phải: Nút thao tác nhanh */}
        <AssignmentCardActions
          id={id}
          completed={completed}
          isPinned={isPinned}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
        />
      </div>
    </Card>
  );
});

BaseAssignmentCard.displayName = 'BaseAssignmentCard';

// Áp dụng HOC withUrgentHighlight
export const AssignmentCard = withUrgentHighlight(BaseAssignmentCard);
