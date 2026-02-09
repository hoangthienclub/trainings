# Database vs Event Message trong Saga Pattern

Khi làm việc với Saga Pattern trong thực tế, một câu hỏi quan trọng là: **Step tiếp theo nên lấy thông tin từ đâu?**

## 🔄 Hai cách tiếp cận

### Cách 1: Lấy từ Event Message (Hiện tại đang dùng)

Step trước đó trả về data trong context/event, step tiếp theo sử dụng data đó.

```javascript
// Step 1: Tạo đơn hàng
const result = await orderService.createOrder(data);
return { orderId: result.orderId, order: result.order };

// Step 2: Sử dụng orderId từ context (không query DB)
await inventoryService.reserveInventory(context); // context có orderId
```

**Ưu điểm:**
- ✅ **Nhanh**: Không cần query database
- ✅ **Giảm load DB**: Ít query hơn
- ✅ **Đơn giản**: Code dễ đọc, ít phức tạp
- ✅ **Phù hợp với async**: Event message có thể được lưu trong queue

**Nhược điểm:**
- ❌ **Không verify state**: Không biết data trong DB có thay đổi không
- ❌ **Phụ thuộc message**: Nếu message thiếu data, sẽ lỗi
- ❌ **Không handle race condition**: Nếu có nhiều events cùng lúc

### Cách 2: Lấy từ Database và Verify

Step tiếp theo query database để lấy thông tin mới nhất và verify.

```javascript
// Step 1: Tạo đơn hàng
const result = await orderService.createOrder(data);
return { orderId: result.orderId };

// Step 2: Query DB để lấy order và verify
const order = await orderService.getOrder(context.orderId);
if (!order || order.status !== 'CREATED') {
  throw new Error('Order không tồn tại hoặc không hợp lệ');
}
await inventoryService.reserveInventory({ orderId: order.id, items: order.items });
```

**Ưu điểm:**
- ✅ **Data consistency**: Luôn có data mới nhất từ DB
- ✅ **Verify state**: Có thể check status, validate data
- ✅ **Handle race condition**: Có thể check và update atomically
- ✅ **Idempotency**: Có thể check xem đã xử lý chưa

**Nhược điểm:**
- ❌ **Chậm hơn**: Phải query DB
- ❌ **Tăng load DB**: Nhiều query hơn
- ❌ **Phức tạp hơn**: Code nhiều hơn
- ❌ **Network latency**: Nếu DB ở xa

## 🎯 Best Practice: Kết hợp cả hai

Trong thực tế, nên **kết hợp cả hai cách**:

1. **Dùng Event Message** cho data cơ bản (orderId, customerId, etc.)
2. **Query Database** khi cần verify state hoặc lấy data phức tạp

```javascript
// Step 2: Giữ hàng trong kho
async (context) => {
  // Lấy orderId từ context (event message)
  const { orderId } = context;
  
  // Query DB để verify order và lấy items
  const order = await orderService.getOrder(orderId);
  if (!order) {
    throw new Error(`Order ${orderId} không tồn tại`);
  }
  if (order.status !== 'CREATED') {
    throw new Error(`Order ${orderId} không ở trạng thái CREATED`);
  }
  
  // Sử dụng items từ DB (đảm bảo chính xác)
  const result = await inventoryService.reserveInventory({
    orderId: order.id,
    items: order.items, // Lấy từ DB, không phải từ event
  });
  
  return { reservations: result.reservations };
}
```

## 📊 So sánh chi tiết

| Tiêu chí | Event Message | Database Query | Kết hợp |
|----------|--------------|----------------|---------|
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Data Consistency** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Code Complexity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **DB Load** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Error Handling** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Idempotency** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🎯 Khi nào dùng cách nào?

### Dùng **Event Message** khi:
- ✅ Data đơn giản, không thay đổi (orderId, customerId)
- ✅ Performance quan trọng
- ✅ Data đã được validate ở step trước
- ✅ Không cần verify state

### Dùng **Database Query** khi:
- ✅ Cần verify state (order.status, payment.status)
- ✅ Data có thể thay đổi (stock, balance)
- ✅ Cần đảm bảo idempotency
- ✅ Cần handle race condition
- ✅ Data phức tạp, không nên đưa vào event

### Dùng **Kết hợp** khi:
- ✅ Production system thực tế
- ✅ Cần balance giữa performance và consistency
- ✅ Có nhiều services độc lập
- ✅ Cần verify nhưng vẫn muốn performance tốt

## 💡 Ví dụ thực tế

### Scenario: Order Processing

```javascript
// Step 1: Create Order
const order = await orderService.createOrder(data);
// Lưu vào DB với status = 'CREATED'
// Return: { orderId: 'ORD-123' }

// Step 2: Reserve Inventory
// ✅ Lấy orderId từ event (nhanh)
// ✅ Query DB để lấy items và verify status (chính xác)
const order = await orderService.getOrder(context.orderId);
if (order.status !== 'CREATED') {
  throw new Error('Order không hợp lệ');
}
await inventoryService.reserveInventory({
  orderId: order.id,
  items: order.items, // Từ DB, đảm bảo chính xác
});

// Step 3: Process Payment
// ✅ Lấy orderId từ event
// ✅ Query DB để lấy totalAmount (có thể đã thay đổi do discount)
const order = await orderService.getOrder(context.orderId);
await paymentService.processPayment({
  orderId: order.id,
  totalAmount: order.totalAmount, // Từ DB, có thể đã update
});
```

## ⚠️ Lưu ý quan trọng

1. **Idempotency**: Luôn check xem đã xử lý chưa
   ```javascript
   const order = await orderService.getOrder(orderId);
   if (order.status === 'PAID') {
     return; // Đã xử lý rồi, skip
   }
   ```

2. **State Verification**: Luôn verify state trước khi xử lý
   ```javascript
   if (order.status !== 'CREATED') {
     throw new Error('Invalid state');
   }
   ```

3. **Optimistic Locking**: Dùng version để tránh race condition
   ```javascript
   const order = await orderService.getOrder(orderId);
   const updated = await orderService.updateStatus(orderId, 'PAID', order.version);
   if (!updated) {
     throw new Error('Concurrent update detected');
   }
   ```

4. **Event Sourcing**: Có thể dùng event store thay vì query DB
   ```javascript
   // Thay vì query DB, replay events
   const order = await eventStore.replay('ORDER', orderId);
   ```

## ✅ Kết luận

**Recommendation:**
- **Production**: Dùng **kết hợp** - Event message cho ID, Database query cho verify
- **High Performance**: Ưu tiên Event message, chỉ query khi cần
- **High Consistency**: Ưu tiên Database query, đặc biệt cho critical operations
- **Event Sourcing**: Có thể dùng event store thay vì query DB trực tiếp
