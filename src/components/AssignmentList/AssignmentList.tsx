import React, { useMemo } from 'react';
import { Space, Skeleton, Button, Typography, Result } from 'antd';
import { PlusOutlined, InboxOutlined, PushpinFilled, ReloadOutlined } from '@ant-design/icons';
import { AssignmentCard } from '../AssignmentCard';
import { VirtualizedAssignmentList } from '../VirtualizedAssignmentList';
import { AssignmentListProps } from './AssignmentList.types';
import type { Assignment } from '../../types/assignment.types';
import './AssignmentList.css';

const { Text } = Typography;

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  totalCount,
  loading,
  error,
  pinnedIds = [],
  onToggleStatus,
  onDelete,
  onOpenCreateModal,
  onSelectAssignment,
  onTogglePin,
  onRetry,
}) => {
  // Sắp xếp bài tập đã ghim lên đầu danh sách theo yêu cầu Phần A (Zustand Pin Store)
  const sortedAssignments = useMemo(() => {
    const pinSet = new Set(pinnedIds);
    const pinned: Assignment[] = [];
    const unpinned: Assignment[] = [];

    for (const item of assignments) {
      if (pinSet.has(item.id)) {
        pinned.push(item);
      } else {
        unpinned.push(item);
      }
    }

    return [...pinned, ...unpinned];
  }, [assignments, pinnedIds]);

  const pinnedCount = useMemo(() => {
    const pinSet = new Set(pinnedIds);
    return assignments.filter((a) => pinSet.has(a.id)).length;
  }, [assignments, pinnedIds]);

  // Trạng thái gặp lỗi khi tải dữ liệu
  if (error && assignments.length === 0) {
    return (
      <div style={{ background: '#ffffff', padding: '32px', borderRadius: '4px', border: '1px solid #fee2e2', marginTop: '16px' }}>
        <Result
          status="error"
          title="Không thể tải danh sách bài tập"
          subTitle={error}
          extra={
            onRetry && (
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={onRetry}
                style={{ background: '#2563eb', borderRadius: '4px' }}
              >
                Thử lại
              </Button>
            )
          }
        />
      </div>
    );
  }

  // Trạng thái đang tải dữ liệu ban đầu
  if (loading && assignments.length === 0) {
    return (
      <Space direction="vertical" size={14} style={{ width: '100%', marginTop: '16px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ background: '#ffffff', padding: '20px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            <Skeleton active avatar paragraph={{ rows: 2 }} />
          </div>
        ))}
      </Space>
    );
  }

  // Trạng thái rỗng không có bài tập
  if (assignments.length === 0) {
    return (
      <div className="assignment-list__empty">
        <div className="assignment-list__empty-icon">
          <InboxOutlined />
        </div>
        <div className="assignment-list__empty-title">
          {totalCount === 0 ? 'Chưa có deadline nào' : 'Không có bài tập phù hợp'}
        </div>
        <div className="assignment-list__empty-desc">
          {totalCount === 0 
            ? 'Bắt đầu theo dõi deadline bài tập của bạn bằng cách tạo bài tập đầu tiên ngay bây giờ.' 
            : 'Hãy thử chọn bộ lọc trạng thái khác hoặc xoá từ khoá tìm kiếm.'}
        </div>
        {totalCount === 0 && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={onOpenCreateModal}
            style={{ background: '#2563eb', borderRadius: '4px', fontWeight: 600 }}
          >
            Tạo bài tập đầu tiên
          </Button>
        )}
      </div>
    );
  }

  // Nếu số lượng bài tập lớn (> 50 items, ví dụ khi stress test 10.000 bài), tự động áp dụng Virtualization
  const useVirtualization = sortedAssignments.length > 50;

  return (
    <div className="assignment-list">
      {/* Header tóm tắt số lượng */}
      <div className="assignment-list__header">
        <div className="assignment-list__title-group">
          <span className="assignment-list__title">
            Danh Sách Bài Tập
          </span>
          <span className="assignment-list__badge">
            {sortedAssignments.length}
          </span>
          {pinnedCount > 0 && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#2563eb',
              background: '#eff6ff',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid #bfdbfe',
            }}>
              <PushpinFilled style={{ fontSize: '11px' }} /> {pinnedCount} đã ghim
            </span>
          )}
        </div>
        <Text type="secondary" style={{ fontSize: '12px', color: '#94a3b8' }}>
          Hiển thị <strong>{sortedAssignments.length.toLocaleString()}</strong> / <strong>{totalCount.toLocaleString()}</strong> bài tập
        </Text>
      </div>

      {/* Hiển thị danh sách: Virtualized cho danh sách lớn hoặc danh sách thông thường */}
      {useVirtualization ? (
        <VirtualizedAssignmentList
          assignments={sortedAssignments}
          pinnedIds={pinnedIds}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onSelect={onSelectAssignment}
          onTogglePin={onTogglePin}
        />
      ) : (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {sortedAssignments.map((item) => (
            <AssignmentCard
              key={item.id}
              assignment={item}
              isPinned={pinnedIds.includes(item.id)}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onSelect={onSelectAssignment}
              onTogglePin={onTogglePin}
            />
          ))}
        </Space>
      )}
    </div>
  );
};
