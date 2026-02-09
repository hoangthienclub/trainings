/**
 * Choreography-based Saga với Database Verification
 * 
 * Ví dụ minh họa cách kết hợp Event Message và Database Query trong Choreography
 */

import { EventBus } from '../src/choreography/eventBus.js';
import { OrderService } from '../src/services/orderService.js';
import { InventoryService } from '../src/services/inventoryService.js';
import { PaymentService } from '../src/services/paymentService.js';
import { ShippingService } from '../src/services/shippingService.js';

// Khởi tạo Event Bus và Services
const eventBus = new EventBus();
const orderService = new OrderService();
const inventoryService = new InventoryService();
const paymentService = new PaymentService();
const shippingService = new ShippingService();

// ============================================
// Event Handlers với DB Verification
// ============================================

// Order Service: Tạo order và chỉ trả về orderId
eventBus.subscribe('ORDER_CREATED', async (event) => {
  const { orderData } = event.data;
  
  try {
    const result = await orderService.createOrder(orderData);
    console.log(`   ✅ Order Service: Đơn hàng ${result.orderId} đã được tạo\n`);
    
    // Chỉ trả về orderId trong event, không trả về toàn bộ order
    await eventBus.publish('ORDER_CREATED_SUCCESS', {
      orderId: result.orderId, // Chỉ ID, không có order object
      customerId: orderData.customerId,
    });
  } catch (error) {
    await eventBus.publish('ORDER_CREATED_FAILED', {
      orderData,
      error: error.message,
    });
  }
}, 'Order Service');

// Inventory Service: Query DB để lấy order và verify
eventBus.subscribe('ORDER_CREATED_SUCCESS', async (event) => {
  const { orderId } = event.data; // Chỉ có orderId từ event
  
  try {
    // ✅ Query DB để lấy order và verify
    const order = orderService.getOrder(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} không tồn tại trong database`);
    }
    
    if (order.status !== 'CREATED') {
      throw new Error(`Order ${orderId} không ở trạng thái CREATED`);
    }
    
    console.log(`   → Inventory Service: Verified order ${orderId} từ DB`);
    console.log(`   → Inventory Service: Lấy ${order.items.length} items từ DB\n`);
    
    // Sử dụng items từ DB, không từ event
    const result = await inventoryService.reserveInventory({
      orderId: order.id,
      items: order.items, // Từ DB
    });
    
    await eventBus.publish('INVENTORY_RESERVED', {
      orderId: order.id,
      customerId: order.customerId,
      totalAmount: order.totalAmount, // Từ DB
      reservations: result.reservations,
    });
  } catch (error) {
    console.log(`   ❌ Inventory Service: ${error.message}\n`);
    await eventBus.publish('INVENTORY_RESERVED_FAILED', {
      orderId,
      error: error.message,
    });
  }
}, 'Inventory Service (với DB verification)');

// Payment Service: Query DB để lấy totalAmount mới nhất
eventBus.subscribe('INVENTORY_RESERVED', async (event) => {
  const { orderId, totalAmount } = event.data;
  
  try {
    // ✅ Query DB để lấy order mới nhất (totalAmount có thể đã thay đổi)
    const order = orderService.getOrder(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} không tồn tại`);
    }
    
    console.log(`   → Payment Service: Verified order ${orderId} từ DB`);
    console.log(`   → Payment Service: totalAmount từ DB = ${order.totalAmount}`);
    console.log(`   → Payment Service: totalAmount từ event = ${totalAmount}`);
    
    // Sử dụng totalAmount từ DB (có thể đã được update)
    const result = await paymentService.processPayment({
      orderId: order.id,
      customerId: order.customerId,
      totalAmount: order.totalAmount, // Từ DB, không từ event
    });
    
    await eventBus.publish('PAYMENT_COMPLETED', {
      orderId: order.id,
      customerId: order.customerId,
      reservations: event.data.reservations,
      paymentId: result.paymentId,
    });
  } catch (error) {
    console.log(`   ❌ Payment Service: ${error.message}\n`);
    await eventBus.publish('PAYMENT_COMPLETED_FAILED', {
      orderId,
      error: error.message,
    });
  }
}, 'Payment Service (với DB verification)');

// Shipping Service: Query DB để lấy thông tin đầy đủ
eventBus.subscribe('PAYMENT_COMPLETED', async (event) => {
  const { orderId } = event.data;
  
  try {
    // ✅ Query DB để lấy order
    const order = orderService.getOrder(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} không tồn tại`);
    }
    
    console.log(`   → Shipping Service: Verified order ${orderId} từ DB\n`);
    
    // Sử dụng data từ DB
    const result = await shippingService.createShipment({
      orderId: order.id,
      customerId: order.customerId,
      items: order.items, // Từ DB
    });
    
    await eventBus.publish('ORDER_COMPLETED', {
      orderId: order.id,
      shipmentId: result.shipmentId,
    });
  } catch (error) {
    console.log(`   ❌ Shipping Service: ${error.message}\n`);
    await eventBus.publish('SHIPPING_CREATED_FAILED', {
      orderId,
      error: error.message,
    });
  }
}, 'Shipping Service (với DB verification)');

// Compensation Handlers
eventBus.subscribe('INVENTORY_RESERVED_FAILED', async (event) => {
  const { orderId } = event.data;
  console.log(`   🔄 Order Service: Đang hủy đơn hàng ${orderId}\n`);
  await orderService.cancelOrder({ orderId });
}, 'Order Service (Compensation)');

eventBus.subscribe('PAYMENT_COMPLETED_FAILED', async (event) => {
  const { orderId, reservations } = event.data;
  console.log(`   🔄 Inventory Service: Đang trả lại hàng vào kho\n`);
  await inventoryService.releaseInventory({ reservations });
  
  console.log(`   🔄 Order Service: Đang hủy đơn hàng ${orderId}\n`);
  await orderService.cancelOrder({ orderId });
}, 'Inventory & Order Service (Compensation)');

eventBus.subscribe('SHIPPING_CREATED_FAILED', async (event) => {
  const { orderId, reservations, paymentId } = event.data;
  console.log(`   🔄 Payment Service: Đang hoàn tiền\n`);
  await paymentService.refundPayment({ paymentId });
  
  console.log(`   🔄 Inventory Service: Đang trả lại hàng vào kho\n`);
  await inventoryService.releaseInventory({ reservations });
  
  console.log(`   🔄 Order Service: Đang hủy đơn hàng ${orderId}\n`);
  await orderService.cancelOrder({ orderId });
}, 'Payment, Inventory & Order Service (Compensation)');

// ============================================
// Ví dụ sử dụng
// ============================================

async function exampleWithDBVerification() {
  console.log('='.repeat(70));
  console.log('CHOREOGRAPHY - VÍ DỤ: Đơn hàng thành công (với DB Verification)');
  console.log('='.repeat(70));
  console.log('\n📝 Lưu ý: Mỗi service sẽ query DB để verify và lấy data mới nhất\n');

  eventBus.clearHistory();

  const orderData = {
    customerId: 'CUST-001',
    items: [
      { productId: 'PROD-001', quantity: 1, price: 15000000 },
      { productId: 'PROD-002', quantity: 2, price: 500000 },
    ],
    totalAmount: 16000000,
  };

  await eventBus.publish('ORDER_CREATED', { orderData });
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\n📊 Lịch sử Events:');
  eventBus.getHistory().forEach((event, index) => {
    console.log(`   ${index + 1}. ${event.type}`);
  });

  console.log('\n🎉 Choreography Saga hoàn thành!\n');
}

// Chạy ví dụ
async function main() {
  try {
    await exampleWithDBVerification();
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

main();
