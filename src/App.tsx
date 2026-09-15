import React, { useEffect, useState } from 'react';
import { Layout, ConfigProvider, App as AntApp, message } from 'antd';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  fetchInitialAssignments,
  createNewAssignment,
  toggleAssignmentStatus,
  deleteAssignment,
  resetAssignmentsData,
  setStatusFilter,
  setSubjectFilter,
  setPriorityFilter,
  setSearchQuery,
  clearFilters,
  selectFilteredAssignments,
  selectAssignmentStats,
  selectAssignmentsState,
} from './features/assignments/assignmentSlice';
import { CreateAssignmentPayload } from './types/assignment.types';

// Components
import { DeadlineHeader } from './components/DeadlineHeader';
import { TechArchitectureBanner } from './components/TechArchitectureBanner';
import { FilterGroup } from './components/FilterGroup';
import { AssignmentList } from './components/AssignmentList';
import { AssignmentFormModal } from './components/AssignmentFormModal';

const { Content, Footer } = Layout;

const DeadlineTrackerContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { loading, submitting, statusFilter, subjectFilter, priorityFilter, searchQuery, items } =
    useAppSelector(selectAssignmentsState);

  const filteredAssignments = useAppSelector(selectFilteredAssignments);
  const stats = useAppSelector(selectAssignmentStats);

  // Yêu cầu 7: Khi khởi động app, lấy danh sách mẫu ban đầu từ 1 API giả lập
  useEffect(() => {
    dispatch(fetchInitialAssignments());
  }, [dispatch]);

  // Yêu cầu 2: Thêm bài tập mới
  const handleCreateAssignment = async (payload: CreateAssignmentPayload) => {
    try {
      await dispatch(createNewAssignment(payload)).unwrap();
      messageApi.success('Đã thêm bài tập mới vào danh sách theo dõi');
      setModalOpen(false);
    } catch (error) {
      messageApi.error(`Thêm bài tập thất bại: ${error}`);
    }
  };

  // Yêu cầu 3: Đánh dấu hoàn thành / bỏ đánh dấu
  const handleToggleStatus = async (id: string) => {
    try {
      const updated = await dispatch(toggleAssignmentStatus(id)).unwrap();
      if (updated.completed) {
        messageApi.success('Đã hoàn thành bài tập');
      } else {
        messageApi.info('Đã chuyển bài tập về trạng thái đang chờ');
      }
    } catch (error) {
      messageApi.error(`Cập nhật thất bại: ${error}`);
    }
  };

  // Yêu cầu 4: Xoá bài tập
  const handleDeleteAssignment = async (id: string) => {
    try {
      await dispatch(deleteAssignment(id)).unwrap();
      messageApi.success('Đã xoá bài tập khỏi danh sách');
    } catch (error) {
      messageApi.error(`Xoá bài tập thất bại: ${error}`);
    }
  };

  // Khôi phục dữ liệu mẫu
  const handleResetMockData = async () => {
    try {
      await dispatch(resetAssignmentsData()).unwrap();
      messageApi.success('Đã khôi phục dữ liệu mẫu ban đầu từ API giả lập');
    } catch (error) {
      messageApi.error(`Khôi phục dữ liệu thất bại: ${error}`);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {contextHolder}
      <Content style={{ padding: '36px 24px', maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
        {/* Header thống kê KPI & Sinh viên */}
        <DeadlineHeader
          stats={stats}
          loading={loading}
          onOpenCreateModal={() => setModalOpen(true)}
          onResetMockData={handleResetMockData}
        />

        {/* Banner giải thích kiến trúc 3 buổi học */}
        <TechArchitectureBanner />

        {/* Compound Component FilterGroup (React Design Pattern Buổi 2) */}
        <FilterGroup
          statusFilter={statusFilter}
          subjectFilter={subjectFilter}
          priorityFilter={priorityFilter}
          searchQuery={searchQuery}
          onStatusChange={(s) => dispatch(setStatusFilter(s))}
          onSubjectChange={(sub) => dispatch(setSubjectFilter(sub))}
          onPriorityChange={(p) => dispatch(setPriorityFilter(p))}
          onSearchChange={(q) => dispatch(setSearchQuery(q))}
          onReset={() => dispatch(clearFilters())}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Hàng 1: Trạng thái (Yêu cầu 5: Tất cả / Chưa hoàn thành / Quá hạn / Đã hoàn thành) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <FilterGroup.Status />
              <FilterGroup.Actions />
            </div>

            {/* Hàng 2: Môn học + Độ ưu tiên + Tìm kiếm */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <FilterGroup.Subject />
              <FilterGroup.Priority />
              <FilterGroup.Search />
            </div>
          </div>
        </FilterGroup>

        {/* Danh sách bài tập (Yêu cầu 1, 6) */}
        <AssignmentList
          assignments={filteredAssignments}
          totalCount={items.length}
          loading={loading}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteAssignment}
          onOpenCreateModal={() => setModalOpen(true)}
        />

        {/* Modal form thêm bài tập mới (Yêu cầu 2) */}
        <AssignmentFormModal
          open={modalOpen}
          submitting={submitting}
          onCancel={() => setModalOpen(false)}
          onSubmit={handleCreateAssignment}
        />
      </Content>

      <Footer style={{ textAlign: 'center', background: 'transparent', color: '#94a3b8', padding: '32px 24px', fontSize: '13px' }}>
        <strong>Student Deadline Tracker</strong> — Học viện Công nghệ Bưu chính Viễn thông (PTIT)
        <br />
        Sinh viên: <strong style={{ color: '#475569' }}>Nguyễn Tiến Tuấn</strong> (MSV: <code>B23DCCC173</code> — Lớp: <code>RIPT1411-20261-02</code>)
        <br />
        Môn học: Lập trình Web Nâng Cao — Giảng viên: ThS. Ngô Văn Nhận
      </Footer>
    </Layout>
  );
};

export function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb',
          colorSuccess: '#16a34a',
          colorWarning: '#d97706',
          colorError: '#dc2626',
          borderRadius: 10,
          fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          colorBgLayout: '#f8fafc',
          colorBgContainer: '#ffffff',
          colorBorderSecondary: '#f1f5f9',
        },
      }}
    >
      <AntApp>
        <DeadlineTrackerContent />
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
