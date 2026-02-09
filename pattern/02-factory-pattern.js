/**
 * FACTORY PATTERN
 * ===============
 * 
 * Định nghĩa:
 * Factory Pattern cung cấp một interface để tạo objects mà không cần chỉ định 
 * chính xác class của object sẽ được tạo. Việc tạo object được ủy thác cho 
 * factory class/function.
 * 
 * Khi nào sử dụng:
 * - Khi không biết trước loại object cần tạo
 * - Khi muốn tập trung logic tạo object ở một nơi
 * - Khi có nhiều loại object tương tự nhau
 * - Khi muốn giảm sự phụ thuộc giữa code và concrete classes
 * 
 * Ưu điểm:
 * - Tách biệt code tạo object khỏi code sử dụng object
 * - Dễ dàng thêm loại object mới mà không sửa code cũ
 * - Tuân thủ Single Responsibility Principle
 * - Tuân thủ Open/Closed Principle
 * 
 * Nhược điểm:
 * - Code có thể phức tạp hơn do thêm nhiều classes
 * - Cần tạo thêm factory class
 */

// ============================================
// VÍ DỤ 1: Simple Factory - Tạo các loại xe
// ============================================

// Các class sản phẩm
class Car {
    constructor(model) {
        this.type = 'Car';
        this.model = model;
        this.wheels = 4;
        this.doors = 4;
    }

    getInfo() {
        return `${this.type} - ${this.model}: ${this.wheels} wheels, ${this.doors} doors`;
    }

    drive() {
        return `🚗 Driving ${this.model} car on the road`;
    }
}

class Motorcycle {
    constructor(model) {
        this.type = 'Motorcycle';
        this.model = model;
        this.wheels = 2;
    }

    getInfo() {
        return `${this.type} - ${this.model}: ${this.wheels} wheels`;
    }

    drive() {
        return `🏍️  Riding ${this.model} motorcycle`;
    }
}

class Truck {
    constructor(model) {
        this.type = 'Truck';
        this.model = model;
        this.wheels = 6;
        this.doors = 2;
        this.capacity = '10 tons';
    }

    getInfo() {
        return `${this.type} - ${this.model}: ${this.wheels} wheels, capacity: ${this.capacity}`;
    }

    drive() {
        return `🚚 Driving ${this.model} truck, carrying heavy loads`;
    }
}

// Factory class
class VehicleFactory {
    static createVehicle(type, model) {
        switch (type.toLowerCase()) {
            case 'car':
                return new Car(model);
            case 'motorcycle':
                return new Motorcycle(model);
            case 'truck':
                return new Truck(model);
            default:
                throw new Error(`Unknown vehicle type: ${type}`);
        }
    }
}

// ============================================
// VÍ DỤ 2: Factory Method - Tạo các loại User
// ============================================

// Base class
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.permissions = [];
    }

    getInfo() {
        return `${this.role}: ${this.name} (${this.email})`;
    }

    getPermissions() {
        return this.permissions;
    }
}

// Concrete classes
class AdminUser extends User {
    constructor(name, email) {
        super(name, email);
        this.role = 'Admin';
        this.permissions = ['read', 'write', 'delete', 'manage_users', 'manage_system'];
    }

    manageUsers() {
        return `👑 ${this.name} is managing users`;
    }
}

class EditorUser extends User {
    constructor(name, email) {
        super(name, email);
        this.role = 'Editor';
        this.permissions = ['read', 'write', 'edit', 'publish'];
    }

    editContent() {
        return `✏️  ${this.name} is editing content`;
    }
}

class ViewerUser extends User {
    constructor(name, email) {
        super(name, email);
        this.role = 'Viewer';
        this.permissions = ['read'];
    }

    viewContent() {
        return `👀 ${this.name} is viewing content`;
    }
}

// Factory
class UserFactory {
    static createUser(role, name, email) {
        switch (role.toLowerCase()) {
            case 'admin':
                return new AdminUser(name, email);
            case 'editor':
                return new EditorUser(name, email);
            case 'viewer':
                return new ViewerUser(name, email);
            default:
                throw new Error(`Unknown user role: ${role}`);
        }
    }

    // Factory method với logic phức tạp hơn
    static createUserFromData(userData) {
        const { role, name, email, department } = userData;

        // Logic phức tạp để quyết định loại user
        if (department === 'IT' && role === 'admin') {
            const user = new AdminUser(name, email);
            user.department = department;
            user.permissions.push('system_access');
            return user;
        }

        return this.createUser(role, name, email);
    }
}

// ============================================
// VÍ DỤ 3: Abstract Factory - Tạo UI Components
// ============================================

// Abstract Products
class Button {
    render() {
        throw new Error('Method render() must be implemented');
    }
}

class Input {
    render() {
        throw new Error('Method render() must be implemented');
    }
}

