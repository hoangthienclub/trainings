/**
 * Event Bus - Quản lý events trong Choreography-based Saga
 * 
 * Trong Choreography pattern, các services giao tiếp với nhau
 * thông qua events thay vì có một orchestrator trung tâm.
 */

export class EventBus {
  constructor() {
    this.subscribers = new Map();
    this.eventHistory = [];
  }

  /**
   * Đăng ký lắng nghe một event
   * @param {string} eventType - Loại event
   * @param {Function} handler - Hàm xử lý event
   * @param {string} serviceName - Tên service (để logging)
   */
  subscribe(eventType, handler, serviceName) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType).push({ handler, serviceName });
  }

  /**
   * Phát một event
   * @param {string} eventType - Loại event
   * @param {Object} data - Dữ liệu event
   */
  async publish(eventType, data) {
    const event = {
      type: eventType,
      data,
      timestamp: new Date().toISOString(),
    };

    this.eventHistory.push(event);
    console.log(`📢 Event published: ${eventType}`);

    // Gọi tất cả handlers đã đăng ký
    const handlers = this.subscribers.get(eventType) || [];
    
    for (const { handler, serviceName } of handlers) {
      try {
        console.log(`   → ${serviceName} đang xử lý event ${eventType}`);
        await handler(event);
      } catch (error) {
        console.error(`   ❌ Lỗi khi ${serviceName} xử lý ${eventType}:`, error.message);
        // Phát event lỗi để các service khác có thể rollback
        await this.publish(`${eventType}_FAILED`, { ...data, error: error.message });
      }
    }
  }

  /**
   * Lấy lịch sử events
   */
  getHistory() {
    return this.eventHistory;
  }

  /**
   * Xóa lịch sử events
   */
  clearHistory() {
    this.eventHistory = [];
  }
}
