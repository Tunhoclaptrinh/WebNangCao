import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { 
  CodeOutlined, 
  DownOutlined, 
  UpOutlined,
  ThunderboltOutlined,
  BranchesOutlined
} from '@ant-design/icons';

export const TechArchitectureBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      style={{ 
        marginBottom: '24px',
        background: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        padding: '14px 20px',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CodeOutlined style={{ color: '#2563eb', fontSize: '16px' }} />
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>
              Kiến Trúc Kỹ Thuật Tổng Hợp:
            </span>
          </div>

          <Space size={6} wrap>
            <span style={{ padding: '2px 8px', borderRadius: '6px', background: '#eff6ff', color: '#1d4ed8', fontSize: '11px', fontWeight: 600, border: '1px solid #bfdbfe' }}>
              Buổi 1: Generics & Type Guards
            </span>
            <span style={{ padding: '2px 8px', borderRadius: '6px', background: '#f5f3ff', color: '#6d28d9', fontSize: '11px', fontWeight: 600, border: '1px solid #ddd6fe' }}>
              Buổi 2: Compound & HOC
            </span>
            <span style={{ padding: '2px 8px', borderRadius: '6px', background: '#ecfdf5', color: '#047857', fontSize: '11px', fontWeight: 600, border: '1px solid #a7f3d0' }}>
              Buổi 3: Redux Toolkit Thunk
            </span>
          </Space>
        </div>

        <Button 
          type="text" 
          size="small" 
          icon={expanded ? <UpOutlined /> : <DownOutlined />}
          onClick={() => setExpanded(!expanded)}
          style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, padding: '4px 8px' }}
        >
          {expanded ? 'Thu gọn' : 'Chi tiết'}
        </Button>
      </div>

      {expanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {/* Cột 1 */}
            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#1d4ed8', fontWeight: 700, fontSize: '12px' }}>
                <CodeOutlined /> 1. TypeScript Nâng Cao
              </div>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                <li><code>Omit&lt;Assignment, ...&gt;</code>, <code>Record&lt;K, T&gt;</code></li>
                <li>Generic <code>ApiResponse&lt;T&gt;</code>, <code>FilterCriteria&lt;T&gt;</code></li>
                <li>Type guards: <code>isOverdueAssignment</code>, <code>isCompletedAssignment</code></li>
              </ul>
            </div>

            {/* Cột 2 */}
            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#6d28d9', fontWeight: 700, fontSize: '12px' }}>
                <BranchesOutlined /> 2. React Design Patterns
              </div>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                <li>Compound Component: <code>FilterGroup</code> (Context API)</li>
                <li>HOC: <code>withUrgentHighlight</code> tự động viền cảnh báo</li>
                <li>Custom Hook: <code>useDeadlineCountdown</code> đếm ngược thực</li>
              </ul>
            </div>

            {/* Cột 3 */}
            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#047857', fontWeight: 700, fontSize: '12px' }}>
                <ThunderboltOutlined /> 3. Redux Toolkit
              </div>
              <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                <li>Feature-based: <code>src/features/assignments/</code></li>
                <li><code>createAsyncThunk</code> kết nối API giả lập 700ms</li>
                <li>Typed hooks: <code>useAppDispatch</code>, <code>useAppSelector</code></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
