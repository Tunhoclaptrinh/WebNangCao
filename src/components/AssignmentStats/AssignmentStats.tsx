import { useMemo } from 'react';
import { Card, Row, Col, Progress, Typography, Tag } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined, 
  BookOutlined,
  PushpinOutlined,
} from '@ant-design/icons';
import { Assignment, SUBJECT_METAS } from '../../types/assignment.types';
import { calcStats } from '../../utils/dateCalculations';
import './AssignmentStats.css';

const { Text } = Typography;

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

  return (
    <div className="assignment-stats">
      {/* 4 Chỉ số cốt lõi */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card size="small" className="assignment-stats__card assignment-stats__card--total">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>Tổng bài tập</Text>
                <div className="assignment-stats__num assignment-stats__num--total">
                  {stats.total.toLocaleString()}
                </div>
              </div>
              <BookOutlined style={{ fontSize: '24px', color: '#2563eb' }} />
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card size="small" className="assignment-stats__card assignment-stats__card--completed">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="assignment-stats__label--completed">Đã hoàn thành</span>
                <div className="assignment-stats__num assignment-stats__num--completed">
                  {stats.completed.toLocaleString()}
                </div>
              </div>
              <CheckCircleOutlined style={{ fontSize: '24px', color: '#16a34a' }} />
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card size="small" className="assignment-stats__card assignment-stats__card--pending">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="assignment-stats__label--pending">Đang thực hiện</span>
                <div className="assignment-stats__num assignment-stats__num--pending">
                  {stats.pending.toLocaleString()}
                </div>
              </div>
              <ClockCircleOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card size="small" className="assignment-stats__card assignment-stats__card--overdue">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="assignment-stats__label--overdue">Quá hạn nộp</span>
                <div className="assignment-stats__num assignment-stats__num--overdue">
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
          <Card size="small" title="Tiến độ hoàn thành bài tập" className="assignment-stats__card assignment-stats__card--panel" style={{ height: '100%' }}>
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
          <Card size="small" title="Phân bố theo môn học" className="assignment-stats__card assignment-stats__card--panel" style={{ height: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '6px 0' }}>
              {Object.entries(subjectBreakdown).map(([subCode, count]) => {
                const meta = SUBJECT_METAS[subCode as keyof typeof SUBJECT_METAS];
                return (
                  <div
                    key={subCode}
                    className="assignment-stats__subject-pill"
                  >
                    <span
                      className={`assignment-card__dot assignment-card__dot--${subCode}`}
                    />
                    <span>{meta?.name || subCode}:</span>
                    <strong style={{ marginLeft: '4px' }}>{count}</strong>
                  </div>
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
