/**
 * VÍ DỤ TUÂN THỦ SINGLE RESPONSIBILITY PRINCIPLE (SRP)
 * 
 * Giải pháp: Tách thành nhiều class, mỗi class một trách nhiệm duy nhất:
 * - User: Chỉ quản lý dữ liệu user
 * - UserValidator: Chỉ validate dữ liệu
 * - UserRepository: Chỉ xử lý database
 * - EmailService: Chỉ gửi email
 * 
 * Lợi ích:
 * - Dễ maintain: mỗi class nhỏ, tập trung
 * - Dễ test: test từng class riêng biệt
 * - Dễ mở rộng: thêm tính năng không ảnh hưởng class khác
 */

// Class 1: Chỉ quản lý dữ liệu User
class User {
    constructor(name, email, age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    getName() {
        return this.name;
    }

    getEmail() {
        return this.email;
    }

    getAge() {
        return this.age;
    }
}

// Class 2: Chỉ validate dữ liệu
class UserValidator {
    validate(user) {
        if (!user.getName() || user.getName().length < 2) {
            throw new Error('Tên phải có ít nhất 2 ký tự');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.getEmail())) {
            throw new Error('Email không hợp lệ');
        }

        if (user.getAge() < 18) {
            throw new Error('Tuổi phải từ 18 trở lên');
        }

        return true;
    }
}

// Class 3: Chỉ xử lý database
class UserRepository {
    save(user) {
        console.log('💾 Đang lưu vào database...');
        console.log(`   INSERT INTO users (name, email, age) VALUES ('${user.getName()}', '${user.getEmail()}', ${user.getAge()})`);
        console.log('✅ Lưu thành công!');
        return true;
    }

    findByEmail(email) {
        console.log(`🔍 Tìm user với email: ${email}`);
        // Giả lập tìm kiếm
        return null;
    }

    delete(user) {
        console.log(`🗑️  Xóa user: ${user.getName()}`);
        return true;
    }
}

// Class 4: Chỉ gửi email
class EmailService {
    sendWelcomeEmail(user) {
        console.log('📧 Đang gửi email chào mừng...');
        console.log(`   To: ${user.getEmail()}`);
        console.log(`   Subject: Chào mừng ${user.getName()}!`);
        console.log(`   Body: Xin chào ${user.getName()}, cảm ơn bạn đã đăng ký!`);
        console.log('✅ Email đã được gửi!');
    }

    sendPasswordResetEmail(user) {
        console.log('📧 Gửi email reset password...');
        console.log(`   To: ${user.getEmail()}`);
        // Logic gửi email reset password
    }
}

// Class 5: Orchestrator - điều phối các class khác
class UserService {
    constructor() {
        this.validator = new UserValidator();
        this.repository = new UserRepository();
        this.emailService = new EmailService();
    }

    registerUser(name, email, age) {
        // Tạo user
        const user = new User(name, email, age);

        // Validate
        this.validator.validate(user);

        // Lưu database
        this.repository.save(user);

        // Gửi email
        this.emailService.sendWelcomeEmail(user);

        return user;
    }
}

// ===== DEMO =====
console.log('✅ VÍ DỤ TUÂN THỦ SRP - Mỗi class một trách nhiệm\n');
console.log('='.repeat(60));

try {
    const userService = new UserService();

    console.log('📝 Đăng ký user mới...\n');
    const user = userService.registerUser('Nguyễn Văn A', 'nguyenvana@example.com', 25);

    console.log('\n✅ LỢI ÍCH CỦA SRP:');
    console.log('   ✓ User class: Chỉ quản lý dữ liệu');
    console.log('   ✓ UserValidator: Chỉ validate');
    console.log('   ✓ UserRepository: Chỉ xử lý database');
    console.log('   ✓ EmailService: Chỉ gửi email');
    console.log('   ✓ UserService: Điều phối các class');
    console.log('\n   → Dễ test, dễ maintain, dễ mở rộng!');
    console.log('   → Thay đổi validation không ảnh hưởng database');
    console.log('   → Thay đổi email service không ảnh hưởng user data');

} catch (error) {
    console.error('❌ Lỗi:', error.message);
}

console.log('\n' + '='.repeat(60));
console.log('💡 So sánh với 1-srp-bad.js để thấy sự khác biệt!\n');
