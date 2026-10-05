import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import cartReducer from '../features/cart/cartSlice.ts';
import { productsApi } from '../features/products/productsApi.ts';
import productsReducer from '../features/products/productsSlice.ts';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  // Bổ sung RTK Query middleware cho caching, invalidation, polling...
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
  devTools: true,
});

// Kích hoạt tính năng refetchOnFocus và refetchOnReconnect của RTK Query
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
