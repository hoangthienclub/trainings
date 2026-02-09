/**
 * VÍ DỤ TUÂN THỦ DEPENDENCY INVERSION PRINCIPLE (DIP)
 * 
 * Giải pháp: Cả high-level và low-level đều phụ thuộc vào abstraction
 * - Tạo interface Database (abstraction)
 * - UserService phụ thuộc vào interface Database
 * - MySQLDatabase, PostgreSQLDatabase implement interface Database
 * 
 * Lợi ích:
 * - Dễ thay đổi database: chỉ cần inject implementation khác
 * - Dễ test: có thể inject mock database
 * - Tuân thủ DIP: cả hai đều phụ thuộc vào abstraction
 */

// Abstraction: Database Interface
class IDatabase {
    connect() {
        throw new Error('Method connect() must be implemented');
    }

    query(sql) {
        throw new Error('Method query() must be implemented');
    }

    close() {
        throw new Error('Method close() must be implemented');
    }
}

// Low-level module 1: MySQL Database
class MySQLDatabase extends IDatabase {
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

// Low-level module 2: PostgreSQL Database
class PostgreSQLDatabase extends IDatabase {
    connect() {
        console.log('🔌 Kết nối PostgreSQL database...');
    }

    query(sql) {
        console.log(`📊 Thực thi PostgreSQL query: ${sql}`);
        return { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com' };
    }

    close() {
        console.log('🔒 Đóng kết nối PostgreSQL');
    }
}

// Low-level module 3: MongoDB Database
class MongoDatabase extends IDatabase {
    connect() {
        console.log('🔌 Kết nối MongoDB database...');
    }

    query(filter) {
        console.log(`📊 Thực thi MongoDB query: ${JSON.stringify(filter)}`);
        return { id: 3, name: 'Lê Văn C', email: 'levanc@example.com' };
    }

    close() {
        console.log('🔒 Đóng kết nối MongoDB');
    }
}

// Low-level module 4: Mock Database (cho testing)
class MockDatabase extends IDatabase {
    constructor() {
        super();
        this.data = [
            { id: 1, name: 'Test User 1', email: 'test1@example.com' },
            { id: 2, name: 'Test User 2', email: 'test2@example.com' }
        ];
    }

    connect() {
        console.log('🔌 Mock database connected');
    }

    query(sql) {
        console.log(`📊 Mock query: ${sql}`);
        return this.data[0];
    }

    close() {
        console.log('🔒 Mock database closed');
    }
}

// High-level module: phụ thuộc vào abstraction (IDatabase)
class UserService {
    constructor(database) {
        // Dependency Injection: inject abstraction, không phụ thuộc vào implementation cụ thể
        if (!(database instanceof IDatabase)) {
            throw new Error('Database must implement IDatabase interface');
        }
        this.database = database;
    }

    getUser(userId) {
        console.log(`\n👤 Lấy thông tin user ID: ${userId}`);
        this.database.connect();
        const user = this.database.query(`SELECT * FROM users WHERE id = ${userId}`);
        this.database.close();
        console.log(`✅ Tìm thấy: ${user.name} (${user.email})`);
        return user;
    }

    saveUser(user) {
        console.log(`\n💾 Lưu user: ${user.name}`);
        this.database.connect();
        this.database.query(`INSERT INTO users (name, email) VALUES ('${user.name}', '${user.email}')`);
        this.database.close();
        console.log('✅ Lưu thành công!');
    }
}

// ===== DEMO =====
console.log('✅ VÍ DỤ TUÂN THỦ DIP - Phụ thuộc vào abstraction\n');
console.log('='.repeat(60));

// Sử dụng MySQL
console.log('\n📦 SỬ DỤNG MYSQL:');
console.log('='.repeat(60));
const mysqlDb = new MySQLDatabase();
const userServiceMySQL = new UserService(mysqlDb);
userServiceMySQL.getUser(1);

// Đổi sang PostgreSQL - KHÔNG cần sửa UserService!
console.log('\n📦 CHUYỂN SANG POSTGRESQL:');
console.log('='.repeat(60));
const postgresDb = new PostgreSQLDatabase();
const userServicePostgres = new UserService(postgresDb);
userServicePostgres.getUser(2);

// Đổi sang MongoDB - KHÔNG cần sửa UserService!
console.log('\n📦 CHUYỂN SANG MONGODB:');
console.log('='.repeat(60));
const mongoDb = new MongoDatabase();
const userServiceMongo = new UserService(mongoDb);
userServiceMongo.getUser(3);

// Testing với Mock Database
console.log('\n🧪 TESTING VỚI MOCK DATABASE:');
console.log('='.repeat(60));
const mockDb = new MockDatabase();
const userServiceTest = new UserService(mockDb);
userServiceTest.getUser(1);
userServiceTest.saveUser({ name: 'New User', email: 'new@example.com' });

console.log('\n✅ LỢI ÍCH CỦA DIP:');
console.log('   ✓ UserService phụ thuộc vào IDatabase (abstraction)');
console.log('   ✓ Các database implementation phụ thuộc vào IDatabase');
console.log('   ✓ Dễ thay đổi database: chỉ cần inject implementation khác');
console.log('   ✓ Dễ test: inject MockDatabase');
console.log('   ✓ Không cần sửa UserService khi thêm database mới');
console.log('   ✓ Code linh hoạt, dễ mở rộng, dễ maintain');

console.log('\n💡 Nguyên tắc:');
console.log('   → High-level module phụ thuộc vào abstraction');
console.log('   → Low-level module phụ thuộc vào abstraction');
console.log('   → Sử dụng Dependency Injection');
console.log('   → "Depend on abstractions, not concretions"');

console.log('\n💡 Ứng dụng thực tế:');
console.log('   → Startup: dùng MySQL (rẻ, đơn giản)');
console.log('   → Scale up: chuyển sang PostgreSQL (mạnh hơn)');
console.log('   → Big data: thêm MongoDB cho analytics');
console.log('   → Testing: dùng MockDatabase');
console.log('   → Tất cả KHÔNG cần sửa UserService!');

console.log('\n' + '='.repeat(60));
console.log('💡 So sánh với 5-dip-bad.js để thấy sự khác biệt!\n');
