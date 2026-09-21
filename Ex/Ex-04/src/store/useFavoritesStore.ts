import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FavoritesState } from '../types/favoriteTypes.ts';
import type { Product } from '../features/products/productTypes.ts';

/**
 * Zustand Store riêng biệt cho tính năng "Sản phẩm yêu thích" (Favorites / Wishlist)
 * - Tách biệt hoàn toàn khỏi cartStore/productsStore
 * - Tích hợp persist middleware lưu tự động vào localStorage
 * - Không cần Provider bọc ngoài, subscribe bằng selector linh hoạt
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      // Thêm sản phẩm vào danh sách yêu thích nếu chưa có
      addFavorite: (product: Product) => {
        const { favorites } = get();
        const exists = favorites.some((item) => item.id === product.id);
        if (!exists) {
          set({ favorites: [product, ...favorites] });
        }
      },

      // Bỏ sản phẩm khỏi danh sách yêu thích theo id
      removeFavorite: (productId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== productId),
        }));
      },

      // Toggle: Thêm nếu chưa có, xoá nếu đã có
      toggleFavorite: (product: Product) => {
        const { favorites } = get();
        const exists = favorites.some((item) => item.id === product.id);
        if (exists) {
          set({
            favorites: favorites.filter((item) => item.id !== product.id),
          });
        } else {
          set({
            favorites: [product, ...favorites],
          });
        }
      },

      // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
      isFavorite: (productId: string) => {
        return get().favorites.some((item) => item.id === productId);
      },

      // Xoá toàn bộ danh sách yêu thích
      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'ptit-favorites-storage', // Key lưu trữ trong localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
