/**
 * VÍ DỤ TUÂN THỦ OPEN/CLOSED PRINCIPLE (OCP)
 * 
 * Giải pháp: Sử dụng abstraction (interface/base class) và polymorphism
 * - Tạo base class PaymentMethod
 * - Mỗi phương thức thanh toán là một class kế thừa
 * - Thêm phương thức mới: chỉ cần tạo class mới, KHÔNG sửa code cũ
 * 
 * Lợi ích:
 * - Mở rộng dễ dàng: thêm class mới
 * - Không sửa code cũ: giảm rủi ro
 * - Tuân thủ OCP: "Open for extension, Closed for modification"
 */

// Base class (Abstract class) - định nghĩa interface chung
class PaymentMethod {
    constructor(name) {
        if (this.constructor === PaymentMethod) {
            throw new Error('Không thể khởi tạo abstract class PaymentMethod');
        }
        this.name = name;
    }

    // Abstract method - bắt buộc phải implement
    processPayment(amount) {
        throw new Error('Method processPayment() must be implemented');
    }

    refund(amount) {
        throw new Error('Method refund() must be implemented');
    }
}

// Concrete class 1: Thanh toán bằng thẻ tín dụng
class CreditCardPayment extends PaymentMethod {
    constructor() {
        super('Thẻ tín dụng');
    }

    processPayment(amount) {
        console.log(`\n💳 Xử lý thanh toán ${amount.toLocaleString('vi-VN')} VNĐ`);
        console.log(`   Phương thức: ${this.name}`);
        console.log('   → Kết nối với cổng thanh toán thẻ');
        console.log('   → Xác thực thông tin thẻ');
        console.log('   → Trừ tiền từ thẻ');
        console.log('   ✅ Thanh toán thành công!');
    }

    refund(amount) {
        console.log(`   ✅ Hoàn ${amount.toLocaleString('vi-VN')} VNĐ về thẻ tín dụng`);
    }
}

// Concrete class 2: Thanh toán qua PayPal
class PayPalPayment extends PaymentMethod {
    constructor() {
        super('PayPal');
    }

    processPayment(amount) {
        console.log(`\n💳 Xử lý thanh toán ${amount.toLocaleString('vi-VN')} VNĐ`);
        console.log(`   Phương thức: ${this.name}`);
        console.log('   → Kết nối với PayPal API');
        console.log('   → Xác thực tài khoản PayPal');
        console.log('   → Chuyển tiền qua PayPal');
        console.log('   ✅ Thanh toán thành công!');
    }

    refund(amount) {
        console.log(`   ✅ Hoàn ${amount.toLocaleString('vi-VN')} VNĐ về PayPal`);
    }
}

// Concrete class 3: Chuyển khoản ngân hàng
class BankTransferPayment extends PaymentMethod {
    constructor() {
        super('Chuyển khoản ngân hàng');
    }

    processPayment(amount) {
        console.log(`\n💳 Xử lý thanh toán ${amount.toLocaleString('vi-VN')} VNĐ`);
        console.log(`   Phương thức: ${this.name}`);
        console.log('   → Tạo mã QR code');
        console.log('   → Chờ xác nhận từ ngân hàng');
        console.log('   → Đối chiếu giao dịch');
        console.log('   ✅ Thanh toán thành công!');
    }

    refund(amount) {
        console.log(`   ✅ Hoàn ${amount.toLocaleString('vi-VN')} VNĐ về tài khoản ngân hàng`);
    }
}

// Concrete class 4: MoMo - THÊM MỚI mà KHÔNG sửa code cũ!
class MoMoPayment extends PaymentMethod {
    constructor() {
        super('MoMo');
    }

    processPayment(amount) {
        console.log(`\n💳 Xử lý thanh toán ${amount.toLocaleString('vi-VN')} VNĐ`);
        console.log(`   Phương thức: ${this.name}`);
        console.log('   → Kết nối với MoMo API');
        console.log('   → Xác thực ví MoMo');
        console.log('   → Trừ tiền từ ví');
        console.log('   ✅ Thanh toán thành công!');
    }

    refund(amount) {
        console.log(`   ✅ Hoàn ${amount.toLocaleString('vi-VN')} VNĐ về ví MoMo`);
    }
}

// PaymentProcessor - KHÔNG cần sửa khi thêm phương thức mới!
class PaymentProcessor {
    processPayment(amount, paymentMethod) {
        // Chỉ cần gọi method của paymentMethod
        // Không cần biết đó là phương thức gì
        paymentMethod.processPayment(amount);
    }

    refund(amount, paymentMethod) {
        console.log(`\n💰 Hoàn tiền ${amount.toLocaleString('vi-VN')} VNĐ`);
        paymentMethod.refund(amount);
    }
}

// ===== DEMO =====
console.log('✅ VÍ DỤ TUÂN THỦ OCP - Mở rộng không cần sửa code cũ\n');
console.log('='.repeat(60));

const processor = new PaymentProcessor();

// Tạo các payment method
const creditCard = new CreditCardPayment();
const paypal = new PayPalPayment();
const bankTransfer = new BankTransferPayment();
const momo = new MoMoPayment();

// Xử lý thanh toán - code giống nhau cho mọi phương thức
processor.processPayment(500000, creditCard);
processor.processPayment(1000000, paypal);
processor.processPayment(750000, momo);

// Hoàn tiền
processor.refund(100000, bankTransfer);

console.log('\n✅ LỢI ÍCH CỦA OCP:');
console.log('   ✓ Thêm phương thức mới: chỉ cần tạo class mới');
console.log('   ✓ KHÔNG cần sửa PaymentProcessor');
console.log('   ✓ KHÔNG cần sửa các payment method cũ');
console.log('   ✓ Giảm rủi ro làm hỏng code đang hoạt động');
console.log('   ✓ Dễ test: test từng payment method riêng');
console.log('\n   → "Open for extension, Closed for modification"!');

console.log('\n💡 Ví dụ: Muốn thêm ZaloPay?');
console.log('   → Chỉ cần tạo class ZaloPayPayment extends PaymentMethod');
console.log('   → KHÔNG cần sửa bất kỳ code nào khác!');

console.log('\n' + '='.repeat(60));
console.log('💡 So sánh với 2-ocp-bad.js để thấy sự khác biệt!\n');
