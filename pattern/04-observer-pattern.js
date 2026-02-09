/**
 * OBSERVER PATTERN
 * ================
 * 
 * Định nghĩa:
 * Observer Pattern định nghĩa mối quan hệ phụ thuộc một-nhiều giữa các objects,
 * khi một object thay đổi trạng thái, tất cả các objects phụ thuộc vào nó sẽ
 * được thông báo và cập nhật tự động.
 * 
 * Khi nào sử dụng:
 * - Khi thay đổi của một object cần thông báo cho nhiều objects khác
 * - Khi muốn loose coupling giữa objects
 * - Event handling systems
 * - Pub/Sub messaging
 * 
 * Ưu điểm:
 * - Loose coupling giữa Subject và Observers
 * - Hỗ trợ broadcast communication
 * - Dễ dàng thêm/xóa observers
 * 
 * Nhược điểm:
 * - Observers được thông báo theo thứ tự ngẫu nhiên
 * - Có thể gây memory leaks nếu không unsubscribe
 */

// ============================================
// VÍ DỤ 1: News Publisher - Subscriber
// ============================================

class Subject {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
        console.log(`✅ ${observer.name} subscribed`);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
        console.log(`❌ ${observer.name} unsubscribed`);
    }

    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}

class NewsAgency extends Subject {
    constructor(name) {
        super();
        this.name = name;
        this.latestNews = null;
    }

    publishNews(news) {
        console.log(`\n📰 ${this.name} publishing: "${news}"`);
        this.latestNews = news;
        this.notify(news);
    }
}

class Subscriber {
    constructor(name) {
        this.name = name;
    }

    update(news) {
        console.log(`   📱 ${this.name} received: "${news}"`);
    }
}

// ============================================
// VÍ DỤ 2: Stock Market
// ============================================

class Stock {
    constructor(symbol, price) {
        this.symbol = symbol;
        this.price = price;
        this.investors = [];
    }

    attach(investor) {
        this.investors.push(investor);
        console.log(`💼 ${investor.name} is now watching ${this.symbol}`);
    }

    detach(investor) {
        this.investors = this.investors.filter(inv => inv !== investor);
        console.log(`👋 ${investor.name} stopped watching ${this.symbol}`);
    }

    setPrice(newPrice) {
        const oldPrice = this.price;
        this.price = newPrice;
        const change = ((newPrice - oldPrice) / oldPrice * 100).toFixed(2);

        console.log(`\n📊 ${this.symbol}: $${oldPrice} → $${newPrice} (${change}%)`);
        this.notifyInvestors(oldPrice, newPrice);
    }

    notifyInvestors(oldPrice, newPrice) {
        this.investors.forEach(investor => {
            investor.update(this.symbol, oldPrice, newPrice);
        });
    }
}

class Investor {
    constructor(name) {
        this.name = name;
    }

    update(symbol, oldPrice, newPrice) {
        const trend = newPrice > oldPrice ? '📈' : '📉';
        console.log(`   ${trend} ${this.name}: ${symbol} changed to $${newPrice}`);
    }
}

// ============================================
// VÍ DỤ 3: Event Emitter (Node.js style)
// ============================================

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    off(eventName, callback) {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }

    emit(eventName, data) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(callback => callback(data));
    }

    once(eventName, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(eventName, wrapper);
        };
        this.on(eventName, wrapper);
    }
}

class UserService extends EventEmitter {
    constructor() {
        super();
        this.users = [];
    }

    createUser(user) {
        this.users.push(user);
        this.emit('userCreated', user);
    }

    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        this.users = this.users.filter(u => u.id !== userId);
        this.emit('userDeleted', user);
    }
}

// ============================================
// DEMO
// ============================================

console.log('\n========== OBSERVER PATTERN DEMO ==========\n');

// Test 1: News Agency
console.log('--- News Publisher ---');
const bbc = new NewsAgency('BBC News');
const subscriber1 = new Subscriber('John');
const subscriber2 = new Subscriber('Alice');

bbc.subscribe(subscriber1);
bbc.subscribe(subscriber2);
bbc.publishNews('Breaking: New technology discovered!');

bbc.unsubscribe(subscriber1);
bbc.publishNews('Update: Stock market rises 5%');

// Test 2: Stock Market
console.log('\n--- Stock Market ---');
const apple = new Stock('AAPL', 150);
const investor1 = new Investor('Warren');
const investor2 = new Investor('Elon');

apple.attach(investor1);
apple.attach(investor2);
apple.setPrice(155);
apple.setPrice(148);

// Test 3: Event Emitter
console.log('\n--- Event Emitter ---');
const userService = new UserService();

userService.on('userCreated', (user) => {
    console.log(`📧 Sending welcome email to ${user.name}`);
});

userService.on('userCreated', (user) => {
    console.log(`📊 Logging user creation: ${user.name}`);
});

userService.once('userDeleted', (user) => {
    console.log(`🗑️  Cleanup data for ${user.name}`);
});

userService.createUser({ id: 1, name: 'Bob', email: 'bob@example.com' });
userService.deleteUser(1);
