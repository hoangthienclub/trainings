# SOLID Design Principles - Ví dụ bằng Node.js

Đây là tập hợp các ví dụ chi tiết về 5 nguyên tắc SOLID trong lập trình hướng đối tượng, được viết bằng JavaScript/Node.js.

## 📚 SOLID là gì?

SOLID là 5 nguyên tắc thiết kế phần mềm giúp code dễ maintain, dễ mở rộng, và dễ test hơn:

1. **S**ingle Responsibility Principle (SRP)
2. **O**pen/Closed Principle (OCP)
3. **L**iskov Substitution Principle (LSP)
4. **I**nterface Segregation Principle (ISP)
5. **D**ependency Inversion Principle (DIP)

## 🚀 Cách chạy ví dụ

```bash
# Chạy từng ví dụ
npm run srp-bad      # SRP - Ví dụ vi phạm
npm run srp-good     # SRP - Ví dụ tuân thủ

npm run ocp-bad      # OCP - Ví dụ vi phạm
npm run ocp-good     # OCP - Ví dụ tuân thủ

npm run lsp-bad      # LSP - Ví dụ vi phạm
npm run lsp-good     # LSP - Ví dụ tuân thủ

npm run isp-bad      # ISP - Ví dụ vi phạm
npm run isp-good     # ISP - Ví dụ tuân thủ

npm run dip-bad      # DIP - Ví dụ vi phạm
npm run dip-good     # DIP - Ví dụ tuân thủ
```

Hoặc chạy trực tiếp:
```bash
node 1-srp-bad.js
node 1-srp-good.js
# ... tương tự cho các file khác
```

## 📖 Chi tiết từng nguyên tắc

### 1. Single Responsibility Principle (SRP)

**Nguyên tắc:** Một class chỉ nên có một lý do để thay đổi (một trách nhiệm duy nhất).

**Ví dụ:**
- **Bad:** Class `User` vừa quản lý data, vừa validate, vừa lưu database, vừa gửi email
- **Good:** Tách thành `User`, `UserValidator`, `UserRepository`, `EmailService`

**Lợi ích:**
- ✅ Dễ maintain: mỗi class nhỏ, tập trung
- ✅ Dễ test: test từng class riêng biệt
- ✅ Dễ mở rộng: thêm tính năng không ảnh hưởng class khác

**Files:**
- [`1-srp-bad.js`](./1-srp-bad.js) - Vi phạm SRP
- [`1-srp-good.js`](./1-srp-good.js) - Tuân thủ SRP

---

### 2. Open/Closed Principle (OCP)

**Nguyên tắc:** Software entities nên "mở cho mở rộng, đóng cho sửa đổi".

**Ví dụ:**
- **Bad:** `PaymentProcessor` dùng if/else, mỗi khi thêm phương thức thanh toán mới phải sửa code
- **Good:** Dùng abstraction và inheritance, thêm phương thức mới chỉ cần tạo class mới

**Lợi ích:**
- ✅ Mở rộng dễ dàng: thêm class mới
- ✅ Không sửa code cũ: giảm rủi ro
- ✅ Tuân thủ OCP: "Open for extension, Closed for modification"

**Files:**
- [`2-ocp-bad.js`](./2-ocp-bad.js) - Vi phạm OCP
- [`2-ocp-good.js`](./2-ocp-good.js) - Tuân thủ OCP

---

### 3. Liskov Substitution Principle (LSP)

**Nguyên tắc:** Đối tượng của class con phải có thể thay thế được class cha mà không gây lỗi.

**Ví dụ:**
- **Bad:** `Penguin` kế thừa `Bird` nhưng không bay được → throw exception
- **Good:** Thiết kế lại: `Bird` → `FlyingBird`, `SwimmingBird`

**Lợi ích:**
- ✅ Subclass có thể thay thế superclass
- ✅ Không cần throw exception
- ✅ Class hierarchy rõ ràng, logic

**Files:**
- [`3-lsp-bad.js`](./3-lsp-bad.js) - Vi phạm LSP
- [`3-lsp-good.js`](./3-lsp-good.js) - Tuân thủ LSP

---

### 4. Interface Segregation Principle (ISP)

**Nguyên tắc:** Không nên bắt client implement các method mà nó không dùng.

**Ví dụ:**
- **Bad:** Interface `Worker` quá lớn, `RobotWorker` bắt buộc phải implement `eat()`, `sleep()`
- **Good:** Tách thành nhiều interface nhỏ: `Workable`, `Eatable`, `Sleepable`, `Rechargeable`

**Lợi ích:**
- ✅ Mỗi class chỉ implement interface cần thiết
- ✅ Không bắt buộc implement method không dùng
- ✅ Linh hoạt, dễ mở rộng

**Files:**
- [`4-isp-bad.js`](./4-isp-bad.js) - Vi phạm ISP
- [`4-isp-good.js`](./4-isp-good.js) - Tuân thủ ISP

---

### 5. Dependency Inversion Principle (DIP)

**Nguyên tắc:** 
1. High-level modules không nên phụ thuộc vào low-level modules. Cả hai nên phụ thuộc vào abstraction.
2. Abstraction không nên phụ thuộc vào details. Details nên phụ thuộc vào abstraction.

**Ví dụ:**
- **Bad:** `UserService` phụ thuộc trực tiếp vào `MySQLDatabase`
- **Good:** Cả hai phụ thuộc vào `IDatabase` interface, dùng Dependency Injection

**Lợi ích:**
- ✅ Dễ thay đổi database: chỉ cần inject implementation khác
- ✅ Dễ test: inject mock database
- ✅ Code linh hoạt, dễ mở rộng

**Files:**
- [`5-dip-bad.js`](./5-dip-bad.js) - Vi phạm DIP
- [`5-dip-good.js`](./5-dip-good.js) - Tuân thủ DIP

---

## 🎯 Tổng kết

### Tại sao cần SOLID?

1. **Maintainability** - Dễ bảo trì
   - Code rõ ràng, dễ hiểu
   - Thay đổi ít ảnh hưởng đến phần khác

2. **Testability** - Dễ test
   - Test từng phần riêng biệt
   - Dễ mock dependencies

3. **Flexibility** - Linh hoạt
   - Dễ thêm tính năng mới
   - Dễ thay đổi implementation

4. **Reusability** - Tái sử dụng
   - Code module hóa
   - Dễ tái sử dụng ở nhiều nơi

### Khi nào áp dụng SOLID?

- ✅ Dự án lớn, phức tạp
- ✅ Team nhiều người
- ✅ Code cần maintain lâu dài
- ✅ Yêu cầu cao về quality

### Khi nào KHÔNG cần quá strict?

- ⚠️ Script nhỏ, chạy một lần
- ⚠️ Prototype, POC
- ⚠️ Deadline gấp (nhưng nên refactor sau)

## 📝 Ghi chú

- Tất cả ví dụ đều có comments chi tiết bằng tiếng Việt
- Mỗi nguyên tắc có 2 file: bad (vi phạm) và good (tuân thủ)
- Chạy file để xem output và hiểu rõ hơn
- So sánh bad vs good để thấy sự khác biệt

## 🔗 Tài liệu tham khảo

- [SOLID Principles - Wikipedia](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code - Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Design Patterns - Gang of Four](https://en.wikipedia.org/wiki/Design_Patterns)

## 📧 Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue hoặc pull request.

---

**Happy Coding! 🚀**
