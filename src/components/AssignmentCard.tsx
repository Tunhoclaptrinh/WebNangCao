import React from 'react';
import { Card, Tag, Typography, Button, Popconfirm, Tooltip } from 'antd';
import { 
  CheckOutlined, 
  UndoOutlined, 
  DeleteOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined 
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
  
  // Áp dụng Custom Hook theo yêu cầu 6
  const countdown = useDeadlineCountdown(dueDate, completed);

  const subjectMeta = SUBJECT_METAS[subject] || SUBJECT_METAS.OTHER;
  const priorityMeta = PRIORITY_METAS[priority];

  return (
    <Card
      hoverable
      style={{
        borderRadius: '10px',
        border: '1px solid #f0f0f0',
        background: completed ? '#fafafa' : '#ffffff',
        opacity: completed ? 0.8 : 1,
        transition: 'all 0.25s ease',
      }}
      styles={{
        body: { padding: '18px 20px' }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        {/* Khối bên trái: Checkbox + Nội dung */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
          {/* Nút đánh dấu hoàn thành (Yêu cầu 3) */}
          <Tooltip title={completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}>
            <Button
              type={completed ? 'primary' : 'default'}
              shape="circle"
              size="middle"
              style={{
                background: completed ? '#52c41a' : '#ffffff',
                borderColor: completed ? '#52c41a' : '#d9d9d9',
                color: completed ? '#ffffff' : '#bfbfbf',
                flexShrink: 0,
                marginTop: '2px',
              }}
              icon={completed ? <CheckOutlined /> : <CheckOutlined />}
              onClick={() => onToggleStatus(id)}
            />
          </Tooltip>

          {/* Chi tiết bài tập */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
              {/* Tag môn học */}
              <Tag color={subjectMeta.color} style={{ margin: 0, fontWeight: 500, borderRadius: '4px' }}>
                {subjectMeta.iconText} {subjectMeta.code}
              </Tag>

              {/* Tag mức ưu tiên */}
              <Tag 
                style={{ 
                  margin: 0, 
                  color: priorityMeta.color, 
                  borderColor: `${priorityMeta.color}40`,
                  background: `${priorityMeta.color}10`,
                  fontWeight: 600,
                  borderRadius: '4px',
                }}
              >
                Ưu tiên {priorityMeta.label}
              </Tag>

              {/* Tag hiển thị hạn nộp (Yêu cầu 6: Còn X ngày / Quá hạn Y ngày) */}
              <Tag 
                color={countdown.color} 
                icon={<ClockCircleOutlined />} 
                style={{ margin: 0, fontWeight: 600, borderRadius: '4px' }}
              >
                {countdown.text}
              </Tag>
            </div>

            {/* Tên bài tập */}
            <Text
              strong
              style={{
                fontSize: '16px',
                color: completed ? '#8c8c8c' : '#262626',
                textDecoration: completed ? 'line-through' : 'none',
                display: 'block',
                lineHeight: 1.4,
                marginBottom: description ? '4px' : '8px',
              }}
            >
              {title}
            </Text>

            {/* Mô tả phụ nếu có */}
            {description && (
              <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: 'Xem thêm' }}
                style={{
                  color: completed ? '#bfbfbf' : '#595959',
                  fontSize: '13px',
                  marginBottom: '8px',
                  lineHeight: 1.5,
                }}
              >
                {description}
              </Paragraph>
            )}

            {/* Thời gian deadline cụ thể */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8c8c8c', fontSize: '12px' }}>
              <CalendarOutlined />
              <span>Hạn nộp: <strong>{countdown.formattedDueDate}</strong></span>
            </div>
          </div>
        </div>

        {/* Khối bên phải: Hành động (Xoá bài tập - Yêu cầu 4) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {completed && (
            <Tooltip title="Chuyển về chưa hoàn thành">
              <Button
                type="text"
                size="small"
                icon={<UndoOutlined />}
                onClick={() => onToggleStatus(id)}
              />
            </Tooltip>
          )}

          <Popconfirm
            title="Xoá bài tập này?"
            description="Bạn có chắc chắn muốn xoá bài tập này khỏi danh sách?"
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(id)}
          >
            <Tooltip title="Xoá bài tập">
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
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
