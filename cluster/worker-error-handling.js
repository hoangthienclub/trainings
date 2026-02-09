const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

/**
 * XỬ LÝ LỖI TRONG WORKER THREADS
 * 
 * VẤN ĐỀ: Nếu không xử lý lỗi đúng cách, worker thread crash có thể làm main thread crash
 * 
 * GIẢI PHÁP:
 * 1. Luôn lắng nghe event 'error' trên worker
 * 2. Luôn lắng nghe event 'exit' để biết worker đã dừng
 * 3. Dùng try-catch trong worker thread
 * 4. Gửi lỗi về main thread thay vì throw
 */

if (isMainThread) {
  console.log('=== VÍ DỤ 1: Worker crash KHÔNG được xử lý (NGUY HIỂM) ===\n');
  
  // ❌ SAI: Không xử lý lỗi - main thread có thể crash
  const badWorker = new Worker(__filename, {
    workerData: { scenario: 'unhandled-error' }
  });
  
  // Thiếu error handler - nguy hiểm!
  // badWorker.on('error', ...) // ← Thiếu dòng này!
  
  setTimeout(() => {
    console.log('\n=== VÍ DỤ 2: Worker crash ĐƯỢC xử lý đúng cách ===\n');
    
    // ✅ ĐÚNG: Xử lý lỗi đầy đủ
    const goodWorker = new Worker(__filename, {
      workerData: { scenario: 'handled-error' }
    });
    
    // Bắt buộc: Lắng nghe lỗi
    goodWorker.on('error', (error) => {
      console.log('⚠️  Bắt được lỗi từ worker:', error.message);
      console.log('✅ Main thread vẫn chạy bình thường!');
    });
    
    // Bắt buộc: Lắng nghe khi worker exit
    goodWorker.on('exit', (code) => {
      if (code !== 0) {
        console.log(`⚠️  Worker dừng với exit code: ${code}`);
        console.log('✅ Main thread vẫn an toàn!');
      } else {
        console.log('✅ Worker hoàn thành thành công');
      }
    });
    
    // Lắng nghe message từ worker
    goodWorker.on('message', (msg) => {
      if (msg.type === 'error') {
        console.log('📨 Nhận lỗi qua message:', msg.error);
      } else {
        console.log('📨 Nhận message:', msg);
      }
    });
    
    // Test với nhiều workers
    setTimeout(() => {
      console.log('\n=== VÍ DỤ 3: Xử lý nhiều workers với error handling ===\n');
      handleMultipleWorkers();
    }, 2000);
    
  }, 2000);
  
  // Giữ main thread chạy
  setInterval(() => {
    console.log('💓 Main thread vẫn đang chạy...');
  }, 5000);
  
} else {
  // Worker thread code
  const { scenario } = workerData;
  
  if (scenario === 'unhandled-error') {
    // ❌ SAI: Throw error mà không xử lý
    console.log('Worker: Sắp throw error (không được xử lý)...');
    setTimeout(() => {
      throw new Error('Lỗi không được xử lý - có thể làm crash main thread!');
    }, 1000);
    
  } else if (scenario === 'handled-error') {
    // ✅ ĐÚNG: Xử lý lỗi và gửi về main thread
    console.log('Worker: Bắt đầu xử lý...');
    
    try {
      // Giả lập công việc có thể lỗi
      setTimeout(() => {
        try {
          // Giả lập lỗi
          if (Math.random() > 0.5) {
            throw new Error('Lỗi trong quá trình xử lý dữ liệu');
          }
          
          // Nếu thành công
          parentPort.postMessage({ 
            type: 'success', 
            message: 'Xử lý thành công!' 
          });
          
        } catch (error) {
          // ✅ Bắt lỗi và gửi về main thread
          parentPort.postMessage({ 
            type: 'error', 
            error: error.message 
          });
        }
      }, 1000);
      
    } catch (error) {
      // ✅ Xử lý lỗi đồng bộ
      parentPort.postMessage({ 
        type: 'error', 
        error: error.message 
      });
    }
    
  } else if (scenario === 'fibonacci') {
    // Worker tính toán
    const { n } = workerData;
    
    try {
      if (n < 0 || n > 50) {
        throw new Error(`Số ${n} không hợp lệ (phải từ 0-50)`);
      }
      
      function fibonacci(n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }
      
      const result = fibonacci(n);
      parentPort.postMessage({ 
        type: 'result', 
        n: n, 
        result: result 
      });
      
    } catch (error) {
      // Gửi lỗi về main thread
      parentPort.postMessage({ 
        type: 'error', 
        error: error.message 
      });
    }
  }
}

// Hàm xử lý nhiều workers với error handling
function handleMultipleWorkers() {
  const tasks = [35, 36, -5, 37, 100]; // Có số không hợp lệ
  const workers = [];
  const results = [];
  
  tasks.forEach((n, index) => {
    const worker = new Worker(__filename, {
      workerData: { 
        scenario: 'fibonacci',
        n: n 
      }
    });
    
    // ✅ Bắt buộc: Error handler
    worker.on('error', (error) => {
      console.log(`❌ Worker ${index} (n=${n}) lỗi:`, error.message);
      results[index] = { n, error: error.message, success: false };
      checkCompletion();
    });
    
    // ✅ Bắt buộc: Exit handler
    worker.on('exit', (code) => {
      if (code !== 0 && !results[index]) {
        results[index] = { n, error: 'Worker crashed', success: false };
        checkCompletion();
      }
    });
    
    // Message handler
    worker.on('message', (msg) => {
      if (msg.type === 'error') {
        console.log(`❌ Worker ${index} (n=${n}) lỗi:`, msg.error);
        results[index] = { n, error: msg.error, success: false };
      } else if (msg.type === 'result') {
        console.log(`✅ Worker ${index}: Fibonacci(${n}) = ${msg.result}`);
        results[index] = { n, result: msg.result, success: true };
      }
      
      checkCompletion();
    });
    
    workers.push(worker);
  });
  
  function checkCompletion() {
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
      
      console.log('\n✅ Main thread vẫn chạy bình thường!');
      
      // Dọn dẹp
      workers.forEach(w => w.terminate());
    }
  }
}

