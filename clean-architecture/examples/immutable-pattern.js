/**
 * VÍ DỤ: IMMUTABLE PATTERN VỚI FACTORY METHODS
 * 
 * Immutable Pattern: Object không thể thay đổi sau khi được tạo
 * Factory Methods: Methods để tạo object thay vì dùng constructor trực tiếp
 */

// ============================================
// ❌ MUTABLE PATTERN (Không tốt)
// ============================================

class MutableUser {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    // ❌ Cho phép thay đổi trực tiếp
    setName(name) {
        this.name = name;
    }

    setEmail(email) {
        this.email = email;
    }
}

// Vấn đề với Mutable:
const mutableUser = new MutableUser(1, 'John', 'john@example.com');
console.log('Original:', mutableUser.name); // John

mutableUser.name = 'Hacker'; // ❌ Có thể thay đổi trực tiếp
mutableUser.setName('Changed'); // ❌ Có thể thay đổi qua method
console.log('Changed:', mutableUser.name); // Changed

// ❌ Vấn đề: Khó track changes, khó debug, không thread-safe


// ============================================
// ✅ IMMUTABLE PATTERN (Tốt)
// ============================================

class ImmutableUser {
    // Private constructor - không cho phép tạo trực tiếp
    constructor(props) {
        // Freeze object để không thể thay đổi
        this._id = props.id;
        this._name = props.name;
        this._email = props.email;
        this._createdAt = props.createdAt;

        // Freeze để không thể thay đổi properties
        Object.freeze(this);
    }

    // ✅ FACTORY METHOD 1: Tạo user mới
    static create(id, name, email) {
        // Validation trước khi tạo
        if (!name || name.trim().length === 0) {
            throw new Error('Name is required');
        }
        if (!email || !email.includes('@')) {
            throw new Error('Invalid email');
        }

        return new ImmutableUser({
            id,
            name,
            email,
            createdAt: new Date()
        });
    }

    // ✅ FACTORY METHOD 2: Reconstruct từ database
    static fromDatabase(data) {
        return new ImmutableUser({
            id: data.id,
            name: data.name,
            email: data.email,
            createdAt: new Date(data.createdAt)
        });
    }

    // ✅ FACTORY METHOD 3: Tạo bản copy với thay đổi
    // Thay vì modify object hiện tại, tạo object mới
    withName(newName) {
        if (!newName || newName.trim().length === 0) {
            throw new Error('Name is required');
        }

        // Tạo object MỚI với name mới
        return new ImmutableUser({
            id: this._id,
            name: newName,
            email: this._email,
            createdAt: this._createdAt
        });
    }

    withEmail(newEmail) {
        if (!newEmail || !newEmail.includes('@')) {
            throw new Error('Invalid email');
        }

        // Tạo object MỚI với email mới
        return new ImmutableUser({
            id: this._id,
            name: this._name,
            email: newEmail,
            createdAt: this._createdAt
        });
    }

    // Getters (read-only)
    get id() { return this._id; }
    get name() { return this._name; }
    get email() { return this._email; }
    get createdAt() { return this._createdAt; }

    // Convert to plain object
    toObject() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            createdAt: this._createdAt
        };
    }
}

// ============================================
// ✅ SỬ DỤNG IMMUTABLE PATTERN
// ============================================

console.log('\n=== IMMUTABLE PATTERN DEMO ===\n');

// 1. Tạo user bằng Factory Method
const user1 = ImmutableUser.create(1, 'Alice', 'alice@example.com');
console.log('User 1:', user1.toObject());

// 2. Không thể thay đổi trực tiếp
try {
    user1.name = 'Hacker'; // ❌ Không có tác dụng (strict mode sẽ throw error)
    console.log('After attempt to change:', user1.name); // Vẫn là 'Alice'
} catch (error) {
    console.log('Cannot modify:', error.message);
}

// 3. Muốn "thay đổi" -> Tạo object MỚI
const user2 = user1.withName('Alice Updated');
console.log('\nUser 1 (original):', user1.name); // Alice (không đổi)
console.log('User 2 (new):', user2.name); // Alice Updated

// 4. Chain methods
const user3 = user1
    .withName('Bob')
    .withEmail('bob@example.com');
console.log('\nUser 3 (chained):', user3.toObject());
console.log('User 1 (still original):', user1.toObject());


// ============================================
// ✅ IMMUTABLE PATTERN VỚI TYPESCRIPT (Bonus)
// ============================================

