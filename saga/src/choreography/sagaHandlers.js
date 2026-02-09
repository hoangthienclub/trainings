/**
 * Saga Handlers - Đăng ký event handlers cho Choreography-based Saga
 * 
 * File này chứa tất cả các event handlers và compensation handlers
 * cho Choreography pattern.
 */

import { EventBus } from './eventBus.js';
import { OrderService } from '../services/orderService.js';
import { InventoryService } from '../services/inventoryService.js';
import { PaymentService } from '../services/paymentService.js';
import { ShippingService } from '../services/shippingService.js';

/**
 * Khởi tạo và đăng ký tất cả event handlers
 * @param {EventBus} eventBus - Event bus instance
 * @param {Object} services - Object chứa các service instances
 */
export function registerSagaHandlers(eventBus, services) {
  const { orderService, inventoryService, paymentService, shippingService } = services;

  // ============================================
  // Đăng ký Event Handlers cho Order Service
  // ============================================

  eventBus.subscribe('ORDER_CREATED', async (event) => {
    const { orderData } = event.data;
    
    try {
      const result = await orderService.createOrder(orderData);
      console.log(`   ✅ Order Service: Đơn hàng ${result.orderId} đã được tạo\n`);
      
      // Phát event tiếp theo
      await eventBus.publish('ORDER_CREATED_SUCCESS', {
        orderId: result.orderId,
        order: result.order,
        customerId: orderData.customerId,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
      });
    } catch (error) {
      await eventBus.publish('ORDER_CREATED_FAILED', {
        orderData,
        error: error.message,
      });
    }
  }, 'Order Service');

  // ============================================
  // Đăng ký Event Handlers cho Inventory Service
  // ============================================

  eventBus.subscribe('ORDER_CREATED_SUCCESS', async (event) => {
    const { orderId, items, customerId, totalAmount } = event.data;
    
    try {
      const result = await inventoryService.reserveInventory({
        orderId,
        items,
      });
      console.log(`   ✅ Inventory Service: Đã giữ hàng thành công\n`);
      
      // Phát event tiếp theo
      await eventBus.publish('INVENTORY_RESERVED', {
        orderId,
        items,
        customerId,
        totalAmount,
        reservations: result.reservations,
      });
    } catch (error) {
      console.log(`   ❌ Inventory Service: ${error.message}\n`);
      await eventBus.publish('INVENTORY_RESERVED_FAILED', {
        orderId,
        items,
        customerId,
        totalAmount,
        error: error.message,
      });
    }
  }, 'Inventory Service');

  // ============================================
  // Đăng ký Event Handlers cho Payment Service
  // ============================================

  eventBus.subscribe('INVENTORY_RESERVED', async (event) => {
    const { orderId, customerId, totalAmount, reservations } = event.data;
    
    try {
      const result = await paymentService.processPayment({
        orderId,
        customerId,
        totalAmount,
      });
      console.log(`   ✅ Payment Service: Thanh toán thành công\n`);
      
      // Phát event tiếp theo
      await eventBus.publish('PAYMENT_COMPLETED', {
        orderId,
        customerId,
        totalAmount,
        reservations,
        paymentId: result.paymentId,
        payment: result.payment,
      });
    } catch (error) {
      console.log(`   ❌ Payment Service: ${error.message}\n`);
      await eventBus.publish('PAYMENT_COMPLETED_FAILED', {
        orderId,
        customerId,
        totalAmount,
        reservations,
        error: error.message,
      });
    }
  }, 'Payment Service');

  // ============================================
  // Đăng ký Event Handlers cho Shipping Service
  // ============================================

  eventBus.subscribe('PAYMENT_COMPLETED', async (event) => {
    const { orderId, customerId, items, reservations, paymentId } = event.data;
    
    try {
      const result = await shippingService.createShipment({
        orderId,
        customerId,
        items,
      });
      console.log(`   ✅ Shipping Service: Đơn vận chuyển đã được tạo\n`);
      
      // Phát event hoàn thành
      await eventBus.publish('ORDER_COMPLETED', {
        orderId,
        shipmentId: result.shipmentId,
        shipment: result.shipment,
      });
    } catch (error) {
      console.log(`   ❌ Shipping Service: ${error.message}\n`);
      await eventBus.publish('SHIPPING_CREATED_FAILED', {
        orderId,
        customerId,
        items,
        error: error.message,
      });
    }
  }, 'Shipping Service');

  // ============================================
  // Compensation Handlers (Rollback)
  // ============================================

  // Rollback khi Inventory fail
  eventBus.subscribe('INVENTORY_RESERVED_FAILED', async (event) => {
    const { orderId } = event.data;
    console.log(`   🔄 Order Service: Đang hủy đơn hàng ${orderId}\n`);
    await orderService.cancelOrder({ orderId });
  }, 'Order Service (Compensation)');

  // Rollback khi Payment fail
  eventBus.subscribe('PAYMENT_COMPLETED_FAILED', async (event) => {
    const { orderId, reservations } = event.data;
    console.log(`   🔄 Inventory Service: Đang trả lại hàng vào kho\n`);
    await inventoryService.releaseInventory({ reservations });
    
    console.log(`   🔄 Order Service: Đang hủy đơn hàng ${orderId}\n`);
    await orderService.cancelOrder({ orderId });
  }, 'Inventory & Order Service (Compensation)');

  // Rollback khi Shipping fail
  eventBus.subscribe('SHIPPING_CREATED_FAILED', async (event) => {
    const { orderId, reservations, paymentId } = event.data;
    console.log(`   🔄 Payment Service: Đang hoàn tiền\n`);
    await paymentService.refundPayment({ paymentId });
    
    console.log(`   🔄 Inventory Service: Đang trả lại hàng vào kho\n`);
    await inventoryService.releaseInventory({ reservations });
    
    console.log(`   🔄 Order Service: Đang hủy đơn hàng ${orderId}\n`);
    await orderService.cancelOrder({ orderId });
  }, 'Payment, Inventory & Order Service (Compensation)');
}
