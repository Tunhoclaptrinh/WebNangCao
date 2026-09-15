import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Assignment, 
  AssignmentStatusFilter, 
  CreateAssignmentPayload, 
  Priority, 
  SubjectCode,
  isCompletedAssignment,
  isOverdueAssignment 
} from '../../types/assignment.types';
import { mockAssignmentApi } from '../../api/mockAssignmentApi';
import type { RootState } from '../../app/store';

export interface AssignmentState {
  items: Assignment[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  // Bộ lọc
  statusFilter: AssignmentStatusFilter;
  subjectFilter: SubjectCode | 'ALL';
  priorityFilter: Priority | 'ALL';
  searchQuery: string;
}

const initialState: AssignmentState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  statusFilter: 'ALL',
  subjectFilter: 'ALL',
  priorityFilter: 'ALL',
  searchQuery: '',
};

// -------------------------------------------------------------
// Async Thunks (createAsyncThunk) theo yêu cầu Buổi 3
// -------------------------------------------------------------

export const fetchInitialAssignments = createAsyncThunk<
  Assignment[], 
  void, 
  { rejectValue: string }
>(
  'assignments/fetchInitial',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockAssignmentApi.fetchAssignments();
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Không thể tải danh sách bài tập');
    }
  }
);

export const createNewAssignment = createAsyncThunk<
  Assignment, 
  CreateAssignmentPayload, 
  { rejectValue: string }
>(
  'assignments/create',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await mockAssignmentApi.createAssignment(payload);
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Thêm bài tập thất bại');
    }
  }
);

export const toggleAssignmentStatus = createAsyncThunk<
  Assignment, 
  string, 
  { rejectValue: string }
>(
  'assignments/toggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await mockAssignmentApi.toggleAssignmentStatus(id);
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Cập nhật trạng thái thất bại');
    }
  }
);

export const deleteAssignment = createAsyncThunk<
  string, 
  string, 
  { rejectValue: string }
>(
  'assignments/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await mockAssignmentApi.deleteAssignment(id);
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Xoá bài tập thất bại');
    }
  }
);

export const resetAssignmentsData = createAsyncThunk<
  Assignment[], 
  void, 
  { rejectValue: string }
>(
  'assignments/resetData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockAssignmentApi.resetToInitialMock();
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Khôi phục dữ liệu thất bại');
    }
  }
);

// -------------------------------------------------------------
// Slice Definition
// -------------------------------------------------------------

export const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<AssignmentStatusFilter>) => {
      state.statusFilter = action.payload;
    },
    setSubjectFilter: (state, action: PayloadAction<SubjectCode | 'ALL'>) => {
      state.subjectFilter = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<Priority | 'ALL'>) => {
      state.priorityFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.statusFilter = 'ALL';
      state.subjectFilter = 'ALL';
      state.priorityFilter = 'ALL';
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    // fetchInitialAssignments
    builder
      .addCase(fetchInitialAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitialAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInitialAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định khi tải bài tập';
      });

    // createNewAssignment
    builder
      .addCase(createNewAssignment.pending, (state) => {
        state.submitting = true;
      })
      .addCase(createNewAssignment.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(action.payload);
      })
      .addCase(createNewAssignment.rejected, (state) => {
        state.submitting = false;
      });

    // toggleAssignmentStatus
    builder.addCase(toggleAssignmentStatus.fulfilled, (state, action) => {
      const updated = action.payload;
      const index = state.items.findIndex(a => a.id === updated.id);
      if (index !== -1) {
        state.items[index] = updated;
      }
    });

    // deleteAssignment
    builder.addCase(deleteAssignment.fulfilled, (state, action) => {
      const deletedId = action.payload;
      state.items = state.items.filter(a => a.id !== deletedId);
    });

    // resetAssignmentsData
    builder.addCase(resetAssignmentsData.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const {
  setStatusFilter,
  setSubjectFilter,
  setPriorityFilter,
  setSearchQuery,
  clearFilters,
} = assignmentSlice.actions;

// -------------------------------------------------------------
// Selectors (Sử dụng Type Guards để phân loại chính xác)
// -------------------------------------------------------------

export const selectAssignmentsState = (state: RootState) => state.assignments;
export const selectAllAssignments = (state: RootState) => state.assignments.items;

export const selectFilteredAssignments = (state: RootState): Assignment[] => {
  const { items, statusFilter, subjectFilter, priorityFilter, searchQuery } = state.assignments;
  const now = new Date();

  return items.filter((item) => {
    // 1. Lọc theo trạng thái
    if (statusFilter === 'COMPLETED') {
      if (!isCompletedAssignment(item)) return false;
    } else if (statusFilter === 'OVERDUE') {
      if (!isOverdueAssignment(item, now)) return false;
    } else if (statusFilter === 'PENDING') {
      if (isCompletedAssignment(item) || isOverdueAssignment(item, now)) return false;
    }

    // 2. Lọc theo môn học
    if (subjectFilter !== 'ALL' && item.subject !== subjectFilter) {
      return false;
    }

    // 3. Lọc theo độ ưu tiên
    if (priorityFilter !== 'ALL' && item.priority !== priorityFilter) {
      return false;
    }

    // 4. Lọc theo từ khóa tìm kiếm (tên bài tập hoặc mô tả)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchDesc = item.description ? item.description.toLowerCase().includes(query) : false;
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });
};

export const selectAssignmentStats = (state: RootState) => {
  const items = state.assignments.items;
  const now = new Date();

  let completedCount = 0;
  let overdueCount = 0;
  let pendingCount = 0;

  for (const item of items) {
    if (isCompletedAssignment(item)) {
      completedCount++;
    } else if (isOverdueAssignment(item, now)) {
      overdueCount++;
    } else {
      pendingCount++;
    }
  }

  return {
    total: items.length,
    completed: completedCount,
    overdue: overdueCount,
    pending: pendingCount,
    completionRate: items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0,
  };
};

export default assignmentSlice.reducer;
