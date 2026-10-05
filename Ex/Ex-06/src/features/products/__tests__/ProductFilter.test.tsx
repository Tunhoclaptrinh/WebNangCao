import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { ProductFilter } from '../ProductFilter.tsx';
import { renderWithProviders } from '../../../test-utils.tsx';

describe('ProductFilter Component Unit/Integration Tests', () => {
  it('hiển thị đầy đủ ô tìm kiếm, dropdown sắp xếp và các radio danh mục', () => {
    renderWithProviders(<ProductFilter />);

    expect(screen.getByPlaceholderText(/tìm kiếm sản phẩm/i)).toBeInTheDocument();
    expect(screen.getByText('Tất cả')).toBeInTheDocument();
    expect(screen.getByText('Màn hình')).toBeInTheDocument();
    expect(screen.getByText('Bàn phím')).toBeInTheDocument();
  });

  it('nhập từ khóa tìm kiếm kích hoạt setSearchQuery trong Redux Store', () => {
    const { store } = renderWithProviders(<ProductFilter />);

    const input = screen.getByPlaceholderText(/tìm kiếm sản phẩm/i);
    fireEvent.change(input, { target: { value: 'Keychron' } });

    expect(store.getState().products.searchQuery).toBe('Keychron');
  });

  it('click chọn danh mục kích hoạt setSelectedCategory trong Redux Store', () => {
    const { store } = renderWithProviders(<ProductFilter />);

    const keyboardRadio = screen.getByLabelText('Bàn phím');
    fireEvent.click(keyboardRadio);

    expect(store.getState().products.selectedCategory).toBe('Bàn phím');
  });

  it('hiển thị nút "Đặt lại" khi bộ lọc đang hoạt động và click sẽ hoàn tác về mặc định', () => {
    const { store } = renderWithProviders(<ProductFilter />, {
      preloadedState: {
        products: {
          items: [],
          status: 'idle',
          error: null,
          selectedCategory: 'Chuột',
          searchQuery: 'Master',
          sortBy: 'price-desc',
        },
      },
    });

    const resetBtn = screen.getByRole('button', { name: /đặt lại/i });
    expect(resetBtn).toBeInTheDocument();

    fireEvent.click(resetBtn);

    expect(store.getState().products.selectedCategory).toBe('Tất cả');
    expect(store.getState().products.searchQuery).toBe('');
    expect(store.getState().products.sortBy).toBe('default');
  });
});
