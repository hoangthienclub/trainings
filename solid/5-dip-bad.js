/**
 * VÍ DỤ VI PHẠM DEPENDENCY INVERSION PRINCIPLE (DIP)
 * 
 * Dependency Inversion Principle:
 * 1. High-level modules should not depend on low-level modules. 
 *    Both should depend on abstractions.
 * 2. Abstractions should not depend on details. 
 *    Details should depend on abstractions.
 * 
 * Vấn đề: UserService (high-level) phụ thuộc trực tiếp vào MySQLDatabase (low-level)
 * -> Khó thay đổi database, khó test, vi phạm DIP
 */

// Low-level module: MySQL Database
class MySQLDatabase {
    connect() {
        console.log('🔌 Kết nối MySQL database...');
    }

    query(sql) {
        console.log(`📊 Thực thi MySQL query: ${sql}`);
        return { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com' };
    }

    close() {
        console.log('🔒 Đóng kết nối MySQL');
    }
}

// High-level module phụ thuộc trực tiếp vào low-level module
// -> Vi phạm DIP!
class UserService {
    constructor() {
        // Vấn đề: phụ thuộc cứng vào MySQLDatabase
        this.database = new MySQLDatabase();
    }

    getUser(userId) {
        console.log(`\n👤 Lấy thông tin user ID: ${userId}`);
        this.database.connect();
        const user = this.database.query(`SELECT * FROM users WHERE id = ${userId}`);
        this.database.close();
        return user;
    }

    saveUser(user) {
        console.log(`\n💾 Lưu user: ${user.name}`);
        this.database.connect();
        this.database.query(`INSERT INTO users (name, email) VALUES ('${user.name}', '${user.email}')`);
        this.database.close();
    }
}

// ===== DEMO =====
console.log('🔴 VÍ DỤ VI PHẠM DIP - High-level phụ thuộc vào low-level\n');
console.log('='.repeat(60));

const userService = new UserService();

// Sử dụng service
userService.getUser(1);
userService.saveUser({ name: 'Trần Thị B', email: 'tranthib@example.com' });

console.log('\n❌ VẤN ĐỀ:');
console.log('   - UserService phụ thuộc cứng vào MySQLDatabase');
console.log('   - Muốn đổi sang PostgreSQL? -> Phải sửa UserService!');
console.log('   - Muốn đổi sang MongoDB? -> Phải sửa UserService!');
console.log('   - Khó test: không thể mock database');
console.log('   - Vi phạm DIP: high-level phụ thuộc vào low-level!');

console.log('\n💡 Hậu quả:');
console.log('   - Code cứng nhắc, khó thay đổi');
console.log('   - Không thể test UserService độc lập');
console.log('   - Thay đổi database -> phải sửa nhiều nơi');
console.log('   - Khó mở rộng, khó maintain');

console.log('\n💡 Ví dụ thực tế:');
console.log('   - Startup dùng MySQL');
console.log('   - Sau này scale lên, muốn chuyển sang PostgreSQL');
console.log('   - Hoặc muốn dùng MongoDB cho một số feature');
console.log('   - → Phải refactor toàn bộ UserService!');

console.log('\n' + '='.repeat(60));
console.log('💡 Xem file 5-dip-good.js để biết cách làm đúng!\n');
