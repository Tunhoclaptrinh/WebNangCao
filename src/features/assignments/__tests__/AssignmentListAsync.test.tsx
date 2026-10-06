import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import { AssignmentList } from '../../../components/AssignmentList';
import type { Assignment } from '../../../types/assignment.types';

describe('Async & Mock State Tests: AssignmentList', () => {
  const mockItems: Assignment[] = [
    {
      id: 'async_1',
      title: 'Bài tập Async Mock 1',
      subject: 'LTWNC',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      priority: 'HIGH',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];

  it('hiển thị trạng thái skeleton khi loading=true và danh sách rỗng', () => {
    const { container } = renderWithProviders(
      <AssignmentList
        assignments={[]}
        totalCount={0}
        loading={true}
        onToggleStatus={jest.fn()}
        onDelete={jest.fn()}
        onOpenCreateModal={jest.fn()}
      />
    );

    // Có skeleton placeholder
    expect(container.querySelectorAll('.ant-skeleton').length).toBeGreaterThan(0);
  });

  it('hiển thị danh sách bài tập khi tải dữ liệu thành công', () => {
    renderWithProviders(
      <AssignmentList
        assignments={mockItems}
        totalCount={1}
        loading={false}
        onToggleStatus={jest.fn()}
        onDelete={jest.fn()}
        onOpenCreateModal={jest.fn()}
      />
    );

    expect(screen.getByText('Bài tập Async Mock 1')).toBeInTheDocument();
    expect(screen.getByText('Danh Sách Bài Tập')).toBeInTheDocument();
  });

  it('hiển thị thông báo lỗi và nút Thử lại khi tải thất bại', () => {
    const handleRetry = jest.fn();
    renderWithProviders(
      <AssignmentList
        assignments={[]}
        totalCount={0}
        loading={false}
        error="Lỗi kết nối máy chủ máy chủ giả lập"
        onToggleStatus={jest.fn()}
        onDelete={jest.fn()}
        onOpenCreateModal={jest.fn()}
        onRetry={handleRetry}
      />
    );

    expect(screen.getByText('Không thể tải danh sách bài tập')).toBeInTheDocument();
    expect(screen.getByText('Lỗi kết nối máy chủ máy chủ giả lập')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /thử lại/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalled();
  });
});
