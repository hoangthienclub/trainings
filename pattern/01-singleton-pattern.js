/**
 * SINGLETON PATTERN
 * =================
 * 
 * Định nghĩa:
 * Singleton Pattern đảm bảo một class chỉ có duy nhất một instance (thể hiện) 
 * và cung cấp một điểm truy cập toàn cục đến instance đó.
 * 
 * Khi nào sử dụng:
 * - Khi bạn cần đảm bảo chỉ có một instance của class trong toàn bộ ứng dụng
 * - Quản lý kết nối database
 * - Quản lý cấu hình ứng dụng
 * - Logger, Cache manager
 * - Thread pool, Connection pool
 * 
 * Ưu điểm:
 * - Đảm bảo chỉ có một instance duy nhất
 * - Tiết kiệm bộ nhớ
 * - Dễ dàng truy cập toàn cục
 * 
 * Nhược điểm:
 * - Vi phạm Single Responsibility Principle (làm 2 việc: quản lý instance và logic nghiệp vụ)
 * - Khó test vì có global state
 * - Có thể gây khó khăn trong môi trường đa luồng
 */

// ============================================
// Cách 1: Sử dụng Class với static instance
// ============================================

class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.connection = null;
    this.connectionTime = new Date();
    DatabaseConnection.instance = this;
  }

  connect(connectionString) {
    if (!this.connection) {
      this.connection = `Connected to ${connectionString}`;
      console.log(`✅ ${this.connection} at ${this.connectionTime.toISOString()}`);
    } else {
      console.log(`⚠️  Already connected: ${this.connection}`);
    }
    return this.connection;
  }

  disconnect() {
    if (this.connection) {
      console.log(`❌ Disconnected from ${this.connection}`);
      this.connection = null;
    }
  }

  getConnection() {
    return this.connection;
  }
}

// ============================================
// Cách 2: Sử dụng IIFE (Immediately Invoked Function Expression)
// ============================================

const ConfigManager = (function() {
  let instance;
  let config = {};

  function createInstance() {
    return {
      set(key, value) {
        config[key] = value;
        console.log(`📝 Config set: ${key} = ${value}`);
      },
      
      get(key) {
        return config[key];
      },
      
      getAll() {
        return { ...config };
      },
      
      clear() {
        config = {};
        console.log('🗑️  Config cleared');
      }
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
        console.log('🆕 ConfigManager instance created');
      }
      return instance;
    }
  };
})();

// ============================================
// Cách 3: Sử dụng Object Literal (Simplest way)
// ============================================

const Logger = {
  logs: [],
  
  log(message, level = 'INFO') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message
    };
    this.logs.push(logEntry);
    console.log(`[${logEntry.level}] ${logEntry.timestamp}: ${message}`);
  },
  
  error(message) {
    this.log(message, 'ERROR');
  },
  
  warn(message) {
    this.log(message, 'WARN');
  },
  
  info(message) {
    this.log(message, 'INFO');
  },
  
  getLogs() {
    return [...this.logs];
  },
  
  clearLogs() {
    this.logs = [];
    console.log('🗑️  Logs cleared');
  }
};

// ============================================
// Cách 4: Sử dụng ES6 Module (Modern approach)
// ============================================

class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = null) {
    const item = {
      value,
      expiry: ttl ? Date.now() + ttl : null
    };
    this.cache.set(key, item);
    console.log(`💾 Cached: ${key}`);
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      console.log(`❌ Cache miss: ${key}`);
      return null;
    }
    
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      console.log(`⏰ Cache expired: ${key}`);
      return null;
    }
    
    console.log(`✅ Cache hit: ${key}`);
    return item.value;
  }

  clear() {
    this.cache.clear();
    console.log('🗑️  Cache cleared');
  }

  size() {
    return this.cache.size;
  }
}

// Export một instance duy nhất
const cacheInstance = new CacheManager();
// Object.freeze(cacheInstance); // Tùy chọn: freeze để không thể modify

// ============================================
// DEMO VÀ TEST
// ============================================

console.log('\n========== SINGLETON PATTERN DEMO ==========\n');

// Test 1: DatabaseConnection
console.log('--- Test 1: DatabaseConnection ---');
const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();

db1.connect('mongodb://localhost:27017/mydb');
db2.connect('postgresql://localhost:5432/mydb'); // Sẽ không tạo connection mới

console.log('db1 === db2:', db1 === db2); // true
console.log('');

// Test 2: ConfigManager
console.log('--- Test 2: ConfigManager ---');
const config1 = ConfigManager.getInstance();
const config2 = ConfigManager.getInstance();

config1.set('apiUrl', 'https://api.example.com');
config1.set('timeout', 5000);

console.log('Config from config2:', config2.getAll());
console.log('config1 === config2:', config1 === config2); // true
console.log('');

// Test 3: Logger
console.log('--- Test 3: Logger ---');
Logger.info('Application started');
Logger.warn('This is a warning');
Logger.error('An error occurred');

console.log('Total logs:', Logger.getLogs().length);
console.log('');

// Test 4: CacheManager
console.log('--- Test 4: CacheManager ---');
cacheInstance.set('user:1', { name: 'John Doe', age: 30 });
cacheInstance.set('user:2', { name: 'Jane Smith', age: 25 }, 2000); // TTL 2 seconds

console.log('Get user:1:', cacheInstance.get('user:1'));
console.log('Cache size:', cacheInstance.size());

// Test TTL
setTimeout(() => {
  console.log('\n--- After 2.5 seconds ---');
  console.log('Get user:2 (should be expired):', cacheInstance.get('user:2'));
}, 2500);

// ============================================
// USE CASE THỰC TẾ: Application Configuration
// ============================================

class AppConfig {
  constructor() {
    if (AppConfig.instance) {
      return AppConfig.instance;
    }
    
    this.settings = {
      environment: 'development',
      apiUrl: 'http://localhost:3000',
      debug: true,
      maxRetries: 3,
      timeout: 5000
    };
    
    AppConfig.instance = this;
  }

  get(key) {
    return this.settings[key];
  }

  set(key, value) {
    this.settings[key] = value;
  }

  getAll() {
    return { ...this.settings };
  }

  isProduction() {
    return this.settings.environment === 'production';
  }

  isDevelopment() {
    return this.settings.environment === 'development';
  }
}

// Sử dụng trong ứng dụng
setTimeout(() => {
  console.log('\n--- Use Case: Application Config ---');
  const appConfig = new AppConfig();
  appConfig.set('environment', 'production');
  appConfig.set('debug', false);

  // Ở module khác
  const sameConfig = new AppConfig();
  console.log('Is Production?', sameConfig.isProduction()); // true
  console.log('Debug mode?', sameConfig.get('debug')); // false
  console.log('Same instance?', appConfig === sameConfig); // true
}, 3000);

/**
 * KẾT LUẬN:
 * 
 * Singleton Pattern rất hữu ích khi bạn cần:
 * 1. Đảm bảo chỉ có một instance duy nhất
 * 2. Quản lý tài nguyên chung (database, config, cache)
 * 3. Tránh tạo nhiều object không cần thiết
 * 
 * Lưu ý:
 * - Trong JavaScript, có nhiều cách implement Singleton
 * - ES6 modules tự động là singleton (mỗi module chỉ được import một lần)
 * - Cẩn thận với global state, có thể gây khó khăn trong testing
 * - Trong Node.js, module caching đã cung cấp singleton behavior
 */
