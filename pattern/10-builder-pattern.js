/**
 * BUILDER PATTERN
 * ===============
 * 
 * Định nghĩa:
 * Builder Pattern tách việc xây dựng một complex object khỏi representation
 * của nó, cho phép cùng một construction process tạo ra các representations khác nhau.
 * 
 * Khi nào sử dụng:
 * - Khi object có nhiều parameters (constructor phức tạp)
 * - Khi muốn tạo object theo từng bước
 * - Khi muốn tạo các representations khác nhau của object
 * 
 * Ưu điểm:
 * - Code dễ đọc hơn (fluent interface)
 * - Có thể construct objects theo từng bước
 * - Có thể reuse construction code
 * 
 * Nhược điểm:
 * - Tăng độ phức tạp của code
 * - Cần tạo thêm builder class
 */

// ============================================
// VÍ DỤ 1: Pizza Builder
// ============================================

class Pizza {
    constructor() {
        this.size = '';
        this.crust = '';
        this.toppings = [];
        this.cheese = '';
        this.sauce = '';
    }

    describe() {
        return `${this.size} pizza with ${this.crust} crust, ${this.sauce} sauce, ${this.cheese} cheese, and toppings: ${this.toppings.join(', ')}`;
    }
}

class PizzaBuilder {
    constructor() {
        this.pizza = new Pizza();
    }

    setSize(size) {
        this.pizza.size = size;
        return this;
    }

    setCrust(crust) {
        this.pizza.crust = crust;
        return this;
    }

    addTopping(topping) {
        this.pizza.toppings.push(topping);
        return this;
    }

    setCheese(cheese) {
        this.pizza.cheese = cheese;
        return this;
    }

    setSauce(sauce) {
        this.pizza.sauce = sauce;
        return this;
    }

    build() {
        return this.pizza;
    }
}

// ============================================
// VÍ DỤ 2: Query Builder
// ============================================

class SQLQuery {
    constructor() {
        this.table = '';
        this.fields = [];
        this.conditions = [];
        this.orderBy = '';
        this.limit = null;
    }

    toSQL() {
        let sql = `SELECT ${this.fields.join(', ')} FROM ${this.table}`;

        if (this.conditions.length > 0) {
            sql += ` WHERE ${this.conditions.join(' AND ')}`;
        }

        if (this.orderBy) {
            sql += ` ORDER BY ${this.orderBy}`;
        }

        if (this.limit) {
            sql += ` LIMIT ${this.limit}`;
        }

        return sql;
    }
}

class QueryBuilder {
    constructor() {
        this.query = new SQLQuery();
    }

    select(...fields) {
        this.query.fields = fields;
        return this;
    }

    from(table) {
        this.query.table = table;
        return this;
    }

    where(condition) {
        this.query.conditions.push(condition);
        return this;
    }

    orderBy(field) {
        this.query.orderBy = field;
        return this;
    }

    limit(count) {
        this.query.limit = count;
        return this;
    }

    build() {
        return this.query.toSQL();
    }
}

// ============================================
// VÍ DỤ 3: HTTP Request Builder
// ============================================

class HttpRequest {
    constructor() {
        this.method = 'GET';
        this.url = '';
        this.headers = {};
        this.body = null;
        this.timeout = 5000;
    }

    toString() {
        return JSON.stringify({
            method: this.method,
            url: this.url,
            headers: this.headers,
            body: this.body,
            timeout: this.timeout
        }, null, 2);
    }
}

class HttpRequestBuilder {
    constructor() {
        this.request = new HttpRequest();
    }

    setMethod(method) {
        this.request.method = method;
        return this;
    }

    setUrl(url) {
        this.request.url = url;
        return this;
    }

    addHeader(key, value) {
        this.request.headers[key] = value;
        return this;
    }

    setBody(body) {
        this.request.body = body;
        return this;
    }

    setTimeout(timeout) {
        this.request.timeout = timeout;
        return this;
    }

    build() {
        return this.request;
    }
}

// ============================================
// DEMO
// ============================================

console.log('\n========== BUILDER PATTERN DEMO ==========\n');

// Test 1: Pizza Builder
console.log('--- Pizza Builder ---');
const pizza = new PizzaBuilder()
    .setSize('Large')
    .setCrust('Thin')
    .setSauce('Tomato')
    .setCheese('Mozzarella')
    .addTopping('Pepperoni')
    .addTopping('Mushrooms')
    .addTopping('Olives')
    .build();

console.log('🍕', pizza.describe());

// Test 2: Query Builder
console.log('\n--- Query Builder ---');
const query = new QueryBuilder()
    .select('id', 'name', 'email')
    .from('users')
    .where('age > 18')
    .where('status = "active"')
    .orderBy('name')
    .limit(10)
    .build();

console.log('📊 SQL Query:\n', query);

// Test 3: HTTP Request Builder
console.log('\n--- HTTP Request Builder ---');
const request = new HttpRequestBuilder()
    .setMethod('POST')
    .setUrl('https://api.example.com/users')
    .addHeader('Content-Type', 'application/json')
    .addHeader('Authorization', 'Bearer token123')
    .setBody({ name: 'John', email: 'john@example.com' })
    .setTimeout(10000)
    .build();

console.log('🌐 HTTP Request:\n', request.toString());
