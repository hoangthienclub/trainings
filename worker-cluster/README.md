# Worker Threads vs Cluster trong Node.js

Tài liệu so sánh **Worker Threads** và **Cluster** trong Node.js: ví dụ, điểm giống, điểm khác và cách dùng.

---

## 1. Worker Threads

### Là gì?

**Worker Threads** (`worker_threads`) cho phép chạy JavaScript song song **trong cùng một process**, mỗi worker có **V8 engine và event loop riêng** nhưng **dùng chung memory** (có thể chia sẻ qua `SharedArrayBuffer`).

### Khi nào dùng?

- **CPU-intensive**: tính toán nặng, xử lý ảnh, mã hóa, parsing lớn.
- Cần tận dụng **nhiều lõi CPU** mà **không block** event loop của thread chính.
- Cần chia sẻ memory hiệu quả (ví dụ buffer lớn) giữa các luồng.

### Ví dụ: Worker Threads

**File: `main-worker.js` (main thread)**

```javascript
const { Worker } = require('worker_threads');
const path = require('path');

function chayWorker(so) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'worker-calc.js'), {
      workerData: { so }
    });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}

async function main() {
  console.log('Main thread bắt đầu...');
  const [kq1, kq2] = await Promise.all([
    chayWorker(10),
    chayWorker(20)
  ]);
  console.log('Kết quả:', kq1, kq2); // Kết quả: 100 400
  console.log('Main thread xong.');
}

main();
```

**File: `worker-calc.js` (worker thread)**

```javascript
const { parentPort, workerData } = require('worker_threads');

// CPU-intensive: tính bình phương
const so = workerData.so;
const ketQua = so * so;

parentPort.postMessage(ketQua);
```

Chạy: `node main-worker.js`

---

## 2. Cluster

### Là gì?

**Cluster** (`cluster`) tạo **nhiều process** (nhiều instance Node.js). Một **master process** điều phối, các **worker process** xử lý tải (thường dùng cho HTTP server). Mỗi process có **memory riêng**, không chia sẻ heap.

### Khi nào dùng?

- **I/O-intensive**, đặc biệt **HTTP server**: cân bằng tải, tận dụng nhiều lõi CPU.
- Mỗi request có thể chạy trên một process khác nhau.
- Cần **cô lập** giữa các worker (crash một process không làm sập cả cụm).

### Ví dụ: Cluster

**File: `main-cluster.js`**

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} đang chạy. Số CPU: ${numCPUs}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} thoát (${code || signal}). Có thể fork lại.`);
  });
} else {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Phản hồi từ worker PID: ${process.pid}\n`);
  });

  server.listen(3000, () => {
    console.log(`Worker ${process.pid} lắng nghe http://localhost:3000`);
  });
}
```

Chạy: `node main-cluster.js` → mở nhiều tab `http://localhost:3000` để thấy request được chia cho các worker khác nhau (PID khác nhau).

---

## 3. So sánh: Giống nhau

| Tiêu chí | Worker Threads | Cluster |
|----------|----------------|---------|
| Mục đích | Chạy code song song, tận dụng CPU | Chạy nhiều process, cân bằng tải (thường cho server) |
| Đơn vị thực thi | Thread trong 1 process | Nhiều process (nhiều instance Node) |
| Giao tiếp | `postMessage` / `parentPort` | IPC (internal), qua master |
| Dùng nhiều lõi CPU | Có | Có |

**Điểm chung:**

- Đều dùng để **tận dụng đa lõi CPU**.
- Đều có cơ chế **giao tiếp** (message passing / IPC).
- Đều thuộc **built-in module** của Node.js (không cần cài thêm).

---

## 4. So sánh: Khác nhau

| Tiêu chí | Worker Threads | Cluster |
|----------|----------------|---------|
| Đơn vị | **Thread** (trong 1 process) | **Process** (nhiều process) |
| Memory | Chung process, có thể dùng `SharedArrayBuffer` | Mỗi process có heap riêng |
| Khởi tạo | Nhẹ hơn (chỉ thêm thread) | Nặng hơn (fork process) |
| Phù hợp | **CPU-bound** (tính toán, xử lý ảnh, crypto) | **I/O-bound**, đặc biệt **HTTP/TCP server** |
| Chia sẻ dữ liệu | Dễ hơn trong cùng process (shared memory) | Phải serialize qua IPC |
| Cô lập lỗi | Một thread lỗi có thể ảnh hưởng process | Một worker crash không làm sập toàn bộ |

