import React, { useMemo, ReactElement } from 'react';
import { List } from 'react-window';
import { Typography, Tag } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { Assignment } from '../../types/assignment.types';
import { AssignmentCard } from '../AssignmentCard';

const { Text } = Typography;

export interface VirtualizedAssignmentListProps {
  assignments: Assignment[];
  pinnedIds: string[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  height?: number;
  itemHeight?: number;
}

interface CustomRowData {
  assignments: Assignment[];
  isPinnedSet: Set<string>;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

type RowComponentProps = {
  index: number;
  style: React.CSSProperties;
  ariaAttributes: {
    'aria-posinset': number;
    'aria-setsize': number;
    role: 'listitem';
  };
} & CustomRowData;

function AssignmentRow({
  index,
  style,
  assignments,
  isPinnedSet,
  onToggleStatus,
  onDelete,
  onSelect,
  onTogglePin,
}: RowComponentProps): ReactElement | null {
  const item = assignments[index];
  if (!item) return null;

  return (
    <div style={{ ...style, paddingBottom: '12px', boxSizing: 'border-box' }}>
      <AssignmentCard
        assignment={item}
        isPinned={isPinnedSet?.has(item.id)}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        onSelect={onSelect}
        onTogglePin={onTogglePin}
      />
    </div>
  );
}

export const VirtualizedAssignmentList: React.FC<VirtualizedAssignmentListProps> = ({
  assignments,
  pinnedIds,
  onToggleStatus,
  onDelete,
  onSelect,
  onTogglePin,
  height = 650,
  itemHeight = 135,
}) => {
  const isPinnedSet = useMemo(() => new Set(pinnedIds), [pinnedIds]);

  const rowProps = useMemo<CustomRowData>(() => ({
    assignments,
    isPinnedSet,
    onToggleStatus,
    onDelete,
    onSelect,
    onTogglePin,
  }), [assignments, isPinnedSet, onToggleStatus, onDelete, onSelect, onTogglePin]);

  return (
    <div className="virtualized-assignment-list" style={{ width: '100%' }}>
      {/* Benchmark Info Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        marginBottom: '12px',
        background: 'rgba(37, 99, 235, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: '4px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tag color="blue" icon={<ThunderboltOutlined />} style={{ borderRadius: '4px', margin: 0 }}>
            react-window Virtualized
          </Tag>
          <Text strong style={{ fontSize: '13px' }}>
            Hiệu năng cao: Render ảo hoá danh sách {assignments.length.toLocaleString()} bài tập
          </Text>
        </div>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          DOM nodes trong bộ nhớ: <strong>~{Math.ceil(height / itemHeight) + 2} thẻ</strong> (thay vì {assignments.length.toLocaleString()})
        </Text>
      </div>

      <List<CustomRowData>
        rowCount={assignments.length}
        rowHeight={itemHeight}
        rowComponent={AssignmentRow as any}
        rowProps={rowProps}
        style={{ height, overflowY: 'auto' }}
      />
    </div>
  );
};

export default VirtualizedAssignmentList;
