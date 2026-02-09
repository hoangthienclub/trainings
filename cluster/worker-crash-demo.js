const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

/**
 * DEMO: VẤN ĐỀ WORKER THREAD CRASH
 * 
 * VẤN ĐỀ: Nếu worker thread throw error mà không được catch,
 * và main thread không có error handler, có thể làm crash toàn bộ ứng dụng
 */

if (isMainThread) {
  console.log('=== DEMO: Worker Thread Crash ===\n');
  console.log('Main thread PID:', process.pid);
  console.log('Main thread đang chạy...\n');

  // ❌ TRƯỜNG HỢP 1: Worker crash KHÔNG có error handler
  console.log('--- TRƯỜNG HỢP 1: Worker crash KHÔNG có error handler ---');
  console.log('⚠️  NGUY HIỂM: Main thread có thể bị ảnh hưởng!\n');
  
  const badWorker = new Worker(__filename, {
    workerData: { mode: 'crash-without-handler' }
  });
  
  // THIẾU: Không có error handler!
  // badWorker.on('error', ...) ← Thiếu dòng này!
  
  // Giữ main thread chạy để quan sát
  let mainThreadAlive = true;
  const heartbeat = setInterval(() => {
    if (mainThreadAlive) {
      console.log('💓 Main thread vẫn sống...');
    }
  }, 1000);

  // Sau 3 giây, tạo worker có error handling
  setTimeout(() => {
    console.log('\n--- TRƯỜNG HỢP 2: Worker crash CÓ error handler ---');
    console.log('✅ AN TOÀN: Main thread được bảo vệ!\n');
    
    const goodWorker = new Worker(__filename, {
      workerData: { mode: 'crash-with-handler' }
    });
    
    // ✅ BẮT BUỘC: Phải có error handler
    goodWorker.on('error', (error) => {
      console.log('✅ Đã bắt được lỗi từ worker:', error.message);
      console.log('✅ Main thread vẫn an toàn và tiếp tục chạy!');
    });
    
    // ✅ BẮT BUỘC: Phải có exit handler
    goodWorker.on('exit', (code) => {
      if (code !== 0) {
        console.log(`✅ Worker đã dừng (exit code: ${code})`);
        console.log('✅ Main thread vẫn chạy bình thường!');
      }
    });
    
    // Sau 2 giây nữa, demo worker xử lý lỗi đúng cách
    setTimeout(() => {
      console.log('\n--- TRƯỜNG HỢP 3: Worker xử lý lỗi ĐÚNG CÁCH ---');
      console.log('✅ TỐT NHẤT: Worker catch lỗi và gửi về main thread\n');
      
      const bestWorker = new Worker(__filename, {
        workerData: { mode: 'handle-error-properly' }
      });
      
      bestWorker.on('error', (error) => {
        console.log('⚠️  Lỗi không được xử lý trong worker:', error.message);
      });
      
      bestWorker.on('message', (msg) => {
        if (msg.type === 'error') {
          console.log('✅ Nhận lỗi qua message (đã được xử lý):', msg.error);
        } else {
          console.log('✅ Kết quả:', msg);
        }
      });
      
      bestWorker.on('exit', (code) => {
        console.log(`✅ Worker hoàn thành (exit code: ${code})`);
        console.log('\n=== KẾT LUẬN ===');
        console.log('✅ Luôn xử lý lỗi trong worker threads!');
        console.log('✅ Luôn có error handler và exit handler!');
        console.log('✅ Main thread sẽ không bị crash!\n');
        
        clearInterval(heartbeat);
        mainThreadAlive = false;
      });
      
    }, 2000);
    
  }, 3000);

} else {
  // Worker thread code
  const { mode } = workerData;
  
  if (mode === 'crash-without-handler') {
    // ❌ SAI: Throw error mà không xử lý
    console.log('Worker: Sắp throw error (không được xử lý)...');
    setTimeout(() => {
      throw new Error('Lỗi không được xử lý - có thể làm crash!');
    }, 1000);
    
  } else if (mode === 'crash-with-handler') {
    // ⚠️  Vẫn throw error, nhưng main thread có handler
    console.log('Worker: Sắp throw error...');
    setTimeout(() => {
      throw new Error('Lỗi được throw, nhưng main thread có handler');
    }, 1000);
    
  } else if (mode === 'handle-error-properly') {
    // ✅ ĐÚNG: Xử lý lỗi trong worker và gửi về main thread
    console.log('Worker: Bắt đầu xử lý...');
    
    try {
      // Giả lập công việc có thể lỗi
      setTimeout(() => {
        try {
          // Giả lập lỗi
          if (Math.random() > 0.3) {
            throw new Error('Lỗi trong quá trình xử lý');
          }
          
          // Nếu thành công
          parentPort.postMessage({ 
            type: 'success', 
            message: 'Xử lý thành công!' 
          });
          
        } catch (error) {
          // ✅ Bắt lỗi và gửi về main thread thay vì throw
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
  }
}

