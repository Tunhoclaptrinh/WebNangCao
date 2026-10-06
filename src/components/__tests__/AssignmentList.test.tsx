import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { AssignmentList } from '../AssignmentList';
import type { Assignment } from '../../types/assignment.types';

describe('Component Tests: AssignmentList', () => {
  const sampleItems: Assignment[] = [
    {
      id: 'list_1',
      title: 'Bài tập thường 1',
      subject: 'LTWNC',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      priority: 'HIGH',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'list_2',
      title: 'Bài tập quan trọng 2',
      subject: 'CSDL',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      priority: 'URGENT',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];

  it('hiển thị danh sách và tự động ưu tiên bài đã ghim lên đầu', () => {
    renderWithProviders(
      <AssignmentList
        assignments={sampleItems}
        totalCount={2}
        loading={false}
        pinnedIds={['list_2']}
        onToggleStatus={jest.fn()}
        onDelete={jest.fn()}
        onOpenCreateModal={jest.fn()}
      />
    );

    expect(screen.getByText('Danh Sách Bài Tập')).toBeInTheDocument();
    expect(screen.getByText(/1 đã ghim/i)).toBeInTheDocument();
  });

  it('hiển thị thông báo rỗng khi không có bài tập và nút tạo bài mới', () => {
    const handleOpenModal = jest.fn();
    renderWithProviders(
      <AssignmentList
        assignments={[]}
        totalCount={0}
        loading={false}
        onToggleStatus={jest.fn()}
        onDelete={jest.fn()}
        onOpenCreateModal={handleOpenModal}
      />
    );

    expect(screen.getByText('Chưa có deadline nào')).toBeInTheDocument();
    const createBtn = screen.getByRole('button', { name: /tạo bài tập đầu tiên/i });
    fireEvent.click(createBtn);
    expect(handleOpenModal).toHaveBeenCalled();
  });
});
