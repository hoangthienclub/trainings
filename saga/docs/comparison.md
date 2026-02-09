# So sánh Orchestration vs Choreography

## 🔄 Flow Diagram

### Orchestration-based Saga

```
┌─────────────┐
│  Client     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Orchestrator   │ ◄─── Single Point of Control
└──────┬──────────┘
       │
       ├──► Order Service
       ├──► Inventory Service
       ├──► Payment Service
       └──► Shipping Service
```

**Đặc điểm:**
- Orchestrator điều phối tất cả
- Services không biết về nhau
- Dễ theo dõi và debug

### Choreography-based Saga

```
┌─────────────┐
│  Client     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Event Bus   │
└──────┬──────┘
       │
       ├──► Order Service ──┐
       │                     │
       ├──► Inventory ───────┤
       │    Service          │ Events flow
       │                     │
       ├──► Payment ─────────┤
       │    Service          │
       │                     │
       └──► Shipping ────────┘
            Service
```

**Đặc điểm:**
- Không có orchestrator trung tâm
- Services giao tiếp qua events
- Mỗi service tự quyết định bước tiếp theo

## 📋 Bảng so sánh chi tiết

| Tiêu chí | Orchestration | Choreography |
|----------|--------------|--------------|
| **Kiến trúc** | Centralized | Distributed |
| **Điều phối** | Orchestrator | Event Bus |
| **Coupling** | Tight (Orchestrator biết tất cả services) | Loose (Services chỉ biết events) |
| **Single Point of Failure** | Có (Orchestrator) | Không |
| **Độ phức tạp** | Thấp (Logic tập trung) | Cao (Logic phân tán) |
| **Dễ hiểu** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Dễ debug** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Dễ test** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Dễ maintain** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Scalability** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Availability** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Flexibility** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 💻 Code Comparison

### Orchestration

```javascript
// Tất cả logic ở một nơi
const saga = new SagaOrchestrator();

saga.addStep(
  async (ctx) => await orderService.createOrder(ctx),
  async (ctx) => await orderService.cancelOrder(ctx),
  'Create Order'
);

saga.addStep(
  async (ctx) => await inventoryService.reserve(ctx),
  async (ctx) => await inventoryService.release(ctx),
  'Reserve Inventory'
);

await saga.execute(context);
```

**Ưu điểm:**
- Dễ đọc: Tất cả flow ở một chỗ
- Dễ sửa: Chỉ cần sửa orchestrator
- Dễ test: Mock services và test toàn bộ flow

### Choreography

```javascript
// Logic rải rác ở nhiều services
eventBus.subscribe('ORDER_CREATED', async (event) => {
  await orderService.createOrder(event.data);
  await eventBus.publish('ORDER_CREATED_SUCCESS', {...});
});

eventBus.subscribe('ORDER_CREATED_SUCCESS', async (event) => {
  await inventoryService.reserve(event.data);
  await eventBus.publish('INVENTORY_RESERVED', {...});
});

// Bắt đầu saga
await eventBus.publish('ORDER_CREATED', orderData);
```

**Ưu điểm:**
- Decoupled: Services không phụ thuộc trực tiếp
- Scalable: Mỗi service có thể scale độc lập
- Flexible: Dễ thêm service mới

## 🎯 Use Cases

### Dùng Orchestration khi:

1. **Flow phức tạp với nhiều điều kiện**
   ```javascript
   if (user.isVIP) {
     // Skip payment
   } else if (user.hasCredit) {
     // Use credit
   } else {
     // Process payment
   }
   ```

2. **Cần kiểm soát chặt chẽ thứ tự**
   - Có thể có conditional branching
   - Cần retry logic phức tạp
   - Cần timeout handling

3. **Team nhỏ, cần code dễ hiểu**
   - Junior developers dễ maintain
   - Onboarding nhanh

4. **Cần monitoring và debugging tốt**
   - Có thể log toàn bộ flow ở một nơi
   - Dễ trace lỗi

### Dùng Choreography khi:

1. **Flow đơn giản, tuyến tính**
   ```
   Order → Inventory → Payment → Shipping
   ```

2. **Cần high availability**
   - Không thể có single point of failure
   - Mỗi service phải độc lập

3. **Team lớn, mỗi team quản lý một service**
   - Teams độc lập
   - Không cần coordination

4. **Đã có event infrastructure**
   - Kafka, RabbitMQ, etc.
   - Event-driven architecture

5. **Cần scale cao**
   - Mỗi service scale độc lập
   - Không bottleneck ở orchestrator

## 🔀 Hybrid Approach

Bạn có thể kết hợp cả hai:

```javascript
// Orchestration cho flow chính
const mainSaga = new SagaOrchestrator();
mainSaga.addStep(createOrder, cancelOrder);
mainSaga.addStep(processPayment, refundPayment);

// Choreography cho sub-flow
eventBus.subscribe('PAYMENT_COMPLETED', async (event) => {
  // Multiple services react to this event
  await shippingService.createShipment(event);
  await notificationService.sendEmail(event);
  await analyticsService.trackEvent(event);
});

await mainSaga.execute(context);
```

## 📈 Khi nào nên chuyển từ Orchestration sang Choreography?

1. Orchestrator trở thành bottleneck
2. Cần scale một service cụ thể
3. Flow trở nên quá đơn giản
4. Cần thêm nhiều services vào flow
5. Team phát triển, mỗi team quản lý một service

## 📉 Khi nào nên chuyển từ Choreography sang Orchestration?

1. Flow trở nên quá phức tạp
2. Khó debug và maintain
3. Cần thêm nhiều business logic
4. Cần kiểm soát chặt chẽ hơn
5. Team nhỏ lại, cần code tập trung

## ✅ Kết luận

- **Bắt đầu với Orchestration** nếu bạn mới với Saga Pattern
- **Chuyển sang Choreography** khi cần scale hoặc high availability
- **Kết hợp cả hai** cho các use case phức tạp
- **Chọn dựa trên requirements** của dự án, không phải trend
