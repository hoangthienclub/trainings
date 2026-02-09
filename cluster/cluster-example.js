const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

/**
 * CLUSTER MODULE - Multi-processing
 * 
 * Cluster cho phép tạo nhiều process con (worker processes) để:
 * - Tận dụng tối đa CPU cores (mỗi core chạy 1 process)
 * - Xử lý nhiều request đồng thời
 * - Tăng hiệu suất cho ứng dụng I/O-bound (web server, API)
 * 
 * Lưu ý: Mỗi worker là một process riêng biệt, có memory riêng
 */

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} đang chạy`);
  console.log(`Số CPU cores: ${numCPUs}`);

  // Tạo worker cho mỗi CPU core
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    console.log(`Worker ${worker.process.pid} đã được tạo`);
  }

  // Lắng nghe khi worker exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} đã dừng (code: ${code}, signal: ${signal})`);
    console.log('Đang tạo worker mới...');
    cluster.fork(); // Tự động tạo worker mới thay thế
  });

  // Lắng nghe message từ worker
  cluster.on('message', (worker, message) => {
    console.log(`Nhận message từ worker ${worker.process.pid}:`, message);
  });

} else {
  // Worker process - xử lý HTTP requests
  const server = http.createServer((req, res) => {
    // Mô phỏng xử lý request
    const startTime = Date.now();
    
    // Giả lập công việc I/O (đọc file, query database, etc.)
    setTimeout(() => {
      const processingTime = Date.now() - startTime;
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'Xử lý thành công',
        workerId: process.pid,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      }));
    }, 100); // Giả lập delay 100ms
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} đang lắng nghe trên port ${PORT}`);
  });

  // Worker gửi message về master
  process.send({ 
    type: 'ready', 
    pid: process.pid,
    message: 'Worker đã sẵn sàng xử lý requests'
  });
}

