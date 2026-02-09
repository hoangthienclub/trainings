const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

/**
 * TEMPLATE: Worker Thread với Error Handling ĐẦY ĐỦ
 * 
 * Đây là template an toàn để sử dụng worker threads
 * Copy và chỉnh sửa theo nhu cầu của bạn
 */

if (isMainThread) {
  // ========== MAIN THREAD ==========
  
  function createSafeWorker(workerData, onMessage, onError) {
    const worker = new Worker(__filename, { workerData });
    
    // ✅ BẮT BUỘC 1: Error handler
    worker.on('error', (error) => {
      console.error('❌ Lỗi từ worker:', error.message);
      console.error('Stack:', error.stack);
      
      // Gọi callback nếu có
      if (onError) {
        onError(error);
      }
      
      // Main thread vẫn an toàn và tiếp tục chạy
    });
    
    // ✅ BẮT BUỘC 2: Exit handler
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`⚠️  Worker dừng với exit code: ${code}`);
      } else {
        console.log('✅ Worker hoàn thành thành công');
      }
    });
    
    // ✅ Message handler
    worker.on('message', (message) => {
      if (message.type === 'error') {
        // Lỗi được xử lý trong worker và gửi về
        console.error('❌ Lỗi từ worker (đã được xử lý):', message.error);
        if (onError) {
          onError(new Error(message.error));
        }
      } else {
        // Kết quả thành công
        if (onMessage) {
          onMessage(message);
        }
      }
    });
    
    return worker;
  }
  
  // ========== VÍ DỤ SỬ DỤNG ==========
  
  console.log('=== Ví dụ sử dụng Safe Worker ===\n');
  
  // Ví dụ 1: Worker tính toán
  const worker1 = createSafeWorker(
    { task: 'calculate', data: 40 },
    (result) => {
      console.log('✅ Kết quả:', result);
      worker1.terminate();
    },
    (error) => {
      console.log('⚠️  Xử lý lỗi:', error.message);
      worker1.terminate();
    }
  );
  
  // Ví dụ 2: Worker xử lý nhiều tasks
  const tasks = [35, 36, 37, 38];
  const workers = [];
  const results = [];
  
  tasks.forEach((n, index) => {
    const worker = createSafeWorker(
      { task: 'fibonacci', n: n },
      (result) => {
        results[index] = { n, result: result.value, success: true };
        checkAllComplete();
      },
      (error) => {
        results[index] = { n, error: error.message, success: false };
        checkAllComplete();
      }
    );
    
    workers.push(worker);
  });
  
  function checkAllComplete() {
    const completed = results.filter(r => r !== undefined).length;
    if (completed === tasks.length) {
      console.log('\n📊 Tổng kết:');
      results.forEach((r, i) => {
        if (r.success) {
          console.log(`  ✅ Task ${i}: Fibonacci(${r.n}) = ${r.result}`);
        } else {
          console.log(`  ❌ Task ${i}: Fibonacci(${r.n}) - ${r.error}`);
        }
      });
      
      // Dọn dẹp
      workers.forEach(w => w.terminate());
    }
  }
  
  // Giữ main thread chạy
  console.log('💓 Main thread đang chạy...');
  
} else {
  // ========== WORKER THREAD ==========
  
  const { task, data, n } = workerData;
  
  try {
    if (task === 'calculate') {
      // Ví dụ tính toán
      function heavyCalculation(n) {
        let result = 0;
        for (let i = 0; i < n * 1000000; i++) {
          result += i;
        }
        return result;
      }
      
      const result = heavyCalculation(data);
      parentPort.postMessage({ 
        type: 'success', 
        value: result 
      });
      
    } else if (task === 'fibonacci') {
      // Tính Fibonacci với error handling
      function fibonacci(n) {
        if (n < 0) {
          throw new Error(`Số ${n} không hợp lệ (phải >= 0)`);
        }
        if (n > 50) {
          throw new Error(`Số ${n} quá lớn (max 50)`);
        }
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }
      
      try {
        const result = fibonacci(n);
        parentPort.postMessage({ 
          type: 'success', 
          value: result 
        });
      } catch (error) {
        // ✅ BẮT BUỘC: Catch lỗi và gửi về main thread
        parentPort.postMessage({ 
          type: 'error', 
          error: error.message 
        });
      }
      
    } else {
      throw new Error(`Task không hợp lệ: ${task}`);
    }
    
  } catch (error) {
    // ✅ BẮT BUỘC: Catch mọi lỗi và gửi về main thread
    // KHÔNG BAO GIỜ throw error trong worker!
    parentPort.postMessage({ 
      type: 'error', 
      error: error.message 
    });
  }
}

