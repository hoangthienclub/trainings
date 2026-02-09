/**
 * Payment Service - Quản lý thanh toán
 */

export class PaymentService {
  constructor() {
    this.payments = new Map();
    this.failedPaymentIds = new Set(); // Để test trường hợp lỗi
  }

  /**
   * Xử lý thanh toán
   */
  async processPayment(context) {
    const { orderId, totalAmount, customerId } = context;
    const paymentId = `PAY-${Date.now()}`;

    // Giả lập kiểm tra thẻ tín dụng
    // Nếu customerId là "FAIL", sẽ fail payment để test rollback
    if (customerId === 'FAIL') {
      throw new Error('Thẻ tín dụng không hợp lệ hoặc không đủ số dư');
    }

    const payment = {
      paymentId,
      orderId,
      customerId,
      amount: totalAmount,
      status: 'COMPLETED',
      processedAt: new Date().toISOString(),
    };

    this.payments.set(paymentId, payment);
    console.log(`   → Đã thanh toán ${totalAmount} VNĐ (Payment ID: ${paymentId})`);

    return { paymentId, payment };
  }

  /**
   * Refund - Hoàn tiền (compensation)
   */
  async refundPayment(context) {
    const { paymentId } = context;
    
    if (this.payments.has(paymentId)) {
      const payment = this.payments.get(paymentId);
      payment.status = 'REFUNDED';
      console.log(`   → Đã hoàn tiền ${payment.amount} VNĐ (Payment ID: ${paymentId})`);
    }
  }

  /**
   * Lấy thông tin payment
   */
  getPayment(paymentId) {
    return this.payments.get(paymentId);
  }
}
