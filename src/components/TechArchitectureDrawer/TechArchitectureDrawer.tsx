import React from 'react';
import { Drawer, Tag, Divider, Typography, Card } from 'antd';
import { 
  CodeOutlined, 
  CheckCircleOutlined
} from '@ant-design/icons';
import { TechArchitectureDrawerProps } from './TechArchitectureDrawer.types';
import './TechArchitectureDrawer.css';

const { Paragraph } = Typography;

export const TechArchitectureDrawer: React.FC<TechArchitectureDrawerProps> = ({
  open,
  onClose,
}) => {
  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CodeOutlined style={{ color: '#2563eb', fontSize: '18px' }} />
          <span style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>
            Hồ Sơ Kiến Trúc Kỹ Thuật (3 Buổi Học)
          </span>
        </div>
      }
      open={open}
      onClose={onClose}
      width={560}
      styles={{ body: { padding: '24px' } }}
    >
      <Paragraph style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.6 }}>
        Ứng dụng <strong>Student Deadline Tracker</strong> được xây dựng theo chuẩn mực Production-Ready, tổng hợp trọn vẹn toàn bộ kiến thức nâng cao của 3 buổi học môn Lập trình Web Nâng Cao (PTIT HK7):
      </Paragraph>

      {/* Pillar 1 */}
      <Card 
        className="tech-drawer__card tech-drawer__card--b1"
        styles={{ body: { padding: '16px 20px' } }}
      >
        <div className="tech-drawer__header">
          <Tag color="blue" style={{ fontWeight: 700 }}>BUỔI 1</Tag>
          <span className="tech-drawer__header-title" style={{ color: '#1d4ed8' }}>
            TypeScript Nâng Cao (Generics, Utility Types, Type Guards)
          </span>
        </div>
        <ul className="tech-drawer__list">
          <li>
            <strong>Generics:</strong> <code>ApiResponse&lt;T&gt;</code>, <code>FilterCriteria&lt;T&gt;</code>
          </li>
          <li>
            <strong>Utility Types:</strong> 
            <br />
            • <code>CreateAssignmentPayload = Omit&lt;Assignment, 'id' | 'createdAt' | 'completed' | 'completedAt'&gt;</code>
            <br />
            • <code>UpdateAssignmentPayload = Partial&lt;Omit&lt;Assignment, 'id' | 'createdAt'&gt;&gt; &amp; &#123; id: string &#125;</code>
            <br />
            • <code>Record&lt;SubjectCode, SubjectMeta&gt;</code>, <code>Record&lt;Priority, PriorityMeta&gt;</code>
          </li>
          <li>
            <strong>Type Guards:</strong>
            <br />
            • <code>isCompletedAssignment(item): item is CompletedAssignment</code>
            <br />
            • <code>isOverdueAssignment(item, now): boolean</code>
            <br />
            • <code>isUrgentAssignment(item, now): boolean</code>
          </li>
        </ul>
      </Card>

      {/* Pillar 2 */}
      <Card 
        className="tech-drawer__card tech-drawer__card--b2"
        styles={{ body: { padding: '16px 20px' } }}
      >
        <div className="tech-drawer__header">
          <Tag color="purple" style={{ fontWeight: 700 }}>BUỔI 2</Tag>
          <span className="tech-drawer__header-title" style={{ color: '#6d28d9' }}>
            React Design Patterns (Compound Component, HOC, Custom Hooks)
          </span>
        </div>
        <ul className="tech-drawer__list">
          <li>
            <strong>Compound Component Pattern:</strong>
            <br />
            • Component cha <code>&lt;FilterGroup&gt;</code> quản lý state bằng React Context API.
            <br />
            • Sub-components gắn kèm: <code>&lt;FilterGroup.Status /&gt;</code>, <code>&lt;FilterGroup.Subject /&gt;</code>, <code>&lt;FilterGroup.Priority /&gt;</code>, <code>&lt;FilterGroup.Search /&gt;</code>, <code>&lt;FilterGroup.Actions /&gt;</code>.
          </li>
          <li>
            <strong>Higher-Order Component (HOC):</strong>
            <br />
            • <code>withUrgentHighlight(BaseCard)</code> tự động gắn class viền đỏ/cam nhấp nháy khi bài tập cận deadline (&lt; 24h) hoặc đã quá hạn.
          </li>
          <li>
            <strong>Custom Hook:</strong>
            <br />
            • <code>useDeadlineCountdown(dueDate, completed)</code> tính toán khoảng cách ngày/giờ, định dạng text 'Còn X ngày' hoặc 'Quá hạn Y ngày', tự động cập nhật thời gian thực.
          </li>
        </ul>
      </Card>

      {/* Pillar 3 */}
      <Card 
        className="tech-drawer__card tech-drawer__card--b3"
        styles={{ body: { padding: '16px 20px' } }}
      >
        <div className="tech-drawer__header">
          <Tag color="green" style={{ fontWeight: 700 }}>BUỔI 3</Tag>
          <span className="tech-drawer__header-title" style={{ color: '#047857' }}>
            Redux Toolkit Quản Lý State Toàn Cục (Feature-Based Architecture)
          </span>
        </div>
        <ul className="tech-drawer__list">
          <li>
            <strong>Feature-based Slice:</strong> <code>assignmentSlice.ts</code> cấu hình theo chuẩn Redux Toolkit hiện đại, tích hợp TypeScript.
          </li>
          <li>
            <strong>Async Thunks (createAsyncThunk):</strong>
            <br />
            • <code>fetchInitialAssignments</code>: Lấy dữ liệu mẫu từ mock API khi khởi động ứng dụng (Yêu cầu 7).
            <br />
            • <code>createNewAssignment</code>: Thêm bài tập mới (Yêu cầu 2).
            <br />
            • <code>toggleAssignmentStatus</code>: Đánh dấu hoàn thành / khôi phục (Yêu cầu 3).
            <br />
            • <code>deleteAssignment</code>: Xoá bài tập (Yêu cầu 4).
            <br />
            • <code>resetAssignmentsData</code>: Khôi phục dữ liệu ban đầu.
          </li>
          <li>
            <strong>Typed Hooks &amp; Selectors:</strong> <code>useAppDispatch</code>, <code>useAppSelector</code>, cùng các memoized selectors lọc dữ liệu theo tiêu chí (Yêu cầu 5).
          </li>
        </ul>
      </Card>

      <Divider style={{ margin: '20px 0' }} />

      <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
        <CheckCircleOutlined style={{ color: '#16a34a', marginRight: '6px' }} />
        Tuân thủ 100% tài liệu và slide thực hành 3 buổi học môn LTWNC (PTIT)
      </div>
    </Drawer>
  );
};
