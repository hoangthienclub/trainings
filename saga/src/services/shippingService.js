/**
 * Shipping Service - Quản lý vận chuyển
 */

export class ShippingService {
  constructor() {
    this.shipments = new Map();
  }

  /**
   * Tạo đơn vận chuyển
   */
  async createShipment(context) {
    const { orderId, customerId, items } = context;
    const shipmentId = `SHIP-${Date.now()}`;

    const shipment = {
      shipmentId,
      orderId,
      customerId,
      items,
      status: 'CREATED',
      estimatedDelivery: this.calculateDeliveryDate(),
      createdAt: new Date().toISOString(),
    };

    this.shipments.set(shipmentId, shipment);
    console.log(`   → Đơn vận chuyển ${shipmentId} đã được tạo`);
    console.log(`   → Dự kiến giao hàng: ${shipment.estimatedDelivery}`);

    return { shipmentId, shipment };
  }

  /**
   * Cancel shipment - Hủy đơn vận chuyển (compensation)
   */
  async cancelShipment(context) {
    const { shipmentId } = context;
    
    if (this.shipments.has(shipmentId)) {
      const shipment = this.shipments.get(shipmentId);
      shipment.status = 'CANCELLED';
      console.log(`   → Đơn vận chuyển ${shipmentId} đã bị hủy`);
    }
  }

  /**
   * Tính ngày giao hàng dự kiến
   */
  calculateDeliveryDate() {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 ngày sau
    return date.toLocaleDateString('vi-VN');
  }

  /**
   * Lấy thông tin shipment
   */
  getShipment(shipmentId) {
    return this.shipments.get(shipmentId);
  }
}