---

## 5. Khi nào dùng cái gì?

- **Worker Threads**:  
  - Ứng dụng cần **tính toán nặng** (hash, compress, xử lý ảnh, AI/ML nhẹ).  
  - Muốn **ít process**, nhiều **thread** trong một process.

- **Cluster**:  
  - **Web server / API** cần scale ngang theo số lõi CPU.  
  - Muốn **cân bằng tải** và **cô lập** giữa các worker (một worker chết có thể restart).

- **Kết hợp**: Có thể dùng **Cluster** để chạy nhiều process server, mỗi process lại dùng **Worker Threads** cho các task CPU-intensive (ví dụ validate, hash password).

---

## 6. Tóm tắt nhanh

| | Worker Threads | Cluster |
|-|----------------|--------|
| Module | `worker_threads` | `cluster` |
| Đơn vị | Thread | Process |
| Use case | CPU-intensive trong 1 app | Multi-process server (I/O, HTTP) |
| Memory | Chia sẻ được (SharedArrayBuffer) | Tách biệt từng process |

Chạy thử:

```bash
node main-worker.js   # Ví dụ Worker Threads
node main-cluster.js  # Ví dụ Cluster (sau đó truy cập http://localhost:3000)
```

---

## 7. Mối quan hệ: Core CPU → Thread CPU → Event Loop → Worker Thread & Cluster

### Tầng phần cứng & OS

```
┌─────────────────────────────────────────────────────────────────┐
│  CPU (chip)                                                     │
│  ├── Core 1  ──► 1 hoặc 2 thread phần cứng (logical CPU)        │
│  ├── Core 2  ──► 1 hoặc 2 thread phần cứng                      │
│  └── Core N  ──► ...                                            │
└─────────────────────────────────────────────────────────────────┘
         │
         │ OS gán các process/thread (phần mềm) lên các logical CPU này
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Logical CPU (os.cpus().length) = số "chỗ" để chạy code song song │
└─────────────────────────────────────────────────────────────────┘
```

- **Core CPU**: lõi vật lý, thực thi lệnh.
- **Thread CPU (phần cứng)**: luồng logic mà OS nhìn thấy. 1 core có thể có 1 thread (tắt Hyper-Threading) hoặc 2 thread (bật HT/SMT). Đây là **logical CPU**.
- **Node.js dùng** `require('os').cpus().length` = số **logical CPU** (số thread phần cứng), không phải số core vật lý.

### Tầng Node.js: Process → Thread → Event Loop

| Khái niệm | Ý nghĩa |
|-----------|--------|
| **1 process Node.js** | 1 instance chương trình, có PID riêng. |
| **Main thread** | Trong 1 process chỉ có **1 thread chính** chạy mã của bạn. |
| **Event loop** | Chạy trên **main thread** đó: lặp lấy callback từ queue (I/O, timer, setImmediate...) và thực thi. **1 main thread = 1 event loop.** |
| **Worker thread** | Thread **phụ** do bạn tạo trong **cùng process**; mỗi worker có **event loop riêng** và V8 riêng. Là **thread phần mềm** do OS đưa lên logical CPU. |
| **Cluster worker** | Là **process con** (fork từ primary). Mỗi process có **1 main thread + 1 event loop**. N process = N event loop độc lập. |

### Sơ đồ quan hệ

