export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  specs: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  imageColor: string;
  badge?: string;
}

export type FetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ProductsState {
  items: Product[];
  status: FetchStatus;
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'rating';
}
