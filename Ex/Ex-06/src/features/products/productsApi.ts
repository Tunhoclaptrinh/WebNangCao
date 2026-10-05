import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { MOCK_PRODUCTS } from './mockProductData.ts';
import type { Product } from './productTypes.ts';

// RTK Query API Slice — PHẦN ĐIỂM CỘNG KỸ THUẬT
// Thay thế việc viết boilerplate createAsyncThunk + extraReducers thủ công
// Tự động: Quản lý cache, tự sinh hooks (useGetProductsQuery), deduping requests
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    // Query lấy danh sách toàn bộ sản phẩm
    getProducts: builder.query<Product[], { shouldFail?: boolean } | void>({
      async queryFn(arg) {
        try {
          // Giả lập độ trễ mạng 600ms
          await new Promise((resolve) => setTimeout(resolve, 600));

          if (arg && arg.shouldFail) {
            return {
              error: {
                status: 500,
                data: 'RTK Query Error: Không thể kết nối tới Mock Data Server!',
              },
            };
          }

          return { data: MOCK_PRODUCTS };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              data: error instanceof Error ? error.message : 'Lỗi không xác định',
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // Query lấy chi tiết 1 sản phẩm theo ID
    getProductById: builder.query<Product, string>({
      async queryFn(id) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const found = MOCK_PRODUCTS.find((p) => p.id === id);
        if (!found) {
          return {
            error: {
              status: 404,
              data: `Không tìm thấy sản phẩm có mã ${id}`,
            },
          };
        }
        return { data: found };
      },
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
