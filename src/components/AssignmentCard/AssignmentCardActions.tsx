import React from 'react';
import { Button, Popconfirm, Tooltip } from 'antd';
import { UndoOutlined, DeleteOutlined, PushpinOutlined, PushpinFilled } from '@ant-design/icons';

export interface AssignmentCardActionsProps {
  id: string;
  completed: boolean;
  isPinned?: boolean;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

export const AssignmentCardActions: React.FC<AssignmentCardActionsProps> = ({
  id,
  completed,
  isPinned = false,
  onToggleStatus,
  onDelete,
  onTogglePin,
}) => {
  return (
    <div 
      className="assignment-card__actions"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Nút Ghim bài tập quan trọng (Zustand Pin Store) */}
      {onTogglePin && (
        <Tooltip title={isPinned ? 'Bỏ ghim bài tập' : 'Ghim bài tập lên đầu'}>
          <Button
            type="text"
            size="small"
            aria-label={isPinned ? 'Bỏ ghim' : 'Ghim'}
            icon={
              isPinned ? (
                <PushpinFilled style={{ color: '#2563eb', fontSize: '15px' }} />
              ) : (
                <PushpinOutlined style={{ color: '#94a3b8', fontSize: '15px' }} />
              )
            }
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(id);
            }}
          />
        </Tooltip>
      )}

      {completed && (
        <Tooltip title="Chuyển về chưa hoàn thành">
          <Button
            type="text"
            size="small"
            aria-label="Chuyển về chưa hoàn thành"
            icon={<UndoOutlined style={{ color: '#64748b' }} />}
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(id);
            }}
          />
        </Tooltip>
      )}

      {/* Nút xoá kèm Popconfirm */}
      <Popconfirm
        title="Xoá bài tập này?"
        description="Bạn có chắc muốn xoá bài tập này khỏi danh sách?"
        okText="Xoá"
        cancelText="Huỷ"
        okButtonProps={{ danger: true, style: { borderRadius: '4px' } }}
        cancelButtonProps={{ style: { borderRadius: '4px' } }}
        onConfirm={() => onDelete(id)}
      >
        <Tooltip title="Xoá bài tập">
          <Button
            type="text"
            danger
            size="small"
            aria-label="Xóa bài tập"
            icon={<DeleteOutlined style={{ fontSize: '14px' }} />}
          />
        </Tooltip>
      </Popconfirm>
    </div>
  );
};