// Concrete Products - Light Theme
class LightButton extends Button {
    render() {
        return '🔘 [Light Button] - White background, dark text';
    }
}

class LightInput extends Input {
    render() {
        return '📝 [Light Input] - White background, dark border';
    }
}

// Concrete Products - Dark Theme
class DarkButton extends Button {
    render() {
        return '🔘 [Dark Button] - Dark background, light text';
    }
}

class DarkInput extends Input {
    render() {
        return '📝 [Dark Input] - Dark background, light border';
    }
}

// Concrete Products - Material Theme
class MaterialButton extends Button {
    render() {
        return '🔘 [Material Button] - Elevated, shadow effect';
    }
}

class MaterialInput extends Input {
    render() {
        return '📝 [Material Input] - Underline style, floating label';
    }
}

// Abstract Factory
class UIFactory {
    createButton() {
        throw new Error('Method createButton() must be implemented');
    }

    createInput() {
        throw new Error('Method createInput() must be implemented');
    }
}

// Concrete Factories
class LightThemeFactory extends UIFactory {
    createButton() {
        return new LightButton();
    }

    createInput() {
        return new LightInput();
    }
}

class DarkThemeFactory extends UIFactory {
    createButton() {
        return new DarkButton();
    }

    createInput() {
        return new DarkInput();
    }
}

class MaterialThemeFactory extends UIFactory {
    createButton() {
        return new MaterialButton();
    }

    createInput() {
        return new MaterialInput();
    }
}

// Factory Provider
class ThemeFactoryProvider {
    static getFactory(theme) {
        switch (theme.toLowerCase()) {
            case 'light':
                return new LightThemeFactory();
            case 'dark':
                return new DarkThemeFactory();
            case 'material':
                return new MaterialThemeFactory();
            default:
                throw new Error(`Unknown theme: ${theme}`);
        }
    }
}

// ============================================
// VÍ DỤ 4: Factory với Configuration
// ============================================

class DatabaseConnection {
    constructor(config) {
        this.config = config;
    }

    connect() {
        throw new Error('Method connect() must be implemented');
    }
}

class MySQLConnection extends DatabaseConnection {
    connect() {
        return `🔌 Connected to MySQL at ${this.config.host}:${this.config.port}`;
    }
}

class PostgreSQLConnection extends DatabaseConnection {
    connect() {
        return `🔌 Connected to PostgreSQL at ${this.config.host}:${this.config.port}`;
    }
}

class MongoDBConnection extends DatabaseConnection {
    connect() {
        return `🔌 Connected to MongoDB at ${this.config.host}:${this.config.port}`;
    }
}

class DatabaseFactory {
    static createConnection(type, config) {
        const defaultConfig = {
            host: 'localhost',
            port: this.getDefaultPort(type),
            username: 'root',
            password: '',
            database: 'mydb',
            ...config
        };

        switch (type.toLowerCase()) {
            case 'mysql':
                return new MySQLConnection(defaultConfig);
            case 'postgresql':
                return new PostgreSQLConnection(defaultConfig);
            case 'mongodb':
                return new MongoDBConnection(defaultConfig);
            default:
                throw new Error(`Unsupported database type: ${type}`);
        }
    }

    static getDefaultPort(type) {
        const ports = {
            mysql: 3306,
            postgresql: 5432,
            mongodb: 27017
        };
        return ports[type.toLowerCase()] || 3306;
    }
}

// ============================================
// DEMO VÀ TEST
// ============================================

console.log('\n========== FACTORY PATTERN DEMO ==========\n');

// Test 1: Vehicle Factory
console.log('--- Test 1: Vehicle Factory ---');
const car = VehicleFactory.createVehicle('car', 'Toyota Camry');
const motorcycle = VehicleFactory.createVehicle('motorcycle', 'Honda CBR');
const truck = VehicleFactory.createVehicle('truck', 'Volvo FH16');

console.log(car.getInfo());
console.log(car.drive());
console.log(motorcycle.getInfo());
console.log(motorcycle.drive());
console.log(truck.getInfo());
console.log(truck.drive());
console.log('');

// Test 2: User Factory
console.log('--- Test 2: User Factory ---');
const admin = UserFactory.createUser('admin', 'John Doe', 'john@example.com');
const editor = UserFactory.createUser('editor', 'Jane Smith', 'jane@example.com');
const viewer = UserFactory.createUser('viewer', 'Bob Wilson', 'bob@example.com');

console.log(admin.getInfo());
console.log('Permissions:', admin.getPermissions());
console.log(admin.manageUsers());

console.log(editor.getInfo());
console.log('Permissions:', editor.getPermissions());
console.log(editor.editContent());

console.log(viewer.getInfo());
console.log('Permissions:', viewer.getPermissions());
console.log(viewer.viewContent());
console.log('');

