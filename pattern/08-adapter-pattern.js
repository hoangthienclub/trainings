/**
 * ADAPTER PATTERN
 * ===============
 * 
 * Định nghĩa:
 * Adapter Pattern cho phép các interfaces không tương thích làm việc cùng nhau.
 * Nó hoạt động như một cầu nối giữa hai interfaces không tương thích.
 * 
 * Khi nào sử dụng:
 * - Khi muốn sử dụng class có interface không tương thích
 * - Khi muốn tạo reusable class làm việc với unrelated classes
 * - Khi cần integrate legacy code với code mới
 * 
 * Ưu điểm:
 * - Tách biệt interface conversion khỏi business logic
 * - Tuân thủ Single Responsibility Principle
 * - Tuân thủ Open/Closed Principle
 * 
 * Nhược điểm:
 * - Tăng độ phức tạp của code
 * - Đôi khi dễ hơn nếu thay đổi service class
 */

// ============================================
// VÍ DỤ 1: Payment Gateway Adapter
// ============================================

// Old payment system
class OldPaymentGateway {
    makePayment(amount) {
        return `Old system: Paid ${amount} USD`;
    }
}

// New payment system (different interface)
class NewPaymentGateway {
    processPayment(data) {
        return `New system: Processed ${data.amount} ${data.currency}`;
    }
}

// Adapter để sử dụng new system với old interface
class PaymentAdapter {
    constructor(newGateway) {
        this.newGateway = newGateway;
    }

    makePayment(amount) {
        const data = {
            amount: amount,
            currency: 'USD',
            timestamp: Date.now()
        };
        return this.newGateway.processPayment(data);
    }
}

// ============================================
// VÍ DỤ 2: Data Format Adapter (XML to JSON)
// ============================================

class XMLData {
    constructor(xmlString) {
        this.xmlString = xmlString;
    }

    getXML() {
        return this.xmlString;
    }
}

class JSONDataAdapter {
    constructor(xmlData) {
        this.xmlData = xmlData;
    }

    getJSON() {
        // Simplified XML to JSON conversion
        const xml = this.xmlData.getXML();
        console.log('🔄 Converting XML to JSON...');

        // Simple parsing (in real app, use proper XML parser)
        const nameMatch = xml.match(/<name>(.*?)<\/name>/);
        const ageMatch = xml.match(/<age>(.*?)<\/age>/);

        return {
            name: nameMatch ? nameMatch[1] : '',
            age: ageMatch ? parseInt(ageMatch[1]) : 0
        };
    }
}

// ============================================
// VÍ DỤ 3: Third-party Library Adapter
// ============================================

// Third-party library (không thể sửa)
class GoogleMapsAPI {
    showLocation(lat, lng) {
        return `Google Maps: Showing location at ${lat}, ${lng}`;
    }
}

class BingMapsAPI {
    displayPosition(latitude, longitude) {
        return `Bing Maps: Displaying position ${latitude}, ${longitude}`;
    }
}

// Unified interface
class MapAdapter {
    constructor(mapService) {
        this.mapService = mapService;
    }

    show(lat, lng) {
        if (this.mapService instanceof GoogleMapsAPI) {
            return this.mapService.showLocation(lat, lng);
        } else if (this.mapService instanceof BingMapsAPI) {
            return this.mapService.displayPosition(lat, lng);
        }
    }
}

// ============================================
// VÍ DỤ 4: Database Adapter
// ============================================

class MySQLDatabase {
    connectMySQL(config) {
        return `MySQL connected: ${config.host}:${config.port}`;
    }

    queryMySQL(sql) {
        return `MySQL query: ${sql}`;
    }
}

class MongoDatabase {
    connectMongo(uri) {
        return `MongoDB connected: ${uri}`;
    }

    find(collection, query) {
        return `MongoDB find in ${collection}: ${JSON.stringify(query)}`;
    }
}

// Unified database interface
class DatabaseAdapter {
    constructor(database, type) {
        this.database = database;
        this.type = type;
    }

    connect(config) {
        if (this.type === 'mysql') {
            return this.database.connectMySQL(config);
        } else if (this.type === 'mongo') {
            return this.database.connectMongo(config.uri);
        }
    }

    query(query) {
        if (this.type === 'mysql') {
            return this.database.queryMySQL(query);
        } else if (this.type === 'mongo') {
            return this.database.find(query.collection, query.filter);
        }
    }
}

// ============================================
// DEMO
// ============================================

console.log('\n========== ADAPTER PATTERN DEMO ==========\n');

// Test 1: Payment Gateway Adapter
console.log('--- Payment Gateway Adapter ---');
const oldGateway = new OldPaymentGateway();
console.log(oldGateway.makePayment(100));

const newGateway = new NewPaymentGateway();
const adapter = new PaymentAdapter(newGateway);
console.log(adapter.makePayment(100));

// Test 2: XML to JSON Adapter
console.log('\n--- Data Format Adapter ---');
const xmlData = new XMLData('<user><name>John</name><age>30</age></user>');
const jsonAdapter = new JSONDataAdapter(xmlData);
console.log('JSON:', jsonAdapter.getJSON());

// Test 3: Maps Adapter
console.log('\n--- Maps Adapter ---');
const googleMaps = new GoogleMapsAPI();
const bingMaps = new BingMapsAPI();

const googleAdapter = new MapAdapter(googleMaps);
const bingAdapter = new MapAdapter(bingMaps);

console.log(googleAdapter.show(10.762622, 106.660172));
console.log(bingAdapter.show(10.762622, 106.660172));

// Test 4: Database Adapter
console.log('\n--- Database Adapter ---');
const mysql = new MySQLDatabase();
const mongo = new MongoDatabase();

const mysqlAdapter = new DatabaseAdapter(mysql, 'mysql');
const mongoAdapter = new DatabaseAdapter(mongo, 'mongo');

console.log(mysqlAdapter.connect({ host: 'localhost', port: 3306 }));
console.log(mysqlAdapter.query('SELECT * FROM users'));

console.log(mongoAdapter.connect({ uri: 'mongodb://localhost:27017' }));
console.log(mongoAdapter.query({ collection: 'users', filter: { age: { $gt: 18 } } }));
