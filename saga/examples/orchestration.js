/**
 * Orchestration-based Saga Examples
 * 
 * Các ví dụ về cách sử dụng Orchestration pattern
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
 * Tạo một saga để xử lý đơn hàng
 */
function createOrderSaga() {
  const saga = new SagaOrchestrator();

  // Bước 1: Tạo đơn hàng
  saga.addStep(
    async (context) => {
      const result = await orderService.createOrder({
        customerId: context.customerId,
        items: context.items,
        totalAmount: context.totalAmount,
      });
      return { orderId: result.orderId, order: result.order };
    },
    async (context) => {
      await orderService.cancelOrder(context);
    },
    'Tạo đơn hàng'
  );

  // Bước 2: Giữ hàng trong kho
  saga.addStep(
    async (context) => {
      const result = await inventoryService.reserveInventory(context);
      return { reservations: result.reservations };
    },
    async (context) => {
      await inventoryService.releaseInventory(context);
    },
    'Giữ hàng trong kho'
  );

  // Bước 3: Xử lý thanh toán
  saga.addStep(
    async (context) => {
      const result = await paymentService.processPayment(context);
      return { paymentId: result.paymentId, payment: result.payment };
    },
    async (context) => {
      await paymentService.refundPayment(context);
    },
    'Xử lý thanh toán'
  );

  // Bước 4: Tạo đơn vận chuyển
  saga.addStep(
    async (context) => {
      const result = await shippingService.createShipment(context);
      return { shipmentId: result.shipmentId, shipment: result.shipment };
    },
    async (context) => {
      await shippingService.cancelShipment(context);
    },
    'Tạo đơn vận chuyển'
  );

  return saga;
}

/**
 * Ví dụ 1: Đơn hàng thành công
 */
async function example1_SuccessfulOrder() {
  console.log('='.repeat(60));
  console.log('ORCHESTRATION - VÍ DỤ 1: Đơn hàng thành công');
  console.log('='.repeat(60));

  const saga = createOrderSaga();
  
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
 * Ví dụ 2: Đơn hàng thất bại do thanh toán (sẽ rollback)
 */
async function example2_FailedPayment() {
  console.log('='.repeat(60));
  console.log('ORCHESTRATION - VÍ DỤ 2: Đơn hàng thất bại do thanh toán (Rollback)');
  console.log('='.repeat(60));

  const saga = createOrderSaga();
  
  const context = {
    customerId: 'FAIL', // Customer ID này sẽ làm payment fail
    items: [
      { productId: 'PROD-001', quantity: 1, price: 15000000 },
    ],
    totalAmount: 15000000,
  };

  const result = await saga.execute(context);
  
  console.log('\n📊 Kết quả:', result);
  console.log('\n');
}

/**
 * Ví dụ 3: Đơn hàng thất bại do không đủ hàng (sẽ rollback)
 */
async function example3_InsufficientStock() {
  console.log('='.repeat(60));
  console.log('ORCHESTRATION - VÍ DỤ 3: Đơn hàng thất bại do không đủ hàng (Rollback)');
  console.log('='.repeat(60));

  const saga = createOrderSaga();
  
  const context = {
    customerId: 'CUST-002',
    items: [
      { productId: 'PROD-001', quantity: 100 }, // Yêu cầu quá nhiều
    ],
    totalAmount: 1500000000,
  };

  const result = await saga.execute(context);
  
  console.log('\n📊 Kết quả:', result);
  console.log('\n');
}

// Chạy các ví dụ
async function main() {
  try {
    await example1_SuccessfulOrder();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Delay 2s
    
    await example2_FailedPayment();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await example3_InsufficientStock();
  } catch (error) {
    console.error('Lỗi:', error);
  }
}

main();
