/**
 * STRATEGY PATTERN
 * ================
 * 
 * Định nghĩa:
 * Strategy Pattern định nghĩa một họ các thuật toán, đóng gói từng thuật toán 
 * và làm cho chúng có thể thay thế lẫn nhau. Strategy cho phép thuật toán 
 * thay đổi độc lập với client sử dụng nó.
 * 
 * Khi nào sử dụng:
 * - Khi có nhiều cách khác nhau để thực hiện một tác vụ
 * - Khi muốn tránh nhiều câu lệnh if-else hoặc switch-case
 * - Khi muốn thay đổi thuật toán tại runtime
 * 
 * Ưu điểm:
 * - Tách biệt implementation của thuật toán khỏi code sử dụng nó
 * - Dễ dàng thêm strategy mới mà không sửa code cũ
 * - Loại bỏ các câu điều kiện phức tạp
 * 
 * Nhược điểm:
 * - Tăng số lượng objects trong hệ thống
 * - Client phải biết về sự khác biệt giữa các strategies
 */

// ============================================
// VÍ DỤ 1: Payment Strategy
// ============================================

class PaymentStrategy {
    pay(amount) {
        throw new Error('Method pay() must be implemented');
    }
}

class CreditCardStrategy extends PaymentStrategy {
    constructor(cardNumber, cvv) {
        super();
        this.cardNumber = cardNumber;
        this.cvv = cvv;
    }

    pay(amount) {
        return `💳 Paid $${amount} using Credit Card ending in ${this.cardNumber.slice(-4)}`;
    }
}

class PayPalStrategy extends PaymentStrategy {
    constructor(email) {
        super();
        this.email = email;
    }

    pay(amount) {
        return `💰 Paid $${amount} using PayPal account ${this.email}`;
    }
}

class ShoppingCart {
    constructor() {
        this.items = [];
        this.paymentStrategy = null;
    }

    addItem(item) {
        this.items.push(item);
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    setPaymentStrategy(strategy) {
        this.paymentStrategy = strategy;
    }

    checkout() {
        const total = this.getTotal();
        return this.paymentStrategy.pay(total);
    }
}

// ============================================
// VÍ DỤ 2: Sorting Strategy
// ============================================

class SortStrategy {
    sort(array) {
        throw new Error('Method sort() must be implemented');
    }
}

class BubbleSortStrategy extends SortStrategy {
    sort(array) {
        console.log('🔄 Using Bubble Sort');
        const arr = [...array];
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
        return arr;
    }
}

class QuickSortStrategy extends SortStrategy {
    sort(array) {
        console.log('⚡ Using Quick Sort');
        return this.quickSort([...array]);
    }

    quickSort(arr) {
        if (arr.length <= 1) return arr;
        const pivot = arr[Math.floor(arr.length / 2)];
        const left = arr.filter(x => x < pivot);
        const middle = arr.filter(x => x === pivot);
        const right = arr.filter(x => x > pivot);
        return [...this.quickSort(left), ...middle, ...this.quickSort(right)];
    }
}

class Sorter {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    sort(array) {
        return this.strategy.sort(array);
    }
}

// ============================================
// DEMO
// ============================================

console.log('\n========== STRATEGY PATTERN DEMO ==========\n');

// Test Payment Strategy
console.log('--- Payment Strategy ---');
const cart = new ShoppingCart();
cart.addItem({ name: 'Laptop', price: 1200 });
cart.addItem({ name: 'Mouse', price: 25 });

cart.setPaymentStrategy(new CreditCardStrategy('1234567890123456', '123'));
console.log(cart.checkout());

cart.setPaymentStrategy(new PayPalStrategy('user@example.com'));
console.log(cart.checkout());

// Test Sorting Strategy
console.log('\n--- Sorting Strategy ---');
const numbers = [64, 34, 25, 12, 22, 11, 90];

const sorter = new Sorter(new BubbleSortStrategy());
console.log('Result:', sorter.sort(numbers));

sorter.setStrategy(new QuickSortStrategy());
console.log('Result:', sorter.sort(numbers));
