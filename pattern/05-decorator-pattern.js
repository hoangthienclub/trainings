/**
 * DECORATOR PATTERN
 * =================
 * 
 * Định nghĩa:
 * Decorator Pattern cho phép thêm chức năng mới vào objects một cách động
 * mà không cần thay đổi cấu trúc của chúng. Pattern này tạo ra một decorator
 * class bao bọc class gốc.
 * 
 * Khi nào sử dụng:
 * - Khi muốn thêm chức năng cho objects mà không ảnh hưởng đến objects khác
 * - Khi muốn thêm/xóa chức năng tại runtime
 * - Khi kế thừa không phù hợp hoặc không thực tế
 * 
 * Ưu điểm:
 * - Linh hoạt hơn kế thừa
 * - Tuân thủ Single Responsibility Principle
 * - Có thể thêm nhiều decorators
 * 
 * Nhược điểm:
 * - Nhiều small objects
 * - Code có thể phức tạp khi có nhiều decorators
 */

// ============================================
// VÍ DỤ 1: Coffee Shop
// ============================================

class Coffee {
    cost() {
        return 5;
    }

    description() {
        return 'Simple Coffee';
    }
}

class CoffeeDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }

    cost() {
        return this.coffee.cost();
    }

    description() {
        return this.coffee.description();
    }
}

class MilkDecorator extends CoffeeDecorator {
    cost() {
        return this.coffee.cost() + 2;
    }

    description() {
        return this.coffee.description() + ', Milk';
    }
}

class SugarDecorator extends CoffeeDecorator {
    cost() {
        return this.coffee.cost() + 1;
    }

    description() {
        return this.coffee.description() + ', Sugar';
    }
}

class WhipDecorator extends CoffeeDecorator {
    cost() {
        return this.coffee.cost() + 3;
    }

    description() {
        return this.coffee.description() + ', Whipped Cream';
    }
}

// ============================================
// VÍ DỤ 2: Text Formatting
// ============================================

class Text {
    constructor(content) {
        this.content = content;
    }

    render() {
        return this.content;
    }
}

class BoldDecorator {
    constructor(text) {
        this.text = text;
    }

    render() {
        return `<strong>${this.text.render()}</strong>`;
    }
}

class ItalicDecorator {
    constructor(text) {
        this.text = text;
    }

    render() {
        return `<em>${this.text.render()}</em>`;
    }
}

class UnderlineDecorator {
    constructor(text) {
        this.text = text;
    }

    render() {
        return `<u>${this.text.render()}</u>`;
    }
}

// ============================================
// VÍ DỤ 3: Function Decorators (Modern JS)
// ============================================

function logExecutionTime(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
        const start = performance.now();
        const result = originalMethod.apply(this, args);
        const end = performance.now();
        console.log(`⏱️  ${propertyKey} took ${(end - start).toFixed(2)}ms`);
        return result;
    };

    return descriptor;
}

function memoize(fn) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            console.log(`💾 Cache hit for ${fn.name}(${args})`);
            return cache.get(key);
        }

        console.log(`🔄 Computing ${fn.name}(${args})`);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// ============================================
// DEMO
// ============================================

console.log('\n========== DECORATOR PATTERN DEMO ==========\n');

// Test 1: Coffee Shop
console.log('--- Coffee Shop ---');
let coffee = new Coffee();
console.log(`${coffee.description()} = $${coffee.cost()}`);

coffee = new MilkDecorator(coffee);
console.log(`${coffee.description()} = $${coffee.cost()}`);

coffee = new SugarDecorator(coffee);
console.log(`${coffee.description()} = $${coffee.cost()}`);

coffee = new WhipDecorator(coffee);
console.log(`${coffee.description()} = $${coffee.cost()}`);

// Test 2: Text Formatting
console.log('\n--- Text Formatting ---');
let text = new Text('Hello World');
console.log(text.render());

text = new BoldDecorator(text);
console.log(text.render());

text = new ItalicDecorator(text);
console.log(text.render());

text = new UnderlineDecorator(text);
console.log(text.render());

// Test 3: Function Decorators
console.log('\n--- Function Decorators ---');
const fibonacci = memoize(function fib(n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
});

console.log('Result:', fibonacci(10));
console.log('Result:', fibonacci(10)); // Cached
console.log('Result:', fibonacci(5));  // Partially cached