```
                    Logical CPU (thread phần cứng)
                    ┌────┬────┬────┬────┐
                    │ 0  │ 1  │ 2  │ 3  │   ← os.cpus().length = 4
                    └─┬──┴──┬─┴──┬─┴──┬─┘
                      │     │    │    │
    ┌─────────────────┼─────┼────┼────┼─────────────────────────────┐
    │ CLUSTER         │     │    │    │                              │
    │  Process A      ▼     │    │    │   Process B    Process C ... │
    │  ┌─────────────────┐  │    │    │   (mỗi process = 1 main      │
    │  │ Main thread     │  │    │    │    thread + 1 event loop)    │
    │  │ = 1 Event loop  │  │    │    │                              │
    │  └────────┬────────┘  │    │    │                              │
    │           │           │    │    │                              │
    │  ┌────────▼────────┐  │    │    │                              │
    │  │ Worker thread 1 │──┘    │    │   (worker thread cũng được   │
    │  │ (event loop 2)  │       │    │    OS schedule lên logical CPU)│
    │  └─────────────────┘       │    │                              │
    │  ┌─────────────────┐       │    │                              │
    │  │ Worker thread 2 │───────┴────┘                              │
    │  │ (event loop 3)  │                                            │
    │  └─────────────────┘                                            │
    └───────────────────────────────────────────────────────────────┘
```

### Tóm tắt mối quan hệ

| Cấp độ | Thành phần | Số lượng (ví dụ) | Ghi chú |
|--------|------------|------------------|--------|
| Phần cứng | Core CPU | 4 | Lõi vật lý |
| Phần cứng | Thread CPU (logical) | 4 hoặc 8 | `os.cpus().length`; 1 core có thể = 2 thread nếu bật HT |
| Node (1 process) | Main thread + Event loop | 1 | Thread chính chạy `main-worker.js` / `main-cluster.js` |
| Node (worker_threads) | Worker thread + Event loop | N (bạn tạo) | Mỗi worker = 1 thread + 1 event loop trong **cùng process** |
| Node (cluster) | Worker process | N (thường = số logical CPU) | Mỗi process = 1 main thread + 1 event loop; **khác process** |

- **Core / thread CPU**: là “sức chạy” phần cứng; OS phân công mọi process và thread lên đó.
- **Event loop**: gắn với **một thread** (main hoặc worker). Không có “event loop chung” cho cả process.
- **Worker thread**: thêm **thread + event loop** trong cùng process; giúp không block main thread khi làm CPU-intensive.
- **Cluster**: thêm **process** (mỗi process có 1 main thread + 1 event loop); thường dùng để scale server theo số logical CPU.

---

## 8. Có thể tạo được bao nhiêu thread phụ (worker thread)?

**Node.js không đặt giới hạn cứng** — API cho phép bạn tạo bao nhiêu worker thread cũng được. Giới hạn thực tế nằm ở tài nguyên và hiệu năng.

| Yếu tố | Ảnh hưởng |
|--------|-----------|
| **RAM** | Mỗi worker có V8 isolate và heap riêng (vài MB ~ vài chục MB mỗi worker). Tạo quá nhiều → dễ hết memory. |
| **Số logical CPU** | Tạo nhiều worker hơn `os.cpus().length` vẫn chạy được, nhưng với task **CPU-bound** thường không nhanh hơn mà còn tốn context switch. Nên thường **≤ số logical CPU** cho CPU-intensive. |
| **OS** | Hệ điều hành giới hạn số thread trong 1 process (Linux: phụ thuộc stack size, ulimit; thường từ vài nghìn trở lên). |
| **I/O-bound** | Nếu worker chủ yếu chờ I/O thì có thể tạo nhiều hơn số CPU (ví dụ 2x, 4x) vì lúc chờ I/O thread không chiếm CPU. |

### Gợi ý thực tế

- **CPU-intensive**: dùng **pool** với số worker ≈ `os.cpus().length` (hoặc ít hơn nếu cần dành CPU cho việc khác).
- **I/O-heavy**: có thể dùng nhiều worker hơn (ví dụ 2× số CPU), nhưng vẫn theo dõi RAM.
- **Không nên** tạo hàng trăm worker cố định nếu mỗi worker tốn nhiều memory; ưu tiên **worker pool** + queue task.

```javascript
const os = require('os');
const soLogicalCPU = os.cpus().length;

// Ví dụ: pool CPU-bound với số worker = số logical CPU
const soWorker = soLogicalCPU; // hoặc Math.max(1, soLogicalCPU - 1) để chừa main thread
```
