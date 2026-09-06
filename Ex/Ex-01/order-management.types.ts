/**
 * @module OrderManagement
 * @description Hệ thống định nghĩa kiểu dữ liệu (Types, Interfaces, Generics, DTOs) cho phân hệ Quản lý Đơn hàng (Order Management System).
 */

// 1. ENUMS & DOMAIN CONSTANTS

/**
 * Trạng thái vòng đời của đơn hàng.
 * Sử dụng String Enum để dữ liệu serialize qua REST/JSON và lưu DB giữ nguyên ý nghĩa nghiệp vụ, tránh rủi ro sai lệch chỉ mục khi bổ sung trạng thái mới.
 */
export enum OrderStatus {
  PENDING = 'PENDING',         // Đơn mới tạo, chờ duyệt
  CONFIRMED = 'CONFIRMED',     // Đã xác nhận đơn hàng
  PROCESSING = 'PROCESSING',   // Đang xử lý đóng gói
  SHIPPED = 'SHIPPED',         // Đang giao hàng
  DELIVERED = 'DELIVERED',     // Giao hàng thành công
  CANCELLED = 'CANCELLED',     // Đã huỷ đơn
  RETURNED = 'RETURNED'        // Khách trả hàng
}

/** Phương thức thanh toán được hỗ trợ. */
export enum PaymentMethod {
  COD = 'COD',                     // Tiền mặt khi giao hàng
  BANK_TRANSFER = 'BANK_TRANSFER', // Chuyển khoản ngân hàng
  CREDIT_CARD = 'CREDIT_CARD',     // Thẻ thanh toán quốc tế
  E_WALLET = 'E_WALLET'            // Ví điện tử
}

/** Trạng thái giao dịch thanh toán. */
export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}

/** Phân hạng hội viên khách hàng dùng cho chính sách chiết khấu và ưu tiên xử lý. */
export enum CustomerTier {
  STANDARD = 'STANDARD',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND'
}

/** Phân loại danh mục hàng hoá. */
export enum ProductCategory {
  ELECTRONICS = 'ELECTRONICS',
  FASHION = 'FASHION',
  HOME_APPLIANCES = 'HOME_APPLIANCES',
  BOOKS = 'BOOKS',
  FOOD = 'FOOD',
  OTHER = 'OTHER'
}

// 2. BASE ENTITY & GENERIC CONSTRAINTS

/** Ràng buộc định danh thống nhất cho mọi thực thể trong hệ thống. Phục vụ làm generic constraint cho tầng Repository/Service. */
export interface Identifiable {
  readonly id: string;
}

/** Dấu vết thời gian phục vụ audit bản ghi. */
export interface Timestampable {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/** Thực thể cơ sở dùng chung để tuân thủ nguyên lý DRY. Đánh dấu readonly ở id và timestamps để chống đột biến trạng thái (immutability) ngoài ý muốn. */
export interface BaseEntity extends Identifiable, Timestampable {}

// 3. CORE DOMAIN ENTITIES

/** Thực thể Khách hàng. */
export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  address: string;
  tier: CustomerTier;
  isActive: boolean;
}

/** Thực thể Sản phẩm trong kho hàng. */
export interface Product extends BaseEntity {
  name: string;
  sku: string;                     // Mã quản lý kho duy nhất
  price: number;                   // Đơn giá niêm yết hiện hành
  stock: number;                   // Số lượng khả dụng trong kho
  category: ProductCategory;
  description?: string;
}

/**
 * Chi tiết một dòng sản phẩm trong đơn hàng.
 * Sử dụng Generic TProduct để linh hoạt giữa trạng thái chưa nạp (chỉ có productId) và trạng thái đã populate đối tượng Product đầy đủ mà không cần nhân bản interface.
 * Lưu unitPrice độc lập để bảo toàn lịch sử giá tại thời điểm giao dịch.
 */
export interface OrderItem<TProduct = Product> {
  productId: string;
  product?: TProduct;
  quantity: number;
  unitPrice: number;
  discount?: number;
  subtotal: number;                // subtotal = (quantity * unitPrice) - (discount || 0)
}

/**
 * Thực thể Đơn hàng.
 * Mô hình hoá quan hệ: 1 Order có nhiều OrderItem và thuộc về 1 Customer.
 * Sử dụng cặp Generic <TCustomer, TProduct> cho phép module hoạt động nhất quán ở cả tầng truy vấn thô (raw ID) lẫn tầng nghiệp vụ cao hơn (populated object).
 */
