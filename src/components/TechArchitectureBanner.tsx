import React, { useState } from 'react';
import { Alert, Button, Space, Typography, Collapse } from 'antd';
import { InfoCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const TechArchitectureBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ marginBottom: '24px' }}>
      <Alert
        message={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <Space>
              <InfoCircleOutlined style={{ color: '#1677ff', fontSize: '16px' }} />
              <Text strong style={{ color: '#1677ff', fontSize: '14px' }}>
                Tổng hợp kiến thức 3 buổi học: TypeScript Nâng Cao + React Design Patterns + Redux Toolkit
              </Text>
            </Space>
            <Button 
              type="link" 
              size="small" 
              icon={expanded ? <UpOutlined /> : <DownOutlined />}
              onClick={() => setExpanded(!expanded)}
              style={{ padding: 0 }}
            >
              {expanded ? 'Thu gọn kiến trúc' : 'Xem chi tiết kỹ thuật'}
            </Button>
          </div>
        }
        description={
          expanded && (
            <div style={{ marginTop: '12px' }}>
              <Collapse
                ghost
                defaultActiveKey={['1', '2', '3']}
                items={[
                  {
                    key: '1',
                    label: <strong>Buổi 1 — TypeScript Nâng Cao</strong>,
                    children: (
                      <div>
                        <p style={{ margin: '0 0 6px 0' }}>
                          • <strong>Generics & Utility Types:</strong> Sử dụng <code>CreateAssignmentPayload = Omit&lt;Assignment, ...&gt;</code>, <code>Record&lt;Priority, ...&gt;</code>, <code>ApiResponse&lt;T&gt;</code>, <code>FilterCriteria&lt;T&gt;</code>.
                        </p>
                        <p style={{ margin: 0 }}>
                          • <strong>Type Guards Chuyên Biệt:</strong> <code>isCompletedAssignment()</code>, <code>isOverdueAssignment()</code>, <code>isUrgentAssignment()</code> kiểm tra runtime & compile-time.
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: '2',
                    label: <strong>Buổi 2 — React Design Patterns</strong>,
                    children: (
                      <div>
                        <p style={{ margin: '0 0 6px 0' }}>
                          • <strong>Compound Component:</strong> <code>FilterGroup</code> (Context API) gồm <code>FilterGroup.Status</code>, <code>FilterGroup.Subject</code>, <code>FilterGroup.Priority</code>, <code>FilterGroup.Search</code>.
                        </p>
                        <p style={{ margin: '0 0 6px 0' }}>
                          • <strong>Higher-Order Component (HOC):</strong> <code>withUrgentHighlight()</code> tự động bọc thẻ bài tập và làm nổi bật visual viền/shadow khi deadline &lt; 24h hoặc quá hạn.
                        </p>
                        <p style={{ margin: 0 }}>
                          • <strong>Custom Hook:</strong> <code>useDeadlineCountdown()</code> tính toán chính xác <em>"Còn X ngày"</em> hoặc <em>"Quá hạn Y ngày"</em>.
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: '3',
                    label: <strong>Buổi 3 — Redux Toolkit Feature-Based</strong>,
                    children: (
                      <div>
                        <p style={{ margin: '0 0 6px 0' }}>
                          • <strong>Feature-Based Architecture:</strong> Toàn bộ state quản lý tại <code>src/features/assignments/</code>.
                        </p>
                        <p style={{ margin: '0 0 6px 0' }}>
                          • <strong>createAsyncThunk & Mock API:</strong> Lấy dữ liệu bài tập mẫu ban đầu (Yêu cầu 7) có mô phỏng độ trễ mạng 700ms.
                        </p>
                        <p style={{ margin: 0 }}>
                          • <strong>Typed Hooks:</strong> <code>useAppDispatch</code> và <code>useAppSelector</code> đảm bảo 100% type-safety.
                        </p>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          )
        }
        type="info"
        showIcon={false}
        style={{
          borderRadius: '10px',
          border: '1px solid #bae0ff',
          background: '#e6f4ff',
        }}
      />
    </div>
  );
};
