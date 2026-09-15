import React from 'react';
import { 
  Assignment, 
  isCompletedAssignment, 
  isOverdueAssignment, 
  isUrgentAssignment 
} from '../../types/assignment.types';
import { KanbanBoardProps, KanbanColumnConfig } from './KanbanBoard.types';
import { KanbanColumn } from './KanbanColumn';
import './KanbanBoard.css';

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  assignments,
  onToggleStatus,
  onDelete,
  onSelectAssignment,
}) => {
  const now = new Date();

  // Phân loại bài tập vào 3 cột sử dụng Type Guards (Buổi 1 TypeScript Nâng Cao)
  const pendingItems = assignments.filter(
    (item) => !isCompletedAssignment(item) && !isOverdueAssignment(item, now) && !isUrgentAssignment(item)
  );

  const urgentAndOverdueItems = assignments.filter(
    (item) => !isCompletedAssignment(item) && (isOverdueAssignment(item, now) || isUrgentAssignment(item))
  );

  const completedItems = assignments.filter((item) => isCompletedAssignment(item));

  const columns: { config: KanbanColumnConfig; items: Assignment[] }[] = [
    {
      config: {
        key: 'pending',
        title: 'Đang Chờ Xử Lý',
        badgeBg: '#eff6ff',
        badgeColor: '#1d4ed8',
        borderColor: '#bfdbfe',
      },
      items: pendingItems,
    },
    {
      config: {
        key: 'urgent',
        title: 'Khẩn Cấp & Quá Hạn',
        badgeBg: '#fef2f2',
        badgeColor: '#b91c1c',
        borderColor: '#fca5a5',
      },
      items: urgentAndOverdueItems,
    },
    {
      config: {
        key: 'completed',
        title: 'Đã Hoàn Thành',
        badgeBg: '#f0fdf4',
        badgeColor: '#15803d',
        borderColor: '#bbf7d0',
      },
      items: completedItems,
    },
  ];

  return (
    <div className="kanban-board">
      <div className="kanban-board__grid">
        {columns.map(({ config, items }) => (
          <KanbanColumn
            key={config.key}
            config={config}
            items={items}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            onSelectAssignment={onSelectAssignment}
          />
        ))}
      </div>
    </div>
  );
};
