# Clean Architecture với MVC Pattern trong Node.js

Ví dụ về Clean Architecture được implement với cấu trúc MVC quen thuộc trong Node.js + Express.

## 📚 Giới thiệu về Clean Architecture

Clean Architecture là một pattern thiết kế phần mềm được đề xuất bởi Robert C. Martin (Uncle Bob). Mục tiêu chính là tạo ra code:
- **Độc lập với Framework**: Business logic không phụ thuộc vào Express, React, etc.
- **Testable**: Dễ dàng test mà không cần UI, Database, Web Server
- **Độc lập với UI**: UI có thể thay đổi mà không ảnh hưởng business logic
- **Độc lập với Database**: Có thể đổi MongoDB sang PostgreSQL mà không ảnh hưởng business rules
- **Độc lập với bất kỳ external agency nào**

## 🏗️ Cấu trúc Project

```
clean-architecture/
├── src/
│   ├── models/              # 🔵 Domain Layer - Business Entities
│   │   └── User.js          # Entity với business logic và validation
│   │
│   ├── services/            # 🟢 Use Cases Layer - Business Logic
│   │   └── userService.js   # Orchestrate business operations
│   │
│   ├── repositories/        # 🟡 Data Access Layer
│   │   └── userRepository.js # Trừu tượng hóa data access
│   │
│   ├── controllers/         # 🟠 Interface Adapters
│   │   └── userController.js # Xử lý HTTP requests/responses
│   │
│   ├── routes/              # 🔴 API Routes
│   │   └── userRoutes.js    # Định nghĩa endpoints
│   │
│   ├── utils/               # 🛠️ Utilities
│   │   ├── validator.js     # Validation helpers
│   │   └── response.js      # Response formatting
│   │
│   ├── config/              # ⚙️ Configuration
│   │   └── database.js      # Database setup (in-memory)
│   │
│   └── app.js              # Express app setup
│
├── server.js               # Server entry point
├── package.json
└── README.md
```

## 🎯 Các Layer và Dependency Rule

### 1. Models Layer (Domain Layer)
- **Trách nhiệm**: Chứa business entities và business logic cốt lõi
- **Phụ thuộc**: KHÔNG phụ thuộc vào layer nào khác
- **Ví dụ**: `User.js` - Entity với validation rules

### 2. Services Layer (Use Cases Layer)
- **Trách nhiệm**: Orchestrate business logic, implement use cases
- **Phụ thuộc**: Models, Repositories (interface)
- **Ví dụ**: `userService.js` - Create user, update user, business rules

### 3. Repositories Layer (Data Access Layer)
- **Trách nhiệm**: Trừu tượng hóa data access, CRUD operations
- **Phụ thuộc**: Models, Database config
- **Ví dụ**: `userRepository.js` - Tương tác với database

### 4. Controllers Layer (Interface Adapters)
- **Trách nhiệm**: Chuyển đổi data giữa HTTP và business logic
- **Phụ thuộc**: Services, Utils
- **Ví dụ**: `userController.js` - Handle HTTP requests

### 5. Routes Layer
- **Trách nhiệm**: Định nghĩa API endpoints
- **Phụ thuộc**: Controllers
- **Ví dụ**: `userRoutes.js` - Express routes

### 6. Utils & Config
- **Trách nhiệm**: Shared utilities và configuration
- **Ví dụ**: Validators, response helpers, database config

## 🔄 Data Flow

```
HTTP Request
    ↓
Routes (userRoutes.js)
    ↓
Controller (userController.js)
    ↓
Service (userService.js) ← Business Logic
    ↓
Repository (userRepository.js)
    ↓
Database (database.js)
    ↓
Model (User.js) ← Validation
    ↓
Response ← Utils (response.js)
    ↓
HTTP Response
```

## 🚀 Cài đặt và Chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy server
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

### 3. Development mode (với nodemon)
```bash
npm run dev
```

## 📡 API Endpoints

### 1. Tạo User Mới
```bash
POST /api/users
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "age": 25
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo user thành công",
  "data": {
    "id": "uuid-here",
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "age": 25,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Lấy Tất Cả Users
```bash
GET /api/users
```

### 3. Lấy User Theo ID
```bash
GET /api/users/:id
```

### 4. Cập Nhật User
```bash
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Nguyễn Văn B",
  "age": 26
}
```

### 5. Xóa User
```bash
DELETE /api/users/:id
```

### 6. Lấy Users Trưởng Thành (>= 18 tuổi)
```bash
GET /api/users/adults
```

## 🧪 Test với cURL

### Tạo user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Trần Thị B","email":"tranthib@example.com","age":30}'
```

### Lấy tất cả users
```bash
curl http://localhost:3000/api/users
```

### Lấy user theo ID
```bash
curl http://localhost:3000/api/users/USER_ID_HERE
```

### Cập nhật user
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"age":31}'
```

### Xóa user
```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID_HERE
```

## 💡 Ưu điểm của Clean Architecture

### 1. **Separation of Concerns**
Mỗi layer có trách nhiệm riêng biệt, dễ maintain và scale

### 2. **Testability**
- Test Models mà không cần database
- Test Services mà không cần HTTP
- Mock repositories dễ dàng

### 3. **Flexibility**
- Đổi database: Chỉ cần thay đổi Repository layer
- Đổi framework: Chỉ cần thay đổi Controllers/Routes
- Thêm API mới: Thêm routes mà không ảnh hưởng business logic

### 4. **Maintainability**
- Code organized rõ ràng
- Dễ tìm và fix bugs
- Dễ onboard developers mới

### 5. **Reusability**
- Business logic có thể reuse cho Web, Mobile, CLI
- Models và Services độc lập với delivery mechanism

## 🔍 Ví dụ về Dependency Rule

```javascript
// ✅ ĐÚNG: Service phụ thuộc vào Repository
// userService.js
const userRepository = require('../repositories/userRepository');

// ✅ ĐÚNG: Controller phụ thuộc vào Service
// userController.js
const userService = require('../services/userService');

// ❌ SAI: Model KHÔNG được phụ thuộc vào Service
// User.js
// const userService = require('../services/userService'); // WRONG!

// ❌ SAI: Service KHÔNG được phụ thuộc vào Controller
// userService.js
// const userController = require('../controllers/userController'); // WRONG!
```

## 🎓 Best Practices

1. **Models**: Chỉ chứa business logic thuần túy, không có dependencies
2. **Services**: Implement business rules, orchestrate operations
3. **Repositories**: Chỉ lo data access, không có business logic
4. **Controllers**: Chỉ lo HTTP, không có business logic
5. **Routes**: Chỉ định nghĩa endpoints, không có logic

## 🚧 Mở rộng

### Thêm Database thật (MongoDB)
Chỉ cần thay đổi `src/repositories/userRepository.js`:
```javascript
// Thay vì in-memory
const database = require('../config/database');

// Dùng MongoDB
const User = require('../models/User');
// ... MongoDB operations
```

### Thêm Authentication
Thêm middleware trong `src/app.js`:
```javascript
const authMiddleware = require('./middleware/auth');
app.use('/api/users', authMiddleware, userRoutes);
```

### Thêm Validation Middleware
Tạo `src/middleware/validateUser.js` và apply vào routes

## 📖 Tài liệu tham khảo

- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [The Clean Architecture in Node.js](https://mannhowie.com/clean-architecture-node)

## 📝 License

MIT

---

**Tác giả**: Clean Architecture Example  
**Ngày tạo**: 2024  
**Mục đích**: Educational - Học tập về Clean Architecture
