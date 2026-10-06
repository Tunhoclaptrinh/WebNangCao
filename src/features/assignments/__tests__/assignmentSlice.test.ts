import assignmentsReducer, {
  setStatusFilter,
  setSubjectFilter,
  setPriorityFilter,
  setSearchQuery,
  clearFilters,
  setViewMode,
  setSelectedAssignmentId,
  setTechDrawerOpen,
  setBulkAssignments,
  fetchInitialAssignments,
  createNewAssignment,
  toggleAssignmentStatus,
  deleteAssignment,
  selectFilteredAssignments,
  selectAssignmentStats,
  selectSelectedAssignment,
  selectSubjectStats,
  AssignmentState,
} from '../assignmentSlice';
import type { Assignment } from '../../../types/assignment.types';
import type { RootState } from '../../../app/store';

describe('Unit Tests: assignmentsSlice Reducer, Actions & Selectors', () => {
  const initialTestState: AssignmentState = {
    items: [],
    loading: false,
    submitting: false,
    error: null,
    statusFilter: 'ALL',
    subjectFilter: 'ALL',
    priorityFilter: 'ALL',
    searchQuery: '',
    viewMode: 'list',
    selectedAssignmentId: null,
    techDrawerOpen: false,
  };

  const sampleAssignment: Assignment = {
    id: 'test_1',
    title: 'Thực hành Redux Slice',
    subject: 'LTWNC',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    priority: 'HIGH',
    completed: false,
    description: 'Chi tiết bài tập Redux',
    createdAt: new Date().toISOString(),
  };

  it('xử lý bộ lọc trạng thái setStatusFilter', () => {
    const nextState = assignmentsReducer(initialTestState, setStatusFilter('COMPLETED'));
    expect(nextState.statusFilter).toBe('COMPLETED');
  });

  it('xử lý bộ lọc môn học setSubjectFilter', () => {
    const nextState = assignmentsReducer(initialTestState, setSubjectFilter('CSDL'));
    expect(nextState.subjectFilter).toBe('CSDL');
  });

  it('xử lý bộ lọc độ ưu tiên setPriorityFilter', () => {
    const nextState = assignmentsReducer(initialTestState, setPriorityFilter('URGENT'));
    expect(nextState.priorityFilter).toBe('URGENT');
  });

  it('xử lý setViewMode, setSelectedAssignmentId, setTechDrawerOpen', () => {
    let state = assignmentsReducer(initialTestState, setViewMode('board'));
    expect(state.viewMode).toBe('board');

    state = assignmentsReducer(state, setSelectedAssignmentId('test_1'));
    expect(state.selectedAssignmentId).toBe('test_1');

    state = assignmentsReducer(state, setTechDrawerOpen(true));
    expect(state.techDrawerOpen).toBe(true);
  });

  it('xử lý tìm kiếm setSearchQuery và xóa bộ lọc clearFilters', () => {
    let state = assignmentsReducer(initialTestState, setSearchQuery('React Testing'));
    expect(state.searchQuery).toBe('React Testing');

    state = assignmentsReducer(state, clearFilters());
    expect(state.searchQuery).toBe('');
    expect(state.statusFilter).toBe('ALL');
    expect(state.subjectFilter).toBe('ALL');
    expect(state.priorityFilter).toBe('ALL');
  });

  it('xử lý nạp hàng loạt dữ liệu setBulkAssignments (10k stress test)', () => {
    const bulk = [sampleAssignment, { ...sampleAssignment, id: 'test_2' }];
    const state = assignmentsReducer(initialTestState, setBulkAssignments(bulk));
    expect(state.items).toHaveLength(2);
    expect(state.loading).toBe(false);
  });

  it('xử lý extraReducers: fetchInitialAssignments pending, fulfilled, rejected', () => {
    let state = assignmentsReducer(initialTestState, { type: fetchInitialAssignments.pending.type });
    expect(state.loading).toBe(true);

    state = assignmentsReducer(state, { type: fetchInitialAssignments.fulfilled.type, payload: [sampleAssignment] });
    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(1);

    state = assignmentsReducer(state, { type: fetchInitialAssignments.rejected.type, payload: 'Lỗi tải' });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Lỗi tải');
  });

  it('xử lý extraReducers: createNewAssignment pending, fulfilled', () => {
    let state = assignmentsReducer(initialTestState, { type: createNewAssignment.pending.type });
    expect(state.submitting).toBe(true);

    state = assignmentsReducer(state, { type: createNewAssignment.fulfilled.type, payload: sampleAssignment });
    expect(state.submitting).toBe(false);
    expect(state.items).toHaveLength(1);
  });

  it('xử lý extraReducers: toggleAssignmentStatus fulfilled', () => {
    const stateWithItem: AssignmentState = {
      ...initialTestState,
      items: [sampleAssignment],
    };
    const updatedAssignment = { ...sampleAssignment, completed: true };
    const action = { type: toggleAssignmentStatus.fulfilled.type, payload: updatedAssignment };
    const nextState = assignmentsReducer(stateWithItem, action);
    expect(nextState.items[0].completed).toBe(true);
  });

  it('xử lý extraReducers: deleteAssignment fulfilled', () => {
    const stateWithItem: AssignmentState = {
      ...initialTestState,
      items: [sampleAssignment],
      selectedAssignmentId: 'test_1',
    };
    const action = { type: deleteAssignment.fulfilled.type, payload: 'test_1' };
    const nextState = assignmentsReducer(stateWithItem, action);
    expect(nextState.items).toHaveLength(0);
    expect(nextState.selectedAssignmentId).toBeNull();
  });

  describe('Selectors', () => {
    const rootState: RootState = {
      assignments: {
        ...initialTestState,
        items: [
          sampleAssignment,
          {
            id: 'test_2',
            title: 'Học CSDL SQL',
            subject: 'CSDL',
            dueDate: '2026-09-01T12:00:00.000Z', // overdue
            priority: 'URGENT',
            completed: false,
            createdAt: '2026-08-01T12:00:00.000Z',
          },
          {
            id: 'test_3',
            title: 'Hoàn thành bài KTMT',
            subject: 'KTMT',
            dueDate: '2026-10-10T12:00:00.000Z',
            priority: 'LOW',
            completed: true,
            createdAt: '2026-08-01T12:00:00.000Z',
          },
        ],
        selectedAssignmentId: 'test_1',
      },
    };

    it('selectFilteredAssignments lọc đúng theo từ khóa và trạng thái', () => {
      let filtered = selectFilteredAssignments(rootState);
      expect(filtered).toHaveLength(3);

      const searchState: RootState = {
        ...rootState,
        assignments: { ...rootState.assignments, searchQuery: 'CSDL' },
      };
      filtered = selectFilteredAssignments(searchState);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('test_2');

      const completedState: RootState = {
        ...rootState,
        assignments: { ...rootState.assignments, statusFilter: 'COMPLETED' },
      };
      filtered = selectFilteredAssignments(completedState);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('test_3');
    });

    it('selectAssignmentStats tính đúng thống kê', () => {
      const stats = selectAssignmentStats(rootState);
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.overdue).toBe(1);
      expect(stats.pending).toBe(1);
    });

    it('selectSelectedAssignment và selectSubjectStats', () => {
      const selected = selectSelectedAssignment(rootState);
      expect(selected?.id).toBe('test_1');

      const subStats = selectSubjectStats(rootState);
      expect(subStats.LTWNC).toBe(1);
      expect(subStats.CSDL).toBe(1);
      expect(subStats.KTMT).toBe(1);
    });
  });
});