// Test 3: User Factory with complex data
console.log('--- Test 3: User Factory with Data ---');
const itAdmin = UserFactory.createUserFromData({
    role: 'admin',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    department: 'IT'
});
console.log(itAdmin.getInfo());
console.log('Permissions:', itAdmin.getPermissions());
console.log('');

// Test 4: UI Theme Factory
console.log('--- Test 4: UI Theme Factory ---');
const themes = ['light', 'dark', 'material'];

themes.forEach(themeName => {
    console.log(`\n${themeName.toUpperCase()} THEME:`);
    const factory = ThemeFactoryProvider.getFactory(themeName);
    const button = factory.createButton();
    const input = factory.createInput();

    console.log(button.render());
    console.log(input.render());
});
console.log('');

// Test 5: Database Factory
console.log('--- Test 5: Database Factory ---');
const mysqlDb = DatabaseFactory.createConnection('mysql', {
    host: 'db.example.com',
    database: 'production'
});

const mongoDb = DatabaseFactory.createConnection('mongodb', {
    port: 27018
});

const postgresDb = DatabaseFactory.createConnection('postgresql', {
    host: 'postgres.example.com',
    username: 'admin',
    database: 'analytics'
});

console.log(mysqlDb.connect());
console.log(mongoDb.connect());
console.log(postgresDb.connect());
console.log('');

// ============================================
// USE CASE THỰC TẾ: Payment Gateway Factory
// ============================================

class PaymentGateway {
    constructor(config) {
        this.config = config;
    }

    processPayment(amount) {
        throw new Error('Method processPayment() must be implemented');
    }
}

class StripeGateway extends PaymentGateway {
    processPayment(amount) {
        return {
            success: true,
            message: `💳 Processed $${amount} via Stripe`,
            transactionId: `stripe_${Date.now()}`,
            fee: amount * 0.029 + 0.30
        };
    }
}

class PayPalGateway extends PaymentGateway {
    processPayment(amount) {
        return {
            success: true,
            message: `💳 Processed $${amount} via PayPal`,
            transactionId: `paypal_${Date.now()}`,
            fee: amount * 0.034 + 0.30
        };
    }
}

class VNPayGateway extends PaymentGateway {
    processPayment(amount) {
        return {
            success: true,
            message: `💳 Processed ${amount * 23000} VND via VNPay`,
            transactionId: `vnpay_${Date.now()}`,
            fee: amount * 23000 * 0.02
        };
    }
}

class PaymentFactory {
    static createGateway(type, config = {}) {
        switch (type.toLowerCase()) {
            case 'stripe':
                return new StripeGateway({ apiKey: config.apiKey || 'sk_test_xxx' });
            case 'paypal':
                return new PayPalGateway({ clientId: config.clientId || 'paypal_xxx' });
            case 'vnpay':
                return new VNPayGateway({ merchantId: config.merchantId || 'vnpay_xxx' });
            default:
                throw new Error(`Unsupported payment gateway: ${type}`);
        }
    }

    static createGatewayByCountry(country, config = {}) {
        const countryGatewayMap = {
            'US': 'stripe',
            'VN': 'vnpay',
            'UK': 'stripe',
            'JP': 'paypal'
        };

        const gatewayType = countryGatewayMap[country] || 'stripe';
        return this.createGateway(gatewayType, config);
    }
}

console.log('--- Use Case: Payment Gateway Factory ---');
const stripeGateway = PaymentFactory.createGateway('stripe');
const vnpayGateway = PaymentFactory.createGatewayByCountry('VN');

console.log(stripeGateway.processPayment(100));
console.log(vnpayGateway.processPayment(100));

/**
 * KẾT LUẬN:
 * 
 * Factory Pattern có 3 dạng chính:
 * 
 * 1. Simple Factory (Factory Method):
 *    - Một method/function tạo objects
 *    - Đơn giản, dễ hiểu
 *    - Phù hợp cho các trường hợp đơn giản
 * 
 * 2. Factory Method Pattern:
 *    - Định nghĩa interface để tạo object
 *    - Subclass quyết định class nào được khởi tạo
 *    - Linh hoạt hơn Simple Factory
 * 
 * 3. Abstract Factory Pattern:
 *    - Tạo families of related objects
 *    - Không cần chỉ định concrete classes
 *    - Phù hợp cho hệ thống phức tạp với nhiều variants
 * 
 * Khi nào dùng Factory Pattern:
 * - Khi có nhiều loại objects tương tự nhau
 * - Khi logic tạo object phức tạp
 * - Khi muốn tách biệt creation logic khỏi business logic
 * - Khi cần linh hoạt trong việc thêm loại object mới
 * 
 * Ví dụ thực tế:
 * - Payment gateways (Stripe, PayPal, VNPay)
 * - Database connections (MySQL, PostgreSQL, MongoDB)
 * - UI themes (Light, Dark, Material)
 * - User roles (Admin, Editor, Viewer)
 * - Vehicle types (Car, Motorcycle, Truck)
 */
