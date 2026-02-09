/**
 * VÍ DỤ VI PHẠM OPEN/CLOSED PRINCIPLE (OCP)
 * 
 * Open/Closed Principle: "Software entities should be open for extension, but closed for modification"
 * (Mở cho mở rộng, đóng cho sửa đổi)
 * 
 * Vấn đề: Mỗi khi thêm phương thức thanh toán mới, phải sửa code trong class PaymentProcessor
 * -> Vi phạm OCP vì phải "mở" class để sửa đổi
 */

class PaymentProcessor {
    processPayment(amount, method) {
        console.log(`\n💳 Xử lý thanh toán ${amount.toLocaleString('vi-VN')} VNĐ`);

        // Vấn đề: Phải dùng if/else hoặc switch/case
        // Mỗi khi thêm phương thức mới -> phải sửa code ở đây
        if (method === 'credit-card') {
            console.log('   Phương thức: Thẻ tín dụng');
            console.log('   → Kết nối với cổng thanh toán thẻ');
            console.log('   → Xác thực thông tin thẻ');
            console.log('   → Trừ tiền từ thẻ');
            console.log('   ✅ Thanh toán thành công qua thẻ tín dụng!');

        } else if (method === 'paypal') {
            console.log('   Phương thức: PayPal');
            console.log('   → Kết nối với PayPal API');
            console.log('   → Xác thực tài khoản PayPal');
            console.log('   → Chuyển tiền qua PayPal');
            console.log('   ✅ Thanh toán thành công qua PayPal!');

        } else if (method === 'bank-transfer') {
            console.log('   Phương thức: Chuyển khoản ngân hàng');
            console.log('   → Tạo mã QR code');
            console.log('   → Chờ xác nhận từ ngân hàng');
            console.log('   → Đối chiếu giao dịch');
            console.log('   ✅ Thanh toán thành công qua chuyển khoản!');

        } else if (method === 'momo') {
            // Giả sử thêm phương thức MoMo mới
            // -> Phải sửa code ở đây -> Vi phạm OCP!
            console.log('   Phương thức: MoMo');
            console.log('   → Kết nối với MoMo API');
            console.log('   → Xác thực ví MoMo');
            console.log('   → Trừ tiền từ ví');
            console.log('   ✅ Thanh toán thành công qua MoMo!');

        } else {
            throw new Error(`Phương thức thanh toán "${method}" không được hỗ trợ`);
        }
    }

    refund(amount, method) {
        console.log(`\n💰 Hoàn tiền ${amount.toLocaleString('vi-VN')} VNĐ`);

        // Vấn đề tương tự: phải lặp lại logic if/else
        if (method === 'credit-card') {
            console.log('   ✅ Hoàn tiền về thẻ tín dụng');
        } else if (method === 'paypal') {
            console.log('   ✅ Hoàn tiền về PayPal');
        } else if (method === 'bank-transfer') {
            console.log('   ✅ Hoàn tiền về tài khoản ngân hàng');
        } else if (method === 'momo') {
            console.log('   ✅ Hoàn tiền về ví MoMo');
        } else {
            throw new Error(`Không thể hoàn tiền cho phương thức "${method}"`);
        }
    }
}

// ===== DEMO =====
console.log('🔴 VÍ DỤ VI PHẠM OCP - Phải sửa code khi thêm tính năng mới\n');
console.log('='.repeat(60));

const processor = new PaymentProcessor();

// Test các phương thức thanh toán
processor.processPayment(500000, 'credit-card');
processor.processPayment(1000000, 'paypal');
processor.processPayment(750000, 'momo');

console.log('\n❌ VẤN ĐỀ:');
console.log('   - Mỗi khi thêm phương thức thanh toán mới (VNPay, ZaloPay...)');
console.log('   - Phải sửa code trong class PaymentProcessor');
console.log('   - Thêm if/else hoặc case mới');
console.log('   - Rủi ro: có thể làm hỏng code cũ');
console.log('   - Vi phạm OCP: không "đóng cho sửa đổi"!');

console.log('\n' + '='.repeat(60));
console.log('💡 Xem file 2-ocp-good.js để biết cách làm đúng!\n');
