/**
 * useAuth.ts
 * Giả lập hook xác thực người dùng.
 * Trong thực tế sẽ lấy từ Redux store, JWT, hoặc React Query.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
}

/**
 * useAuth — Giả lập trạng thái đăng nhập.
 * Thay đổi `mockUser` để test các trường hợp khác nhau.
 */
export function useAuth(): AuthState {
  // 👇 Thay null để test trường hợp chưa đăng nhập
  const mockUser: AuthUser | null = {
    id: "u-001",
    name: "Nguyễn Văn Tuấn",
    email: "tuan@ptit.edu.vn",
    role: "user",
  };

  return {
    user: mockUser,
    isLoading: false,
  };
}
