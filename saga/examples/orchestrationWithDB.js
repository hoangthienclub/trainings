/**
 * Orchestration-based Saga với Database Verification
 * 
 * Ví dụ minh họa cách kết hợp Event Message và Database Query
 */

import { SagaOrchestrator } from '../src/orchestration/sagaOrchestrator.js';
import { OrderService } from '../src/services/orderService.js';
import { InventoryService } from '../src/services/inventoryService.js';
import { PaymentService } from '../src/services/paymentService.js';
import { ShippingService } from '../src/services/shippingService.js';

// Khởi tạo các services
const orderService = new OrderService();
const inventoryService = new InventoryService();
const paymentService = new PaymentService();
const shippingService = new ShippingService();

/**
 * Tạo saga với Database Verification
 * 
 * Mỗi step sẽ:
 * 1. Lấy ID từ context (event message) - nhanh
 * 2. Query DB để verify và lấy data - chính xác
 */
function createOrderSagaWithDBVerification() {
  const saga = new SagaOrchestrator();

  // Bước 1: Tạo đơn hàng
  saga.addStep(
    async (context) => {
      const result = await orderService.createOrder({
        customerId: context.customerId,
        items: context.items,
        totalAmount: context.totalAmount,
      });
      // Chỉ trả về orderId, không trả về toàn bộ order object
      return { orderId: result.orderId };
    },
    async (context) => {
      await orderService.cancelOrder(context);
    },
    'Tạo đơn hàng'
  );

  // Bước 2: Giữ hàng trong kho
  // ✅ Lấy orderId từ context (event message)
  // ✅ Query DB để verify order và lấy items (chính xác)
  saga.addStep(
    async (context) => {
      const { orderId } = context;
      
      // Query DB để verify order
      const order = orderService.getOrder(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} không tồn tại trong database`);
      }
      
      // Verify state
      if (order.status !== 'CREATED') {
        throw new Error(`Order ${orderId} không ở trạng thái CREATED. Hiện tại: ${order.status}`);
      }
      
      console.log(`   → Verified order ${orderId} từ database: status=${order.status}`);
      
      // Sử dụng items từ DB (đảm bảo chính xác, không phụ thuộc event message)
      const result = await inventoryService.reserveInventory({
        orderId: order.id,
        items: order.items, // Lấy từ DB, không từ context
      });
      
      return { reservations: result.reservations };
    },
    async (context) => {
      await inventoryService.releaseInventory(context);
    },
    'Giữ hàng trong kho (với DB verification)'
  );

  // Bước 3: Xử lý thanh toán
  // ✅ Lấy orderId từ context
  // ✅ Query DB để lấy totalAmount (có thể đã thay đổi)
  saga.addStep(
    async (context) => {
      const { orderId } = context;
      
      // Query DB để lấy order mới nhất
      const order = orderService.getOrder(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} không tồn tại`);
      }
      
      // Verify state - order phải đã được giữ hàng
      if (order.status !== 'CREATED') {
        throw new Error(`Order ${orderId} không ở trạng thái hợp lệ để thanh toán`);
      }
      
      console.log(`   → Verified order ${orderId}: totalAmount=${order.totalAmount} (từ DB)`);
      
      // Sử dụng totalAmount từ DB (có thể đã được update bởi discount, etc.)
      const result = await paymentService.processPayment({
        orderId: order.id,
        customerId: order.customerId,
        totalAmount: order.totalAmount, // Từ DB, không từ context
      });
      
      return { paymentId: result.paymentId, payment: result.payment };
    },
    async (context) => {
      await paymentService.refundPayment(context);
    },
    'Xử lý thanh toán (với DB verification)'
  );

  // Bước 4: Tạo đơn vận chuyển
  // ✅ Lấy orderId từ context
  // ✅ Query DB để lấy thông tin đầy đủ
  saga.addStep(
    async (context) => {
      const { orderId } = context;
      
      // Query DB để lấy order
      const order = orderService.getOrder(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} không tồn tại`);
      }
      
      // Verify state - order phải đã thanh toán
      // (Trong thực tế, có thể có status 'PAID')
      console.log(`   → Verified order ${orderId} từ database cho shipping`);
      
      // Sử dụng data từ DB
      const result = await shippingService.createShipment({
        orderId: order.id,
        customerId: order.customerId,
        items: order.items, // Từ DB
      });
      
      return { shipmentId: result.shipmentId, shipment: result.shipment };
    },
    async (context) => {
      await shippingService.cancelShipment(context);
    },
    'Tạo đơn vận chuyển (với DB verification)'
  );

  return saga;
}

/**
 * Ví dụ: Đơn hàng thành công với DB verification
 */
async function exampleWithDBVerification() {
  console.log('='.repeat(70));
  console.log('ORCHESTRATION - VÍ DỤ: Đơn hàng thành công (với DB Verification)');
  console.log('='.repeat(70));
  console.log('\n📝 Lưu ý: Mỗi step sẽ query DB để verify và lấy data mới nhất\n');

  const saga = createOrderSagaWithDBVerification();
  
  const context = {
    customerId: 'CUST-001',
    items: [
      { productId: 'PROD-001', quantity: 1, price: 15000000 },
      { productId: 'PROD-002', quantity: 2, price: 500000 },
    ],
    totalAmount: 16000000,
  };

  const result = await saga.execute(context);
  
  console.log('\n📊 Kết quả:', result);
  console.log('\n');
}

/**
 * Ví dụ: Thất bại khi order không tồn tại trong DB
 */
async function exampleOrderNotFound() {
  console.log('='.repeat(70));
  console.log('ORCHESTRATION - VÍ DỤ: Order không tồn tại trong DB');
  console.log('='.repeat(70));
  console.log('\n📝 Mô phỏng trường hợp orderId không tồn tại trong DB\n');

  const saga = new SagaOrchestrator();

  saga.addStep(
    async (context) => {
      // Giả lập: Step này không tạo order thực sự
      // Chỉ trả về orderId giả
      return { orderId: 'NONEXISTENT-ORDER' };
    },
    async (context) => {},
    'Tạo đơn hàng (giả lập)'
  );

  saga.addStep(
    async (context) => {
      const { orderId } = context;
      
      // Query DB - sẽ không tìm thấy
      const order = orderService.getOrder(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} không tồn tại trong database`);
      }
      
      // Code này sẽ không chạy đến
      await inventoryService.reserveInventory({ orderId, items: [] });
    },
    async (context) => {},
    'Giữ hàng (sẽ fail vì order không tồn tại)'
  );

  const result = await saga.execute({ orderId: 'NONEXISTENT-ORDER' });
  
  console.log('\n📊 Kết quả:', result);
  console.log('\n');
}

// Chạy các ví dụ
async function main() {
  try {
    await exampleWithDBVerification();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await exampleOrderNotFound();
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

main();
