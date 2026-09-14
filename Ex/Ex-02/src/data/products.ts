/**
 * products.ts
 * Dữ liệu mẫu cho demo usePagination.
 */

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
  emoji: string;
}

export const products: Product[] = [
  { id: 1,  name: "MacBook Pro M3",        price: 49_990_000, category: "Laptop",      rating: 4.9, inStock: true,  emoji: "💻" },
  { id: 2,  name: "iPhone 16 Pro Max",     price: 34_990_000, category: "Điện thoại",  rating: 4.8, inStock: true,  emoji: "📱" },
  { id: 3,  name: "AirPods Pro 2",         price: 6_990_000,  category: "Tai nghe",    rating: 4.7, inStock: true,  emoji: "🎧" },
  { id: 4,  name: "iPad Pro M4 13\"",      price: 28_990_000, category: "Máy tính bảng",rating:4.8, inStock: false, emoji: "📟" },
  { id: 5,  name: "Apple Watch Ultra 2",   price: 22_990_000, category: "Đồng hồ",     rating: 4.6, inStock: true,  emoji: "⌚" },
  { id: 6,  name: "Samsung Galaxy S25",    price: 26_990_000, category: "Điện thoại",  rating: 4.7, inStock: true,  emoji: "📲" },
  { id: 7,  name: "Sony WH-1000XM6",      price: 9_990_000,  category: "Tai nghe",    rating: 4.9, inStock: true,  emoji: "🎵" },
  { id: 8,  name: "Dell XPS 15 OLED",     price: 52_000_000, category: "Laptop",      rating: 4.6, inStock: false, emoji: "🖥️" },
  { id: 9,  name: "Logitech MX Master 3S",price: 2_990_000,  category: "Phụ kiện",    rating: 4.8, inStock: true,  emoji: "🖱️" },
  { id: 10, name: "Keychron Q1 Pro",      price: 4_200_000,  category: "Phụ kiện",    rating: 4.7, inStock: true,  emoji: "⌨️" },
  { id: 11, name: "LG UltraWide 34\"",    price: 18_500_000, category: "Màn hình",     rating: 4.5, inStock: true,  emoji: "🖥️" },
  { id: 12, name: "GoPro Hero 13 Black",  price: 12_990_000, category: "Camera",      rating: 4.6, inStock: false, emoji: "📷" },
  { id: 13, name: "Nintendo Switch OLED", price: 8_990_000,  category: "Gaming",      rating: 4.8, inStock: true,  emoji: "🎮" },
  { id: 14, name: "DJI Mini 4 Pro",       price: 19_990_000, category: "Drone",       rating: 4.7, inStock: true,  emoji: "🚁" },
  { id: 15, name: "Kindle Paperwhite 5",  price: 3_990_000,  category: "Đọc sách",    rating: 4.5, inStock: true,  emoji: "📚" },
  { id: 16, name: "Anker 140W GaN",       price: 1_490_000,  category: "Phụ kiện",    rating: 4.6, inStock: true,  emoji: "🔌" },
];
