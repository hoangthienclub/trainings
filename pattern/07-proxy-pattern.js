/**
 * PROXY PATTERN
 * =============
 * 
 * Định nghĩa:
 * Proxy Pattern cung cấp một object đại diện (surrogate) cho một object khác
 * để kiểm soát việc truy cập vào object đó.
 * 
 * Khi nào sử dụng:
 * - Lazy initialization (tạo object khi cần)
 * - Access control (kiểm soát quyền truy cập)
 * - Logging và monitoring
 * - Caching
 * 
 * Ưu điểm:
 * - Kiểm soát truy cập vào object
 * - Lazy initialization
 * - Thêm logic mà không sửa object gốc
 * 
 * Nhược điểm:
 * - Thêm layer of abstraction
 * - Có thể làm chậm response
 */

// ============================================
// VÍ DỤ 1: Virtual Proxy - Lazy Loading
// ============================================

class RealImage {
    constructor(filename) {
        this.filename = filename;
        this.loadFromDisk();
    }

    loadFromDisk() {
        console.log(`📥 Loading image from disk: ${this.filename}`);
    }

    display() {
        console.log(`🖼️  Displaying: ${this.filename}`);
    }
}

class ImageProxy {
    constructor(filename) {
        this.filename = filename;
        this.realImage = null;
    }

    display() {
        if (!this.realImage) {
            this.realImage = new RealImage(this.filename);
        }
        this.realImage.display();
    }
}

// ============================================
// VÍ DỤ 2: Protection Proxy - Access Control
// ============================================

class BankAccount {
    constructor(balance) {
        this.balance = balance;
    }

    deposit(amount) {
        this.balance += amount;
        return this.balance;
    }

    withdraw(amount) {
        if (amount > this.balance) {
            throw new Error('Insufficient funds');
        }
        this.balance -= amount;
        return this.balance;
    }

    getBalance() {
        return this.balance;
    }
}

class BankAccountProxy {
    constructor(account, user) {
        this.account = account;
        this.user = user;
    }

    deposit(amount) {
        console.log(`💰 ${this.user.name} depositing $${amount}`);
        return this.account.deposit(amount);
    }

    withdraw(amount) {
        if (!this.user.canWithdraw) {
            throw new Error('❌ Access denied: User cannot withdraw');
        }
        console.log(`💸 ${this.user.name} withdrawing $${amount}`);
        return this.account.withdraw(amount);
    }

    getBalance() {
        if (!this.user.canViewBalance) {
            throw new Error('❌ Access denied: User cannot view balance');
        }
        console.log(`👁️  ${this.user.name} viewing balance`);
        return this.account.getBalance();
    }
}

// ============================================
// VÍ DỤ 3: Caching Proxy
// ============================================

class APIService {
    fetchData(endpoint) {
        console.log(`🌐 Fetching data from API: ${endpoint}`);
        // Simulate API call
        return { data: `Data from ${endpoint}`, timestamp: Date.now() };
    }
}

class CachingAPIProxy {
    constructor(apiService) {
        this.apiService = apiService;
        this.cache = new Map();
        this.cacheDuration = 5000; // 5 seconds
    }

    fetchData(endpoint) {
        const cached = this.cache.get(endpoint);

        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            console.log(`💾 Cache hit for: ${endpoint}`);
            return cached.data;
        }

        console.log(`🔄 Cache miss for: ${endpoint}`);
        const data = this.apiService.fetchData(endpoint);
        this.cache.set(endpoint, { data, timestamp: Date.now() });
        return data;
    }

    clearCache() {
        this.cache.clear();
        console.log('🗑️  Cache cleared');
    }
}

// ============================================
// VÍ DỤ 4: ES6 Proxy (Built-in)
// ============================================

const person = {
    name: 'John',
    age: 30
};

const personProxy = new Proxy(person, {
    get(target, property) {
        console.log(`📖 Reading property: ${property}`);
        return target[property];
    },

    set(target, property, value) {
        console.log(`✏️  Setting ${property} = ${value}`);

        if (property === 'age' && typeof value !== 'number') {
            throw new Error('Age must be a number');
        }

        if (property === 'age' && value < 0) {
            throw new Error('Age must be positive');
        }

        target[property] = value;
        return true;
    }
});

// ============================================
// VÍ DỤ 5: Logging Proxy
// ============================================

function createLoggingProxy(target, name) {
    return new Proxy(target, {
        get(obj, property) {
            if (typeof obj[property] === 'function') {
                return function (...args) {
                    console.log(`📞 Calling ${name}.${property}(${args.join(', ')})`);
                    const result = obj[property].apply(obj, args);
                    console.log(`✅ ${name}.${property} returned:`, result);
                    return result;
                };
            }
            return obj[property];
        }
    });
}

class Calculator {
    add(a, b) {
        return a + b;
    }

    multiply(a, b) {
        return a * b;
    }
}

// ============================================
// DEMO
// ============================================

console.log('\n========== PROXY PATTERN DEMO ==========\n');

// Test 1: Virtual Proxy
console.log('--- Virtual Proxy (Lazy Loading) ---');
const image1 = new ImageProxy('photo1.jpg');
const image2 = new ImageProxy('photo2.jpg');
console.log('Images created (not loaded yet)');
image1.display(); // Loads now
image1.display(); // Already loaded
image2.display(); // Loads now

// Test 2: Protection Proxy
console.log('\n--- Protection Proxy (Access Control) ---');
const account = new BankAccount(1000);
const adminUser = { name: 'Admin', canWithdraw: true, canViewBalance: true };
const guestUser = { name: 'Guest', canWithdraw: false, canViewBalance: false };

const adminProxy = new BankAccountProxy(account, adminUser);
console.log('Balance:', adminProxy.getBalance());
adminProxy.deposit(500);
adminProxy.withdraw(200);

const guestProxy = new BankAccountProxy(account, guestUser);
try {
    guestProxy.getBalance();
} catch (e) {
    console.log(e.message);
}

// Test 3: Caching Proxy
console.log('\n--- Caching Proxy ---');
const api = new APIService();
const cachedAPI = new CachingAPIProxy(api);

cachedAPI.fetchData('/users');
cachedAPI.fetchData('/users'); // From cache
cachedAPI.fetchData('/posts');

// Test 4: ES6 Proxy
console.log('\n--- ES6 Proxy (Validation) ---');
console.log(personProxy.name);
personProxy.age = 31;
try {
    personProxy.age = 'thirty'; // Error
} catch (e) {
    console.log('❌', e.message);
}

// Test 5: Logging Proxy
console.log('\n--- Logging Proxy ---');
const calc = new Calculator();
const loggedCalc = createLoggingProxy(calc, 'Calculator');
loggedCalc.add(5, 3);
loggedCalc.multiply(4, 7);
