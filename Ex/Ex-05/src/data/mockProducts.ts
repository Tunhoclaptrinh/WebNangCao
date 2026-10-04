import type { Product, ProductCategory, ProductStatus } from '../types/product.ts';

const CATEGORIES: ProductCategory[] = [
  'Laptop',
  'Bàn Phím Cơ',
  'Chuột Gaming',
  'Màn Hình',
  'Tai Nghe & Âm Thanh',
  'Linh Kiện PC',
];

const BRANDS = [
  'Dell', 'Asus ROG', 'Apple', 'Lenovo', 'HP Omen', 'Logitech', 'Razer',
  'Keychron', 'Akko', 'Corsair', 'LG UltraGear', 'Samsung Odyssey',
  'Sony', 'Audio-Technica', 'SteelSeries', 'Kingston Fury', 'Gigabyte AORUS', 'MSI'
];

const LAPTOP_MODELS = [
  'XPS 15 OLED', 'ThinkPad X1 Carbon Gen 12', 'ROG Zephyrus G16', 'MacBook Pro M3 Max',
  'Legion Pro 7i', 'Zenbook S 14 OLED', 'Predator Helios Neo', 'Yoga Slim 7i Aura'
];

const KEYBOARD_MODELS = [
  'K8 Pro QMK/VIA Wireless', 'MonsGeek M1 V3 QMK', 'Ducky One 3 RGB TKL',
  'Akko 5075B Plus Multi-Mode', 'BlackWidow V4 Pro', 'G915 LIGHTSPEED Wireless'
];

const MOUSE_MODELS = [
  'G Pro X Superlight 2', 'DeathAdder V3 Pro Wireless', 'Viper V3 Pro 8KHz',
  'Lamzu Atlantis OG V2 4K', 'Pulsar X2V2 Wireless Mini', 'MX Master 3S Silent'
];

const MONITOR_MODELS = [
  'UltraGear 27GR95QE OLED 240Hz', 'Odyssey Neo G9 49 inch Dual UHD',
  'ProArt Display 27 inch 4K HDR', 'Alienware AW3423DW QD-OLED', 'TUF Gaming VG27AQ3A'
];

const AUDIO_MODELS = [
  'WH-1000XM5 Noise Cancelling', 'ATH-M50xBT2 Professional Studio',
  'HD 660S2 High-End Audiophile', 'Arctis Nova Pro Wireless Multi-System'
];

const COMPONENT_MODELS = [
  'RTX 4090 OC 24GB GDDR6X', 'Core i9-14900K 24 Cores Unlocked',
  'Ryzen 9 7950X3D V-Cache', 'Fury Renegade 64GB DDR5 6400MHz RGB', '990 PRO 2TB NVMe PCIe 4.0'
];

const MODEL_MAP: Record<ProductCategory, string[]> = {
  'Laptop': LAPTOP_MODELS,
  'Bàn Phím Cơ': KEYBOARD_MODELS,
  'Chuột Gaming': MOUSE_MODELS,
  'Màn Hình': MONITOR_MODELS,
  'Tai Nghe & Âm Thanh': AUDIO_MODELS,
  'Linh Kiện PC': COMPONENT_MODELS,
};

let cachedProducts: Product[] | null = null;

export function generate10000Products(): Product[] {
  if (cachedProducts) {
    return cachedProducts;
  }

  const list: Product[] = new Array(10000);

  for (let i = 0; i < 10000; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const brand = BRANDS[i % BRANDS.length];
    const models = MODEL_MAP[category];
    const model = models[i % models.length];

    // Seeded realistic variation
    const variantId = (i % 8) + 1;
    const priceBase = 450000 + ((i * 1337) % 55000000);
    const originalPrice = Math.round(priceBase * 1.15 / 10000) * 10000;
    const price = Math.round(priceBase / 10000) * 10000;
    const stock = (i * 17) % 250;
    const rating = Math.min(5, Math.max(3.5, Number((3.8 + ((i % 13) * 0.1)).toFixed(1))));
    const salesCount = (i * 31) % 4500;

    let status: ProductStatus = 'in_stock';
    if (stock === 0) {
      status = 'out_of_stock';
    } else if (stock < 15) {
      status = 'low_stock';
    }

    const paddedId = String(i + 1).padStart(5, '0');

    list[i] = {
      id: `PRD-${paddedId}`,
      sku: `SKU-${brand.substring(0, 3).toUpperCase()}-${category.substring(0, 2).toUpperCase()}-${paddedId}`,
      name: `${brand} ${model} (V${variantId} Edition - Ref #${i + 1})`,
      category,
      brand,
      price,
      originalPrice,
      stock,
      rating,
      status,
      salesCount,
      lastUpdated: new Date(Date.now() - (i % 30) * 86400000).toISOString().split('T')[0],
      avatarSeed: (i % 70) + 1,
    };
  }

  cachedProducts = list;
  return list;
}
