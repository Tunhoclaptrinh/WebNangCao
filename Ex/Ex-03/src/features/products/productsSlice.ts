import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { MOCK_PRODUCTS } from './mockProductData.ts';
import type { Product, ProductsState } from './productTypes.ts';

export interface FetchProductsArgs {
  shouldFail?: boolean;
  delayMs?: number;
}

// Async Thunk: Lấy danh sách sản phẩm từ API giả lập
export const fetchProductsAsync = createAsyncThunk<
  Product[],
  FetchProductsArgs | undefined
>('products/fetchProducts', async (params, { rejectWithValue }) => {
  const delay = params?.delayMs ?? 750;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (params?.shouldFail) {
    return rejectWithValue('Lỗi 503 Service Unavailable: Không thể kết nối tới máy chủ sản phẩm!');
  }

  return MOCK_PRODUCTS;
});

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  selectedCategory: 'Tất cả',
  searchQuery: '',
  sortBy: 'default',
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSortBy(
      state,
      action: PayloadAction<'default' | 'price-asc' | 'price-desc' | 'rating'>
    ) {
      state.sortBy = action.payload;
    },
    resetProductsFilter(state) {
      state.selectedCategory = 'Tất cả';
      state.searchQuery = '';
      state.sortBy = 'default';
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Pending: Bắt đầu gửi request
      .addCase(fetchProductsAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // 2. Fulfilled: Lấy dữ liệu thành công
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      // 3. Rejected: Xảy ra lỗi
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Đã xảy ra lỗi không xác định khi tải sản phẩm.';
      });
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
  setSortBy,
  resetProductsFilter,
} = productsSlice.actions;

export default productsSlice.reducer;
