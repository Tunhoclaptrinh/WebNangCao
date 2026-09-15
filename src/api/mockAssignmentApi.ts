import { Assignment, CreateAssignmentPayload, ApiResponse } from '../types/assignment.types';

// Dữ liệu mẫu ban đầu theo yêu cầu mục 7: "Khi khởi động app, lấy danh sách mẫu ban đầu từ 1 API giả lập"
const INITIAL_MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_001',
    title: 'Bài tập tuần 1 — Thiết kế bộ type TypeScript Module Quản lý Đơn hàng',
    subject: 'LTWNC',
    // Quá hạn 2 ngày trước
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'HIGH',
    completed: false,
    description: 'Xây dựng generic types, type guards và kịch bản demo cho Order, OrderItem, Product, Customer.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'asg_002',
    title: 'Lab 02 — Xây dựng Compound Component Tabs & HOC withAuth',
    subject: 'LTWNC',
    // Còn 18 tiếng nữa đến hạn (Khẩn cấp < 24h)
    dueDate: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    priority: 'URGENT',
    completed: false,
    description: 'Sử dụng Context API để quản lý state activeTab, không prop drilling; viết HOC kiểm tra quyền truy cập.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'asg_003',
    title: 'Bài tập lớn — Chuẩn hoá lược đồ cơ sở dữ liệu BCNF & Viết Stored Procedure',
    subject: 'CSDL',
    // Còn 4 ngày nữa đến hạn
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'HIGH',
    completed: false,
    description: 'Thiết kế lược đồ quan hệ chuẩn 3NF/BCNF, xây dựng trigger kiểm tra ràng buộc toàn vẹn.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'asg_004',
    title: 'Bài tập tuần 3 — Quản lý giỏ hàng Feature-Based với Redux Toolkit',
    subject: 'LTWNC',
    // Còn 6 ngày nữa đến hạn
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'MEDIUM',
    completed: false,
    description: 'Tích hợp createSlice, createAsyncThunk, FakeStore API, voucher giảm giá và checkout modal.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'asg_005',
    title: 'Lab 01 — Cài đặt môi trường phát triển & cấu hình TypeScript Strict Mode',
    subject: 'LTWNC',
    // Đã hoàn thành 3 ngày trước
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'LOW',
    completed: true,
    description: 'Kiểm tra Node.js LTS, Vite, cấu hình tsconfig.json strict: true.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Khởi tạo bộ nhớ tạm (in-memory mock storage)
let assignmentsStorage: Assignment[] = [...INITIAL_MOCK_ASSIGNMENTS];

// Giả lập độ trễ mạng (Network Latency Simulation)
const delay = (ms: number = 700) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAssignmentApi = {
  /**
   * Lấy toàn bộ danh sách bài tập mẫu ban đầu
   */
  async fetchAssignments(): Promise<ApiResponse<Assignment[]>> {
    await delay(700);
    return {
      data: [...assignmentsStorage],
      message: 'Tải danh sách bài tập từ máy chủ thành công',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  },

  /**
   * Thêm mới một bài tập
   */
  async createAssignment(payload: CreateAssignmentPayload): Promise<ApiResponse<Assignment>> {
    await delay(500);
    const newAssignment: Assignment = {
      ...payload,
      id: `asg_${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    assignmentsStorage = [newAssignment, ...assignmentsStorage];
    return {
      data: newAssignment,
      message: 'Thêm bài tập mới thành công',
      timestamp: new Date().toISOString(),
      statusCode: 201,
    };
  },

  /**
   * Cập nhật trạng thái hoàn thành / bỏ hoàn thành
   */
  async toggleAssignmentStatus(id: string): Promise<ApiResponse<Assignment>> {
    await delay(300);
    const index = assignmentsStorage.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Không tìm thấy bài tập với id ${id}`);
    }
    const current = assignmentsStorage[index];
    const updated: Assignment = {
      ...current,
      completed: !current.completed,
      completedAt: !current.completed ? new Date().toISOString() : undefined,
    };
    assignmentsStorage[index] = updated;
    return {
      data: updated,
      message: updated.completed ? 'Đã đánh dấu hoàn thành bài tập' : 'Đã chuyển về trạng thái đang chờ',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  },

  /**
   * Xoá bài tập
   */
  async deleteAssignment(id: string): Promise<ApiResponse<string>> {
    await delay(400);
    const exists = assignmentsStorage.some(a => a.id === id);
    if (!exists) {
      throw new Error(`Không tìm thấy bài tập với id ${id}`);
    }
    assignmentsStorage = assignmentsStorage.filter(a => a.id !== id);
    return {
      data: id,
      message: 'Xoá bài tập thành công',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  },

  /**
   * Khôi phục dữ liệu ban đầu
   */
  async resetToInitialMock(): Promise<ApiResponse<Assignment[]>> {
    await delay(500);
    assignmentsStorage = [...INITIAL_MOCK_ASSIGNMENTS];
    return {
      data: [...assignmentsStorage],
      message: 'Đã khôi phục dữ liệu mẫu ban đầu',
      timestamp: new Date().toISOString(),
      statusCode: 200,
    };
  },
};
