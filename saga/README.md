# Saga Pattern Example - Node.js

Ví dụ minh họa về **Saga Pattern** trong Node.js, sử dụng để quản lý distributed transactions trong kiến trúc microservices.

## 📚 Saga Pattern là gì?

Saga Pattern là một pattern để quản lý distributed transactions bằng cách:
- Chia nhỏ transaction thành các bước tuần tự
- Mỗi bước có một **compensation action** (hành động bù trừ) để rollback
- Nếu một bước thất bại, tất cả các bước đã thực thi sẽ được rollback theo thứ tự ngược lại

## 📁 Cấu trúc Project

```
saga/
├── src/                          # Source code chính
│   ├── orchestration/            # Orchestration-based Saga
│   │   └── sagaOrchestrator.js   # Orchestrator class
│   ├── choreography/             # Choreography-based Saga
│   │   ├── eventBus.js           # Event Bus
│   │   └── sagaHandlers.js       # Event handlers
│   └── services/                 # Shared services
│       ├── orderService.js
│       ├── inventoryService.js
│       ├── paymentService.js
│       └── shippingService.js
├── examples/                     # Ví dụ sử dụng
│   ├── orchestration.js          # Orchestration examples (dùng event message)
│   ├── orchestrationWithDB.js   # Orchestration với DB verification
│   ├── choreography.js           # Choreography examples (dùng event message)
│   └── choreographyWithDB.js    # Choreography với DB verification
├── docs/                         # Tài liệu
│   ├── README.md                 # Tài liệu chi tiết
│   ├── comparison.md             # So sánh Orchestration vs Choreography
│   └── database-vs-event.md      # Database vs Event Message trong Saga
├── package.json
└── README.md                     # File này
```

## 🚀 Cài đặt và Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy ví dụ Orchestration-based Saga (dùng event message)
npm start

# Chạy ví dụ Choreography-based Saga (dùng event message)
npm run choreography

# Chạy ví dụ Orchestration với DB verification
npm run start:db

# Chạy ví dụ Choreography với DB verification
npm run choreography:db
```

## 🔄 Hai cách triển khai Saga Pattern

### 1. Orchestration-based Saga (Điều phối tập trung)

Có một **orchestrator** trung tâm điều phối tất cả các bước.

**Ưu điểm:**
- ✅ Dễ hiểu và debug
- ✅ Dễ test và maintain
- ✅ Tránh cyclic dependencies

**Nhược điểm:**
- ❌ Single point of failure
- ❌ Tight coupling

### 2. Choreography-based Saga (Điều phối phân tán)

Không có orchestrator trung tâm. Mỗi service tự quyết định bước tiếp theo dựa trên **events**.

**Ưu điểm:**
- ✅ Decentralized, không có single point of failure
- ✅ Loose coupling
- ✅ Dễ scale

**Nhược điểm:**
- ❌ Khó debug và test
- ❌ Logic rải rác

## 📊 So sánh nhanh

| Tiêu chí | Orchestration | Choreography |
|----------|--------------|--------------|
| **Độ phức tạp** | Thấp | Cao |
| **Single Point of Failure** | Có | Không |
| **Coupling** | Tight | Loose |
| **Debugging** | Dễ | Khó |
| **Scalability** | Trung bình | Cao |

## 🎯 Nên dùng cách nào?

### Dùng **Orchestration** khi:
- ✅ Bạn mới bắt đầu với Saga Pattern
- ✅ Flow phức tạp, có nhiều điều kiện
- ✅ Team nhỏ, cần code dễ hiểu
- ✅ Cần debugging và monitoring tốt

### Dùng **Choreography** khi:
- ✅ Flow đơn giản, tuyến tính
- ✅ Cần high availability tuyệt đối
- ✅ Team lớn, mỗi team độc lập
- ✅ Đã có infrastructure event-driven
- ✅ Cần scale cao

## 💾 Database vs Event Message

Khi mỗi step lưu vào database, step tiếp theo nên:
- **Lấy từ Event Message**: Nhanh, nhưng không verify state
- **Lấy từ Database**: Chậm hơn, nhưng đảm bảo data consistency
- **Kết hợp cả hai**: Best practice - dùng event message cho ID, query DB để verify

Xem chi tiết: `docs/database-vs-event.md`

## 📖 Tài liệu chi tiết

Xem thêm trong thư mục `docs/`:
- `docs/README.md` - Tài liệu chi tiết về Saga Pattern
- `docs/comparison.md` - So sánh chi tiết giữa Orchestration và Choreography
- `docs/database-vs-event.md` - Database vs Event Message trong Saga Pattern

## 📚 Tài liệu tham khảo

- [Microservices Patterns - Saga Pattern](https://microservices.io/patterns/data/saga.html)
- [Distributed Transactions: The Icebergs of Microservices](https://www.nginx.com/blog/distributed-transactions-microservices-icebergs/)
