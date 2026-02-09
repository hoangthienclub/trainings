# Saga Pattern Example - Node.js

Ví dụ minh họa về **Saga Pattern** trong Node.js, sử dụng để quản lý distributed transactions trong kiến trúc microservices.

## 📚 Saga Pattern là gì?

Saga Pattern là một pattern để quản lý distributed transactions bằng cách:
- Chia nhỏ transaction thành các bước tuần tự
- Mỗi bước có một **compensation action** (hành động bù trừ) để rollback
- Nếu một bước thất bại, tất cả các bước đã thực thi sẽ được rollback theo thứ tự ngược lại

## 🏗️ Kiến trúc

```
Order Saga
├── Step 1: Tạo đơn hàng
│   └── Compensation: Hủy đơn hàng
├── Step 2: Giữ hàng trong kho
│   └── Compensation: Trả lại hàng vào kho
├── Step 3: Xử lý thanh toán
│   └── Compensation: Hoàn tiền
└── Step 4: Tạo đơn vận chuyển
    └── Compensation: Hủy đơn vận chuyển
```

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
│   ├── orchestration.js          # Orchestration examples
│   └── choreography.js           # Choreography examples
├── docs/                         # Tài liệu
│   ├── README.md                 # File này
│   └── comparison.md             # So sánh Orchestration vs Choreography
├── package.json
└── README.md                     # README chính
```

## 🚀 Cài đặt và Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy ví dụ Orchestration-based Saga
npm start

# Chạy ví dụ Choreography-based Saga
npm run choreography
```

## 💡 Cách hoạt động

### 1. Saga Orchestrator

`SagaOrchestrator` quản lý việc thực thi các bước:
- Thêm các bước với action và compensation
- Thực thi các bước tuần tự
- Tự động rollback nếu có lỗi

### 2. Các Services

Mỗi service đại diện cho một microservice:
- **OrderService**: Tạo và quản lý đơn hàng
- **InventoryService**: Quản lý kho hàng và giữ chỗ sản phẩm
- **PaymentService**: Xử lý thanh toán
- **ShippingService**: Tạo đơn vận chuyển

### 3. Compensation Actions

Mỗi bước có một compensation action để rollback:
- `cancelOrder()`: Hủy đơn hàng
- `releaseInventory()`: Trả lại hàng vào kho
- `refundPayment()`: Hoàn tiền
- `cancelShipment()`: Hủy đơn vận chuyển

## 📝 Ví dụ

### Ví dụ 1: Đơn hàng thành công

Tất cả các bước thực thi thành công, không cần rollback.

### Ví dụ 2: Thất bại ở bước thanh toán

1. ✅ Tạo đơn hàng
2. ✅ Giữ hàng trong kho
3. ❌ Thanh toán thất bại
4. 🔄 Rollback: Trả lại hàng vào kho
5. 🔄 Rollback: Hủy đơn hàng

### Ví dụ 3: Thất bại ở bước giữ hàng

1. ✅ Tạo đơn hàng
2. ❌ Không đủ hàng trong kho
3. 🔄 Rollback: Hủy đơn hàng

## 🎯 Lợi ích của Saga Pattern

1. **Không có distributed locks**: Không cần lock toàn bộ transaction
2. **High availability**: Mỗi service có thể hoạt động độc lập
3. **Scalability**: Dễ dàng scale từng service riêng biệt
4. **Eventual consistency**: Đảm bảo tính nhất quán cuối cùng

## ⚠️ Lưu ý

1. **Idempotency**: Đảm bảo các action và compensation có thể chạy nhiều lần an toàn
2. **Compensation có thể fail**: Cần xử lý trường hợp compensation cũng thất bại
3. **Monitoring**: Cần theo dõi trạng thái của các saga để xử lý các trường hợp edge case

## 🔄 Các biến thể của Saga Pattern

Có 2 cách triển khai Saga Pattern:

### 1. Orchestration-based Saga (Điều phối tập trung)

Có một **orchestrator** trung tâm điều phối tất cả các bước. Orchestrator biết toàn bộ flow và quyết định bước tiếp theo.

**Ưu điểm:**
- ✅ Dễ hiểu và debug: Tất cả logic ở một nơi
- ✅ Dễ test: Có thể test toàn bộ flow trong một chỗ
- ✅ Dễ thay đổi flow: Chỉ cần sửa orchestrator
- ✅ Tránh cyclic dependencies: Services không cần biết về nhau
- ✅ Dễ monitoring: Có thể theo dõi trạng thái saga ở một nơi

