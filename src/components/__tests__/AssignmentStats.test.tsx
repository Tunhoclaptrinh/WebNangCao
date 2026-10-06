import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { AssignmentStats } from '../AssignmentStats';
import type { Assignment } from '../../types/assignment.types';

describe('Component Tests: AssignmentStats (Lazy Loaded Metric Dashboard)', () => {
  const mockAssignments: Assignment[] = [
    {
      id: 'stat_1',
      title: 'Đã hoàn thành',
      subject: 'LTWNC',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      priority: 'HIGH',
      completed: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'stat_2',
      title: 'Đang làm',
      subject: 'CSDL',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      priority: 'MEDIUM',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];

  it('hiển thị đầy đủ 4 thẻ thống kê tổng quan và tỷ lệ hoàn thành', () => {
    renderWithProviders(
      <AssignmentStats
        assignments={mockAssignments}
        pinnedIds={['stat_1']}
      />
    );

    expect(screen.getByText('Tổng bài tập')).toBeInTheDocument();
    expect(screen.getByText('Đã hoàn thành')).toBeInTheDocument();
    expect(screen.getByText('Đang thực hiện')).toBeInTheDocument();
    expect(screen.getByText('Quá hạn nộp')).toBeInTheDocument();
    expect(screen.getAllByText('50%').length).toBeGreaterThanOrEqual(1);
  });
});
