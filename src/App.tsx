import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { Layout, App as AntApp, message, Spin } from 'antd';
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
  setBulkAssignments,
  selectFilteredAssignments,
  selectAssignmentStats,
  selectAssignmentsState,
  selectSelectedAssignment,
  selectSubjectStats,
} from './features/assignments/assignmentSlice';
import { CreateAssignmentPayload, SUBJECT_METAS } from './types/assignment.types';
import { usePinStore } from './store/usePinStore';
import { useTheme } from './context/ThemeContext';
import { generate10kAssignments } from './utils/generate10kAssignments';

// Modular Components
import {
  Sidebar,
  WorkspaceHeader,
  FilterGroup,
  AssignmentList,
  KanbanBoard,
  AssignmentDetailDrawer,
  AssignmentFormModal,
} from './components';

// Kỹ thuật tối ưu #4: Code Splitting với React.lazy & Suspense
const LazyAssignmentStats = lazy(() => import('./components/AssignmentStats/AssignmentStats'));

const { Content, Footer } = Layout;

const DeadlineTrackerContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Zustand Store cho Pinned Assignments (Phần A - Tách biệt hoàn toàn khỏi Redux)
  const pinnedIds = usePinStore((state) => state.pinnedIds);
  const togglePin = usePinStore((state) => state.togglePin);

  // Theme Context (Phần A - useMemo độc lập)
  const { isDark } = useTheme();

  const {
    loading,
    submitting,
    error,
    statusFilter,
    subjectFilter,
    priorityFilter,
    searchQuery,
    items,
    viewMode,
    selectedAssignmentId,
  } = useAppSelector(selectAssignmentsState);

  const filteredAssignments = useAppSelector(selectFilteredAssignments);
  const stats = useAppSelector(selectAssignmentStats);
  const selectedAssignment = useAppSelector(selectSelectedAssignment);
  const subjectCounts = useAppSelector(selectSubjectStats);

  // Khởi động app: tải dữ liệu mẫu từ mock API
  useEffect(() => {
    dispatch(fetchInitialAssignments());
  }, [dispatch]);

  // Kỹ thuật tối ưu #1: useCallback cho các handler props
  const handleCreateAssignment = useCallback(async (payload: CreateAssignmentPayload) => {
    try {
      await dispatch(createNewAssignment(payload)).unwrap();
      messageApi.success('Đã thêm bài tập mới vào danh sách theo dõi');
      setModalOpen(false);
    } catch (err) {
      messageApi.error(`Thêm bài tập thất bại: ${err}`);
    }
  }, [dispatch, messageApi]);

  const handleToggleStatus = useCallback(async (id: string) => {
    try {
      const updated = await dispatch(toggleAssignmentStatus(id)).unwrap();
      if (updated.completed) {
        messageApi.success('Đã hoàn thành bài tập');
      } else {
        messageApi.info('Đã chuyển bài tập về trạng thái đang chờ');
      }
    } catch (err) {
      messageApi.error(`Cập nhật thất bại: ${err}`);
    }
  }, [dispatch, messageApi]);

  const handleDeleteAssignment = useCallback(async (id: string) => {
    try {
      await dispatch(deleteAssignment(id)).unwrap();
      messageApi.success('Đã xoá bài tập khỏi danh sách');
    } catch (err) {
      messageApi.error(`Xoá bài tập thất bại: ${err}`);
    }
  }, [dispatch, messageApi]);

  const handleResetMockData = useCallback(async () => {
    try {
      await dispatch(resetAssignmentsData()).unwrap();
      messageApi.success('Đã khôi phục dữ liệu mẫu ban đầu từ API giả lập');
    } catch (err) {
      messageApi.error(`Khôi phục dữ liệu thất bại: ${err}`);
    }
  }, [dispatch, messageApi]);

  // Sinh 10.000 bài tập mẫu phục vụ stress test và benchmark (Phần B)
  const handleGenerate10k = useCallback(() => {
    const sample10k = generate10kAssignments(10000);
    dispatch(setBulkAssignments(sample10k));
    messageApi.success('Đã nạp thành công 10.000 bài tập mẫu! Chế độ Virtualization tự động kích hoạt.');
  }, [dispatch, messageApi]);

  const handleTogglePin = useCallback((id: string) => {
    togglePin(id);
    const willBePinned = !pinnedIds.includes(id);
    if (willBePinned) {
      messageApi.info('Đã ghim bài tập lên đầu danh sách');
    } else {
      messageApi.info('Đã bỏ ghim bài tập');
    }
  }, [togglePin, pinnedIds, messageApi]);

  const handleRetryFetch = useCallback(() => {
    dispatch(fetchInitialAssignments());
  }, [dispatch]);

  // Xác định tiêu đề hiển thị theo bộ lọc hiện tại
  const getViewTitle = useCallback(() => {
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
  }, [subjectFilter, statusFilter]);

  const isFiltered = statusFilter !== 'ALL' || subjectFilter !== 'ALL' || priorityFilter !== 'ALL' || searchQuery.trim() !== '';

  return (
    <Layout style={{ minHeight: '100vh', background: isDark ? '#0f172a' : '#f8fafc', display: 'flex', flexDirection: 'row' }}>
      {contextHolder}

      {/* 1. Sidebar Điều Hướng */}
      <Sidebar
        statusFilter={statusFilter}
        subjectFilter={subjectFilter}
        stats={stats}
        subjectCounts={subjectCounts}
        loading={loading}
        onStatusSelect={(s) => dispatch(setStatusFilter(s))}
        onSubjectSelect={(sub) => dispatch(setSubjectFilter(sub))}
        onResetMockData={handleResetMockData}
      />

      {/* 2. Main Workspace Layout */}
      <Layout style={{ background: isDark ? '#0f172a' : '#f8fafc', minHeight: '100vh', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Workspace Top Header (Sticky Bar) */}
        <WorkspaceHeader
          title={getViewTitle()}
          count={filteredAssignments.length}
          isFiltered={isFiltered}
          viewMode={viewMode}
          loading={loading}
          showStats={showStats}
          onClearFilters={() => dispatch(clearFilters())}
          onViewModeChange={(mode) => dispatch(setViewMode(mode))}
          onResetMockData={handleResetMockData}
          onOpenCreateModal={() => setModalOpen(true)}
          onGenerate10k={handleGenerate10k}
          onToggleStats={() => setShowStats((prev) => !prev)}
        />

        {/* Workspace Main Content */}
        <Content style={{ padding: '20px 24px', width: '100%', flex: 1 }}>
          {/* Lazy Loaded Stats Component */}
          {showStats && (
            <Suspense fallback={
              <div style={{ textAlign: 'center', padding: '24px', background: isDark ? '#1e293b' : '#ffffff', borderRadius: '4px', marginBottom: '16px' }}>
                <Spin tip="Đang tải dữ liệu thống kê chi tiết (Lazy Chunk)..." />
              </div>
            }>
              <LazyAssignmentStats
                assignments={filteredAssignments}
                pinnedIds={pinnedIds}
              />
            </Suspense>
          )}

          {viewMode === 'list' ? (
            <>
              {/* Compound Component Pattern: FilterGroup */}
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
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <FilterGroup.Search />
                  <FilterGroup.Status />
                  <FilterGroup.Subject />
                  <FilterGroup.Priority />
                  <FilterGroup.Actions />
                </div>
              </FilterGroup>

              {/* Danh sách bài tập (Zustand Pin + React.memo + Virtualization) */}
              <AssignmentList
                assignments={filteredAssignments}
                totalCount={items.length}
                loading={loading}
                error={error}
                pinnedIds={pinnedIds}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteAssignment}
                onOpenCreateModal={() => setModalOpen(true)}
                onSelectAssignment={(id) => dispatch(setSelectedAssignmentId(id))}
                onTogglePin={handleTogglePin}
                onRetry={handleRetryFetch}
              />
            </>
          ) : (
            <>
              {/* Chế độ Kanban Board */}
              <KanbanBoard
                assignments={filteredAssignments}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteAssignment}
                onSelectAssignment={(id) => dispatch(setSelectedAssignmentId(id))}
              />
            </>
          )}

          {/* Side-Peek Detail Drawer */}
          <AssignmentDetailDrawer
            assignment={selectedAssignment}
            open={Boolean(selectedAssignmentId)}
            onClose={() => dispatch(setSelectedAssignmentId(null))}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteAssignment}
          />

          {/* Modal Form Thêm Bài Tập Mới */}
          <AssignmentFormModal
            open={modalOpen}
            submitting={submitting}
            onCancel={() => setModalOpen(false)}
            onSubmit={handleCreateAssignment}
          />
        </Content>

        {/* Footer Minimalist */}
        <Footer style={{ textAlign: 'center', background: 'transparent', color: '#94a3b8', padding: '24px 32px', fontSize: '13px' }}>
          <div style={{ fontWeight: 600, color: isDark ? '#94a3b8' : '#475569', marginBottom: '4px' }}>
            Student Deadline Tracker — Hệ Thống Quản Lý Deadline Bài Tập Sinh Viên PTIT (Lab 02)
          </div>
          <div>
            Sinh viên: <strong style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Nguyễn Tiến Tuấn</strong> • MSV: <code style={{ background: isDark ? '#334155' : '#e2e8f0', color: isDark ? '#f1f5f9' : '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>B23DCCC173</code> • Lớp: <code style={{ background: isDark ? '#334155' : '#e2e8f0', color: isDark ? '#f1f5f9' : '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>RIPT1411-20261-02</code>
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
    <AntApp>
      <DeadlineTrackerContent />
    </AntApp>
  );
}

export default App;
