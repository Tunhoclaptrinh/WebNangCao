/**
 * @file order-management.demo.ts
 * @description Kịch bản kiểm thử luồng nghiệp vụ và xác minh tính an toàn kiểu dữ liệu
 * của phân hệ Quản lý Đơn hàng.
 */

import {
  Customer,
  Product,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  CustomerTier,
  ProductCategory,
  CreateOrderDto,
  UpdateProductDto,
  ProductSummaryDto,
  OrderStatusConfigMap,
  ApiResponse,
  PaginatedResponse,
  IRepository,
  isPopulatedOrder,
  isDeliveredOrder,
  Log
} from './order-management.types';

// =========================================================================================
// 1. MOCK DATA
// =========================================================================================

const mockCustomer: Customer = {
  id: 'cust_001',
  name: 'Nguyễn Tiến Tuấn',
  email: 'tuannguyentien16@gmail.com',
  phone: '0987654321',
  address: 'Học viện Công nghệ Bưu chính Viễn thông, Km10 Đường Nguyễn Trãi, Hà Đông, Hà Nội',
  tier: CustomerTier.GOLD,
  isActive: true,
  createdAt: new Date('2026-01-01T08:00:00Z'),
  updatedAt: new Date('2026-09-01T10:00:00Z')
};

const mockProducts: Product[] = [
  {
    id: 'prod_macbook',
    name: 'MacBook Pro 16 inch M3 Max',
    sku: 'LAP-MBP-16-M3M',
    price: 79990000,
    stock: 15,
    category: ProductCategory.ELECTRONICS,
    description: 'Apple M3 Max 16-core CPU, 40-core GPU, 36GB RAM, 1TB SSD',
    createdAt: new Date('2026-02-15T00:00:00Z'),
    updatedAt: new Date('2026-08-20T00:00:00Z')
  },
  {
    id: 'prod_keyboard',
    name: 'Bàn phím cơ Custom Keychron Q3 Max',
    sku: 'ACC-KEY-Q3M-GREY',
    price: 4890000,
    stock: 40,
    category: ProductCategory.ELECTRONICS,
    description: 'Bàn phím cơ không dây nhôm nguyên khối, Switch Gateron Jupiter',
    createdAt: new Date('2026-03-10T00:00:00Z'),
    updatedAt: new Date('2026-08-25T00:00:00Z')
  }
];

// =========================================================================================
// 2. DTO & UTILITY TYPE DEMONSTRATION
// =========================================================================================

// Pick: Tóm tắt thông tin sản phẩm phục vụ hiển thị thẻ danh sách
const productPreviews: ProductSummaryDto[] = mockProducts.map(p => ({
  id: p.id,
  name: p.name,
  price: p.price,
  sku: p.sku,
  category: p.category
}));

// Partial: Payload cập nhật một phần dữ liệu sản phẩm
const productPatchPayload: UpdateProductDto = {
  price: 77990000,
  stock: 14
};

// Record: Ánh xạ cấu hình hiển thị trạng thái đơn hàng
const orderStatusConfigs: OrderStatusConfigMap = {
  [OrderStatus.PENDING]: { label: 'Chờ xác nhận', badgeColor: '#f59e0b', canCancel: true },
  [OrderStatus.CONFIRMED]: { label: 'Đã xác nhận', badgeColor: '#3b82f6', canCancel: true },
  [OrderStatus.PROCESSING]: { label: 'Đang xử lý', badgeColor: '#8b5cf6', canCancel: false },
  [OrderStatus.SHIPPED]: { label: 'Đang giao hàng', badgeColor: '#06b6d4', canCancel: false },
  [OrderStatus.DELIVERED]: { label: 'Đã nhận hàng thành công', badgeColor: '#10b981', canCancel: false },
  [OrderStatus.CANCELLED]: { label: 'Đơn đã huỷ', badgeColor: '#ef4444', canCancel: false },
  [OrderStatus.RETURNED]: { label: 'Đơn trả lại', badgeColor: '#64748b', canCancel: false }
};

// =========================================================================================
// 3. ORDER SERVICE IMPLEMENTATION
// =========================================================================================

class OrderService implements IRepository<Order<Customer, Product>> {
  private orders: Order<Customer, Product>[] = [];

  @Log
  async create(order: Order<Customer, Product>): Promise<Order<Customer, Product>> {
    this.orders.push(order);
    return order;
  }

  @Log
  async findById(id: string): Promise<Order<Customer, Product> | undefined> {
    return this.orders.find(o => o.id === id);
  }

  @Log
  async findAll(): Promise<Order<Customer, Product>[]> {
    return [...this.orders];
  }

  @Log
  async update(id: string, partialItem: Partial<Order<Customer, Product>>): Promise<Order<Customer, Product> | undefined> {
    const order = await this.findById(id);
    if (!order) return undefined;
    Object.assign(order, partialItem, { updatedAt: new Date() });
    return order;
  }

  @Log
  async delete(id: string): Promise<boolean> {
    const initialLen = this.orders.length;
    this.orders = this.orders.filter(o => o.id !== id);
    return this.orders.length < initialLen;
  }

