import React from 'react';
import { Space, Skeleton, Button, Typography } from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import { AssignmentCard } from '../AssignmentCard';
import { AssignmentListProps } from './AssignmentList.types';
import './AssignmentList.css';

const { Text } = Typography;

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  totalCount,
  loading,
  onToggleStatus,
  onDelete,
  onOpenCreateModal,
  onSelectAssignment,
}) => {
  // Trạng thái đang tải dữ liệu ban đầu
  if (loading && assignments.length === 0) {
    return (
      <Space direction="vertical" size={14} style={{ width: '100%', marginTop: '16px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
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
            style={{ background: '#2563eb', borderRadius: '8px', fontWeight: 600 }}
          >
            Tạo bài tập đầu tiên
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="assignment-list">
      {/* Header tóm tắt số lượng */}
      <div className="assignment-list__header">
        <div className="assignment-list__title-group">
          <span className="assignment-list__title">
            Danh Sách Bài Tập
          </span>
          <span className="assignment-list__badge">
            {assignments.length}
          </span>
        </div>
        <Text type="secondary" style={{ fontSize: '12px', color: '#94a3b8' }}>
          Hiển thị <strong>{assignments.length}</strong> / <strong>{totalCount}</strong> bài tập
        </Text>
      </div>

      {/* Danh sách thẻ bài tập */}
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {assignments.map((item) => (
          <AssignmentCard
            key={item.id}
            assignment={item}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            onSelect={onSelectAssignment}
          />
        ))}
      </Space>
    </div>
  );
};
