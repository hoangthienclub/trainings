# Distributed Tracing với Node.js Microservices

Ví dụ hoàn chỉnh về **Distributed Tracing** sử dụng **OpenTelemetry** và **Jaeger** để theo dõi requests qua nhiều microservices trong Node.js.

## 📋 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Kiến Trúc](#kiến-trúc)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cài Đặt](#cài-đặt)
- [Chạy Ứng Dụng](#chạy-ứng-dụng)
- [Test API](#test-api)
- [Xem Traces trong Jaeger](#xem-traces-trong-jaeger)
- [Giải Thích Concepts](#giải-thích-concepts)
- [Troubleshooting](#troubleshooting)

## 🎯 Giới Thiệu

**Distributed Tracing** là kỹ thuật theo dõi một request khi nó đi qua nhiều services khác nhau trong kiến trúc microservices. Nó giúp:

- 🔍 **Debug** các vấn đề phức tạp xảy ra giữa nhiều services
- ⚡ **Tối ưu performance** bằng cách xác định bottlenecks
- 📊 **Hiểu rõ flow** của requests trong hệ thống
- 🐛 **Phát hiện lỗi** và xác định service gây ra lỗi

## 🏗️ Kiến Trúc

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     ▼
┌─────────────────┐
│  API Gateway    │ :3000
│  (Entry Point)  │
└────┬────────────┘
     │
     ├──────────────┐
     │              │
     ▼              ▼
┌──────────┐  ┌──────────┐
│  User    │  │  Order   │
│ Service  │  │ Service  │
│  :3001   │  │  :3002   │
└──────────┘  └──────────┘
     │              │
     └──────┬───────┘
            │
            ▼
      ┌──────────┐
      │  Jaeger  │
      │  :16686  │
      └──────────┘
```

### Services:

1. **API Gateway** (Port 3000)
   - Điểm vào chính của hệ thống
   - Nhận requests từ client
   - Gọi User Service và Order Service

2. **User Service** (Port 3001)
   - Quản lý thông tin người dùng
   - Simulate database queries

3. **Order Service** (Port 3002)
   - Quản lý đơn hàng
   - Tính toán tổng giá trị đơn hàng

4. **Jaeger** (Port 16686)
   - UI để visualize traces
   - Collector nhận traces từ các services

## 🛠️ Công Nghệ Sử Dụng

- **Node.js** - Runtime
- **Express** - Web framework
- **OpenTelemetry** - Tracing framework (vendor-neutral)
- **Jaeger** - Tracing backend và UI
- **Docker** - Container cho Jaeger

## 📦 Cài Đặt

### 1. Clone hoặc tạo project

```bash
cd /Users/thientran/SynologyDrive/Me/SelfStudy/Node/distributed_tracing
```

### 2. Cài đặt dependencies cho tất cả services

```bash
# API Gateway
cd api-gateway
npm install

# User Service
cd ../user-service
npm install

# Order Service
cd ../order-service
npm install

cd ..
```

### 3. Start Jaeger bằng Docker

```bash
docker-compose up -d
```

Kiểm tra Jaeger đã chạy:
```bash
docker ps
```

## 🚀 Chạy Ứng Dụng

Mở **3 terminal windows** riêng biệt:

### Terminal 1 - User Service
```bash
cd user-service
npm start
```

### Terminal 2 - Order Service
```bash
cd order-service
npm start
```

### Terminal 3 - API Gateway
```bash
cd api-gateway
npm start
```

Bạn sẽ thấy output:
```
🔍 Tracing initialized for [service-name]
🚀 [Service] running on port [PORT]
```

## 🧪 Test API

### 1. Lấy thông tin user

```bash
curl http://localhost:3000/api/users/1
```

**Response:**
```json
{
  "id": "1",
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "age": 25
}
```

**Trace flow:** API Gateway → User Service

---

### 2. Lấy thông tin user và orders

```bash
curl http://localhost:3000/api/orders/1
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "age": 25
  },
  "orders": {
    "userId": "1",
    "orders": [
      {
        "id": "ORD-001",
        "userId": "1",
        "product": "Laptop Dell XPS 13",
        "amount": 25000000,
        "status": "delivered"
      },
      {
        "id": "ORD-002",
        "userId": "1",
        "product": "Mouse Logitech MX Master",
        "amount": 2000000,
        "status": "shipped"
      }
    ],
    "totalOrders": 2,
    "totalAmount": 27000000
  }
}
```

**Trace flow:** API Gateway → User Service (parallel) → Order Service

---

### 3. Test với user khác

```bash
# User 2
curl http://localhost:3000/api/orders/2

# User 3
curl http://localhost:3000/api/orders/3
```

## 📊 Xem Traces trong Jaeger

### 1. Mở Jaeger UI

Truy cập: **http://localhost:16686**

### 2. Tìm Traces

1. Chọn **Service**: `api-gateway`
2. Click **Find Traces**
3. Bạn sẽ thấy danh sách các traces

### 3. Xem Chi Tiết Trace

Click vào một trace để xem:

- **Timeline**: Thời gian mỗi operation
- **Spans**: Các operations trong trace
- **Service calls**: Flow giữa các services
- **Attributes**: Metadata của mỗi span
- **Events**: Các events được log
- **Errors**: Nếu có lỗi xảy ra

### 4. Phân Tích Performance

Trong trace detail, bạn có thể thấy:

```
api-gateway: get-user-orders (200ms)
  ├─ HTTP GET (150ms)
  │   ├─ user-service: handle-get-user (80ms)
  │   │   └─ db.query.get_user (60ms)
  │   └─ order-service: handle-get-orders (120ms)
  │       ├─ db.query.get_orders (90ms)
  │       └─ calculate-total-amount (20ms)
```

## 📚 Giải Thích Concepts

### 1. Trace

- **Trace** là toàn bộ journey của một request qua hệ thống
- Mỗi trace có một **Trace ID** duy nhất
- Trace bao gồm nhiều **spans**

### 2. Span

- **Span** đại diện cho một operation/unit of work
- Mỗi span có:
  - **Span ID** duy nhất
  - **Parent Span ID** (nếu là child span)
  - **Start time** và **duration**
  - **Attributes** (metadata)
  - **Events** (log points)
  - **Status** (OK, ERROR)

### 3. Context Propagation

- **Context** được truyền qua HTTP headers
- OpenTelemetry tự động inject và extract context
- Đảm bảo các spans được link với nhau đúng

### 4. Instrumentation

#### Auto-instrumentation
```javascript
getNodeAutoInstrumentations()
```
Tự động instrument:
- HTTP requests
- Express routes
- Database queries (nếu có driver support)

#### Manual instrumentation
```javascript
const span = tracer.startSpan('operation-name');
span.setAttribute('key', 'value');
span.addEvent('event-name');
span.end();
```

### 5. Attributes

Metadata gắn vào span:
```javascript
span.setAttribute('user.id', userId);
span.setAttribute('http.method', 'GET');
span.setAttribute('db.system', 'postgresql');
```

### 6. Events

Log points trong span:
```javascript
span.addEvent('Calling User Service');
span.addEvent('User Service responded', {
  'response.status': 200,
});
```

### 7. Status

Trạng thái của span:
```javascript
// Success
span.setStatus({ code: SpanStatusCode.OK });

// Error
span.setStatus({
  code: SpanStatusCode.ERROR,
  message: error.message,
});
```

## 🔧 Troubleshooting

### Không thấy traces trong Jaeger

1. **Kiểm tra Jaeger đang chạy:**
   ```bash
   docker ps | grep jaeger
   ```

2. **Kiểm tra services đã init tracing:**
   - Xem console log có `🔍 Tracing initialized` không

3. **Kiểm tra Jaeger endpoint:**
   - Default: `http://localhost:14268/api/traces`
   - Đảm bảo port 14268 không bị block

### Services không kết nối được với nhau

1. **Kiểm tra ports:**
   ```bash
   lsof -i :3000
   lsof -i :3001
   lsof -i :3002
   ```

2. **Kiểm tra service URLs trong API Gateway:**
   ```javascript
   const USER_SERVICE_URL = 'http://localhost:3001';
   const ORDER_SERVICE_URL = 'http://localhost:3002';
   ```

### Traces bị disconnect

- **Nguyên nhân**: Context không được propagate đúng
- **Giải pháp**: Đảm bảo tracing được init **TRƯỚC** khi import Express:
  ```javascript
  // ✅ ĐÚNG
  const { initTracing } = require('../shared/tracing');
  initTracing('service-name');
  const express = require('express');

  // ❌ SAI
  const express = require('express');
  const { initTracing } = require('../shared/tracing');
  ```

## 🎓 Học Thêm

### OpenTelemetry Concepts
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Tracing Specification](https://opentelemetry.io/docs/specs/otel/trace/)

### Best Practices
- Đặt tên spans rõ ràng và consistent
- Thêm attributes hữu ích cho debugging
- Log events quan trọng
- Handle errors properly
- Không tạo quá nhiều spans (performance overhead)

## 📝 Notes

- Ví dụ này sử dụng **mock data** để đơn giản hóa
- Trong production, bạn sẽ kết nối với database thật
- Có thể thêm sampling để giảm overhead
- Có thể export traces sang nhiều backends khác (Zipkin, Prometheus, etc.)

## 🤝 Contributing

Feel free to improve this example!

## 📄 License

MIT
