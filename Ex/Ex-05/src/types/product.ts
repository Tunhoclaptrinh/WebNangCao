export type ProductCategory =
  | 'Laptop'
  | 'Bàn Phím Cơ'
  | 'Chuột Gaming'
  | 'Màn Hình'
  | 'Tai Nghe & Âm Thanh'
  | 'Linh Kiện PC';

export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice: number;
  stock: number;
  rating: number;
  status: ProductStatus;
  salesCount: number;
  lastUpdated: string;
  avatarSeed: number;
}

export type SortOption =
  | 'default'
  | 'price_asc'
  | 'price_desc'
  | 'stock_asc'
  | 'stock_desc'
  | 'rating_desc'
  | 'sales_desc';

export interface ProductFilter {
  search: string;
  category: ProductCategory | 'all';
  status: ProductStatus | 'all';
  sortBy: SortOption;
  minPrice?: number;
  maxPrice?: number;
}

export interface MetricSnapshot {
  renderDuration: number;
  domNodeEstimate: number;
  filteredCount: number;
  totalCount: number;
  fps: number;
  renderCount: number;
  mode: 'unoptimized' | 'optimized';
}

export interface LighthouseMetric {
  name: string;
  acronym: string;
  unit: string;
  beforeValue: number | string;
  afterValue: number | string;
  beforeScore?: number;
  afterScore?: number;
  improvement: string;
  status: 'good' | 'improved' | 'great';
  description: string;
}
