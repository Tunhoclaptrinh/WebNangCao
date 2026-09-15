import React from 'react';
import { Space, Skeleton, Button, Typography } from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
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
      <Space direction="vertical" size={14} style={{ width: '100%', marginTop: '20px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
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
          padding: '60px 24px', 
          borderRadius: '16px', 
          border: '1px dashed #cbd5e1',
          textAlign: 'center',
          marginTop: '20px',
        }}
      >
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f8fafc', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
          <InboxOutlined style={{ fontSize: '24px' }} />
        </div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
          {totalCount === 0 ? 'Chưa có deadline nào' : 'Không có bài tập phù hợp'}
        </div>
        <div style={{ color: '#64748b', fontSize: '13px', maxWidth: '380px', margin: '0 auto 18px auto' }}>
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
    <div style={{ marginTop: '20px' }}>
      {/* Header tóm tắt danh sách */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
            Danh Sách Bài Tập
          </span>
          <span 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              padding: '1px 8px',
              borderRadius: '9999px',
              background: '#f1f5f9',
              color: '#475569',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
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
          />
        ))}
      </Space>
    </div>
  );
};
