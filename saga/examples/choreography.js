/**
 * Choreography-based Saga Examples
 * 
 * Các ví dụ về cách sử dụng Choreography pattern
 */

import { EventBus } from '../src/choreography/eventBus.js';
import { registerSagaHandlers } from '../src/choreography/sagaHandlers.js';
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

// Đăng ký tất cả event handlers
registerSagaHandlers(eventBus, {
  orderService,
  inventoryService,
  paymentService,
  shippingService,
});

/**
 * Ví dụ 1: Đơn hàng thành công (Choreography)
 */
async function choreographyExample1_SuccessfulOrder() {
  console.log('='.repeat(60));
  console.log('CHOREOGRAPHY - VÍ DỤ 1: Đơn hàng thành công');
  console.log('='.repeat(60));
  console.log('\n🚀 Bắt đầu Choreography Saga...\n');

  eventBus.clearHistory();

  const orderData = {
    customerId: 'CUST-001',
    items: [
      { productId: 'PROD-001', quantity: 1, price: 15000000 },
      { productId: 'PROD-002', quantity: 2, price: 500000 },
    ],
    totalAmount: 16000000,
  };

  // Bắt đầu saga bằng cách phát event đầu tiên
  await eventBus.publish('ORDER_CREATED', { orderData });

  // Đợi một chút để tất cả events được xử lý
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\n📊 Lịch sử Events:');
  eventBus.getHistory().forEach((event, index) => {
    console.log(`   ${index + 1}. ${event.type} (${event.timestamp})`);
  });

  console.log('\n🎉 Choreography Saga hoàn thành!\n');
}

/**
 * Ví dụ 2: Đơn hàng thất bại do thanh toán (Choreography)
 */
async function choreographyExample2_FailedPayment() {
  console.log('='.repeat(60));
  console.log('CHOREOGRAPHY - VÍ DỤ 2: Đơn hàng thất bại do thanh toán');
  console.log('='.repeat(60));
  console.log('\n🚀 Bắt đầu Choreography Saga...\n');

  eventBus.clearHistory();

  const orderData = {
    customerId: 'FAIL', // Customer ID này sẽ làm payment fail
    items: [
      { productId: 'PROD-001', quantity: 1, price: 15000000 },
    ],
    totalAmount: 15000000,
  };

  // Bắt đầu saga
  await eventBus.publish('ORDER_CREATED', { orderData });

  // Đợi một chút để tất cả events được xử lý
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\n📊 Lịch sử Events:');
  eventBus.getHistory().forEach((event, index) => {
    console.log(`   ${index + 1}. ${event.type} (${event.timestamp})`);
  });

  console.log('\n⚠️  Choreography Saga đã rollback!\n');
}

/**
 * Ví dụ 3: Đơn hàng thất bại do không đủ hàng (Choreography)
 */
async function choreographyExample3_InsufficientStock() {
  console.log('='.repeat(60));
  console.log('CHOREOGRAPHY - VÍ DỤ 3: Đơn hàng thất bại do không đủ hàng');
  console.log('='.repeat(60));
  console.log('\n🚀 Bắt đầu Choreography Saga...\n');

  eventBus.clearHistory();

  const orderData = {
    customerId: 'CUST-002',
    items: [
      { productId: 'PROD-001', quantity: 100 }, // Yêu cầu quá nhiều
    ],
    totalAmount: 1500000000,
  };

  // Bắt đầu saga
  await eventBus.publish('ORDER_CREATED', { orderData });

  // Đợi một chút để tất cả events được xử lý
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\n📊 Lịch sử Events:');
  eventBus.getHistory().forEach((event, index) => {
    console.log(`   ${index + 1}. ${event.type} (${event.timestamp})`);
  });

  console.log('\n⚠️  Choreography Saga đã rollback!\n');
}

// Chạy các ví dụ
async function main() {
  try {
    await choreographyExample1_SuccessfulOrder();
    await new Promise(resolve => setTimeout(resolve, 2000));

    await choreographyExample2_FailedPayment();
    await new Promise(resolve => setTimeout(resolve, 2000));

    await choreographyExample3_InsufficientStock();
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

main();
