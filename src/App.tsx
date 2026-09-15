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
  setViewMode,
  setSelectedAssignmentId,
  setTechDrawerOpen,
  selectFilteredAssignments,
  selectAssignmentStats,
  selectAssignmentsState,
  selectSelectedAssignment,
  selectSubjectStats,
} from './features/assignments/assignmentSlice';
import { CreateAssignmentPayload, SUBJECT_METAS } from './types/assignment.types';

// Modular Components
import {
  Sidebar,
  WorkspaceHeader,
  FilterGroup,
  AssignmentList,
  KanbanBoard,
  AssignmentDetailDrawer,
  AssignmentFormModal,
  TechArchitectureDrawer,
} from './components';

const { Content, Footer } = Layout;

const DeadlineTrackerContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const {
    loading,
    submitting,
    statusFilter,
    subjectFilter,
    priorityFilter,
    searchQuery,
    items,
    viewMode,
    selectedAssignmentId,
    techDrawerOpen
  } = useAppSelector(selectAssignmentsState);

  const filteredAssignments = useAppSelector(selectFilteredAssignments);
  const stats = useAppSelector(selectAssignmentStats);
  const selectedAssignment = useAppSelector(selectSelectedAssignment);
  const subjectCounts = useAppSelector(selectSubjectStats);

  // Yêu cầu 7: Khởi động app, lấy danh sách mẫu từ mock API qua async thunk
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

  // Xác định tiêu đề hiển thị theo bộ lọc hiện tại
  const getViewTitle = () => {
    if (subjectFilter !== 'ALL') {
      const meta = SUBJECT_METAS[subjectFilter];
      return meta ? `${meta.name} (${meta.code})` : 'Môn học';
    }
    switch (statusFilter) {
      case 'PENDING':
        return 'Bài tập đang chờ nộp';
      case 'OVERDUE':
        return 'Bài tập đã quá hạn & khẩn cấp';
      case 'COMPLETED':
        return 'Bài tập đã hoàn thành';
      default:
        return 'Tất cả deadline bài tập';
    }
  };

  const isFiltered = statusFilter !== 'ALL' || subjectFilter !== 'ALL' || priorityFilter !== 'ALL' || searchQuery.trim() !== '';

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'row' }}>
      {contextHolder}

      {/* 1. Sidebar Điều Hướng (Notion/Linear-style, Single Source of Truth cho Status & Subject) */}
      <Sidebar
        statusFilter={statusFilter}
        subjectFilter={subjectFilter}
        stats={stats}
        subjectCounts={subjectCounts}
        loading={loading}
        onStatusSelect={(s) => dispatch(setStatusFilter(s))}
        onSubjectSelect={(sub) => dispatch(setSubjectFilter(sub))}
        onOpenCreateModal={() => setModalOpen(true)}
        onResetMockData={handleResetMockData}
        onOpenTechDrawer={() => dispatch(setTechDrawerOpen(true))}
      />

      {/* 2. Main Workspace Layout */}
      <Layout style={{ background: '#f8fafc', minHeight: '100vh', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Workspace Top Header (Sticky Bar) */}
        <WorkspaceHeader
          title={getViewTitle()}
          count={filteredAssignments.length}
          isFiltered={isFiltered}
          viewMode={viewMode}
          loading={loading}
          onClearFilters={() => dispatch(clearFilters())}
          onViewModeChange={(mode) => dispatch(setViewMode(mode))}
          onOpenTechDrawer={() => dispatch(setTechDrawerOpen(true))}
          onResetMockData={handleResetMockData}
          onOpenCreateModal={() => setModalOpen(true)}
        />

        {/* Workspace Main Content */}
        <Content style={{ padding: '24px 32px', maxWidth: '1200px', width: '100%', margin: '0 auto', flex: 1 }}>
          {viewMode === 'list' ? (
            <>
              {/* Compound Component Pattern (Buổi 2 React Design Patterns): FilterGroup */}
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
                <div style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px' }}>
                  <FilterGroup.Subject />
                  <FilterGroup.Priority />
                  <FilterGroup.Search />
                  <FilterGroup.Actions />
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
                onSelectAssignment={(id) => dispatch(setSelectedAssignmentId(id))}
              />
            </>
          ) : (
            <>
              {/* Chế độ Kanban Board: 3 cột sạch sẽ, trực quan */}
              <KanbanBoard
                assignments={filteredAssignments}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteAssignment}
                onSelectAssignment={(id) => dispatch(setSelectedAssignmentId(id))}
              />
            </>
          )}

          {/* Side-Peek Detail Drawer (Notion/Linear style) */}
          <AssignmentDetailDrawer
            assignment={selectedAssignment}
            open={Boolean(selectedAssignmentId)}
            onClose={() => dispatch(setSelectedAssignmentId(null))}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteAssignment}
          />

          {/* Drawer Hồ Sơ Kiến Trúc Kỹ Thuật 3 Buổi Học */}
          <TechArchitectureDrawer
            open={techDrawerOpen}
            onClose={() => dispatch(setTechDrawerOpen(false))}
          />

          {/* Modal Form Thêm Bài Tập Mới (Yêu cầu 2) */}
          <AssignmentFormModal
            open={modalOpen}
            submitting={submitting}
            onCancel={() => setModalOpen(false)}
            onSubmit={handleCreateAssignment}
          />
        </Content>

        {/* Footer Minimalist */}
        <Footer style={{ textAlign: 'center', background: 'transparent', color: '#94a3b8', padding: '24px 32px', fontSize: '13px' }}>
          <div style={{ fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
            Student Deadline Tracker — Hệ Thống Quản Lý Deadline Bài Tập Sinh Viên PTIT
          </div>
          <div>
            Sinh viên: <strong style={{ color: '#0f172a' }}>Nguyễn Tiến Tuấn</strong> • MSV: <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>B23DCCC173</code> • Lớp: <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>RIPT1411-20261-02</code>
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            Môn học: Lập trình Web Nâng Cao — Giảng viên: ThS. Ngô Văn Nhận
          </div>
        </Footer>
      </Layout>
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
