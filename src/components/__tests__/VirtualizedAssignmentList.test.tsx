import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { VirtualizedAssignmentList } from '../VirtualizedAssignmentList';
import type { Assignment } from '../../types/assignment.types';

describe('Component Tests: VirtualizedAssignmentList (react-window)', () => {
  const mock100Items: Assignment[] = Array.from({ length: 100 }, (_, i) => ({
    id: `virt_${i + 1}`,
    title: `Bài tập ảo hóa #${i + 1}`,
    subject: 'LTWNC',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    priority: 'MEDIUM',
    completed: false,
    createdAt: new Date().toISOString(),
  }));

  it('hiển thị thanh thông tin benchmark virtualization với số lượng 100 items', () => {
    renderWithProviders(
      <VirtualizedAssignmentList
        assignments={mock100Items}
        pinnedIds={['virt_1']}
        onToggleStatus={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText(/react-window Virtualized/i)).toBeInTheDocument();
    expect(screen.getByText(/Render ảo hoá danh sách 100 bài tập/i)).toBeInTheDocument();
  });
});