**Nhược điểm:**
- ❌ Single point of failure: Nếu orchestrator down, toàn bộ saga dừng
- ❌ Tight coupling: Orchestrator phải biết tất cả services
- ❌ Khó scale orchestrator: Phải xử lý nhiều saga đồng thời

**Khi nào dùng:**
- Flow phức tạp, có nhiều điều kiện
- Cần kiểm soát chặt chẽ thứ tự các bước
- Team nhỏ, cần dễ maintain
- Cần monitoring và debugging tốt

### 2. Choreography-based Saga (Điều phối phân tán)

Không có orchestrator trung tâm. Mỗi service tự quyết định bước tiếp theo dựa trên **events** mà nó nhận được.

**Ưu điểm:**
- ✅ Decentralized: Không có single point of failure
- ✅ Loose coupling: Services không cần biết về nhau, chỉ cần biết events
- ✅ Dễ scale: Mỗi service scale độc lập
- ✅ Flexible: Dễ thêm service mới vào flow
- ✅ Event-driven: Phù hợp với kiến trúc event-driven

**Nhược điểm:**
- ❌ Khó debug: Logic rải rác ở nhiều services
- ❌ Khó test: Phải test từng service riêng biệt
- ❌ Khó thay đổi flow: Phải sửa nhiều services
- ❌ Có thể có cyclic dependencies: Services phụ thuộc vào events của nhau
- ❌ Khó monitoring: Phải theo dõi events ở nhiều nơi

**Khi nào dùng:**
- Flow đơn giản, tuyến tính
- Cần high availability, không có single point of failure
- Team lớn, mỗi team quản lý một service
- Đã có infrastructure event-driven (Kafka, RabbitMQ, etc.)
- Cần scale cao

## 📊 So sánh Orchestration vs Choreography

| Tiêu chí | Orchestration | Choreography |
|----------|--------------|--------------|
| **Độ phức tạp** | Dễ hiểu hơn | Phức tạp hơn |
| **Single Point of Failure** | Có (Orchestrator) | Không |
| **Coupling** | Tight (Orchestrator biết tất cả) | Loose (Chỉ biết events) |
| **Debugging** | Dễ (Logic ở một nơi) | Khó (Logic rải rác) |
| **Testing** | Dễ (Test toàn bộ flow) | Khó (Test từng service) |
| **Scalability** | Khó scale orchestrator | Dễ scale từng service |
| **Flexibility** | Khó thêm service mới | Dễ thêm service mới |
| **Monitoring** | Dễ (Một nơi) | Khó (Nhiều nơi) |
| **Event-driven** | Không bắt buộc | Bắt buộc |

## 🎯 Nên dùng cách nào?

### Dùng **Orchestration** khi:
- ✅ Bạn mới bắt đầu với Saga Pattern
- ✅ Flow phức tạp, có nhiều điều kiện và branching
- ✅ Team nhỏ, cần code dễ hiểu và maintain
- ✅ Cần debugging và monitoring tốt
- ✅ Có thể chấp nhận single point of failure (có thể deploy nhiều orchestrator instances)

### Dùng **Choreography** khi:
- ✅ Flow đơn giản, tuyến tính
- ✅ Cần high availability tuyệt đối
- ✅ Team lớn, mỗi team độc lập
- ✅ Đã có infrastructure event-driven
- ✅ Cần scale cao, mỗi service scale độc lập
- ✅ Services đã được thiết kế theo event-driven architecture

### Kết hợp cả hai:
Trong thực tế, bạn có thể kết hợp cả hai:
- Dùng **Orchestration** cho các flow phức tạp, quan trọng
- Dùng **Choreography** cho các flow đơn giản, cần scale cao
- Một saga lớn có thể có sub-sagas dùng Choreography

## 🧪 Chạy cả hai ví dụ

Để so sánh trực tiếp, bạn có thể chạy cả hai:

```bash
# Chạy Orchestration examples
npm start

# Chạy Choreography examples  
npm run choreography
```

## 📖 Tài liệu tham khảo

- [Microservices Patterns - Saga Pattern](https://microservices.io/patterns/data/saga.html)
- [Distributed Transactions: The Icebergs of Microservices](https://www.nginx.com/blog/distributed-transactions-microservices-icebergs/)
- Xem file `comparison.md` để có so sánh chi tiết giữa Orchestration và Choreography