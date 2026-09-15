import React from 'react';
import { Button, Popconfirm, Tooltip } from 'antd';
import { UndoOutlined, DeleteOutlined } from '@ant-design/icons';

export interface AssignmentCardActionsProps {
  id: string;
  completed: boolean;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AssignmentCardActions: React.FC<AssignmentCardActionsProps> = ({
  id,
  completed,
  onToggleStatus,
  onDelete,
}) => {
  return (
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
  );
};
