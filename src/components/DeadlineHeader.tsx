import React from 'react';
import { Card, Row, Col, Button, Typography, Progress } from 'antd';
import { 
  PlusOutlined, 
  SyncOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  AlertOutlined,
  AppstoreOutlined,
  ScheduleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export interface DeadlineHeaderProps {
  stats: {
    total: number;
    completed: number;
    overdue: number;
    pending: number;
    completionRate: number;
  };
  loading: boolean;
  onOpenCreateModal: () => void;
  onResetMockData: () => void;
}

export const DeadlineHeader: React.FC<DeadlineHeaderProps> = ({
  stats,
  loading,
  onOpenCreateModal,
  onResetMockData,
}) => {
  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Top Banner Navigation & Student Profile */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
          background: '#ffffff',
          padding: '20px 24px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '42px', 
              height: '42px', 
              borderRadius: '10px', 
              background: '#eff6ff', 
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              flexShrink: 0
            }}
          >
            <ScheduleOutlined style={{ fontSize: '22px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
                Student Deadline Tracker
              </Title>
              <span 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: '#f0fdf4',
                  color: '#166534',
                  fontSize: '11px',
                  fontWeight: 600,
                  border: '1px solid #bbf7d0',
                }}
              >
                <span className="live-dot" /> Practice Lab 01
              </span>
            </div>
            <Text type="secondary" style={{ fontSize: '13px', color: '#64748b' }}>
              Không gian quản lý & theo dõi tiến độ bài tập cá nhân — PTIT HK7
            </Text>
          </div>
        </div>

        {/* Profile Pill & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Student Chip */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '13px',
            }}
          >
            <span 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 700,
              }}
            >
              TT
            </span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>Nguyễn Tiến Tuấn</span>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>•</span>
            <span style={{ color: '#64748b', fontSize: '12px' }}>B23DCCC173</span>
          </div>

          <Button
            icon={<SyncOutlined spin={loading} />}
            onClick={onResetMockData}
            style={{ borderRadius: '8px', color: '#475569', fontWeight: 500 }}
          >
            Dữ liệu mẫu
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="middle"
            onClick={onOpenCreateModal}
            style={{ 
              borderRadius: '8px', 
              fontWeight: 600, 
              background: '#2563eb',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            }}
          >
            Thêm bài tập
          </Button>
        </div>
      </div>

      {/* Bento Metric Cards (High-End Contrast & Whitespace) */}
      <Row gutter={[16, 16]}>
        {/* Card 1: Tổng số bài tập */}
        <Col xs={12} sm={6}>
          <Card 
            hoverable 
            styles={{ body: { padding: '18px 20px' } }}
            style={{ 
              borderRadius: '14px', 
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Tổng bài tập
              </span>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                <AppstoreOutlined style={{ fontSize: '14px' }} />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
              Tất cả các môn học
            </div>
          </Card>
        </Col>

        {/* Card 2: Đang chờ xử lý */}
        <Col xs={12} sm={6}>
          <Card 
            hoverable 
            styles={{ body: { padding: '18px 20px' } }}
            style={{ 
              borderRadius: '14px', 
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Đang chờ nộp
              </span>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <ClockCircleOutlined style={{ fontSize: '14px' }} />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#2563eb', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {stats.pending}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
              Đang trong thời hạn
            </div>
          </Card>
        </Col>

        {/* Card 3: Quá hạn */}
        <Col xs={12} sm={6}>
          <Card 
            hoverable 
            styles={{ body: { padding: '18px 20px' } }}
            style={{ 
              borderRadius: '14px', 
              border: stats.overdue > 0 ? '1px solid #fecaca' : '1px solid #e2e8f0',
              background: stats.overdue > 0 ? '#fffafa' : '#ffffff',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: stats.overdue > 0 ? '#dc2626' : '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Quá hạn nộp
              </span>
              <div 
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '6px', 
                  background: stats.overdue > 0 ? '#fee2e2' : '#f1f5f9', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: stats.overdue > 0 ? '#dc2626' : '#94a3b8' 
                }}
              >
                <AlertOutlined style={{ fontSize: '14px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: stats.overdue > 0 ? '#dc2626' : '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                {stats.overdue}
              </span>
              {stats.overdue > 0 && <span className="pulse-indicator" />}
            </div>
            <div style={{ fontSize: '12px', color: stats.overdue > 0 ? '#ef4444' : '#94a3b8', marginTop: '6px' }}>
              {stats.overdue > 0 ? 'Cần xử lý gấp' : 'Không có bài trễ'}
            </div>
          </Card>
        </Col>

        {/* Card 4: Đã hoàn thành */}
        <Col xs={12} sm={6}>
          <Card 
            hoverable 
            styles={{ body: { padding: '18px 20px' } }}
            style={{ 
              borderRadius: '14px', 
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Đã hoàn thành
              </span>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                <CheckCircleOutlined style={{ fontSize: '14px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                {stats.completed}
              </div>
              <Progress 
                type="circle" 
                percent={stats.completionRate} 
                size={38} 
                strokeColor="#16a34a"
                trailColor="#f1f5f9"
                strokeWidth={9}
              />
            </div>
            <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '6px', fontWeight: 500 }}>
              {stats.completionRate}% chỉ tiêu hoàn tất
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
