/**
 * Order Service - Quản lý đơn hàng
 */

export class OrderService {
  constructor() {
    this.orders = new Map();
  }

  /**
   * Tạo đơn hàng mới
   */
  async createOrder(orderData) {
    const orderId = `ORD-${Date.now()}`;
    const order = {
      id: orderId,
      customerId: orderData.customerId,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: 'CREATED',
      createdAt: new Date().toISOString(),
    };

    this.orders.set(orderId, order);
    console.log(`   → Đơn hàng ${orderId} đã được tạo`);
    
    return { orderId, order };
  }

  /**
   * Xóa đơn hàng (compensation)
   */
  async cancelOrder(context) {
    const { orderId } = context;
    if (this.orders.has(orderId)) {
      this.orders.delete(orderId);
      console.log(`   → Đơn hàng ${orderId} đã bị hủy`);
    }
  }

  /**
   * Lấy thông tin đơn hàng
   */
  getOrder(orderId) {
    return this.orders.get(orderId);
  }
}
