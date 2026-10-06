import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { AssignmentCard } from '../AssignmentCard';
import type { Assignment } from '../../types/assignment.types';

describe('Component Tests: AssignmentCard (React Testing Library)', () => {
  const mockAssignment: Assignment = {
    id: 'card_test_1',
    title: 'Xây dựng Jest Unit Tests',
    subject: 'LTWNC',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days ahead
    priority: 'HIGH',
    completed: false,
    description: 'Viết bộ test case cho các component chính',
    createdAt: new Date().toISOString(),
  };

  it('hiển thị đầy đủ thông tin bài tập (tiêu đề, môn học, tag)', () => {
    renderWithProviders(
      <AssignmentCard
        assignment={mockAssignment}
        onToggleStatus={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Xây dựng Jest Unit Tests')).toBeInTheDocument();
    expect(screen.getByText('Lập trình Web Nâng Cao')).toBeInTheDocument();
    expect(screen.getByText('Ưu tiên Cao')).toBeInTheDocument();
  });

  it('gọi hàm onToggleStatus khi người dùng bấm nút hoàn thành', () => {
    const handleToggle = jest.fn();
    renderWithProviders(
      <AssignmentCard
        assignment={mockAssignment}
        onToggleStatus={handleToggle}
        onDelete={jest.fn()}
      />
    );

    const toggleBtn = screen.getByRole('button', { name: /chưa hoàn thành/i });
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledWith('card_test_1');
  });

  it('hiển thị tag "Đã ghim" và gọi onTogglePin khi bấm nút ghim', () => {
    const handlePin = jest.fn();
    renderWithProviders(
      <AssignmentCard
        assignment={mockAssignment}
        isPinned={false}
        onToggleStatus={jest.fn()}
        onDelete={jest.fn()}
        onTogglePin={handlePin}
      />
    );

    const pinBtn = screen.getByRole('button', { name: /^ghim$/i });
    fireEvent.click(pinBtn);
    expect(handlePin).toHaveBeenCalledWith('card_test_1');
  });

  it('gọi onSelect khi click vào thẻ bài tập', () => {
    const handleSelect = jest.fn();
    renderWithProviders(
      <AssignmentCard
        assignment={mockAssignment}
        onToggleStatus={jest.fn()}
        onDelete={jest.fn()}
        onSelect={handleSelect}
      />
    );

    const titleElement = screen.getByText('Xây dựng Jest Unit Tests');
    fireEvent.click(titleElement);
    expect(handleSelect).toHaveBeenCalledWith('card_test_1');
  });
});