/*
// TypeScript version với readonly
class ImmutableUserTS {
  private constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _email: string,
    private readonly _createdAt: Date
  ) {
    Object.freeze(this);
  }

  static create(id: number, name: string, email: string): ImmutableUserTS {
    return new ImmutableUserTS(id, name, email, new Date());
  }

  withName(newName: string): ImmutableUserTS {
    return new ImmutableUserTS(
      this._id,
      newName,
      this._email,
      this._createdAt
    );
  }

  get id(): number { return this._id; }
  get name(): string { return this._name; }
  get email(): string { return this._email; }
}
*/


// ============================================
// 📚 ƯU ĐIỂM CỦA IMMUTABLE PATTERN
// ============================================

console.log('\n=== ƯU ĐIỂM ===\n');

console.log(`
1. ✅ PREDICTABILITY (Dự đoán được)
   - Object không thay đổi -> dễ reasoning
   - Không có side effects

2. ✅ THREAD SAFETY
   - An toàn trong môi trường concurrent
   - Không cần locking

3. ✅ EASIER DEBUGGING
   - Object history rõ ràng
   - Dễ track changes

4. ✅ CACHING
   - Có thể cache an toàn
   - Hash code không đổi

5. ✅ FUNCTIONAL PROGRAMMING
   - Phù hợp với FP paradigm
   - Pure functions

6. ✅ TIME TRAVEL DEBUGGING
   - Có thể lưu lại mọi state
   - Undo/Redo dễ dàng
`);


// ============================================
// 🎯 KHI NÀO DÙNG IMMUTABLE PATTERN?
// ============================================

console.log('\n=== KHI NÀO DÙNG? ===\n');

console.log(`
✅ NÊN DÙNG:
- Domain entities (User, Product, Order)
- Value objects (Money, Address, Email)
- Configuration objects
- State management (Redux, Vuex)
- API responses

❌ KHÔNG NÊN DÙNG:
- Performance-critical code (tạo object mới tốn memory)
- Large collections (dùng persistent data structures)
- UI components với nhiều updates
`);


// ============================================
// 🔧 FACTORY METHODS PATTERNS
// ============================================

class Product {
    constructor(props) {
        this._id = props.id;
        this._name = props.name;
        this._price = props.price;
        this._category = props.category;
        Object.freeze(this);
    }

    // Factory Method 1: Tạo từ raw data
    static create(id, name, price, category) {
        return new Product({ id, name, price, category });
    }

    // Factory Method 2: Tạo từ API response
    static fromAPI(apiData) {
        return new Product({
            id: apiData.product_id,
            name: apiData.product_name,
            price: parseFloat(apiData.price),
            category: apiData.cat
        });
    }

    // Factory Method 3: Tạo default product
    static createDefault() {
        return new Product({
            id: 0,
            name: 'Unnamed Product',
            price: 0,
            category: 'uncategorized'
        });
    }

    // Factory Method 4: Tạo với discount
    withDiscount(percentage) {
        return new Product({
            id: this._id,
            name: this._name,
            price: this._price * (1 - percentage / 100),
            category: this._category
        });
    }

    get id() { return this._id; }
    get name() { return this._name; }
    get price() { return this._price; }
    get category() { return this._category; }
}

console.log('\n=== FACTORY METHODS DEMO ===\n');

const product1 = Product.create(1, 'Laptop', 1000, 'electronics');
console.log('Product 1:', product1);

const product2 = Product.fromAPI({
    product_id: 2,
    product_name: 'Mouse',
    price: '25.99',
    cat: 'accessories'
});
console.log('Product 2:', product2);

const product3 = product1.withDiscount(10); // 10% discount
console.log('Product 3 (with discount):', product3.price); // 900


// ============================================
// 📖 TÓM TẮT
// ============================================

console.log('\n=== TÓM TẮT ===\n');

console.log(`
IMMUTABLE PATTERN:
- Object không thể thay đổi sau khi tạo
- Dùng Object.freeze() để enforce
- "Thay đổi" = tạo object mới

FACTORY METHODS:
- Static methods để tạo object
- Thay vì dùng 'new Constructor()' trực tiếp
- Cho phép validation, transformation, multiple constructors

KẾT HỢP:
- Private constructor
- Public static factory methods
- Immutable properties
- Methods trả về object mới thay vì modify
`);

module.exports = { ImmutableUser, Product };
