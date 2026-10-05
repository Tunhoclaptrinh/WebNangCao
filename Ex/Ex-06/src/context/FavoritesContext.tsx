import { createContext, useContext, useReducer, useMemo, useEffect, type ReactNode } from 'react';
import type { Product } from '../features/products/productTypes.ts';
import type { FavoritesState } from '../types/favoriteTypes.ts';

// Actions cho useReducer
type Action =
  | { type: 'ADD_FAVORITE'; payload: Product }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: Product }
  | { type: 'CLEAR_FAVORITES' };

const STORAGE_KEY = 'ptit-context-favorites-storage';

// Khởi tạo state từ localStorage
const getInitialState = (): { favorites: Product[] } => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { favorites: JSON.parse(saved) } : { favorites: [] };
  } catch {
    return { favorites: [] };
  }
};

function favoritesReducer(state: { favorites: Product[] }, action: Action): { favorites: Product[] } {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      if (state.favorites.some((item) => item.id === action.payload.id)) {
        return state;
      }
      return { favorites: [action.payload, ...state.favorites] };
    }
    case 'REMOVE_FAVORITE': {
      return {
        favorites: state.favorites.filter((item) => item.id !== action.payload),
      };
    }
    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.some((item) => item.id === action.payload.id);
      return {
        favorites: exists
          ? state.favorites.filter((item) => item.id !== action.payload.id)
          : [action.payload, ...state.favorites],
      };
    }
    case 'CLEAR_FAVORITES': {
      return { favorites: [] };
    }
    default:
      return state;
  }
}

const FavoritesContext = createContext<FavoritesState | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, undefined, getInitialState);

  // Lưu tự động vào localStorage khi state thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites));
    } catch {
      // Bỏ qua lỗi quota storage nếu có
    }
  }, [state.favorites]);

  // Tối ưu hoá bằng useMemo để tránh re-render thừa toàn bộ component con (Yêu cầu đề bài Buổi 4)
  const contextValue = useMemo<FavoritesState>(() => {
    return {
      favorites: state.favorites,
      addFavorite: (product: Product) => dispatch({ type: 'ADD_FAVORITE', payload: product }),
      removeFavorite: (productId: string) => dispatch({ type: 'REMOVE_FAVORITE', payload: productId }),
      toggleFavorite: (product: Product) => dispatch({ type: 'TOGGLE_FAVORITE', payload: product }),
      isFavorite: (productId: string) => state.favorites.some((item) => item.id === productId),
      clearFavorites: () => dispatch({ type: 'CLEAR_FAVORITES' }),
    };
  }, [state.favorites]);

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook truy cập Context nâng cao
export function useFavoritesContext(): FavoritesState {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
}
