import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { AssignmentFormModal } from '../AssignmentFormModal';

describe('Component Tests: AssignmentFormModal', () => {
  it('hiển thị form khi open={true}', () => {
    renderWithProviders(
      <AssignmentFormModal
        open={true}
        submitting={false}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('Thêm Deadline Bài Tập Mới')).toBeInTheDocument();
    expect(screen.getByText('Tên bài tập / Đề mục')).toBeInTheDocument();
    expect(screen.getByText('Môn học')).toBeInTheDocument();
  });

  it('hiển thị thông báo lỗi xác thực khi tiêu đề để trống', async () => {
    renderWithProviders(
      <AssignmentFormModal
        open={true}
        submitting={false}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    const saveBtn = screen.getByRole('button', { name: /lưu bài tập/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText('Vui lòng nhập tên bài tập')).toBeInTheDocument();
    });
  });

  it('gọi hàm onCancel khi nhấn nút Hủy', () => {
    const handleCancel = jest.fn();
    renderWithProviders(
      <AssignmentFormModal
        open={true}
        submitting={false}
        onCancel={handleCancel}
        onSubmit={jest.fn()}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: /huỷ/i });
    fireEvent.click(cancelBtn);
    expect(handleCancel).toHaveBeenCalled();
  });
});
