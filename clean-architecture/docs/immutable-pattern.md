# Immutable Pattern với Factory Methods

## 📖 Định nghĩa

### Immutable Pattern
**Immutable** = Không thể thay đổi. Một object immutable là object mà sau khi được tạo, state của nó không thể bị thay đổi.

### Factory Methods
**Factory Methods** = Static methods dùng để tạo object thay vì dùng constructor trực tiếp.

## 🔄 So sánh Mutable vs Immutable

### ❌ Mutable Pattern (Có thể thay đổi)

```javascript
class MutableUser {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  setName(name) {
    this.name = name; // ❌ Thay đổi object hiện tại
  }
}

const user = new MutableUser(1, 'Alice', 'alice@example.com');
user.name = 'Bob';        // ❌ Có thể thay đổi trực tiếp
user.setName('Charlie');  // ❌ Có thể thay đổi qua method
```

**Vấn đề**:
- 🔴 Khó track changes
- 🔴 Side effects không mong muốn
- 🔴 Không thread-safe
- 🔴 Khó debug

### ✅ Immutable Pattern (Không thể thay đổi)

```javascript
class ImmutableUser {
  constructor(props) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    Object.freeze(this); // ✅ Freeze object
  }

  // Factory Method
  static create(id, name, email) {
    return new ImmutableUser({ id, name, email });
  }

  // Tạo object MỚI thay vì modify
  withName(newName) {
    return new ImmutableUser({
      id: this._id,
      name: newName,
      email: this._email
    });
  }

  get name() { return this._name; }
}

const user1 = ImmutableUser.create(1, 'Alice', 'alice@example.com');
user1.name = 'Bob';  // ❌ KHÔNG có tác dụng (frozen)

const user2 = user1.withName('Bob'); // ✅ Tạo object MỚI
console.log(user1.name); // 'Alice' (không đổi)
console.log(user2.name); // 'Bob' (object mới)
```

**Ưu điểm**:
- ✅ Predictable (dự đoán được)
- ✅ No side effects
- ✅ Thread-safe
- ✅ Dễ debug và test

## 🏭 Factory Methods Patterns

### 1. Basic Factory Method

```javascript
class User {
  constructor(props) {
    this._id = props.id;
    this._name = props.name;
    Object.freeze(this);
  }

  // Factory method thay vì dùng constructor trực tiếp
  static create(id, name) {
    // Validation
    if (!name) throw new Error('Name required');
    
    return new User({ id, name });
  }
}

// ✅ Dùng factory method
const user = User.create(1, 'Alice');

// ❌ Không dùng constructor trực tiếp
// const user = new User({ id: 1, name: 'Alice' });
```

### 2. Multiple Factory Methods

```javascript
class User {
  constructor(props) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._createdAt = props.createdAt;
    Object.freeze(this);
  }

  // Factory 1: Tạo user mới
  static create(id, name, email) {
    return new User({
      id,
      name,
      email,
      createdAt: new Date()
    });
  }

  // Factory 2: Reconstruct từ database
  static fromDatabase(data) {
    return new User({
      id: data.id,
      name: data.name,
      email: data.email,
      createdAt: new Date(data.created_at)
    });
  }

  // Factory 3: Tạo từ API response
  static fromAPI(apiData) {
    return new User({
      id: apiData.user_id,
      name: apiData.full_name,
      email: apiData.email_address,
      createdAt: new Date(apiData.timestamp)
    });
  }

  // Factory 4: Tạo default user
  static createGuest() {
    return new User({
      id: 0,
      name: 'Guest',
      email: 'guest@example.com',
      createdAt: new Date()
    });
  }
}

// Sử dụng
const user1 = User.create(1, 'Alice', 'alice@example.com');
const user2 = User.fromDatabase({ id: 2, name: 'Bob', email: 'bob@example.com', created_at: '2024-01-01' });
const user3 = User.fromAPI({ user_id: 3, full_name: 'Charlie', email_address: 'charlie@example.com', timestamp: '2024-01-01' });
const guest = User.createGuest();
```

### 3. Copy-with-Modification Pattern

```javascript
class User {
  constructor(props) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    Object.freeze(this);
  }

  static create(id, name, email) {
    return new User({ id, name, email });
  }

  // Tạo bản copy với name mới
  withName(newName) {
    return new User({
      id: this._id,
      name: newName,
      email: this._email
    });
  }

  // Tạo bản copy với email mới
  withEmail(newEmail) {
    return new User({
      id: this._id,
      name: this._name,
      email: newEmail
    });
  }

  get name() { return this._name; }
  get email() { return this._email; }
}

// Sử dụng
const user1 = User.create(1, 'Alice', 'alice@example.com');
const user2 = user1.withName('Alice Smith');
const user3 = user2.withEmail('alice.smith@example.com');

// Hoặc chain
const user4 = user1
  .withName('Bob')
  .withEmail('bob@example.com');

console.log(user1.name); // 'Alice' (không đổi)
console.log(user4.name); // 'Bob' (object mới)
```

