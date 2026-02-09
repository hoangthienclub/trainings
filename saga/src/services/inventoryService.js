/**
 * Inventory Service - Quản lý kho hàng
 */

export class InventoryService {
  constructor() {
    // Giả lập database kho hàng
    this.inventory = new Map([
      ['PROD-001', { productId: 'PROD-001', name: 'Laptop', stock: 10 }],
      ['PROD-002', { productId: 'PROD-002', name: 'Mouse', stock: 50 }],
      ['PROD-003', { productId: 'PROD-003', name: 'Keyboard', stock: 30 }],
    ]);
    this.reservations = new Map();
  }

  /**
   * Reserve inventory - Giữ chỗ sản phẩm
   */
  async reserveInventory(context) {
    const { orderId, items } = context;
    const reservations = [];

    for (const item of items) {
      const product = this.inventory.get(item.productId);
      
      if (!product) {
        throw new Error(`Sản phẩm ${item.productId} không tồn tại`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Không đủ hàng cho ${product.name}. Còn lại: ${product.stock}, yêu cầu: ${item.quantity}`
        );
      }

      // Giảm stock
      product.stock -= item.quantity;

      // Lưu reservation
      const reservationId = `RES-${orderId}-${item.productId}`;
      const reservation = {
        reservationId,
        orderId,
        productId: item.productId,
        quantity: item.quantity,
      };
      
      this.reservations.set(reservationId, reservation);
      reservations.push(reservation);

      console.log(`   → Đã giữ ${item.quantity} ${product.name} (Còn lại: ${product.stock})`);
    }

    return { reservations };
  }

  /**
   * Release inventory - Trả lại hàng vào kho (compensation)
   */
  async releaseInventory(context) {
    const { reservations } = context;
    
    if (!reservations) return;

    for (const reservation of reservations) {
      const product = this.inventory.get(reservation.productId);
      if (product) {
        product.stock += reservation.quantity;
        this.reservations.delete(reservation.reservationId);
        console.log(`   → Đã trả lại ${reservation.quantity} ${product.name} vào kho`);
      }
    }
  }

  /**
   * Confirm inventory - Xác nhận giữ hàng (sau khi thanh toán thành công)
   */
  async confirmInventory(context) {
    const { reservations } = context;
    console.log(`   → Xác nhận giữ hàng cho ${reservations.length} sản phẩm`);
    // Trong thực tế, có thể cập nhật trạng thái reservation
  }
}
