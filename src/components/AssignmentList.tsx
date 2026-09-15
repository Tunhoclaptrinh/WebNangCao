import React from 'react';
import { Space, Skeleton, Empty, Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Assignment } from '../types/assignment.types';
import { AssignmentCard } from './AssignmentCard';

const { Text } = Typography;

export interface AssignmentListProps {
  assignments: Assignment[];
  totalCount: number;
  loading: boolean;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenCreateModal: () => void;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  totalCount,
  loading,
  onToggleStatus,
  onDelete,
  onOpenCreateModal,
}) => {
  if (loading && assignments.length === 0) {
    return (
      <Space direction="vertical" size={16} style={{ width: '100%', marginTop: '16px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #f0f0f0' }}>
            <Skeleton active avatar paragraph={{ rows: 2 }} />
          </div>
        ))}
      </Space>
    );
  }

  if (assignments.length === 0) {
    return (
      <div 
        style={{ 
          background: '#ffffff', 
          padding: '48px 24px', 
          borderRadius: '12px', 
          border: '1px dashed #d9d9d9',
          textAlign: 'center',
          marginTop: '16px',
        }}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span style={{ color: '#8c8c8c' }}>
              {totalCount === 0 
                ? 'Chưa có bài tập nào. Hãy thêm bài tập mới để bắt đầu theo dõi deadline!' 
                : 'Không tìm thấy bài tập phù hợp với bộ lọc hiện tại.'}
            </span>
          }
        >
          {totalCount === 0 && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onOpenCreateModal}>
              Tạo bài tập đầu tiên
            </Button>
          )}
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '16px' }}>
      {/* Header tóm tắt số lượng */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          Đang hiển thị <strong>{assignments.length}</strong> / <strong>{totalCount}</strong> bài tập
        </Text>
      </div>

      {/* Danh sách thẻ bài tập */}
      <Space direction="vertical" size={14} style={{ width: '100%' }}>
        {assignments.map((item) => (
          <AssignmentCard
            key={item.id}
            assignment={item}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))}
      </Space>
    </div>
  );
};
