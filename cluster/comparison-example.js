const cluster = require('cluster');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const http = require('http');

/**
 * SO SÁNH CLUSTER vs WORKER_THREADS
 * 
 * CLUSTER:
 * - Tạo nhiều PROCESS (mỗi process có memory riêng)
 * - Phù hợp cho: Web servers, API servers (I/O-bound)
 * - Communication: IPC (Inter-Process Communication)
 * - Overhead: Cao hơn (tạo process mới tốn nhiều tài nguyên)
 * - Isolation: Tốt (process crash không ảnh hưởng process khác)
 * 
 * WORKER_THREADS:
 * - Tạo nhiều THREAD (chia sẻ memory)
 * - Phù hợp cho: CPU-intensive tasks (tính toán, xử lý dữ liệu)
 * - Communication: Message passing (nhanh hơn IPC)
 * - Overhead: Thấp hơn (tạo thread nhẹ hơn process)
 * - Isolation: Kém hơn (có thể dùng SharedArrayBuffer)
 */

// ========== CLUSTER EXAMPLE ==========
if (process.argv[2] === 'cluster') {
  if (cluster.isMaster) {
    console.log('=== CLUSTER MODE ===');
    console.log(`Master PID: ${process.pid}`);
    
    const numWorkers = require('os').cpus().length;
    console.log(`Tạo ${numWorkers} worker processes...\n`);

    for (let i = 0; i < numWorkers; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} đã dừng`);
      cluster.fork();
    });

    // Test server
    setTimeout(() => {
      console.log('\n--- Test HTTP Server ---');
      testServer('http://localhost:3000', 10);
    }, 2000);

  } else {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        worker: process.pid,
        type: 'cluster',
        message: 'Xử lý từ worker process'
      }));
    });

    server.listen(3000, () => {
      console.log(`Worker ${process.pid} listening on port 3000`);
    });
  }
}

// ========== WORKER_THREAD EXAMPLE ==========
else if (process.argv[2] === 'worker') {
  if (isMainThread) {
    console.log('=== WORKER_THREAD MODE ===');
    console.log(`Main Thread PID: ${process.pid}\n`);

    // Test CPU-intensive task
    console.log('--- Test CPU-intensive Task ---');
    const tasks = [38, 39, 40, 41];
    const startTime = Date.now();

    tasks.forEach((n, index) => {
      const worker = new Worker(__filename, {
        workerData: { task: 'fibonacci', n: n }
      });

      worker.on('message', (result) => {
        console.log(`Fibonacci(${n}) = ${result}`);
        
        if (index === tasks.length - 1) {
          const totalTime = Date.now() - startTime;
          console.log(`\nTổng thời gian: ${totalTime}ms`);
          console.log('Main thread không bị block!');
        }
      });
    });

  } else {
    // Worker thread code
    const { task, n } = workerData;
    
    if (task === 'fibonacci') {
      function fibonacci(n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }
      
      const result = fibonacci(n);
      parentPort.postMessage(result);
    }
  }
}

// ========== HELPER FUNCTION ==========
function testServer(url, requests) {
  const http = require('http');
  let completed = 0;

  for (let i = 0; i < requests; i++) {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Request ${i + 1}:`, JSON.parse(data));
        completed++;
        if (completed === requests) {
          console.log('\n✅ Tất cả requests đã hoàn thành');
          process.exit(0);
        }
      });
    });
  }
}

// Usage instructions
if (!process.argv[2]) {
  console.log(`
CÁCH SỬ DỤNG:

1. Chạy Cluster example:
   node comparison-example.js cluster

2. Chạy Worker Thread example:
   node comparison-example.js worker

3. Xem giải thích chi tiết trong README.md
  `);
}

