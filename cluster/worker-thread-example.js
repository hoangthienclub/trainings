const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const path = require('path');

/**
 * WORKER_THREAD MODULE - Multi-threading
 * 
 * Worker Threads cho phép chạy JavaScript code trong thread riêng biệt:
 * - Chia sẻ memory với main thread (có thể dùng SharedArrayBuffer)
 * - Phù hợp cho CPU-intensive tasks (tính toán phức tạp, xử lý dữ liệu lớn)
 * - Nhanh hơn cluster vì không cần serialize/deserialize data
 * 
 * Lưu ý: Worker threads KHÔNG phù hợp cho I/O operations (file, network)
 * vì Node.js đã có event loop xử lý I/O hiệu quả
 */

if (isMainThread) {
  // Main thread
  console.log('Main thread đang chạy (PID:', process.pid, ')');

  // Ví dụ 1: Tính toán số Fibonacci lớn (CPU-intensive)
  function calculateFibonacci(n) {
    if (n <= 1) return n;
    return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
  }

  // Chạy trên main thread (sẽ block event loop)
  console.log('\n=== Ví dụ 1: Tính Fibonacci trên Main Thread ===');
  const start1 = Date.now();
  const result1 = calculateFibonacci(40);
  const time1 = Date.now() - start1;
  console.log(`Kết quả: ${result1}, Thời gian: ${time1}ms`);
  console.log('⚠️  Main thread bị block trong thời gian này!');

  // Chạy trên worker thread (không block main thread)
  console.log('\n=== Ví dụ 2: Tính Fibonacci trên Worker Thread ===');
  const start2 = Date.now();

  const worker = new Worker(__filename, {
    workerData: { 
      task: 'fibonacci',
      n: 40 
    }
  });

  worker.on('message', (result) => {
    const time2 = Date.now() - start2;
    console.log(`Kết quả ví dụ 2: ${result}, Thời gian: ${time2}ms`);
    console.log('✅ Main thread không bị block!');
  });

  worker.on('error', (error) => {
    console.error('Lỗi worker:', error);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker dừng với exit code ${code}`);
    }
  });

  // Ví dụ 3: Xử lý nhiều tasks song song
  console.log('\n=== Ví dụ 3: Xử lý nhiều tasks song song ===');
  const tasks = [35, 36, 37, 38, 39];
  const workers = [];
  const results = [];

  tasks.forEach((n, index) => {
    const w = new Worker(__filename, {
      workerData: { 
        task: 'fibonacci',
        n: n 
      }
    });

    // ✅ QUAN TRỌNG: Luôn xử lý lỗi để main thread không bị crash
    w.on('error', (error) => {
      console.error(`❌ Worker ${index} (n=${n}) lỗi:`, error.message);
      results[index] = { n, error: error.message, success: false };
      checkCompletion();
    });

    w.on('exit', (code) => {
      if (code !== 0 && !results[index]) {
        console.error(`❌ Worker ${index} (n=${n}) dừng với exit code: ${code}`);
        results[index] = { n, error: 'Worker crashed', success: false };
        checkCompletion();
      }
    });

    w.on('message', (result) => {
      results[index] = { n, result, success: true };
      console.log(`Fibonacci(${n}) = ${result}`);
      checkCompletion();
    });

    workers.push(w);
  });

  function checkCompletion() {
    const completed = results.filter(r => r !== undefined).length;
    if (completed === tasks.length) {
      console.log('\n✅ Tất cả tasks đã hoàn thành!');
      // Dọn dẹp workers
      workers.forEach(w => w.terminate());
    }
  }

  // Ví dụ 4: Xử lý dữ liệu lớn
  console.log('\n=== Ví dụ 4: Xử lý dữ liệu lớn ===');
  const largeData = Array.from({ length: 1000000 }, (_, i) => i);
  
  const dataWorker = new Worker(__filename, {
    workerData: { 
      task: 'processArray',
      data: largeData 
    }
  });

  // ✅ QUAN TRỌNG: Xử lý lỗi cho worker xử lý dữ liệu
  dataWorker.on('error', (error) => {
    console.error('❌ Lỗi khi xử lý dữ liệu:', error.message);
  });

  dataWorker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Worker xử lý dữ liệu dừng với exit code: ${code}`);
    }
  });

  dataWorker.on('message', (result) => {
    console.log(`Đã xử lý ${result.processed} phần tử`);
    console.log(`Tổng: ${result.sum}`);
    console.log(`Trung bình: ${result.average.toFixed(2)}`);
  });

} else {
  // Worker thread
  const { task, n, data } = workerData;

  if (task === 'fibonacci') {
    // Tính Fibonacci (CPU-intensive)
    function fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }

    const result = fibonacci(n);
    parentPort.postMessage(result);

  } else if (task === 'processArray') {
    // Xử lý mảng lớn (CPU-intensive)
    const start = Date.now();
    let sum = 0;
    
    for (let i = 0; i < data.length; i++) {
      sum += data[i] * 2; // Giả lập tính toán phức tạp
    }
    
    const average = sum / data.length;
    const processingTime = Date.now() - start;

    parentPort.postMessage({
      processed: data.length,
      sum: sum,
      average: average,
      processingTime: `${processingTime}ms`
    });
  }
}