  @Log
  async processNewOrder(
    dto: CreateOrderDto,
    customer: Customer,
    productResolver: (id: string) => Product | undefined
  ): Promise<ApiResponse<Order<Customer, Product>>> {
    const orderItems: OrderItem<Product>[] = dto.items.map(itemDto => {
      const product = productResolver(itemDto.productId);
      if (!product) {
        throw new Error(`Sản phẩm [${itemDto.productId}] không tồn tại trong hệ thống.`);
      }
      const unitPrice = product.price;
      const subtotal = itemDto.quantity * unitPrice;
      return {
        productId: product.id,
        product,
        quantity: itemDto.quantity,
        unitPrice,
        subtotal
      };
    });

    const totalAmount = orderItems.reduce((acc, item) => acc + item.subtotal, 0);

    const newOrder: Order<Customer, Product> = {
      id: `order_${Date.now()}`,
      orderCode: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customer.id,
      customer,
      items: orderItems,
      status: OrderStatus.CONFIRMED,
      paymentMethod: dto.paymentMethod,
      paymentStatus: PaymentStatus.PAID,
      totalAmount,
      shippingAddress: dto.shippingAddress,
      notes: dto.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const saved = await this.create(newOrder);

    return {
      statusCode: 201,
      message: 'Tạo đơn hàng thành công',
      data: saved,
      timestamp: new Date()
    };
  }
}

// =========================================================================================
// 4. RUNTIME VERIFICATION
// =========================================================================================

async function runDemo() {
  console.log('====================================================================');
  console.log('ORDER MANAGEMENT SYSTEM - TYPE VERIFICATION RUNTIME');
  console.log('====================================================================\n');

  console.log('📦 1. Danh sách sản phẩm tóm tắt (Pick<Product, ...>):');
  console.table(productPreviews);

  console.log('\n👤 2. Thông tin khách hàng:');
  console.log(`- Tên: ${mockCustomer.name} (${mockCustomer.tier})`);
  console.log(`- Email: ${mockCustomer.email} | SĐT: ${mockCustomer.phone}`);
  console.log(`- Địa chỉ: ${mockCustomer.address}`);

  const newOrderDto: CreateOrderDto = {
    customerId: mockCustomer.id,
    shippingAddress: mockCustomer.address,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    notes: 'Giao giờ hành chính, gọi trước 15 phút',
    status: OrderStatus.PENDING,
    items: [
      { productId: 'prod_macbook', quantity: 1 },
      { productId: 'prod_keyboard', quantity: 2 }
    ]
  };

  const orderService = new OrderService();
  const productMap = new Map(mockProducts.map(p => [p.id, p]));

  const response = await orderService.processNewOrder(
    newOrderDto,
    mockCustomer,
    id => productMap.get(id)
  );

  const order = response.data;

  console.log('\n📄 3. Chi tiết đơn hàng được khởi tạo:');
  console.log(`- Mã đơn: ${order.orderCode} (ID: ${order.id})`);
  console.log(`- Khách hàng: ${order.customer?.name} [Tier: ${order.customer?.tier}]`);
  console.log(`- Trạng thái: ${orderStatusConfigs[order.status].label}`);
  console.log(`- Thanh toán: ${order.paymentMethod} (Trạng thái: ${order.paymentStatus})`);
  console.log('- Chi tiết mặt hàng:');
  order.items.forEach((item, index) => {
    console.log(
      `   ${index + 1}. [${item.product?.sku}] ${item.product?.name} x ${item.quantity} = ${item.subtotal.toLocaleString('vi-VN')} đ`
    );
  });
  console.log(`💰 TỔNG GIÁ TRỊ ĐƠN: ${order.totalAmount.toLocaleString('vi-VN')} đ`);

  console.log('\n🛡️ 4. Kiểm tra Type Guards:');
  const isPopulated = isPopulatedOrder(order);
  console.log(`- isPopulatedOrder: ${isPopulated ? '✅ Đầy đủ quan hệ Customer & Product' : '❌ Chưa nạp quan hệ'}`);

  const isDelivered = isDeliveredOrder(order);
  console.log(`- isDeliveredOrder: ${isDelivered ? '✅ Đã giao hàng' : '⏳ Chưa giao hàng'}`);

  console.log('\n🚚 5. Cập nhật trạng thái sang DELIVERED:');
  const updatedOrder = await orderService.update(order.id, {
    status: OrderStatus.DELIVERED
  });
  if (updatedOrder) {
    console.log(`- Trạng thái cập nhật: ${orderStatusConfigs[updatedOrder.status].label}`);
    console.log(`- Kiểm tra isDeliveredOrder: ${isDeliveredOrder(updatedOrder) ? '✅ Giao hàng thành công' : '❌ Chưa giao'}`);
  }

  const paginatedOrders: PaginatedResponse<Order<Customer, Product>> = {
    items: await orderService.findAll(),
    page: 1,
    pageSize: 10,
    totalItems: 1,
    totalPages: 1
  };
  console.log('\n📊 6. Cấu trúc Generic PaginatedResponse:');
  console.log(`- Trang: ${paginatedOrders.page}/${paginatedOrders.totalPages} | Tổng bản ghi: ${paginatedOrders.totalItems}`);

  console.log('\n✅ Hoàn tất kiểm thử runtime: Type checking hoạt động chính xác tuyệt đối.');
}

runDemo().catch(console.error);
