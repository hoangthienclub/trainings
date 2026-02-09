# Cluster và Worker Threads trong Node.js

## 📚 Tổng quan

Node.js là single-threaded, nhưng cung cấp 2 cách để tận dụng đa CPU cores:
1. **Cluster Module** - Multi-processing
2. **Worker Threads Module** - Multi-threading

---

## 🔄 CLUSTER MODULE

### Khái niệm
- Tạo nhiều **process con** (worker processes) từ một master process
- Mỗi worker là một process độc lập với memory riêng
- Master process quản lý và phân phối tải cho các workers

### Khi nào dùng?
✅ **Phù hợp cho:**
- Web servers, API servers (I/O-bound applications)
- Ứng dụng cần xử lý nhiều requests đồng thời
- Cần isolation tốt (process crash không ảnh hưởng process khác)

❌ **Không phù hợp cho:**
- CPU-intensive tasks (tốn nhiều tài nguyên tạo process)
- Tasks cần chia sẻ memory lớn

### Ưu điểm
- Isolation tốt (mỗi process độc lập)
- Tận dụng tối đa CPU cores
- Tự động restart worker nếu crash
- Phù hợp cho production web servers

### Nhược điểm
- Overhead cao (tạo process tốn nhiều memory)
- Communication chậm hơn (IPC)
- Không thể chia sẻ memory trực tiếp

### Ví dụ sử dụng
```bash
node cluster-example.js
```

---

## 🧵 WORKER THREADS MODULE

### Khái niệm
- Tạo nhiều **thread** trong cùng một process
- Các threads chia sẻ memory (có thể dùng SharedArrayBuffer)
- Main thread không bị block khi worker thread chạy

### Khi nào dùng?
✅ **Phù hợp cho:**
- CPU-intensive tasks (tính toán phức tạp, xử lý dữ liệu lớn)
- Image processing, video encoding
- Machine learning, data analysis
- Tasks cần chia sẻ memory

❌ **Không phù hợp cho:**
- I/O operations (Node.js event loop đã xử lý tốt)
- Web servers (dùng cluster thay vì)

### Ưu điểm
- Overhead thấp (tạo thread nhẹ hơn process)
- Communication nhanh (message passing)
- Có thể chia sẻ memory (SharedArrayBuffer)
- Main thread không bị block

### Nhược điểm
- Isolation kém hơn (cùng process)
- Phức tạp hơn khi làm việc với shared memory
- Không phù hợp cho I/O-bound tasks
- ⚠️ **QUAN TRỌNG**: Nếu worker crash mà không xử lý lỗi, có thể làm main thread crash

### Ví dụ sử dụng
```bash
node worker-thread-example.js
```

---

## 📊 SO SÁNH

| Tiêu chí | Cluster | Worker Threads |
|----------|---------|----------------|
| **Loại** | Multi-process | Multi-thread |
| **Memory** | Riêng biệt | Chia sẻ |
| **Overhead** | Cao | Thấp |
| **Communication** | IPC (chậm) | Message passing (nhanh) |
| **Isolation** | Tốt | Kém hơn |
| **Phù hợp** | I/O-bound | CPU-intensive |
| **Use case** | Web servers | Tính toán phức tạp |

---

## 🎯 KẾT LUẬN

### Dùng CLUSTER khi:
- Xây dựng web server, API server
- Cần xử lý nhiều HTTP requests
- Cần isolation tốt giữa các workers
- Ứng dụng I/O-bound

### Dùng WORKER THREADS khi:
- Có CPU-intensive tasks
- Cần tính toán phức tạp
- Cần xử lý dữ liệu lớn
- Main thread không được block

### Có thể kết hợp:
- Dùng **Cluster** để tạo nhiều process
- Trong mỗi process, dùng **Worker Threads** để xử lý CPU-intensive tasks

---

## 🚀 CHẠY VÍ DỤ

```bash
# Cluster example
node cluster-example.js

# Worker Thread example
node worker-thread-example.js

# Xử lý lỗi trong Worker Threads (QUAN TRỌNG!)
node worker-error-handling.js
node worker-crash-demo.js

# So sánh
node comparison-example.js cluster
node comparison-example.js worker
```

---

## ⚠️ XỬ LÝ LỖI TRONG WORKER THREADS

### Vấn đề
Nếu worker thread throw error mà **không được xử lý đúng cách**, có thể làm **main thread crash**!

### Giải pháp (BẮT BUỘC)

```javascript
const worker = new Worker(__filename, { workerData: {...} });

// ✅ BẮT BUỘC 1: Luôn có error handler
worker.on('error', (error) => {
  console.error('Lỗi từ worker:', error.message);
  // Main thread vẫn an toàn
});

// ✅ BẮT BUỘC 2: Luôn có exit handler
worker.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Worker dừng với exit code: ${code}`);
  }
});

// ✅ BẮT BUỘC 3: Trong worker, catch lỗi và gửi về main thread
// ❌ SAI: throw new Error('Lỗi');
// ✅ ĐÚNG: 
try {
  // code có thể lỗi
} catch (error) {
  parentPort.postMessage({ type: 'error', error: error.message });
}
```

### Ví dụ xử lý lỗi
```bash
# Demo vấn đề và giải pháp
node worker-error-handling.js

# Demo worker crash
node worker-crash-demo.js
```

---

## 📝 LƯU Ý

1. **Cluster**: Mỗi worker có port riêng hoặc dùng round-robin để phân phối requests
2. **Worker Threads**: 
   - ⚠️ **QUAN TRỌNG**: Luôn xử lý lỗi để tránh main thread crash
   - Không thể dùng một số Node.js APIs (như `fs` một số trường hợp)
3. **Performance**: Đo lường và test để chọn giải pháp phù hợp
4. **Memory**: Worker threads có thể dùng SharedArrayBuffer nhưng cần cẩn thận với race conditions

---

## 🔗 TÀI LIỆU THAM KHẢO

- [Node.js Cluster Documentation](https://nodejs.org/api/cluster.html)
- [Node.js Worker Threads Documentation](https://nodejs.org/api/worker_threads.html)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)

