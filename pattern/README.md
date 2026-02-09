# Design Patterns trong JavaScript

Tổng hợp các Design Patterns phổ biến được implement bằng JavaScript với giải thích chi tiết.

## 📚 Danh sách Patterns

### Creational Patterns (Khởi tạo Object)

1. **[Singleton Pattern](./01-singleton-pattern.js)** ⭐⭐⭐⭐⭐
   - Đảm bảo chỉ có một instance duy nhất
   - Use cases: Database connection, Config manager, Logger, Cache
   - 4 cách implement: Class, IIFE, Object Literal, ES6 Module

2. **[Factory Pattern](./02-factory-pattern.js)** ⭐⭐⭐⭐⭐
   - Tạo objects mà không cần chỉ định class cụ thể
   - Use cases: Vehicle factory, User roles, UI themes, Database connections
   - 3 loại: Simple Factory, Factory Method, Abstract Factory

3. **[Builder Pattern](./10-builder-pattern.js)** ⭐⭐⭐⭐
   - Xây dựng complex objects theo từng bước
   - Use cases: Pizza builder, Query builder, HTTP request builder
   - Fluent interface pattern

### Behavioral Patterns (Hành vi)

4. **[Strategy Pattern](./03-strategy-pattern.js)** ⭐⭐⭐⭐⭐
   - Định nghĩa họ các thuật toán có thể thay thế lẫn nhau
   - Use cases: Payment methods, Sorting algorithms, Compression, Validation
   - Loại bỏ if-else phức tạp

5. **[Observer Pattern](./04-observer-pattern.js)** ⭐⭐⭐⭐⭐
   - Pub/Sub pattern - thông báo khi có thay đổi
   - Use cases: News publisher, Stock market, Event emitter
   - Loose coupling giữa objects

6. **[Command Pattern](./09-command-pattern.js)** ⭐⭐⭐⭐
   - Đóng gói request thành object
   - Use cases: Text editor với undo/redo, Remote control
   - Hỗ trợ queue, log, undo operations

### Structural Patterns (Cấu trúc)

7. **[Decorator Pattern](./05-decorator-pattern.js)** ⭐⭐⭐⭐
   - Thêm chức năng mới vào objects động
   - Use cases: Coffee shop, Text formatting, Function decorators
   - Linh hoạt hơn kế thừa

8. **[Proxy Pattern](./07-proxy-pattern.js)** ⭐⭐⭐⭐
   - Kiểm soát truy cập vào objects
   - Use cases: Lazy loading, Access control, Caching, Logging
   - ES6 Proxy built-in

9. **[Adapter Pattern](./08-adapter-pattern.js)** ⭐⭐⭐⭐
   - Chuyển đổi interface không tương thích
   - Use cases: Payment gateways, Data formats, Third-party APIs, Databases
   - Integration pattern

10. **[Module Pattern](./06-module-pattern.js)** ⭐⭐⭐⭐⭐
    - Đóng gói private/public members
    - Use cases: Calculator, User manager, App config, Shopping cart
    - IIFE, Revealing Module, Singleton Module

## 🎯 Cách sử dụng

Mỗi file pattern có thể chạy độc lập:

```bash
# Chạy từng pattern
node 01-singleton-pattern.js
node 02-factory-pattern.js
node 03-strategy-pattern.js
# ... và các file khác
```

## 📖 Cấu trúc mỗi file

Mỗi file pattern bao gồm:

1. **Định nghĩa**: Pattern là gì?
2. **Khi nào sử dụng**: Use cases cụ thể
3. **Ưu điểm**: Lợi ích khi sử dụng
4. **Nhược điểm**: Hạn chế cần lưu ý
5. **Ví dụ code**: 3-5 ví dụ thực tế
6. **Demo**: Code chạy được ngay
7. **Kết luận**: Tổng kết và so sánh

## 🌟 Patterns phổ biến nhất

### Top 5 patterns nên học đầu tiên:

1. **Module Pattern** - Cơ bản nhất, dùng hàng ngày
2. **Singleton Pattern** - Quản lý state, config
3. **Factory Pattern** - Tạo objects linh hoạt
4. **Observer Pattern** - Event handling, reactive programming
5. **Strategy Pattern** - Thay thế if-else, algorithms

## 💡 Khi nào dùng pattern nào?

### Tạo Objects
- Cần 1 instance duy nhất → **Singleton**
- Nhiều loại objects tương tự → **Factory**
- Object phức tạp nhiều params → **Builder**

### Thay đổi behavior
- Nhiều thuật toán khác nhau → **Strategy**
- Cần undo/redo → **Command**
- Thông báo nhiều objects → **Observer**

### Cấu trúc code
- Thêm chức năng động → **Decorator**
- Kiểm soát truy cập → **Proxy**
- Interface không tương thích → **Adapter**
- Đóng gói private/public → **Module**

## 📚 Tài liệu tham khảo

- [Refactoring Guru - Design Patterns](https://refactoring.guru/design-patterns)
- [JavaScript Design Patterns](https://www.patterns.dev/)
- [Learning JavaScript Design Patterns - Addy Osmani](https://addyosmani.com/resources/essentialjsdesignpatterns/book/)

## 🎓 Lưu ý

- Patterns là **giải pháp**, không phải **quy tắc bắt buộc**
- Đừng over-engineering - chỉ dùng khi cần thiết
- Hiểu **vấn đề** trước khi áp dụng pattern
- Mỗi pattern có **trade-offs** riêng
- Practice makes perfect! 💪

## 🚀 Next Steps

Sau khi học xong 10 patterns này, bạn có thể tìm hiểu thêm:

- **Facade Pattern** - Simplified interface
- **Composite Pattern** - Tree structures
- **State Pattern** - State machines
- **Template Method** - Algorithm skeleton
- **Chain of Responsibility** - Request handling chain
- **Mediator Pattern** - Centralized communication
- **Memento Pattern** - Save/restore state
- **Prototype Pattern** - Clone objects
- **Flyweight Pattern** - Share objects efficiently

---

**Happy Coding! 🎉**

Tạo bởi: Design Patterns Tutorial
Ngôn ngữ: JavaScript (ES6+)
