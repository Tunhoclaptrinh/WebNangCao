import React, { useMemo } from 'react';
import { Card, Row, Col, Progress, Typography, Tag, Divider } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined, 
  BookOutlined,
  PushpinOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Assignment, SUBJECT_METAS, PRIORITY_METAS } from '../../types/assignment.types';
import { calcStats } from '../../utils/dateCalculations';

const { Title, Text } = Typography;

export interface AssignmentStatsProps {
  assignments: Assignment[];
  pinnedIds?: string[];
}

export const AssignmentStats: React.FC<AssignmentStatsProps> = ({
  assignments,
  pinnedIds = [],
}) => {
  const stats = useMemo(() => {
    return calcStats(assignments);
  }, [assignments]);

  const subjectBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of assignments) {
      map[a.subject] = (map[a.subject] || 0) + 1;
    }
    return map;
  }, [assignments]);

  const priorityBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of assignments) {
      map[a.priority] = (map[a.priority] || 0) + 1;
    }
    return map;
  }, [assignments]);

  return (
    <div className="assignment-stats" style={{ marginTop: '16px', marginBottom: '24px' }}>
      {/* 4 Chỉ số cốt lõi */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>Tổng bài tập</Text>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                  {stats.total.toLocaleString()}
                </div>
              </div>
              <BookOutlined style={{ fontSize: '24px', color: '#2563eb' }} />
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card size="small" style={{ borderRadius: '4px', border: '1px solid #bbf7d0', background: '#f0fdf4' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text style={{ fontSize: '12px', color: '#166534' }}>Đã hoàn thành</Text>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#15803d', marginTop: '2px' }}>
                  {stats.completed.toLocaleString()}
                </div>
              </div>
              <CheckCircleOutlined style={{ fontSize: '24px', color: '#16a34a' }} />
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card size="small" style={{ borderRadius: '4px', border: '1px solid #bfdbfe', background: '#eff6ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text style={{ fontSize: '12px', color: '#1e40af' }}>Đang thực hiện</Text>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>
                  {stats.pending.toLocaleString()}
                </div>
              </div>
              <ClockCircleOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card size="small" style={{ borderRadius: '4px', border: '1px solid #fecaca', background: '#fef2f2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text style={{ fontSize: '12px', color: '#991b1b' }}>Quá hạn nộp</Text>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#dc2626', marginTop: '2px' }}>
                  {stats.overdue.toLocaleString()}
                </div>
              </div>
              <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#ef4444' }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tiến độ hoàn thành & Phân bố môn học */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} md={12}>
          <Card size="small" title="Tiến độ hoàn thành bài tập" style={{ borderRadius: '4px', border: '1px solid #e2e8f0', height: '100%' }}>
            <div style={{ padding: '8px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <Text style={{ fontWeight: 600 }}>Tỷ lệ hoàn thành:</Text>
                <Text style={{ fontWeight: 700, color: '#16a34a' }}>{stats.completionRate}%</Text>
              </div>
              <Progress 
                percent={stats.completionRate} 
                strokeColor={{ '0%': '#2563eb', '100%': '#16a34a' }}
                status={stats.completionRate === 100 ? 'success' : 'active'}
              />
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Tag color="blue" icon={<PushpinOutlined />} style={{ borderRadius: '4px' }}>
                  Đã ghim: {pinnedIds.length}
                </Tag>
                {stats.urgentCount > 0 && (
                  <Tag color="error" icon={<ExclamationCircleOutlined />} style={{ borderRadius: '4px' }}>
                    Khẩn cấp (&lt;24h): {stats.urgentCount}
                  </Tag>
                )}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card size="small" title="Phân bố theo môn học" style={{ borderRadius: '4px', border: '1px solid #e2e8f0', height: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '6px 0' }}>
              {Object.entries(subjectBreakdown).map(([subCode, count]) => {
                const meta = SUBJECT_METAS[subCode as keyof typeof SUBJECT_METAS];
                return (
                  <Tag
                    key={subCode}
                    style={{
                      borderRadius: '4px',
                      padding: '4px 10px',
                      background: meta?.bg || '#f1f5f9',
                      color: meta?.textColor || '#334155',
                      borderColor: meta?.borderColor || '#cbd5e1',
                      fontWeight: 600,
                    }}
                  >
                    {meta?.name || subCode}: <strong>{count}</strong>
                  </Tag>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AssignmentStats;
