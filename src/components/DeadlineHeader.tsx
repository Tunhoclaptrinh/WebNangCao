import React from 'react';
import { Card, Row, Col, Statistic, Button, Typography, Progress, Tag } from 'antd';
import { 
  PlusOutlined, 
  SyncOutlined, 
  BookOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  WarningOutlined,
  UserOutlined,
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
    <div style={{ marginBottom: '24px' }}>
      {/* Thanh tiêu đề chính & thông tin sinh viên */}
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
          borderRadius: '12px',
          border: '1px solid #e8e8e8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                background: '#e6f4ff', 
                color: '#1677ff',
                flexShrink: 0
              }}
            >
              <ScheduleOutlined style={{ fontSize: '20px' }} />
            </div>
            <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#1f1f1f', letterSpacing: '-0.02em' }}>
              Student Deadline Tracker
            </Title>
            <Tag color="blue" style={{ fontWeight: 600 }}>Practice Lab 01</Tag>
          </div>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            Ứng dụng Quản lý Deadline Bài tập Cá nhân — Vận dụng TypeScript nâng cao, React Design Patterns & Redux Toolkit
          </Text>
        </div>

        {/* Nút hành động & Tên sinh viên */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Tag icon={<UserOutlined />} color="geekblue" style={{ padding: '6px 12px', fontSize: '13px' }}>
            <strong>Nguyễn Tiến Tuấn</strong> — B23DCCC173 (RIPT1411-20261-02)
          </Tag>

          <Button
            icon={<SyncOutlined spin={loading} />}
            onClick={onResetMockData}
            title="Khôi phục danh sách bài tập mẫu ban đầu từ API giả lập"
          >
            Dữ liệu mẫu
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="middle"
            onClick={onOpenCreateModal}
            style={{ fontWeight: 600 }}
          >
            Thêm bài tập mới
          </Button>
        </div>
      </div>

      {/* Thẻ thống kê KPI */}
      <Row gutter={[16, 16]}>
        {/* Tổng số bài tập */}
        <Col xs={12} sm={6}>
          <Card 
            hoverable 
            styles={{ body: { padding: '16px 20px' } }}
            style={{ borderRadius: '10px', border: '1px solid #f0f0f0' }}
          >
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#595959' }}>Tổng số bài tập</span>}
              value={stats.total}
              prefix={<BookOutlined style={{ color: '#1677ff' }} />}
              valueStyle={{ fontWeight: 700, color: '#262626' }}
            />
          </Card>
        </Col>

        {/* Chưa hoàn thành */}
        <Col xs={12} sm={6}>
          <Card 
            hoverable 
            styles={{ body: { padding: '16px 20px' } }}
            style={{ borderRadius: '10px', border: '1px solid #f0f0f0' }}
          >
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#595959' }}>Đang chờ xử lý</span>}
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ fontWeight: 700, color: '#fa8c16' }}
            />
          </Card>
        </Col>

        {/* Quá hạn */}
        <Col xs={12} sm={6}>
          <Card 
            hoverable 
            styles={{ body: { padding: '16px 20px' } }}
            style={{ borderRadius: '10px', border: '1px solid #ffccc7', background: stats.overdue > 0 ? '#fff2f0' : '#ffffff' }}
          >
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#cf1322' }}>Đã quá hạn</span>}
              value={stats.overdue}
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ fontWeight: 700, color: '#cf1322' }}
            />
          </Card>
        </Col>

        {/* Đã hoàn thành */}
        <Col xs={12} sm={6}>
          <Card 
            hoverable 
            styles={{ body: { padding: '16px 20px' } }}
            style={{ borderRadius: '10px', border: '1px solid #f0f0f0' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Statistic
                title={<span style={{ fontWeight: 600, color: '#595959' }}>Đã hoàn thành</span>}
                value={stats.completed}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ fontWeight: 700, color: '#52c41a' }}
              />
              <div style={{ width: 44, textAlign: 'center' }}>
                <Progress 
                  type="circle" 
                  percent={stats.completionRate} 
                  size={42} 
                  strokeColor="#52c41a"
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
