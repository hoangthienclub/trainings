# Outbox Pattern + Saga Pattern Example

## Tổng quan

Ví dụ này minh họa cách kết hợp **Outbox Pattern** và **Saga Pattern** để xử lý giao dịch phân tán trong kiến trúc microservices.

## Kiến trúc

```
┌─────────────────┐
│  Order Service  │
│  - Create Order │
│  - Outbox Table │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Outbox Relay    │
│ (Publisher)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Message Broker │
│  (Kafka/RabbitMQ)│
└────────┬────────┘
         │
         ├──────────────┬──────────────┐
         ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Payment    │ │  Inventory   │ │   Shipping   │
│   Service    │ │   Service    │ │   Service    │
└──────────────┘ └──────────────┘ └──────────────┘
```

## Các Pattern được sử dụng

### 1. Outbox Pattern
- Đảm bảo atomicity giữa database update và message publishing
- Sử dụng local transaction để lưu business data và outbox message
- Relay process đọc outbox table và publish messages

### 2. Saga Pattern (Orchestration)
- Quản lý distributed transaction qua nhiều services
- Xử lý compensation khi có lỗi xảy ra
- Đảm bảo eventual consistency

## Cấu trúc thư mục

```
outbox/
├── README.md
├── package.json
├── docker-compose.yml
├── shared/
│   ├── database.js
│   ├── message-broker.js
│   └── constants.js              # Shared constants
├── order-service/
│   ├── index.js
│   ├── order-repository.js
│   └── outbox-repository.js
├── saga-orchestrator-service/    # Saga orchestrator riêng
│   ├── index.js
│   └── saga-orchestrator.js
├── outbox-relay/
│   └── index.js
├── payment-service/
│   └── index.js
├── inventory-service/
│   └── index.js
└── shipping-service/
    └── index.js
```

## Cài đặt và chạy

```bash
# Cài đặt dependencies
npm install

# Khởi động infrastructure (PostgreSQL, Kafka, Kafka UI)
docker-compose up -d

# Kiểm tra services đang chạy
docker-compose ps

# Truy cập Kafka UI: http://localhost:8080

# Chạy các services (mỗi terminal riêng)
npm run start:order      # Order Service (Port 3001)
npm run start:relay      # Outbox Relay
npm run start:saga       # Saga Orchestrator Service
npm run start:payment    # Payment Service
npm run start:inventory  # Inventory Service
npm run start:shipping   # Shipping Service
```

## Monitoring

- **Kafka UI**: http://localhost:8080
  - Xem tất cả topics
  - Monitor messages real-time
  - Xem consumer groups
  - Inspect message payloads


## Flow hoạt động

1. **Order Service** nhận request tạo đơn hàng
2. Trong một transaction:
   - Lưu order vào `orders` table
   - Lưu event vào `outbox` table ✅ **Outbox Pattern**
   - Commit transaction
3. **Outbox Relay** polling outbox table
4. Publish `OrderCreated` event lên Kafka
5. **Saga Orchestrator** lắng nghe event và bắt đầu saga
6. Saga điều phối các bước:
   - Reserve Payment → Payment Service
   - Reserve Inventory → Inventory Service
   - Schedule Shipping → Shipping Service
7. Nếu có lỗi, thực hiện compensation:
   - Refund Payment
   - Release Inventory
   - Cancel Shipping

### Ưu điểm của kiến trúc này:

✅ **Atomicity**: Database update và event publishing trong cùng transaction  
✅ **Eventual Consistency**: Đảm bảo dữ liệu cuối cùng sẽ nhất quán  
✅ **Decoupling**: Services không phụ thuộc trực tiếp vào nhau  
✅ **Reliability**: Retry mechanism và compensation handling  
✅ **Observability**: Saga state và step logs để tracking

