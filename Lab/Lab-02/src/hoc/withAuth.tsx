/**
 * withAuth.tsx — Bài Thực Hành 1/3
 * Higher-Order Component (HOC) bảo vệ route bằng xác thực.
 *
 * HOC nhận vào một Component generic <P> và trả về component mới.
 * Component mới tự động kiểm tra đăng nhập trước khi render Component gốc.
 *
 * Pattern: HOC (Higher-Order Component)
 * Khi nào dùng: Cần bọc nhiều component bằng 1 logic chung (auth, logging, tracking)
 */

import { type ComponentType } from "react";
import { useAuth } from "../hooks/useAuth";

// ─── Component hiển thị khi chưa đăng nhập ───
function NotAuthenticated() {
  return (
    <div className="auth-guard">
      <div className="auth-guard__icon">🔒</div>
      <h2 className="auth-guard__title">Yêu cầu đăng nhập</h2>
      <p className="auth-guard__desc">
        Bạn cần đăng nhập để truy cập trang này.
      </p>
      <a className="auth-guard__btn" href="/login">
        Đăng nhập ngay →
      </a>
    </div>
  );
}

// ─── Loading state ───
function AuthLoading() {
  return (
    <div className="auth-guard">
      <div className="auth-guard__spinner" />
      <p>Đang kiểm tra quyền truy cập...</p>
    </div>
  );
}

/**
 * withAuth<P> — HOC kiểm tra đăng nhập
 *
 * @param Component - Component cần bảo vệ
 * @returns Component mới với auth guard
 *
 * @example
 * ```tsx
 * const ProtectedDashboard = withAuth(DashboardPage);
 * // <ProtectedDashboard /> sẽ tự kiểm tra đăng nhập
 * ```
 */
export function withAuth<P extends object>(Component: ComponentType<P>) {
  // Đặt tên displayName để dễ debug trong React DevTools
  const displayName = Component.displayName ?? Component.name ?? "Component";

  function AuthGuard(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <AuthLoading />;
    if (!user) return <NotAuthenticated />;

    // Đã đăng nhập → render component gốc với đầy đủ props
    return <Component {...props} />;
  }

  AuthGuard.displayName = `withAuth(${displayName})`;
  return AuthGuard;
}
