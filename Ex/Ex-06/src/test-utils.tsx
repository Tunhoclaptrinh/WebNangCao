import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { App as AntApp } from 'antd';
import { cartSlice } from './features/cart/cartSlice.ts';
import { productsSlice } from './features/products/productsSlice.ts';
import { productsApi } from './features/products/productsApi.ts';
import { FavoritesProvider } from './context/FavoritesContext.tsx';
import type { CartState } from './features/cart/cartTypes.ts';
import type { ProductsState } from './features/products/productTypes.ts';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: {
    cart?: Partial<CartState>;
    products?: Partial<ProductsState>;
  };
  store?: ReturnType<typeof createTestStore>;
}

export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      cart: cartSlice.reducer,
      products: productsSlice.reducer,
      [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
    preloadedState,
  });
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <AntApp>
          <FavoritesProvider>{children}</FavoritesProvider>
        </AntApp>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
