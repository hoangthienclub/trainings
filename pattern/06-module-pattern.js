/**
 * MODULE PATTERN
 * ==============
 * 
 * Định nghĩa:
 * Module Pattern cung cấp cách để đóng gói private và public methods/variables
 * trong một single object, giúp tránh pollution của global scope.
 * 
 * Khi nào sử dụng:
 * - Khi muốn tạo private variables/methods
 * - Khi muốn tổ chức code thành modules
 * - Khi muốn tránh global namespace pollution
 * 
 * Ưu điểm:
 * - Encapsulation (đóng gói)
 * - Private members
 * - Tránh global scope pollution
 * 
 * Nhược điểm:
 * - Khó test private methods
 * - Không thể extend sau khi tạo
 */

// ============================================
// VÍ DỤ 1: Basic Module Pattern (IIFE)
// ============================================

const Calculator = (function () {
    // Private variables
    let history = [];

    // Private methods
    function log(operation, result) {
        history.push({ operation, result, timestamp: new Date() });
    }

    // Public API
    return {
        add(a, b) {
            const result = a + b;
            log(`${a} + ${b}`, result);
            return result;
        },

        subtract(a, b) {
            const result = a - b;
            log(`${a} - ${b}`, result);
            return result;
        },

        multiply(a, b) {
            const result = a * b;
            log(`${a} × ${b}`, result);
            return result;
        },

        divide(a, b) {
            if (b === 0) throw new Error('Division by zero');
            const result = a / b;
            log(`${a} ÷ ${b}`, result);
            return result;
        },

        getHistory() {
            return [...history];
        },

        clearHistory() {
            history = [];
            console.log('🗑️  History cleared');
        }
    };
})();

// ============================================
// VÍ DỤ 2: Revealing Module Pattern
// ============================================

const UserManager = (function () {
    // Private state
    const users = [];
    let nextId = 1;

    // Private methods
    function validateUser(user) {
        if (!user.name || !user.email) {
            throw new Error('Name and email are required');
        }
        if (!user.email.includes('@')) {
            throw new Error('Invalid email format');
        }
        return true;
    }

    function findUserById(id) {
        return users.find(user => user.id === id);
    }

    // Public methods
    function createUser(name, email) {
        const user = { id: nextId++, name, email };
        validateUser(user);
        users.push(user);
        console.log(`✅ Created user: ${name}`);
        return user;
    }

    function getUser(id) {
        return findUserById(id);
    }

    function getAllUsers() {
        return [...users];
    }

    function updateUser(id, updates) {
        const user = findUserById(id);
        if (!user) throw new Error('User not found');
        Object.assign(user, updates);
        validateUser(user);
        console.log(`📝 Updated user: ${user.name}`);
        return user;
    }

    function deleteUser(id) {
        const index = users.findIndex(user => user.id === id);
        if (index === -1) throw new Error('User not found');
        const deleted = users.splice(index, 1)[0];
        console.log(`❌ Deleted user: ${deleted.name}`);
        return deleted;
    }

    // Reveal public API
    return {
        create: createUser,
        get: getUser,
        getAll: getAllUsers,
        update: updateUser,
        delete: deleteUser
    };
})();

// ============================================
// VÍ DỤ 3: Singleton Module Pattern
// ============================================

const AppConfig = (function () {
    let instance;

    function init() {
        // Private variables
        const config = {
            apiUrl: 'http://localhost:3000',
            timeout: 5000,
            debug: true
        };

        // Private methods
        function validate(key, value) {
            if (key === 'timeout' && value < 0) {
                throw new Error('Timeout must be positive');
            }
            return true;
        }

        // Public methods
        return {
            get(key) {
                return config[key];
            },

            set(key, value) {
                validate(key, value);
                config[key] = value;
                console.log(`⚙️  Config updated: ${key} = ${value}`);
            },

            getAll() {
                return { ...config };
            }
        };
    }

    return {
        getInstance() {
            if (!instance) {
                instance = init();
                console.log('🆕 AppConfig instance created');
            }
            return instance;
        }
    };
})();

// ============================================
// VÍ DỤ 4: ES6 Module Pattern
// ============================================

// Private variables (using closure)
const ShoppingCart = (() => {
    const items = [];

    function calculateTotal() {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    return {
        addItem(name, price, quantity = 1) {
            const existing = items.find(item => item.name === name);
            if (existing) {
                existing.quantity += quantity;
            } else {
                items.push({ name, price, quantity });
            }
            console.log(`🛒 Added ${quantity}x ${name}`);
        },

        removeItem(name) {
            const index = items.findIndex(item => item.name === name);
            if (index !== -1) {
                items.splice(index, 1);
                console.log(`❌ Removed ${name}`);
            }
        },

        getItems() {
            return items.map(item => ({ ...item }));
        },

        getTotal() {
            return calculateTotal();
        },

        clear() {
            items.length = 0;
            console.log('🗑️  Cart cleared');
        }
    };
})();

// ============================================
// DEMO
// ============================================

console.log('\n========== MODULE PATTERN DEMO ==========\n');

// Test 1: Calculator
console.log('--- Calculator Module ---');
console.log('5 + 3 =', Calculator.add(5, 3));
console.log('10 - 4 =', Calculator.subtract(10, 4));
console.log('6 × 7 =', Calculator.multiply(6, 7));
console.log('20 ÷ 4 =', Calculator.divide(20, 4));
console.log('History:', Calculator.getHistory());
Calculator.clearHistory();

// Test 2: User Manager
console.log('\n--- User Manager Module ---');
const user1 = UserManager.create('John Doe', 'john@example.com');
const user2 = UserManager.create('Jane Smith', 'jane@example.com');
console.log('All users:', UserManager.getAll());
UserManager.update(user1.id, { name: 'John Updated' });
UserManager.delete(user2.id);

// Test 3: App Config (Singleton)
console.log('\n--- App Config Module ---');
const config1 = AppConfig.getInstance();
const config2 = AppConfig.getInstance();
console.log('Same instance?', config1 === config2);
config1.set('apiUrl', 'https://api.production.com');
console.log('Config from config2:', config2.getAll());

// Test 4: Shopping Cart
console.log('\n--- Shopping Cart Module ---');
ShoppingCart.addItem('Laptop', 1200, 1);
ShoppingCart.addItem('Mouse', 25, 2);
ShoppingCart.addItem('Keyboard', 75, 1);
console.log('Cart items:', ShoppingCart.getItems());
console.log('Total: $' + ShoppingCart.getTotal());
ShoppingCart.removeItem('Mouse');
console.log('New total: $' + ShoppingCart.getTotal());
