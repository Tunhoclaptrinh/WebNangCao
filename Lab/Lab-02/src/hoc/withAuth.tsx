import { type ComponentType } from 'react';
import { Button, Result, Spin } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth.ts';

// ─── Component hiển thị khi chưa đăng nhập ───
function NotAuthenticated() {
  return (
    <Result
      status="403"
      icon={<LockOutlined style={{ color: '#faad14' }} />}
      title="Yêu cầu đăng nhập"
      subTitle="Bạn cần đăng nhập để xem nội dung được bảo vệ bởi withAuth HOC."
      extra={
        <Button type="primary" href="#login">
          Đăng nhập ngay
        </Button>
      }
    />
  );
}

// ─── Loading state ───
function AuthLoading() {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <Spin size="large" />
      <p style={{ marginTop: 12, color: '#6b7280' }}>Đang kiểm tra quyền truy cập...</p>
    </div>
  );
}

export function withAuth<P extends object>(Component: ComponentType<P>) {
  const displayName = Component.displayName ?? Component.name ?? 'Component';

  function AuthGuard(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <AuthLoading />;
    if (!user) return <NotAuthenticated />;

    return <Component {...props} />;
  }

  AuthGuard.displayName = `withAuth(${displayName})`;
  return AuthGuard;
}