## 🎯 Ví dụ thực tế

### Value Object: Money

```javascript
class Money {
  constructor(amount, currency) {
    this._amount = amount;
    this._currency = currency;
    Object.freeze(this);
  }

  static create(amount, currency = 'USD') {
    if (amount < 0) throw new Error('Amount cannot be negative');
    return new Money(amount, currency);
  }

  static zero(currency = 'USD') {
    return new Money(0, currency);
  }

  add(other) {
    if (this._currency !== other._currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this._amount + other._amount, this._currency);
  }

  multiply(factor) {
    return new Money(this._amount * factor, this._currency);
  }

  get amount() { return this._amount; }
  get currency() { return this._currency; }
}

// Sử dụng
const price = Money.create(100, 'USD');
const tax = price.multiply(0.1);        // $10
const total = price.add(tax);           // $110

console.log(price.amount);  // 100 (không đổi)
console.log(total.amount);  // 110 (object mới)
```

### Domain Entity: Order

```javascript
class Order {
  constructor(props) {
    this._id = props.id;
    this._items = props.items;
    this._status = props.status;
    this._createdAt = props.createdAt;
    Object.freeze(this);
  }

  static create(id, items) {
    return new Order({
      id,
      items,
      status: 'pending',
      createdAt: new Date()
    });
  }

  addItem(item) {
    return new Order({
      id: this._id,
      items: [...this._items, item], // Tạo array mới
      status: this._status,
      createdAt: this._createdAt
    });
  }

  confirm() {
    if (this._status !== 'pending') {
      throw new Error('Can only confirm pending orders');
    }
    return new Order({
      id: this._id,
      items: this._items,
      status: 'confirmed',
      createdAt: this._createdAt
    });
  }

  cancel() {
    return new Order({
      id: this._id,
      items: this._items,
      status: 'cancelled',
      createdAt: this._createdAt
    });
  }

  get status() { return this._status; }
  get items() { return [...this._items]; } // Return copy
}

// Sử dụng
const order1 = Order.create(1, ['item1']);
const order2 = order1.addItem('item2');
const order3 = order2.confirm();

console.log(order1.status); // 'pending' (không đổi)
console.log(order2.status); // 'pending' (có item2)
console.log(order3.status); // 'confirmed'
```

## 📊 So sánh tổng quan

| Khía cạnh | Mutable | Immutable |
|-----------|---------|-----------|
| **Thay đổi** | Modify object hiện tại | Tạo object mới |
| **Performance** | Nhanh hơn (không tạo object mới) | Chậm hơn (tạo nhiều object) |
| **Memory** | Ít hơn | Nhiều hơn |
| **Thread Safety** | ❌ Không an toàn | ✅ An toàn |
| **Debugging** | ❌ Khó | ✅ Dễ |
| **Predictability** | ❌ Khó dự đoán | ✅ Dễ dự đoán |
| **Use Case** | UI updates, large data | Domain logic, state management |

## ✅ Khi nào dùng Immutable Pattern?

### Nên dùng:
- ✅ Domain entities (User, Product, Order)
- ✅ Value objects (Money, Address, Email)
- ✅ Configuration objects
- ✅ State management (Redux, Vuex)
- ✅ API responses/DTOs
- ✅ Business logic layer

### Không nên dùng:
- ❌ Performance-critical code
- ❌ Large collections (dùng persistent data structures)
- ❌ UI components với nhiều updates
- ❌ Real-time data processing

## 🔧 Tools hỗ trợ Immutability

### JavaScript
```javascript
// Object.freeze() - shallow freeze
const obj = Object.freeze({ name: 'Alice' });

// Deep freeze
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach(prop => {
    if (obj[prop] !== null && typeof obj[prop] === 'object') {
      deepFreeze(obj[prop]);
    }
  });
  return obj;
}
```

### Libraries
- **Immer.js** - Simplify immutable updates
- **Immutable.js** - Persistent data structures
- **Ramda** - Functional programming utilities

## 📚 Tóm tắt

**Immutable Pattern**:
- Object không thể thay đổi sau khi tạo
- Dùng `Object.freeze()` để enforce
- "Thay đổi" = tạo object mới

**Factory Methods**:
- Static methods để tạo object
- Thay vì `new Constructor()` trực tiếp
- Cho phép validation, transformation, multiple constructors

**Kết hợp**:
- Private/protected constructor
- Public static factory methods
- Immutable properties (freeze)
- Methods trả về object mới thay vì modify

**Ưu điểm chính**:
1. Predictable behavior
2. No side effects
3. Thread-safe
4. Easier debugging
5. Better for functional programming

**Trade-offs**:
- Tốn memory hơn
- Performance có thể chậm hơn
- Cần thay đổi mindset
