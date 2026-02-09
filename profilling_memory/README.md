# Memory Profiling trong Node.js

Dự án này cung cấp các ví dụ về cách profiling memory trong Node.js để phát hiện memory leaks và tối ưu hóa hiệu suất.

## Các phương pháp Profiling

### 1. Sử dụng `process.memoryUsage()`
File: `basic-memory-usage.js`
- Theo dõi memory usage cơ bản
- Hiển thị RSS, Heap Used, Heap Total, External

### 2. Sử dụng `v8.getHeapStatistics()`
File: `heap-statistics.js`
- Thông tin chi tiết về V8 heap
- Heap size limits, used heap, available heap

### 3. Heap Snapshot
File: `heap-snapshot.js`
- Tạo heap snapshot để phân tích
- So sánh snapshots để tìm memory leaks

### 4. Memory Leak Detection
File: `memory-leak-example.js`
- Ví dụ về memory leak phổ biến
- Cách phát hiện và fix

### 5. Continuous Monitoring
File: `memory-monitor.js`
- Theo dõi memory liên tục
- Cảnh báo khi memory vượt ngưỡng

## Cài đặt

```bash
npm install
```

## Chạy các ví dụ

```bash
# 1. Basic memory usage
node basic-memory-usage.js

# 2. Heap statistics
node heap-statistics.js

# 3. Heap snapshot (tạo file .heapsnapshot)
node heap-snapshot.js

# 4. Memory leak example
node memory-leak-example.js

# 5. Memory monitor
node memory-monitor.js
```

## Phân tích Heap Snapshot

Sau khi tạo heap snapshot (.heapsnapshot files), bạn có thể phân tích chúng bằng:

1. **Chrome DevTools**:
   - Mở Chrome DevTools (F12)
   - Vào tab "Memory"
   - Click "Load" và chọn file .heapsnapshot

2. **VS Code**:
   - Cài extension "Heap Snapshot Visualizer"
   - Mở file .heapsnapshot

## Các chỉ số quan trọng

- **RSS (Resident Set Size)**: Tổng memory được cấp phát cho process
- **Heap Total**: Tổng heap memory được V8 cấp phát
- **Heap Used**: Heap memory đang được sử dụng
- **External**: Memory được sử dụng bởi C++ objects liên kết với JS objects
- **Array Buffers**: Memory cho ArrayBuffer và SharedArrayBuffer

## Tips để tránh Memory Leaks

1. Luôn clear timers và intervals
2. Remove event listeners khi không cần
3. Cẩn thận với closures giữ references
4. Sử dụng WeakMap/WeakSet cho caching
5. Giới hạn kích thước của arrays/objects lớn