export interface Order<TCustomer = Customer, TProduct = Product> extends BaseEntity {
  orderCode: string;               // Mã hiển thị cho khách hàng (khác với UUID id nội bộ)
  customerId: string;
  customer?: TCustomer;
  items: OrderItem<TProduct>[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  shippingAddress: string;
  notes?: string;
}

// 4. DATA TRANSFER OBJECTS (DTOs) & UTILITY TYPES

// --- 4.1. Omit & Pick cho DTO tạo mới (Creation DTOs) ---
// Loại bỏ các trường hệ thống tự sinh (id, createdAt, updatedAt, totalAmount) khỏi payload đầu vào.
export type CreateProductDto = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateCustomerDto = Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'tier'> & {
  tier?: CustomerTier;             // Cho phép bỏ trống để fallback về STANDARD
};
export type CreateOrderItemDto = Pick<OrderItem, 'productId' | 'quantity'>;
export type CreateOrderDto = Omit<
  Order,
  'id' | 'orderCode' | 'createdAt' | 'updatedAt' | 'totalAmount' | 'customer' | 'items' | 'paymentStatus'
> & {
  items: CreateOrderItemDto[];
};

// --- 4.2. Pick cho DTO tóm tắt / hiển thị rút gọn (Summary DTOs) ---
// Chỉ lấy các trường cần thiết để hiển thị trên bảng điều khiển hoặc giỏ hàng, tránh over-fetching.
export type ProductSummaryDto = Pick<Product, 'id' | 'name' | 'price' | 'sku' | 'category'>;
export type CustomerSummaryDto = Pick<Customer, 'id' | 'name' | 'email' | 'phone'>;
export type OrderSummaryDto = Pick<
  Order,
  'id' | 'orderCode' | 'status' | 'totalAmount' | 'createdAt'
> & {
  customerName: string;
  totalItems: number;
};

// --- 4.3. Partial cho DTO cập nhật tài nguyên (Update DTOs) ---
// Đáp ứng chuẩn RESTful PATCH: tất cả trường thay đổi đều là tuỳ chọn.
export type UpdateProductDto = Partial<CreateProductDto>;
export type UpdateCustomerDto = Partial<CreateCustomerDto>;
export type UpdateOrderStatusDto = Pick<Order, 'status'> & Partial<Pick<Order, 'notes'>>;

// --- 4.4. Readonly để bảo vệ tính bất biến ---
// Đóng băng trạng thái đơn hàng khi đã hoàn tất giao dịch để ngăn chặn sửa đổi ngầm.
export type ImmutableOrder = Readonly<Order>;

// --- 4.5. Record cho ánh xạ cấu hình nghiệp vụ ---
// Đảm bảo kiểm tra đầy đủ (exhaustive) mọi giá trị enum mà không bị bỏ sót khi biên dịch.
export interface OrderStatusConfig {
  readonly label: string;
  readonly badgeColor: string;
  readonly canCancel: boolean;
}
export type OrderStatusConfigMap = Record<OrderStatus, OrderStatusConfig>;
export type PaymentMethodNameMap = Record<PaymentMethod, string>;

// 5. MAPPED & CONDITIONAL TYPES

/** Mapped Type cho phép tất cả các trường có thể nhận giá trị null (dùng khi reset biểu mẫu). */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

/** Mapped Type đóng băng đệ quy mọi tầng cấu trúc dữ liệu lồng nhau. */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/** Conditional Type kiểm tra điều kiện trạng thái giao hàng ở mức type. */
export type IsDelivered<T extends Order> = T['status'] extends OrderStatus.DELIVERED ? true : false;

// 6. GENERIC SERVICE & REPOSITORY CONTRACTS

/** Cấu trúc đóng gói chuẩn cho mọi phản hồi API. */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: Date;
}

/** Cấu trúc phân trang danh sách dữ liệu. */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/** Hợp đồng CRUD trừu tượng với ràng buộc T phải có định danh id. */
export interface IRepository<T extends Identifiable> {
  findById(id: string): Promise<T | undefined>;
  findAll(): Promise<T[]>;
  create(item: T): Promise<T>;
  update(id: string, partialItem: Partial<T>): Promise<T | undefined>;
  delete(id: string): Promise<boolean>;
}

// 7. TYPE GUARDS & NARROWING UTILITIES

/** Type Guard thu hẹp kiểm tra đơn hàng đã hoàn tất giao hàng. */
export function isDeliveredOrder(order: Order): boolean {
  return order.status === OrderStatus.DELIVERED;
}

/** Type Guard xác thực đơn hàng đã nạp đầy đủ thực thể liên kết (Customer và Product). */
export function isPopulatedOrder(
  order: Order<any, any>
): order is Order<Customer, Product> {
  return (
    order.customer !== undefined &&
    typeof order.customer === 'object' &&
    'tier' in order.customer &&
    order.items.every(item => item.product !== undefined && typeof item.product === 'object')
  );
}

// 8. METHOD DECORATORS

/** Method Decorator ghi log thời gian thực thi và tham số cho các phương thức service. */
export function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`\n[ORDER SERVICE] Method call: [${propertyKey}] with args:`, JSON.stringify(args, null, 2));
    const result = originalMethod.apply(this, args);
    console.log(`[ORDER SERVICE] Method completed: [${propertyKey}]\n`);
    return result;
  };
  return descriptor;
}
